/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:00:19
 * @LastEditTime: 2020-12-09 16:48:31
 * @Description:  年度审核计划管理
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/index.js
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import moment from "moment";
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Input, message, Modal } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { StartFlow } from 'seid';
import { WorkFlow, ExtTable, utils } from 'suid';
import {
    CompanyConfig,
} from '../mainData/commomService';
import {
    ApplyOrganizationProps
} from '../MonthAuditPlan/service';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab } from '../../../utils';
import { judge } from '../../../utils/utilTool';
import { deleteReviewPlanYear, endFlow, submitReviewPlanYear } from './service';
import { stateProps, flowProps, reviewTypesProps, reviewReasonsProps } from './propsParams';
import { getUserAccount } from '../../../components/utils/CommonUtils';

const { authAction } = utils;
const { Search } = Input;
const { FlowHistoryButton } = WorkFlow;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {

    const headerRef = useRef(null);
    const tableRef = useRef(null);

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

    const [data, setData] = useState({
        checkedCreate: false,
        checkedDistribution: false,
        quickSearchValue: '',
        advanceFormData: {},
        selectedRowKeys: [],
        selectedRows: [],
    });

    const checkOnlyOneSelect = data.selectedRowKeys.length === 1;


    const redirectToPage = (type) => {
        switch (type) {
            case 'add':
                openNewTab('supplierAudit/AnnualAuditPlanEda?pageState=add', '年度审核计划管理-新增', false);
                break;
            case 'edit':
                openNewTab(`supplierAudit/AnnualAuditPlanEda?pageState=edit&id=${data.selectedRowKeys[0]}`, '年度审核计划管理-编辑', false);
                break;
            case 'detail':
                openNewTab(`supplierAudit/AnnualAuditPlanDetail?pageState=detail&id=${data.selectedRowKeys[0]}`, '年度审核计划管理-明细', false);
                break;
            case 'delete':
                deleteList();
                break;
            case 'submit':
                submitOrRecall('submit');
                break;
            case 'endFlow':
                toEndFlow();
                break;
            default:
                break;
        }
    };

    // 提交审核完成更新列表
    function handleComplete() {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    }

    const toEndFlow = () => {
        Modal.confirm({
            title: '终止审核',
            content: '是否终止审核？',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                setData(v => ({ ...v, spinning: true }));
                const flowId = data.selectedRowKeys[0];
                const { success, message: msg } = await endFlow({
                    businessId: flowId,
                });
                if (success) {
                    message.success(msg);
                    setData(v => ({ ...v, spinning: false }));
                    handleComplete();
                } else {
                    message.error(msg);
                }
            },
        });
    };


    const handleQuickSearch = (value) => {
        setData(v => ({ ...v, quickSearchValue: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
        console.log(value, 'value');
    };


    const submitOrRecall = (type) => {
        if (type === 'submit') {
            submitReviewPlanYear({
                ids: data.selectedRowKeys.toString(),
            }).then(res => {
                if (res.success) {
                    message.success('提交成功');
                    tableRef.current.manualSelectedRows();
                    tableRef.current.remoteDataRefresh();
                } else {
                    message.error(res.message);
                }
            });
        } else {

        }
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
                deleteReviewPlanYear(data.selectedRowKeys).then(res => {
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

    // 高级查询搜索
    const handleAdvancedSearch = (value) => {
        console.log(value, '高级查询');
        value.applyDate = value.applyDate ? moment(value.applyDate).format('YYYY-MM-DD ') : ''
        value.applyDateStart = value.applyDate ? value.applyDate + "00:00:00" : ''
        value.applyDateEnd = value.applyDate ? value.applyDate + "23:59:59" : ''
        delete value.applyCorporationCode_name;
        delete value.applyDepartmentCode_name;
        delete value.applyDate;
        setData(v => ({ ...v, advanceFormData: value }));
        headerRef.current.hide();
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };

    // 高级查询配置
    const formItems = [
        { title: '公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '申请部门', key: 'applyDepartmentCode', type: 'tree', props: ApplyOrganizationProps },
        { title: '申请人', key: 'applyName', props: { placeholder: '输入申请人' } },
        { title: '申请日期', key: 'applyDate', type: 'datePicker', props: { placeholder: '选择申请日期' } },
        { title: '审批状态', key: 'flowStatus', type: 'list', props: flowProps },
        { title: '状态', key: 'state', type: 'list', props: stateProps },
    ];

    const columns = [
        {
            title: '状态', dataIndex: 'state', width: 100, align: 'center', render: (text) => {
                switch (text) {
                    case "DRAFT":
                        return "草稿";
                    case "EFFECT":
                        return "生效";
                    default:
                        break;
                }
            }
        },
        {
            title: '审批状态', dataIndex: 'flowStatus', width: 120, render: (text, record) => {
                switch (text) {
                    case 'INIT':
                        return '未进入流程';
                    case 'INPROCESS':
                        return '流程中';
                    case 'COMPLETED':
                        return '流程处理完成';
                    default:
                        break;
                }
            },
        },
        { title: '年度审核计划号', dataIndex: 'reviewPlanYearCode', align: 'center', width: 160 },
        { title: '年度', dataIndex: 'applyYear', ellipsis: true, width: 93, render: text => text && `${text} 年`, align: 'right' },
        { title: '拟制说明', dataIndex: 'reviewPlanYearName', ellipsis: true, width: 200, align: 'left' },
        { title: '拟制公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200, align: 'left' },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200, align: 'left' },
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
                key='SUPPLIER_AUDIT_YEAR_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_YEAR_EDIT'
                disabled={
                    !judge(data.selectedRows, 'applyAccount', getUserAccount()) ||
                    !checkOnlyOneSelect ||
                    data.selectedRows[0]?.state !== 'DRAFT' || data.selectedRows[0]?.flowStatus !== 'INIT'}
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_YEAR_DELETE'
                disabled={data.selectedRowKeys.length === 0
                    || !judge(data.selectedRows, 'state', 'DRAFT')
                    || !judge(data.selectedRows, 'flowStatus', 'INIT')
                    || !judge(data.selectedRows, 'applyAccount', getUserAccount())
                }
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_YEAR_DETAIL'
                disabled={!checkOnlyOneSelect}
            >明细</Button>)
        }
        {
            authAction(<StartFlow
                className={styles.btn}
                style={{ marginRight: '5px' }}
                ignore={DEVELOPER_ENV}
                businessKey={data.selectedRowKeys[0]}
                callBack={handleComplete}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INIT') || !checkOnlyOneSelect || !judge(data.selectedRows, 'applyAccount', getUserAccount())}
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewPlanYear'
                key='SUPPLIER_AUDIT_YEAR_PUBLISH'
            >提交审核</StartFlow>)
        }
        {
            authAction(<FlowHistoryButton
                businessId={data.selectedRowKeys[0]}
                flowMapUrl='flow-web/design/showLook'
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_YEAR_HISTORY'
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || !checkOnlyOneSelect}
            >
                <Button className={styles.btn} disabled={data.selectedRowKeys.length !== 1}>审核历史</Button>
            </FlowHistoryButton>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('endFlow')}
                className={styles.btn}
                disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || !checkOnlyOneSelect || !judge(data.selectedRows, 'applyAccount', getUserAccount())}
                ignore={DEVELOPER_ENV}
                key='SUPPLIER_AUDIT_YEAR_ALLOT'
            >终止审核</Button>)
        }
    </>;

    const headerRight = <div style={{ display: 'flex', alignItems: 'center', width: '300px' }}>
        <Search
            placeholder='请输入年度审核计划号或拟制说明查询'
            className={styles.btn}
            onSearch={handleQuickSearch}
            allowClear
        />
    </div>;

    const onSelectRow = (value, rows) => {
        console.log(value, rows);
        setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows }));
    };

    return (
        <Fragment>
            <Header
                left={headerLeft}
                right={headerRight}
                hiddenClose
                content={
                    <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
                }
                ref={headerRef}
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
                                ...data.checkedCreate ? { onlyOwn: data.checkedCreate } : null,
                                ...data.checkedDistribution ? { onlyAllocation: data.checkedDistribution } : null,
                                quickSearchValue: data.quickSearchValue,
                                ...data.advanceFormData,
                            },
                            url: `${recommendUrl}/api/reviewPlanYearService/findByPage`,
                            type: 'POST',
                        }}
                        allowCancelSelect={true}
                        remotePaging={true}
                        checkbox={{
                            multiSelect: true,
                        }}
                        ref={tableRef}
                        showSearch={false}
                        onSelectRow={onSelectRow}
                        selectedRowKeys={data.selectedRowKeys}
                    />
                }
            </AutoSizeLayout>
        </Fragment>
    );
}
