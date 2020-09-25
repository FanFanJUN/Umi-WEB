import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Input, Button, message, Modal } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import { StartFlow } from 'seid';

import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { RecommendationList, stopApproveingOrder } from "@/services/supplierRegister"
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { Search } = Input
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
function SupplierConfigure() {
    const headerRef = useRef(null)
    const tableRef = useRef(null)
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
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { flowStatus: signleFlowStatus, id: flowId, creatorId, saveStatus: typeStatus } = signleRow;
    console.log(selectedRows)
    // 已提交审核状态
    const underWay = signleFlowStatus !== 'INIT';
    // 审核完成状态
    const completed = signleFlowStatus === 'COMPLETED';
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = currentUserId === creatorId;
    // 审核历史
    const history = signleFlowStatus !== 'INIT' && signleFlowStatus !=='INPROCESS';
    // 提交审核
    const Toexamine = signleFlowStatus === 'INIT' && typeStatus === 1;
    const columns = [
        {
            title: '申请单号',
            dataIndex: 'docNumber',
            width: 120,
        },
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            width: 100,
            render: function (text, record, row) {
                if (text === 'INIT' && record.saveStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 'INIT' && record.saveStatus === 1) {
                    return <div>已保存</div>;
                } else if (text === 'INPROCESS') {
                    return <div>审批中</div>;
                } else if (text === 'COMPLETED') {
                    return <div>审批完成</div>;
                }
            },
        },
        {
            title: '供应商代码',
            dataIndex: 'supplier.code',
            width: 120,
        },
        {
            title: '供应商名称',
            dataIndex: 'supplier.name',
            width: 220,
        },
        {
            title: '联系电话',
            dataIndex: 'mobile',
            width: 120,
        },
        {
            title: '申请人',
            dataIndex: 'creatorName',
            width: 180,
        },
        {
            title: '创建时间',
            dataIndex: 'createdDate',
            align: 'center',
            width: 150,
            // render:(text)=>{
            //     return text?text.substring(0,10):""
            // }
        },
        {
            title: '供应商类型',
            width: 100,
            dataIndex: 'supplier.supplierTypeRemark',
        },
        {
            title: '推荐信息',
            width: 100,
            align: 'center',
            dataIndex: 'supplier.hasBeRecommend',
            render: (text, record, index) => {
                return <a onClick={() => showRecommend(record.supplierId)}>查看</a>;
            },
        },
        {
            title: '状态',
            width: 100,
            dataIndex: 'supplier.supplierStatusRemark',
        },
    ].map(_ => ({ ..._, align: 'center' }))
    /**推荐信息弹窗表格 */
    const tableProps = {
        fixedHeader,
        columns: [
            {
                title: '推荐单号',
                dataIndex: 'code',
                width: 180,
                align: 'center',
            },
            {
                title: '准入公司',
                dataIndex: 'corporation.name',
                width: 260,
                align: 'center',
                align: 'center',
            },
            {
                title: '物料分类',
                dataIndex: 'materielCategory',
                width: 240,
                align: 'center',
            },
            {
                title: '推荐人',
                dataIndex: 'creatorName',
                width: 120,
                align: 'center',
            },
            {
                title: '推荐状态',
                dataIndex: 'flowStatus',
                width: 140,
                align: 'center',
                render: function (text, record, row) {
                    if (text === 'init') {
                        return <div>未提交审批</div>;
                    } else if (text === 'inProcess') {
                        return <div className="doingColor">审批中</div>;
                    } else {
                        return <div className="successColor">审批完成</div>;
                    }
                },
            },
        ]
    }
    /* 按钮禁用状态控制 */
    const FRAMEELEMENT = getFrameElement();
    //const empty = selectedRowKeys.length === 0;
    //const dataSource = []
    const dataSource = {
        store: {
            url: `${smBaseUrl}/supplierApply/findOurList`,
            params: {
                ...searchValue,
                quickSearchProperties: [],
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
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <Input
                placeholder='请输入供应商名称查询'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <Button type='primary' onClick={handleQuickSerach}>查询</Button>
        </>
    )

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
    }, []);

    function listenerParentClose(event) {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh()
        }
    }
    // 取消编辑或新增
    function handleCancel() {
        // const { resetFields } = commonFormRef.current.form;
        // resetFields()
        hideModal()
    }
    // 关闭弹窗
    function hideModal() {
        setVisible(false)
    }
    // 推荐信息
    async function showRecommend(supplierId) {
        setrecommen([])
        setVisible(true)
        triggerLoading(true)
        const { data, success, message: msg } = await RecommendationList({ supplierId });
        if (success) {
            triggerLoading(false)
            setrecommen(data)
            triggerLoading(false)
            return;
        }
        triggerLoading(false)
        message.error(msg)

    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRows([]);
        setRowKeys([])
        tableRef.current.manualSelectedRows([])
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 编辑
    function handleEditor() {
        // const [key] = selectedRowKeys;
        // const { id = '' } = FRAMEELEMENT;
        // const { pathname } = window.location
        let categoryid = selectedRows[0].supplier.supplierCategoryId;
        let id = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierRegister/SupplierEdit/index?id=${id}&frameElementId=${categoryid}`, '编辑供应商注册信息', false)
        //openNewTab(`supplier/supplierRegister/SupplierEdit/index?id=${key}&frameElementId=${id}&Opertype=2`, '编辑供应商注册信息', false)
    }
    // 明细
    function handleCheckDetail() {
        const [key] = selectedRowKeys;
        let categoryid = selectedRows[0].supplier.supplierCategoryId;
        let id = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierRegister/SupplierDetail/index?id=${id}&frameElementId=${categoryid}&type=false`, '供应商注册信息明细', false)
    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
    }
    // 查询
    function handleQuickSerach() {
        setSearchValue({
            quickSearchValue: searchValue
        })
        uploadTable();
    }

    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
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
    return (
        <>
            <Header
                left={
                    <>
                        {
                            authAction(
                                <Button type='primary'
                                    ignore={DEVELOPER_ENV}
                                    key='SRM_SM_SUPPLIER_MY_PERFORMANCE_EDIT'
                                    className={styles.btn}
                                    onClick={handleEditor}
                                    disabled={empty || underWay}
                                >编辑
                                </Button>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    ignore={DEVELOPER_ENV}
                                    key='SRM_SM_SUPPLIER_MY_PERFORMANCE_DETAIL'
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
                                    className={styles.btn}
                                    ignore={DEVELOPER_ENV}
                                    // preStart={handleBeforeStartFlow}
                                    businessKey={flowId}
                                    callBack={handleComplete}
                                    disabled={empty || underWay || !Toexamine}
                                    businessModelCode='com.ecmp.srm.sm.entity.SupplierApply'
                                    ignore={DEVELOPER_ENV}
                                    key='SRM_SM_SUPPLIER_MY_PERFORMANCE_EXAMINE'
                                ></StartFlow>
                            )
                        }
                        {
                            authAction(
                                <Button
                                    className={styles.btn}
                                    disabled={empty || !underWay || completed}
                                    onClick={stopApprove}
                                    ignore={DEVELOPER_ENV}
                                    key='SRM_SM_SUPPLIER_MY_PERFORMANCE_STOP_APPROVAL'
                                >终止审核</Button>
                            )
                        }
                        {
                            authAction(
                                <FlowHistoryButton
                                    businessId={flowId}
                                    flowMapUrl='flow-web/design/showLook'
                                    ignore={DEVELOPER_ENV}
                                    key='SRM_SM_SUPPLIER_MY_PERFORMANCE_HISTORY'
                                >
                                    <Button className={styles.btn} disabled={empty || !underWay || history}>审核历史</Button>
                                </FlowHistoryButton>
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
            <ExtModal
                destroyOnClose
                onCancel={handleCancel}
                visible={visible}
                centered
                width={880}
                footer={null}
                bodyStyle={{ height: 380, padding: 0 }}
                title="推荐信息"
            >
                <ScrollBar>
                    <ExtTable
                        //loading={true}
                        showSearch={false}
                        dataSource={recommen}
                        {...tableProps}
                    />
                </ScrollBar>

            </ExtModal>

        </>
    )
}

export default SupplierConfigure
