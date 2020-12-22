import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, utils, DataImport } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import EditFrom from './EdItFrom'
import { PLMSupplierDelete, Importvalidity, MasterfrozenList } from '../../../services/plmService'
import { onLineTarget } from '../../../../config/proxy.config';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
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
    const [loading, triggerLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [signleRow = {}] = selectedRows;
    const { frozen: flowStatus } = signleRow;
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 冻结
    const frozenStatus = flowStatus === '1';
    // 解冻
    const frozenthaw = flowStatus === '0';
    const columns = [
        {
            title: '业务单元代码',
            width: 180,
            dataIndex: 'unitCode',
        },
        {
            title: '业务单元描述',
            width: 320,
            dataIndex: 'unitName',
        },
        {
            title: '排序号',
            width: 320,
            dataIndex: 'sort',
        },
        {
            title: '冻结',
            width: 120,
            dataIndex: 'frozen',
            render: function (text, record, row) {
                if (text === '1') {
                    return <div>已冻结</div>;
                } else {
                    return <div>未冻结</div>;
                }
            },
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/bafSupplierBusinessUnitService/findByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['unitCode', 'unitName'],
                sortOrders: [
                    {
                        property: 'sort',
                        direction: 'ASC'
                    }
                ]
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
    async function handleDelete() {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = selectedRows[0].id;
                const { success, message: msg } = await PLMSupplierDelete({ id: params });
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
    // 冻结
    function handleFrozen(type) {
        confirm({
            title: `请确认是否${type === 'thaw' ? '解冻' : '冻结'}`,
            onOk: async () => {
                let id = selectedRows[0].id, frozen;
                if (type === 'thaw') {
                    frozen = 0
                } else {
                    frozen = 1
                }
                triggerLoading(true)
                const { success, message: msg } = await MasterfrozenList({ id: id, frozen: frozen });
                if (success) {
                    message.success(`${type === 'thaw' ? '解冻' : '冻结'}成功！`);
                    uploadTable();
                    triggerLoading(false)
                } else {
                    message.error(msg);
                    triggerLoading(false)
                }
            },
            onCancel() {
            },
        });
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
                        disabled={empty}
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
                        disabled={empty}
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
                        disabled={empty || frozenStatus}
                    >冻结
                                </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNMASTERDATA-THAW'
                        className={styles.btn}
                        onClick={() => handleFrozen('thaw')}
                        disabled={empty || frozenthaw}
                    >解冻
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
                placeholder='请输入业务单元代码或名称查询'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    return (
        <>
            <Header
                left={HeaderLeftButtons}
                right={HeaderRightButtons}
                ref={headerRef}
                content
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
                type={setSelectType}
                onOk={masterSave}
                wrappedComponentRef={commonFormRef}
            />
        </>
    )
}

export default SupplierConfigure
