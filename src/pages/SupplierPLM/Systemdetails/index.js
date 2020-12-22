import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, utils, DataImport } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import EditFrom from './EdItFrom'
import { SystemDelete, SynchronizationList } from '../../../services/plmService'
import { onLineTarget } from '../../../../config/proxy.config';
import {
    buListCode,
    buListName,
    qualifiedListName,
    PLMSynchronList,
    PLMType
} from '../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const getModelRef = useRef(null)
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const commonFormRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectType, setSelectType] = useState(false);
    const [selectedRows, setRows] = useState([]);
    const [tabtitle, setTabtitle] = useState(false);
    const [searchValue, setSearchValue] = useState({});
    const [seniorSearchvalue, setSeniorsearchvalue] = useState('');
    const [signleRow = {}] = selectedRows;
    const { plmStatus: synchron } = signleRow;
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 同步
    const synStatus = synchron === '0' || synchron === '2';
    // 编辑
    const EditStatus = synchron === '0';
    const columns = [
        {
            title: '业务单元代码',
            width: 120,
            dataIndex: 'unitCode',
        },
        {
            title: '业务单元名称',
            width: 180,
            dataIndex: 'unitName',
        },
        {
            title: '供应商代码',
            width: 120,
            dataIndex: 'supplierCode',
        },
        {
            title: '供应商全称',
            width: 220,
            dataIndex: 'supplierName',
        },
        {
            title: '供应商简称',
            width: 140,
            dataIndex: 'supplierAbbreviation',
        },
        {
            title: '同步PLM状态',
            width: 120,
            dataIndex: 'plmStatus',
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>未同步</div>;
                } else if (text === 1) {
                    return <div>已同步</div>;
                } else if (text === 2) {
                    return <div>同步失败</div>;
                } else {
                    return <div>未同步</div>;
                }
            },
        },
        {
            title: '状态',
            width: 120,
            dataIndex: 'status',
            render: function (text, record, row) {
                if (text === 0 || text === '有效') {
                    return <div>有效</div>;
                } else {
                    return <div>冻结</div>;
                }
            },
        },
        {
            title: '同步PLM结果消息',
            width: 220,
            dataIndex: 'plmMsg',
        },
        {
            title: '同步时间',
            width: 100,
            dataIndex: 'synTime',
        },
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/bafSupplierPlmService/findByPage `,
            params: {
                ...searchValue,
                quickSearchProperties: ['unitName', 'supplierCode', 'supplierName'],
                sortOrders: [
                    {
                        property: 'synTime',
                        direction: 'ASC'
                    }
                ],
                filters: seniorSearchvalue
            },
            type: 'POST'
        }
    }

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);

    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh()
        }
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRows([])
        setRowKeys([])
        tableRef.current.manualSelectedRows([])
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 新增
    function AddModel() {
        setTabtitle('新增')
        setSelectType(false)
        cleanSelectedRecord()
        commonFormRef.current.handleModalVisible(true)
    }
    // 编辑
    function handleCheckEdit() {
        setTabtitle('编辑')
        setSelectType(true)
        commonFormRef.current.handleModalVisible(true)
    }
    // 删除
    async function handleDelete(type) {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = selectedRows[0].id;
                const { success, message: msg } = await SystemDelete({ id: params });
                if (success) {
                    message.success('删除成功！');
                    uploadTable();
                } else {
                    message.error(msg);
                }
            },
            onCancel() {
            },
        });
    }
    // 同步
    async function handleSynchron() {
        confirm({
            title: '是否确认同步',
            onOk: async () => {
                let params = selectedRows[0].id;
                const { success, message: msg } = await SynchronizationList({ id: params });
                if (success) {
                    message.success('同步成功！');
                    uploadTable();
                } else {
                    message.error(msg);
                }
            },
            onCancel() {
            },
        });
    }
    // 导入数据效验
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            Importvalidity(data).then(res => {
                let response = res.data.map((item, index) => ({
                    ...item,
                    key: index,
                    validate: item.importStatus,
                    status: item.importStatus ? '数据完整' : '失败',
                    statusCode: item.importStatus ? 'success' : 'error',
                    message: item.importStatus ? '成功' : item.errMsg,
                }));
                resolve(response);
            })
        })
    }
    // 快速查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        uploadTable();
    }
    // 保存
    async function masterSave() {
        commonFormRef.current.handleModalVisible(false)
        uploadTable();
    }
    // 处理高级搜索
    function handleAdvnacedSearch(v) {
        const keys = Object.keys(v);
        const filters = keys.map((item) => {
            const [_, operator, fieldName, isName] = item.split('_');
            return {
                fieldName,
                operator,
                value: !!isName ? undefined : v[item]
            }
        }).filter(item => !!item.value)
        setSeniorsearchvalue(filters)
        headerRef.current.hide();
        uploadTable();
    }
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '50%', display: 'flex', height: '100%', alignItems: 'center' }}>
            {
                authAction(
                    <Button type='primary'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-ADD'
                        className={styles.btn}
                        onClick={AddModel}
                    //disabled={empty}
                    >新增
                                </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-EDIT'
                        className={styles.btn}
                        onClick={handleCheckEdit}
                        disabled={empty || EditStatus}
                    >编辑
                                </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-EDIT'
                        className={styles.btn}
                        onClick={handleDelete}
                        disabled={empty || EditStatus}
                    >删除
                                </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-FROZEN'
                        className={styles.btn}
                        onClick={() => handleFrozen('freeze')}
                        disabled={empty}
                    >导出
                    </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-THAW'
                        className={styles.btn}
                        onClick={handleSynchron}
                        disabled={empty || synStatus}
                    >同步
                                </Button>
                )
            }
        </div>
    )
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Search
                placeholder='请输入业务单元名称'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '200px' }}
            />
            <Search
                placeholder='请输入供应商代码或名称查询'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    // 高级查询配置
    const formItems = [
        { title: '业务单元代码', key: 'Q_EQ_unitCode', type: 'list', props: buListCode },
        { title: '业务单元名称', key: 'Q_EQ_unitName', type: 'list', props: buListName },
        { title: '供应商代码', key: 'Q_EQ_supplierCode', type: 'list', props: qualifiedListName },
        { title: '同步PLM状态', key: 'Q_EQ_plmStatus', type: 'list', props: PLMSynchronList },
        { title: '状态', key: 'Q_EQ_status', type: 'list', props: PLMType }
    ];
    return (
        <>
            <Header
                left={HeaderLeftButtons}
                right={HeaderRightButtons}
                advanced
                ref={headerRef}
                content={
                    <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
                }
            />
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        columns={columns}
                        showSearch={false}
                        ref={tableRef}
                        rowKey={(item) => item.id}
                        checkbox={{
                            multiSelect: false
                        }}
                        allowCancelSelect
                        size='small'
                        height={height}
                        remotePaging={true}
                        ellipsis={false}
                        onSelectRow={handleSelectedRows}
                        selectedRowKeys={selectedRowKeys}
                        //dataSource={dataSource}
                        {...dataSource}
                    />
                }
            </AutoSizeLayout>
            <EditFrom
                title={tabtitle}
                modifydata={selectedRows[0]}
                type={selectType}
                onOk={masterSave}
                wrappedComponentRef={commonFormRef}
            />
        </>
    )
}

export default SupplierConfigure
