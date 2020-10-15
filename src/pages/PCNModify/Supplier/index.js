import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { RecommendationList, stopApproveingOrder } from "@/services/supplierRegister"
import { deleteSupplierModify, checkExistUnfinishedValidity, findCanModifySupplierList } from '@/services/SupplierModifyService'
import {SupplierBilltypeList,ToexamineList,StrategicPurchaseConfig} from '../commonProps'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
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
    const [searchValue, setSearchValue] = useState('');
    const [visible, setVisible] = useState(false);
    const [recommen, setrecommen] = useState([]);
    const [loading, triggerLoading] = useState(false);
    const [attachId, setAttachId] = useState('');
    const [fixedHeader, setfixedHeader] = useState('');

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
            title: '单据状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
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
            title: 'PCN变更单号',
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
            title: '变更类型',
            width: 120,
            dataIndex: 'creatorName',
        },
        {
            title: '联系人',
            width: 220,
            dataIndex: 'modifyReason',
        },
        {
            title: '联系电话',
            width: 130,
            dataIndex: 'id',
        },
        {
            title: '创建日期',
            width: 120,
            dataIndex: 'id',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierModifyService/findRequestByPage`,
            params: {
                quickSearchValue: searchValue,
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
    const searchbank = ['name'];
    // 右侧搜索
    const searchBtnCfg = (
        <>
            <ComboList
                style={{ width: 340 }}
                searchProperties={searchbank}
                {...SupplierBilltypeList}
                //afterSelect={cooperationChange}
                rowKey="code"
                //showSearch={false}
                allowClear={true}
                afterClear={clearinput}
                reader={{
                    name: 'name',
                }}
                className={styles.btn}
            />
            <Input
                placeholder='请输入变更单号'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <Button type='primary' onClick={handleQuickSerach} className={styles.btn} >查询</Button>
        </>
    )
    // 高级查询配置
    const formItems = [
        { title: '供应商名称或代码', key: 'materialCode',  props: { placeholder: '输入供应商名称或代码' } },
        { title: '单据状态', key: 'materialGroupCode', type: 'list', props: SupplierBilltypeList },
        { title: '审核状态', key: 'environmentAdminName', type: 'list', props: ToexamineList },
        { title: '变更类型', key: 'applyPersonName', type: 'list', props: ToexamineList },
    ];
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
        openNewTab(`/pcnModify/Supplier/create/index`, 'PCN变更新建变更单', false)
    }
    // 编辑
    function handleCheckEdit() {
        const [key] = selectedRowKeys;
        let id = selectedRows[0].id;
        openNewTab(`supplier/supplierModify/Edit/index?id=${id}`, '供应商变更编辑', false)
    }
    // 删除
    function handleDelete() {

    }
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        let supplierId = selectedRows[0].supplierId;
        openNewTab(`supplier/supplierModify/details/index?id=${id}&supplierId=${supplierId}`, '供应商变更明细', false)
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
    // 仅我的
    function handleOnlyMeChange() {

    }
    // 输入框值
    function SerachValue(v) {
        setSearchValue(v.target.value)
    }
    // 查询
    function handleQuickSerach() {
        let search = "";
        setSearchValue(search);
        setSearchValue(searchValue)
        uploadTable();
    }
    // 处理高级搜索
    function handleAdvnacedSearch(value) {
        
    }
     // 清空泛虹公司
     function clearinput() {
        setSearchValue('')
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
                                <Button
                                    ignore={DEVELOPER_ENV}
                                    key='SRM-SM-SUPPLIERMODEL_DETAILED'
                                    className={styles.btn}
                                    onClick={handleCheckDetail}
                                    disabled={empty}
                                >明细
                                </Button>
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
                                >提交
                                </Button>
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
                                >撤回
                                </Button>
                            )
                        }
                    </>
                }
                right={searchBtnCfg}
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
        </>
    )
}

export default SupplierConfigure
