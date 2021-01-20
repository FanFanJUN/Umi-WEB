import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, utils, DataImport } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import EditFrom from './EdItFrom'
import { MasterDeleted, MasterdataSave, Importvalidity, MasterfrozenList } from '../../../services/pcnModifyService'
import { onLineTarget } from '../../../../config/proxy.config';
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
    const [loading, triggerLoading] = useState(false);
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
            title: '变更类型',
            width: 180,
            dataIndex: 'changeTypeName',
        },
        {
            title: '变更内容',
            width: 320,
            dataIndex: 'changeContent',
        },
        {
            title: '所需提交资料',
            width: 320,
            dataIndex: 'changeRequiredSubmission',
        },
        {
            title: '供应商审核确认',
            width: 160,
            dataIndex: 'supplierConfirm',
            render: function (text, record, row) {
                if (text === 0) {
                    return <div>否</div>;
                } else {
                    return <div>是</div>;
                }
            },
        },
        {
            title: '排序码',
            width: 100,
            dataIndex: 'changeSort',
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
            url: `${smBaseUrl}/api/smPcnChangesService/findByPage `,
            params: {
                quickSearchValue: '',
                quickSearchProperties: [''],
                sortOrders: [
                    {
                        property: 'changeSort',
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
        console.log(rows)
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
        console.log(23123)
    }
    // 新增
    function AddModel() {
        setTabtitle('新增PCN变更内容')
        setSelectType(false)
        cleanSelectedRecord()
        commonFormRef.current.handleModalVisible(true)
    }
    // 编辑
    function handleCheckEdit() {
        if (selectedRows[0].supplierConfirm === 1) {
            selectedRows[0].supplierConfirmName = '是'
        } else if (selectedRows[0].supplierConfirm === 0) {
            selectedRows[0].supplierConfirmName = '否'
        }
        setTabtitle('编辑PCN变更内容')
        setSelectType(true)
        commonFormRef.current.handleModalVisible(true)
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
    // 导入
    const importFunc = async (value) => {
        triggerLoading(true)
        const { success, message: msg } = await MasterdataSave(value);
        if (success) {
            message.success('保存成功');
            uploadTable();
            triggerLoading(false)
        } else {
            triggerLoading(false)
            message.error(msg);
        }
    };
    // 保存
    async function masterSave() {
        commonFormRef.current.handleModalVisible(false)
        uploadTable();
    }
    return (
        <>
            <Header
                left={
                    <>
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
                        {
                            authAction(
                                <DataImport
                                    key='SRM-SM-PCNMASTERDATA-IMPORT'
                                    className={styles.btn}
                                    tableProps={{
                                        columns,
                                        showSearch: false,
                                        //allowCustomColumns: false
                                    }}
                                    validateAll={true}
                                    validateFunc={validateItem}
                                    importFunc={importFunc}
                                    ignore={DEVELOPER_ENV}
                                />
                            )

                        }
                        {
                            authAction(
                                <Button
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-PCNMASTERDATA-DOWNLOAD'
                                    className={styles.btn}
                                    href={host + "/srm-sm-web/SmPcnChanges/downloadTemplate?userAccount=" + authorizations.account} key="download"
                                >模版下载
                                </Button>
                            )
                        }
                    </>
                }
                right={false}
                advanced={false}
                extra={false}
                ref={headerRef}
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
