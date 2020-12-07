import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList } from 'suid';
import { Input, Button, message, Modal, Checkbox } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import { StartFlow } from 'seid';
import { AutoSizeLayout, Header, AdvancedForm } from '@/components';
import styles from './index.less';
import { smBaseUrl } from '@/utils/commonUrl';
import { stopApproveingOrder } from "../../../services/pcnModifyService"
import { BilltypeList, ToexamineList, PCNMasterdatalist, seniorStrategypurchase } from '../commonProps'
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
import { router } from 'dva';
const { Search } = Input
const confirm = Modal.confirm;
const { authAction, storage } = utils;
const { FlowHistoryButton } = WorkFlow;
let dataSource
function SupplierConfigure() {
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const currentUserId = authorizations?.account;
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [onlyMe, setOnlyMe] = useState(true);
    const [selectedRows, setRows] = useState([]);
    const [searchValue, setSearchValue] = useState({});
    const [jurisdiction, setJurisdiction] = useState(1);
    const [seniorsearchValue, setSeniorsearchValue] = useState('');
    const { query } = router.useLocation();
    const [singleRow = {}] = selectedRows;
    /** 按钮可用性判断变量集合 BEGIN*/
    const [signleRow = {}] = selectedRows;
    const { flowStatus: signleFlowStatus, id: flowId, smPcnStrategicCode, smDocunmentStatus: typeStatus } = signleRow;
    // 已提交审核状态
    const underWay = signleFlowStatus !== 'INIT';
    // 审核完成状态
    const completed = signleFlowStatus === 'COMPLETED';
    // 未选中数据的状态
    const empty = selectedRowKeys.length === 0;
    // 是不是自己的单据
    const isSelf = smPcnStrategicCode === currentUserId;
    // 删除草稿
    const isdelete = signleFlowStatus === 'INIT'
    // 提交审核
    const Toexamine = signleFlowStatus === 'INIT' && typeStatus === 1;
    const columns = [
        {
            title: '单据状态',
            dataIndex: 'smSubmitStatus',
            key: 'smSubmitStatus',
            width: 160,
            render: function (text, record, row) {
                if (text === 0 && record.smDocunmentStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 0 && record.smDocunmentStatus === 1) {
                    return <div>已保存</div>;
                } else if (text === 1) {
                    return <div className="doingColor">验证中</div>;
                } else if (text === 2) {
                    return <div className="successColor">变更不通过</div>;
                } else if (text === 3) {
                    return <div className="successColor">变更通过</div>;
                } else if (text === 4) {
                    return <div className="successColor">变更完成</div>;
                }
            },
        },
        {
            title: '审批状态',
            dataIndex: 'flowStatus',
            key: 'flowStatus',
            width: 160,
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
            title: 'PCN变更验证单号',
            width: 200,
            dataIndex: 'smPcnCode',
        },
        {
            title: '供应商代码',
            width: 140,
            dataIndex: 'smSupplierCode',
        },
        {
            title: '供应商名称',
            width: 220,
            dataIndex: 'smSupplierName',
        },
        {
            title: '变更类型',
            width: 180,
            dataIndex: 'smPcnChangeTypeName',
        },
        {
            title: '联系人',
            width: 220,
            dataIndex: 'smContacts',
        },
        {
            title: '联系电话',
            width: 220,
            dataIndex: 'smContactNumber',
        },
        {
            title: '创建日期',
            width: 180,
            dataIndex: 'createdDate',
        }
    ].map(_ => ({ ..._, align: 'center' }))

    function handleInfo() {
        if (query.notBubmit) {
            let filters = [];
            filters.push({
                fieldName: 'flowStatus',
                value: 'INIT',
                operator: 'EQ'
            })
            setSeniorsearchValue(filters)
            uploadTable()
        } else if (query.InProcess) {
            let filters = [];
            filters.push({
                fieldName: 'flowStatus',
                value: 'INPROCESS',
                operator: 'EQ'
            })
            setSeniorsearchValue(filters)
            uploadTable()
        } else {
            uploadTable()
        }
    }
    useEffect(() => {
        handleInfo()
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
    // 编辑
    function handleCheckEdit() {
        //const [key] = selectedRowKeys;
        let id = selectedRows[0].id;
        openNewTab(`pcnModify/Purchase/Edit/index?id=${id}`, 'PCN变更方案编辑', false)
    }
    // 明细
    function handleCheckDetail() {
        let id = selectedRows[0].id;
        //openNewTab(`pcnModify/Purchase/Detail/index?id=${id}`, 'PCN变更方案明细', false)
        openNewTab(`pcnModify/ApprovePage/PCNSeewholeDetail?id=${id}`, 'PCN变更方案明细', false)
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
    // 仅我的
    function handleOnlyMeChange(e) {
        setOnlyMe(e.target.checked)
        e.target.checked === true ? setJurisdiction(1) : setJurisdiction(0)
        uploadTable();
    }
    // 查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
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
        setSeniorsearchValue(filters)
        headerRef.current.hide();
        uploadTable();
    }
    function cooperationChange(val) {
        let search = []
        search.push({
            fieldName: 'smSubmitStatus',
            value: val.code,
            operator: 'EQ'
        })
        setSeniorsearchValue(search)
        uploadTable();
    }
    // 清空泛虹公司
    function clearinput() {
        setSearchValue('')
        setSeniorsearchValue('')
        uploadTable();
    }
    // 左侧
    const HeaderLeftButtons = (
        <div style={{ width: '50%', display: 'flex', height: '100%', alignItems: 'center' }}>
            {
                authAction(
                    <Button
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNPURCHASE-EDIT'
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
                        key='SRM-SM-PCNPURCHASE-DETAIL'
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
                        businessKey={flowId}
                        callBack={handleComplete}
                        disabled={empty || underWay || !Toexamine || !isSelf}
                        businessModelCode='com.ecmp.srm.sm.entity.pcn.SmPcnTitle'
                        key='SRM-SM-PCNPURCHASE-EXAMINE'
                    >提交审核</StartFlow>
                )
            }
            {/* {
                authAction(
                    <Button
                        className={styles.btn}
                        disabled={empty || !underWay || !isSelf || completed}
                        onClick={stopApprove}
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-SUPPLIERMODEL_STOP_APPROVAL'
                    >终止审核</Button>
                )
            } */}
            {
                authAction(
                    <FlowHistoryButton
                        businessId={flowId}
                        flowMapUrl='flow-web/design/showLook'
                        ignore={DEVELOPER_ENV}
                        key='SRM-SM-PCNPURCHASE-HISTORY'
                    >
                        <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
                    </FlowHistoryButton>
                )
            }
        </div>
    )
    const searchbank = ['name'];
    // 右侧搜索
    const HeaderRightButtons = (
        <div style={{ display: 'flex' }}>
            <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe}
                style={{ width: '80px' }}>仅我的</Checkbox>
            <ComboList
                //style={{ width: 340 }}
                style={{ width: '200px' }}
                searchProperties={searchbank}
                {...BilltypeList}
                afterSelect={cooperationChange}
                rowKey="code"
                showSearch={false}
                allowClear={true}
                afterClear={clearinput}
                reader={{
                    name: 'name',
                }}
                className={styles.btn}
            />
            <Search
                placeholder='请输入变更单号'
                className={styles.btn}
                onSearch={handleQuickSerach}
                allowClear
                style={{ width: '240px' }}
            />
        </div>
    )
    // 高级查询配置
    const formItems = [
        { title: '供应商代码', key: 'Q_EQ_smSupplierCode', props: { placeholder: '输入供应商代码' } },
        { title: '供应商名称', key: 'Q_LK_smSupplierName', props: { placeholder: '输入供应商名称' } },
        { title: '单据状态', key: 'Q_EQ_smSubmitStatus', type: 'list', props: BilltypeList },
        { title: '审核状态', key: 'Q_EQ_flowStatus', type: 'list', props: ToexamineList },
        { title: '变更类型', key: 'Q_EQ_smPcnChangeTypeCode', type: 'list', props: PCNMasterdatalist },
        { title: '战略采购', key: 'Q_EQ_smPcnStrategicId', type: 'list', props: seniorStrategypurchase },
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
                        //{...dataSource}
                        store={{
                            url: `${smBaseUrl}/api/smPcnTitleService/findByPurchasePage?onlyMeStatus=` + jurisdiction,
                            params: {
                                ...searchValue,
                                quickSearchProperties: ['smPcnCode'],
                                sortOrders: [
                                    {
                                        property: 'createdDate',
                                        direction: 'DESC'
                                    }
                                ],
                                filters: seniorsearchValue
                            },
                            type: 'POST'
                        }}
                    />
                }
            </AutoSizeLayout>
        </>
    )
}

export default SupplierConfigure
