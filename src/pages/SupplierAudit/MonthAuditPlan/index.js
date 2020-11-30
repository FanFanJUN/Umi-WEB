/*
 * @Description:  月度审核计划管理
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/MonthAuditPlan/index.js
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Input, message, Modal } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import { StartFlow } from 'seid';
import moment from "moment";
import { CompanyConfig, EndFlow} from '../mainData/commomService';
import { judge } from '../../QualitySynergy/commonProps';
import { deletePlanMonth, ShareStatusProps, flowProps, ApplyOrganizationProps } from "./service";
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab, getUserAccount } from '../../../utils';
import ChangeHistory from "./component/ChangeHistory";

const { FlowHistoryButton } = WorkFlow;
const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {

    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const [data, setData] = useState({
        quickSearchValue: '',
        epTechnicalShareDemandSearchBo: {},
        selectedRowKeys: [],
        selectedRows: [],
        flowId: ''
    });
    const [historyVisible, setHistoryV] = useState(false);
    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);

    const listenerParentClose = (event) => {
        const { data = {} } = event;
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh();
        }
    };

    const redirectToPage = (type) => {
        switch (type) {
            case 'add':
                openNewTab('supplierAudit/MonthAuditPlanEda?pageState=add', '月度审核计划管理-新增', false);
                break;
            case 'edit':
                openNewTab(`supplierAudit/MonthAuditPlanEda?pageState=edit&id=${data.selectedRowKeys[0]}`, '月度审核计划管理-编辑', false);
                break;
            case 'detail':
                openNewTab(`supplierAudit/MonthAuditPlanEda?pageState=detail&id=${data.selectedRowKeys[0]}`, '月度审核计划管理-明细', false);
                break;
            case 'change':
                openNewTab(`supplierAudit/MonthAuditPlanEda?pageState=change&id=${data.selectedRowKeys[0]}`, '月度审核计划管理-变更', false);
                break;
            case "changehistory":
                setHistoryV(true);
                break;
            default:
                break;
        }
    };

    // 快速查询
    const handleQuickSearch = (value) => {
        setData(v => ({ ...v, quickSearchValue: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };
    // 高级查询搜索
    const handleAdvancedSearch = (value) => {
        console.log(value)
        value.applyDate = value.applyDate ? moment(value.applyDate).format('YYYY-MM-DD ') : ''
        value.applyDateStart = value.applyDate ? value.applyDate + "00:00:00" : ''
        value.applyDateEnd = value.applyDate ? value.applyDate + "23:59:59" : ''
        delete value.flowStatus_name;
        delete value.applyCorporationCode_name;
        delete value.applyDepartmentCode_name;
        delete value.state_name
        delete value.applyDate;
        setData(v => ({ ...v, epTechnicalShareDemandSearchBo: { ...value } }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
        headerRef.current.hide();
    };

    // 删除
    const deleteList = () => {
        Modal.confirm({
            title: '删除',
            content: '是否删除选中的数据',
            okText: '是',
            okType: 'danger',
            cancelText: '否',
            onOk: () => {
                console.log([...data.selectedRowKeys])
                deletePlanMonth(data.selectedRowKeys).then(res => {
                    if (res.success) {
                        message.success(res.message);
                        tableRef.current.manualSelectedRows();
                        tableRef.current.remoteDataRefresh();
                    } else {
                        message.error(res.message);
                    }
                });
            },
        });
    };

    // 提交审核完成更新列表
    function handleComplete() {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    }
    // 终止审核
    const handleStopFlow = () => {
        Modal.confirm({
            title: '终止审核',
            content: '是否终止审核？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                setData(v => ({ ...v, spinning: true }));
                const { flowId } = data;
                const { success, message: msg } = await EndFlow({
                    businessId: flowId,
                });
                if (success) {
                    message.success(msg);
                    setData(v => ({ ...v, spinning: false }));
                    tableRef.current.manualSelectedRows();
                    tableRef.current.remoteDataRefresh();
                    return;
                }
                message.error(msg);
            },
        });
    };

    // 高级查询配置
    const formItems = [
        { title: '公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '申请部门', key: 'applyDepartmentCode', type: 'tree', props: ApplyOrganizationProps },
        { title: '申请人', key: 'applyName', props: { placeholder: '输入申请人' } },
        { title: '申请日期', key: 'applyDate', type: 'datePicker', props: { placeholder: '选择申请日期' } },
        { title: '状态', key: 'state', type: 'list', props: ShareStatusProps },
        { title: '审批状态', key: 'flowStatus', type: 'list', props: flowProps },
    ];

    const columns = [
        {
            title: '状态', dataIndex: 'state', width: 120, render: (text) => {
                switch (text) {
                    case "DRAFT":
                        return "草稿";
                    case "EFFECT":
                        return "生效";
                    case "CHANGING":
                        return "变更中";
                }
            }
        },
        {
            title: '审批状态', dataIndex: 'flowStatus', width: 180, render: v => {
                switch (v) {
                    case 'INIT':
                        return '未进入流程';
                    case 'INPROCESS':
                        return '流程中';
                    case 'COMPLETED':
                        return '流程处理完成';
                }
            },
        },
        { title: '月度审核计划号', dataIndex: 'reviewPlanMonthCode', width: 180 },
        { title: '月度', dataIndex: 'applyMonth', ellipsis: true, width: 80, render:(text)=>text ? (text + "月") : ''},
        { title: '拟制说明', dataIndex: 'reviewPlanMonthName', ellipsis: true, width: 200 },
        { title: '拟制公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200 },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
        { title: '拟制人员', dataIndex: 'applyName', ellipsis: true, width: 120 },
        { title: '拟制时间', dataIndex: 'applyDate', ellipsis: true, width: 200 },
    ].map(item => ({ ...item, align: 'center' }));

    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => redirectToPage('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_EDIT'
                disabled={
                    data.selectedRowKeys.length !== 1
                    || data.selectedRows[0]?.state !== 'DRAFT'
                    || data.selectedRows[0]?.flowStatus !== 'INIT'
                    || data.selectedRows[0]?.applyAccount !== getUserAccount()
                }
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={deleteList}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_DELETE'
                disabled={!(data.selectedRowKeys.length !== 0
                    && judge(data.selectedRows, 'state', 'DRAFT')
                    && judge(data.selectedRows, 'flowStatus', 'INIT')
                    && judge(data.selectedRows, 'applyAccount', getUserAccount()))}
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_DETAIL'
                disabled={data.selectedRowKeys.length !== 1}
            >明细</Button>)
        }
        {
            authAction(<StartFlow
                style={{ marginRight: '5px' }}
                ignore={DEVELOPER_ENV}
                businessKey={data.flowId}
                callBack={handleComplete}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length !== 1}
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewPlanMonth'
                key='SUPPLIER_AUDIT_MONTH_INFLOW'
            >提交审核</StartFlow>)
        }
        {
            authAction(<FlowHistoryButton
                businessId={data.flowId}
                flowMapUrl='flow-web/design/showLook'
                ignore={DEVELOPER_ENV}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
                key='SUPPLIER_AUDIT_MONTH_HISTORY'
            >
                <Button className={styles.btn} disabled={data.selectedRowKeys.length !== 1}>审核历史</Button>
            </FlowHistoryButton>)
        }
        {
            authAction(<Button
                onClick={handleStopFlow}
                loading={data.spinning}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_STOP'
            >终止审核</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('change')}
                className={styles.btn}
                disabled={
                    data.selectedRowKeys.length !== 1 
                    || data.selectedRows[0]?.flowStatus !== 'COMPLETED'
                    || data.selectedRows[0]?.state === 'CHANGING'
                }
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_CHANGE'
            >变更</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('changehistory')}
                className={styles.btn}
                disabled={data.selectedRowKeys.length !== 1}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_MONTH_CHANGE_LIST'
            >变更历史</Button>)
        }
    </>;

    const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
            placeholder='请输入月度审核计划号或拟制说明查询'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </div>;

    return (
        <Fragment>
            <Header
                left={headerLeft}
                right={headerRight}
                ref={headerRef}
                content={
                    <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
                }
                advanced
            />
            <AutoSizeLayout>
                {
                    (h) => <ExtTable
                        rowKey={(v) => v.id}
                        height={h}
                        columns={columns}
                        store={{
                            params: {
                                quickSearchValue: data.quickSearchValue,
                                ...data.epTechnicalShareDemandSearchBo,
                            },
                            url: `${recommendUrl}/api/reviewPlanMonthService/findByPage`,
                            type: 'POST',
                        }}
                        allowCancelSelect={true}
                        remotePaging={true}
                        checkbox={{
                            multiSelect: true,
                        }}
                        ref={tableRef}
                        showSearch={false}
                        onSelectRow={(value, rows) => {
                            setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows, flowId: value[0] }));
                        }}
                        selectedRowKeys={data.selectedRowKeys}
                    />
                }
            </AutoSizeLayout>

            {historyVisible && <ChangeHistory
                visible={historyVisible}
                handleCancel={()=>{setHistoryV(false)}}
                id={data.selectedRowKeys[0]}
                code={data.selectedRows[0]?.reviewPlanMonthCode}
            />}
        </Fragment>
    );
}
