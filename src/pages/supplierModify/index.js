import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Input, Button, message, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import UploadFile from '../../components/Upload/index'
import Header from '@/components/Header';
import ChooseSupplierModal from './commons/ChooseSupplierModal';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { RecommendationList, stopApproveingOrder } from "@/services/supplierRegister"
import { deleteSupplierModify, checkExistUnfinishedValidity, findCanModifySupplierList } from '@/services/SupplierModifyService'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const getModelRef = useRef(null)
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [onlyMe, setOnlyMe] = useState(true);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [visible, setVisible] = useState(false);
    const [recommen, setrecommen] = useState([]);
    const [loading, triggerLoading] = useState(false);
    const [attachId, setAttachId] = useState('');
    const [fixedHeader, setfixedHeader] = useState('');

    const [singleRow = {}] = selectedRows;
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { flowStatus: signleFlowStatus, id: flowId, creatorId, saveStatus: typeStatus } = signleRow;
    // 已提交审核状态
    const underWay = signleFlowStatus !== 'INIT';
    // 审核完成状态
    const completed = signleFlowStatus === 'COMPLETED';
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;
    // 删除草稿
    const isdelete = signleFlowStatus === 'INIT'
    // 提交审核
    const Toexamine = signleFlowStatus === 'INIT' && typeStatus === 1;
    const {
        state: rowState,
        approvalState: rowApprovalState,
        changeable: rowChangeable,
        flowId: businessId
    } = singleRow;

    const columns = [
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 'INIT' && record.saveStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 'INIT' && record.saveStatus === 1) {
                    return <div>待提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div className="doingColor">审批中</div>;
                } else {
                    return <div className="successColor">审批完成</div>;
                }
            },
        },
        {
            title: '申请单号',
            width: 200,
            dataIndex: 'code',
        },
        {
            title: '供应商代码',
            width: 140,
            dataIndex: 'supplierCode',
        },
        {
            title: '供应商名称',
            width: 220,
            dataIndex: 'supplierName',
        },

        {
            title: '变更人',
            width: 120,
            dataIndex: 'creatorName',
        }, {
            title: '变更原因',
            width: 220,
            dataIndex: 'modifyReason',
        }, {
            title: '附件',
            width: 80,
            dataIndex: 'id',
            render: (value) => <UploadFile type="show" entityId={value} />,
        },
        {
            title: '变更日期',
            align: 'center',
            width: 150,
            dataIndex: 'createdDate',
            render: (text) => {
                return text ? text.substring(0, 10) : '';
            },
        },
        {
            title: '供应商类型',
            dataIndex: 'supplierTypeRemark',
        },
    ].map(_ => ({ ..._, align: 'center' }))
    /**供应商表格 */
    const supplierColumns = [
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 'INIT' && record.saveStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 'INIT' && record.saveStatus === 1) {
                    return <div>待提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div className="doingColor">审批中</div>;
                } else {
                    return <div className="successColor">审批完成</div>;
                }
            },
        },
        {
            title: '申请单号',
            width: 200,
            dataIndex: 'code',
        },

        {
            title: '变更原因',
            width: 280,
            dataIndex: 'modifyReason',
        },
        {
            title: '附件',
            width: 100,
            dataIndex: 'id',
            render: (value) => <UploadFile type="show" entityId={value} />,
        },
        {
            title: '创建人员',
            width: 120,
            dataIndex: 'creatorName',
        },
        {
            title: '变更日期',
            align: 'center',
            width: 150,
            dataIndex: 'createdDate',
            render: (text) => {
                return text ? text.substring(0, 10) : '';
            },
        },
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierModifyService/findRequestByPage`,
            params: {
                ...searchValue,
                quickSearchProperties: ['supplierName'],
                sortOrders: [
                    {
                        property: 'docNumber',
                        direction: 'DESC'
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
            cleanSelectedRecord()
        }
    }
    // 新增供应商
    async function AddModel() {
        if (authorizations.userType !== 'Supplier') {
            getModelRef.current.handleModalVisible(true);
            return;
        } else {
            const { data, success, message: msg } = await findCanModifySupplierList();
            if (success) {
                let id = data.rows[0].supplierId;
                openNewTab(`supplier/supplierModify/create/index?id=${id}`, '供应商变更新建变更单', false)
            } else {
                message.error(msg)
            }
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
    // 删除
    async function handleDelete() {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = { supplierModifyId: selectedRows[0].id };
                triggerLoading(true)
                const { success, message: msg } = await deleteSupplierModify(params);
                if (success) {
                    handleComplete();
                    message.success('删除成功！');
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
    // 编辑
    function handleCheckEdit() {
        const [key] = selectedRowKeys;
        let id = selectedRows[0].id;
        openNewTab(`supplier/supplierModify/Edit/index?id=${id}`, '供应商变更编辑', false)
    }
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        let supplierId = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierModify/details/index?id=${id}&supplierId=${supplierId}`, '供应商变更明细', false)
    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
    }
    // 查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value.trim() }));
        uploadTable();
    }
    // 提交审核完成更新列表
    function handleComplete() {
        uploadTable()
    }
    // 提交审核验证
    async function handleBeforeStartFlow() {
        const { success, message: msg } = await checkExistUnfinishedValidity({ requestId: selectedRows[0].id });
        if (success) {
            message.success(msg)
            return true;
        } else {
            message.error(msg)
            return false;
        }

    }
    // 终止审核
    function stopApprove() {
        Modal.confirm({
            title: '终止审批流程',
            content: '流程终止后无法恢复，是否继续？',
            onOk: handleStopApproveRecord,
            okText: '确定',
            cancelText: '取消'
        })
    }
    async function handleStopApproveRecord() {
        const [row] = selectedRows
        const { id: flowId } = row
        const { success, message: msg } = await stopApproveingOrder({
            businessId: flowId
        })
        if (success) {
            message.success(msg)
            uploadTable()
            return
        }
        message.error(msg)
    }
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Search
                placeholder='请输入字段代名称查询'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </>
    )
    return (
        <>
            <Header
                left={
                    <>
                        {
                            authAction(
                                <Button type='primary'
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_ADD'
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
                                    key='SRM-SM-SUPPLIERMODEL_EDIT'
                                    className={styles.btn}
                                    onClick={handleCheckEdit}
                                    disabled={empty || underWay || !isSelf}
                                >编辑
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_DELETE'
                                    className={styles.btn}
                                    onClick={handleDelete}
                                    disabled={empty || underWay || !isSelf}
                                >删除
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <StartFlow
                                    className={styles.btn}
                                    ignore={DEVELOPER_ENV}
                                    needConfirm={handleBeforeStartFlow}
                                    businessKey={flowId}
                                    callBack={handleComplete}
                                    disabled={empty || underWay || !Toexamine}
                                    businessModelCode='com.ecmp.srm.sm.entity.SupplierModify'
                                    key='SRM-SM-SUPPLIERMODEL_EXAMINE'
                                >提交审核</StartFlow>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    className={styles.btn}
                                    disabled={empty || !underWay || !isSelf || completed}
                                    onClick={stopApprove}
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_STOP_APPROVAL'
                                >终止审核</Button>
                            )
                        }
                        {
                            authAction(
                                <FlowHistoryButton
                                    businessId={flowId}
                                    flowMapUrl='flow-web/design/showLook'
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_HISTORY'
                                >
                                    <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
                                </FlowHistoryButton>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_DETAILED'
                                    className={styles.btn}
                                    onClick={handleCheckDetail}
                                    disabled={empty}
                                >变更明细
                                </Button>
                            )
                        }

                    </>
                }
                right={searchBtnCfg}
                advanced={false}
                extra={false}
                ref={headerRef}
            />
            <AutoSizeLayout>
                {
                    (height) => <ExtTable
                        columns={authorizations.userType === 'Supplier' ? supplierColumns : columns}
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
            <ChooseSupplierModal
                wrappedComponentRef={getModelRef}
            >
            </ChooseSupplierModal>
        </>
    )
}

export default SupplierConfigure
