import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, ComboList, utils, WorkFlow } from 'suid';
import { Input, Button, message, Modal, Form, Row, Col } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { AutoSizeLayout, Header } from '@/components';
import styles from './index.less';
// import { StartFlow } from 'seid';
import { smBaseUrl } from '@/utils/commonUrl';
import { deleteBatchById, stopApproveingOrder } from '../../services/SupplierBatchExtend'
import { corporationSupplierConfig } from '../../utils/commonProps'
const { StartFlow, FlowHistoryButton } = WorkFlow;
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
export default () => {
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.userId;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [loading, triggerLoading] = useState(false);
    const [singleRow = {}] = selectedRows;
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { flowStatus: signleFlowStatus, id: flowId, creatorId } = signleRow;
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

    const columns = [
        {
            title: '状态',
            width: 100,
            align: 'center',
            dataIndex: 'assessmentYear',
            render: (text, record, row) => {
                if (record.flowStatus === 'COMPLETED') {
                    return '生效';
                }
                return '草稿';

            },
        },
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 'INIT') {
                    return <div>未提交审批</div>;
                } else if (text === 'INPROCESS') {
                    return <div className="doingColor">审批中</div>;
                } else {
                    return <div className="successColor">审批完成</div>;
                }
            },
        },
        {
            title: '创建单据号',
            width: 140,
            dataIndex: 'code',
        },
        {
            title: '申请公司',
            width: 330,
            dataIndex: 'corporation.name',
        },
        {
            title: '申请人员',
            width: 100,
            dataIndex: 'applyName',
        },
        {
            title: '说明',
            width: 250,
            dataIndex: 'remark',
        },
        {
            title: '创建日期',
            width: 150,
            align: 'center',
            dataIndex: 'createdDate',
        },
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierFinanceViewProcessService/findBatchByPage`,
            params: {
                quickSearchValue: searchValue,

                quickSearchProperties: ['remark', 'corporationId'],
                sortOrders: [
                    {
                        property: 'code',
                        direction: 'DESC'
                    }
                ],
                filters: [
                    {
                        fieldName: 'accountStatus',
                        value: 1,
                        operator: 'EQ'
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
            uploadTable()
        }
    }
    // 申请公司
    function cooperationChange(record) {
        setSearchValue(record.name);
        uploadTable();
    }
    function afterSelect(val) {
        setSearchValue(val.id)
    }
    // 清空公司
    function clearinput() {
        setSearchValue('')
        uploadTable();
    }
    const searchbank = ['name'];

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
    // 新增供应商批量扩展
    async function AddModel() {
        openNewTab(`supplier/SupplierBatchExtend/create/index`, '新增', false)
    }
    // 编辑
    function handleCheckEdit() {
        let id = selectedRows[0].id;
        openNewTab(`supplier/SupplierBatchExtend/Edit/index?id=` + id + '&isEdit=true', '编辑', false)
    }
    // 删除
    async function handleDelete() {
        confirm({
            title: '是否确认删除',
            onOk: async () => {
                let params = { id: selectedRows[0].id };
                triggerLoading(true)
                const { success, message: msg } = await deleteBatchById(params);
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
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        openNewTab(`supplier/SupplierBatchExtend/Detail/index?id=` + id + '&headerInfo=true&isEdit=true', '明细', false)
    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
        if (v.target.value === '') {
            setSearchValue('')
            uploadTable();
        }
    }
    // 查询
    function handleQuickSerach() {
        let search = "";
        setSearchValue(search);
        setSearchValue(searchValue.trim())
        uploadTable();
    }
    // 提交审核完成更新列表
    function handleComplete() {
        uploadTable()
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
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '80%', display: 'flex', height: '100%' }}>
            {
                authAction(
                    <Button type='primary'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-BATCHEXPANSION-ADD'
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
                        key='SRM-SM-BATCHEXPANSION-EDIT'
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
                        key='SRM-SM-BATCHEXPANSION-DELETE'
                        className={styles.btn}
                        onClick={handleDelete}
                        disabled={empty || underWay || !isSelf}
                    >删除
                                </Button>
                )
            }
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-BATCHEXPANSION-DETAIL'
                        className={styles.btn}
                        onClick={handleCheckDetail}
                        disabled={empty}
                    >明细
                                </Button>
                )
            }
            {
                authAction(
                    <StartFlow
                        businessModelCode='com.ecmp.srm.sm.entity.SupplierFinanceViewProcess'
                        businessKey={flowId}
                        key='SRM-SM-BATCHEXPANSION-EXAMINE'
                        startComplete={handleComplete}
                        ignore={DEVELOPER_ENV}
                    >
                        {
                            loading => (
                                <Button
                                    className={styles.btn}
                                    loading={loading}
                                    disabled={empty || underWay || !isSelf}
                                >提交审核</Button>
                            )
                        }
                    </StartFlow>
                )
            }
            {/* {
                authAction(
                    <StartFlow
                        className={styles.btn}
                        ignore={DEVELOPER_ENV}
                        businessKey={flowId}
                        startComplete={handleComplete}
                        disabled={empty || underWay || !isSelf}
                        businessModelCode='com.ecmp.srm.sm.entity.SupplierFinanceViewProcess'
                        key='SRM-SM-BATCHEXPANSION-EXAMINE'
                    >提交审核</StartFlow>
                )
            } */}
            {
                authAction(
                    <Button
                        className={styles.btn}
                        disabled={empty || !underWay || !isSelf || completed}
                        onClick={stopApprove}
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-BATCHEXPANSION-STOP-APPROVAL'
                    >终止审核</Button>
                )
            }
            {
                authAction(
                    <FlowHistoryButton
                        businessId={flowId}
                        flowMapUrl='flow-web/design/showLook'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-BATCHEXPANSION-HISTORY'
                    >
                        <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
                    </FlowHistoryButton>
                )
            }
        </div>
    )
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Input
                style={{ width: '160px' }}
                placeholder='请输入说明'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <ComboList
                style={{ width: '260px' }}
                searchProperties={searchbank}
                {...corporationSupplierConfig}
                afterSelect={cooperationChange}
                rowKey="code"
                //showSearch={false}
                allowClear={true}
                afterClear={clearinput}
                afterSelect={afterSelect}
                reader={{
                    name: 'name',
                }}
                className={styles.btn}
            />
            <Button type='primary' onClick={handleQuickSerach}>查询</Button>
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
        </>
    )
}

//export default SupplierConfigure
