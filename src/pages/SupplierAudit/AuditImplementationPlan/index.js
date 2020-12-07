/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 09:27:25
 * @Description: 审核实施计划管理
 */
/*
 * @Description:  月度审核计划管理
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/MonthAuditPlan/index.js
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Button, Input, message, Modal } from 'antd';
import { ExtTable, utils, WorkFlow } from 'suid';
import { StartFlow } from 'seid';
import moment from "moment";
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ApplyOrganizationProps, CompanyConfig, EndFlow } from '../mainData/commomService';
import {
    judge,
    flowProps
} from '../../QualitySynergy/commonProps';
import { deleteReviewImplementPlan, ShareStatusProps } from "./service";
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab, getUserAccount } from '../../../utils';
import ChangeHistory from "./components/ChangeHistory";
import AddNodal from "./components/addModal";
import ChangeLaderModal from "./components/changeLeader";

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
    const [addVisible, setAddV] = useState(false);
    const [changeVisible, setChangeV] = useState(false);

    useEffect(() => {
        window.parent.frames.addEventListener('message', listenerParentClose, false);
        return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
    }, []);

    const listenerParentClose = (event) => {
        const { data = {} } = event;
        console.log(data);
        if (data.tabAction === 'close') {
            tableRef.current.remoteDataRefresh();
        }
    };

    const redirectToPage = (type) => {
        switch (type) {
            case 'add':
                setAddV(true);
                break;
            case 'edit':
                openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=edit&id=${data.selectedRowKeys[0]}`, '编辑审核实施计划', false);
                break;
            case 'detail':
                openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=detail&id=${data.selectedRowKeys[0]}`, '审核实施计划明细', false);
                break;
            case 'change':
                openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=change&id=${data.selectedRowKeys[0]}`, '变更审核实施计划', false);
                break;
            case "changehistory":
                setHistoryV(true);
                break;
            case "changeLeader":
                setChangeV(true);
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
        delete value.state_name;
        delete value.flowStatus_name;
        delete value.purchaseTeamCode_name;
        // delete value.applyDepartmentCode_name;
        delete value.applyCorporationCode_name;
        delete value.materialSecondClassifyCode_name;
        delete value.allotSupplierState_name;
        delete value.reviewTypeCode_name;
        value.applyDate = value.applyDate ? moment(value.applyDate).format('YYYY-MM-DD ') : '';
        if(value.applyDate) {
            value.ApplyDateStart = value.applyDate ? value.applyDate + "00:00:00" : ''
            value.ApplyDateEnd = value.applyDate ? value.applyDate + "23:59:59" : ''
        }
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
                deleteReviewImplementPlan(data.selectedRowKeys).then(res => {
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

    // 提交审核验证
    const handleBeforeStartFlow = async () => {

    };
    // 提交审核完成更新列表
    function refresh() {
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
            title: '状态', dataIndex: 'state', width: 160, align: 'center', render: (text) => {
                switch (text) {
                    case "DRAFT":
                        return "草稿";
                    case "REVIEWING":
                        return "评审中";
                    case "END_REVIEWING":
                        return "评审完成";
                    case "CHANGING":
                        return "变更中";
                    case "CONFIRM":
                        return "审核结果确认完成";
                    case "REPORTED":
                        return "已产生报告";
                }
            }
        },
        { title: '作废', dataIndex: 'whetherDeleted', ellipsis: true, width: 80, render: text => text ? "是" : "否" },
        {
            title: '审批状态', dataIndex: 'flowStatus', width: 140, render: v => {
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
        { title: '审核实施计划号', dataIndex: 'reviewImplementPlanCode', width: 180, align: 'center'},
        { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 250 },
        { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
        { title: '审核时间', dataIndex: 'reviewDateStart', ellipsis: true, width: 200, align: 'center', render: (text, item) => (text.slice(0, 10) + '~' + item.reviewDateEnd.slice(0, 10)) },
        { title: '拟制人员', dataIndex: 'applyName', ellipsis: true, width: 140 },
        { title: '拟制时间', dataIndex: 'applyDate', ellipsis: true, width: 200, align: 'center' },
    ];

    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => redirectToPage('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_EDIT'
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
                key='SUPPLIER_AUDIT_IMPLEMENT_DELETE'
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
                key='SUPPLIER_AUDIT_IMPLEMENT_DETAIL'
                disabled={data.selectedRowKeys.length !== 1}
            >明细</Button>)
        }
        {
            authAction(<StartFlow
                style={{ marginRight: '5px' }}
                ignore={DEVELOPER_ENV}
                needConfirm={handleBeforeStartFlow}
                businessKey={data.flowId}
                callBack={refresh}
                disabled={
                    !judge(data.selectedRows, 'flowStatus', 'INIT')
                    || data.selectedRowKeys.length === 0
                    || !judge(data.selectedRows, 'applyAccount', getUserAccount())}
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewImplementPlan'
                key='SUPPLIER_AUDIT_IMPLEMENT_INFLOW'
            >提交审核</StartFlow>)
        }
        {
            authAction(<FlowHistoryButton
                businessId={data.flowId}
                flowMapUrl='flow-web/design/showLook'
                ignore={DEVELOPER_ENV}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
                key='SUPPLIER_AUDIT_IMPLEMENT_HISTORY'
            >
                <Button className={styles.btn} disabled={data.selectedRowKeys.length !== 1}>审核历史</Button>
            </FlowHistoryButton>)
        }
        {
            authAction(<Button
                onClick={handleStopFlow}
                loading={data.spinning}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS')
                    || data.selectedRowKeys.length === 0
                    || !judge(data.selectedRows, 'applyAccount', getUserAccount())}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_STOP'
            >终止审核</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('change')}
                className={styles.btn}
                disabled={
                    data.selectedRowKeys.length !== 1
                    || data.selectedRows[0]?.flowStatus !== 'COMPLETED'
                    || !judge(data.selectedRows, 'applyAccount', getUserAccount())
                }
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_CHANGE'
            >变更</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('changehistory')}
                className={styles.btn}
                disabled={data.selectedRowKeys.length !== 1}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_CHANGE_LIST'
            >变更历史</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('changeLeader')}
                className={styles.btn}
                disabled={data.selectedRowKeys.length !== 1 || !judge(data.selectedRows, 'applyAccount', getUserAccount())}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_IMPLEMENT_CHANGE_LEADER'
            >变更组长</Button>)
        }
    </>;

    const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
            placeholder='请输入审核实施计划号查询'
            className={styles.btn}
            style={{width: "16vw"}}
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
                hiddenClose
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
                            url: `${recommendUrl}/api/reviewImplementPlanService/findReviewImplementPlanPage`,
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
                            console.log(value, rows);
                            setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows, flowId: value[0] }));
                        }}
                        selectedRowKeys={data.selectedRowKeys}
                    />
                }
            </AutoSizeLayout>

            {historyVisible && <ChangeHistory
                visible={historyVisible}
                handleCancel={() => { setHistoryV(false) }}
                id={data.selectedRowKeys[0]}
                code={data.selectedRows[0]?.reviewImplementPlanCode}
            />}
            { addVisible && <AddNodal
                visible={addVisible}
                handleCancel={() => { setAddV(false) }}
            />
            }
            { changeVisible && <ChangeLaderModal
                visible={changeVisible}
                handleOk={() => { refresh() }}
                originData={data.selectedRows[0]}
                handleCancel={() => { setChangeV(false) }}
            />
            }
        </Fragment>
    );
}
