/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:00:19
 * @LastEditTime: 2020-11-02 10:10:14
 * @Description:  年度审核计划管理
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/index.js
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Checkbox, Input, message, Modal, Tooltip } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { StartFlow } from 'seid';
import { BarCode, ComboList, ExtTable, utils } from 'suid';
import {
    ApplyOrganizationProps,
    AuditCauseManagementConfig,
    AuditTypeManagementConfig,
    CompanyConfig,
    FindByFiltersConfig,
} from '../mainData/commomService';
import {
    BUConfigNoFrostHighSearch,
    DeleteDataSharingList,
    MaterialConfig,
    MaterialGroupConfig, RecallDataSharingList,
    ShareDistributionProps,
    ShareStatusProps,
    StrategicPurchaseConfig,
    SubmitDataSharingList,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab } from '../../../utils';
import { judge } from '../../../utils/utilTool';
import { materialClassProps } from '../../../utils/commonProps';
import moment from 'moment';
import { deleteReviewPlanYear, submitReviewPlanYear } from './service';
import { stateProps, flowProps, reviewTypesProps, reviewReasonsProps } from './propsParams';

const { authAction } = utils;
const { Search } = Input;

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
            case 'recall':
                recallList();
                break;
            default:
                break;
        }
    };

    // 撤回选中单据
    const recallList = () => {
        Modal.confirm({
            title: '撤回',
            content: '是否撤回选中的数据',
            okText: '是',
            cancelText: '否',
            onOk: () => {
                RecallDataSharingList({
                    ids: data.selectedRowKeys.toString(),
                }).then(res => {
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
                deleteReviewPlanYear({
                    ids: data.selectedRowKeys.toString(),
                }).then(res => {
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
        // value.materialCode = value.materialCode_name;
        // value.materialGroupCode = value.materialGroupCode_name;
        // value.strategicPurchaseCode = value.strategicPurchaseCode_name;
        // value.buCode = value.buCode_name;
        // value.state = value.state_name;
        // value.allotSupplierState = value.allotSupplierState_name;
        // delete value.materialCode_name;
        // delete value.materialGroupCode_name;
        // delete value.strategicPurchaseCode_name;
        // delete value.buCode_name;
        // delete value.state_name;
        // delete value.allotSupplierState_name;
        setData(v => ({ ...v, advanceFormData: value }));
        headerRef.current.hide();
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };

    // 高级查询配置
    const formItems = [
        { title: '公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '采购组织', key: 'purchaseTeamCode', type: 'list', props: FindByFiltersConfig },
        { title: '申请部门', key: 'applyDepartmentCode', type: 'tree', props: ApplyOrganizationProps },
        { title: '申请人', key: 'applyName', props: { placeholder: '输入申请人' } },
        { title: '申请日期', key: 'applyDate', type: 'datePicker', props: { placeholder: '输入申请人' } },
        { title: '供应商', key: 'supplierCode', type: 'list', props: ShareDistributionProps },
        { title: '物料二次分类', key: 'materialGroupCode', type: 'tree', props: materialClassProps },
        { title: '审核类型', key: 'reviewTypeCode', type: 'grid', props: reviewTypesProps },
        { title: '审核原因', key: 'reviewReasonCode', type: 'grid', props: reviewReasonsProps },
        { title: '审批状态', key: 'flowStatus', type: 'list', props: flowProps },
        { title: '状态', key: 'state', type: 'list', props: stateProps },
    ];

    const columns = [
        {
            title: '状态', dataIndex: 'state', width: 80, render: (text) => {
                switch (text) {
                    case "DRAFT":
                        return "草稿";
                    case "EFFECT":
                        return "生效";
                    case "CHANGING":
                        return "变更中";
                    default:
                        break;
                }
            }
        },
        {
            title: '审批状态', dataIndex: 'flowStatus', width: 200, render: (text, record) => {
                switch (text) {
                    case "INIT":
                        return "未提交审批";
                    case "INPROCESS":
                        return "审批中";
                    case "COMPLETED":
                        return "审批完成";
                    default:
                        break;
                }
            },
        },
        { title: '年度审核计划号', dataIndex: 'reviewPlanYearCode', width: 200 },
        { title: '年度', dataIndex: 'applyYear', ellipsis: true, width: 250 },
        { title: '拟制说明', dataIndex: 'reviewPlanYearName', ellipsis: true, width: 200 },
        { title: '拟制公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200 },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
        { title: '拟制人员', dataIndex: 'applyName', ellipsis: true, width: 200 },
        {
            title: '拟制时间', dataIndex: 'applyDate', ellipsis: true, width: 200, render: function (text, record) {
                return record.applyDateStart && `${moment(record.applyDateStart).format('YYYY-MM-DD')} ~ ${moment(record.applyDateEnd).format('YYYY-MM-DD')}`;
            }
        },
    ].map(item => ({ ...item, align: 'center' }));

    const visibleSupplier = () => {
        console.log('查看供应商');
    };

    const onChangeCreate = (e) => {
        setData(v => ({ ...v, checkedCreate: e.target.checked }));
        tableRef.current.remoteDataRefresh();
    };

    const onChangeDistribution = (e) => {
        setData(v => ({ ...v, checkedDistribution: e.target.checked }));
        tableRef.current.remoteDataRefresh();
    };


    const headerLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => redirectToPage('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_EDIT'
                disabled={
                    !checkOnlyOneSelect ||
                    data.selectedRows[0]?.state !== 'DRAFT' || data.selectedRows[0]?.flowStatus !== 'INIT'}
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_DELETE'
                disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', 'DRAFT') || data.selectedRowKeys.length > 1}
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('detail')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_DETAIL'
                disabled={!checkOnlyOneSelect}
            >明细</Button>)
        }
        {
            authAction(<StartFlow
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                businessKey={data.selectedRowKeys[0]}
                // callBack={handleComplete}
                disabled={!checkOnlyOneSelect}
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewPlanYear'
                key='SRM-SM-ACCOUNTSUPPLIER-EXAMINE'
            >提交审核</StartFlow>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('recall')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_UNDO'
                disabled={!checkOnlyOneSelect}
            >审核历史</Button>)
        }
        {
            authAction(<Button
                onClick={() => redirectToPage('allot')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='TECHNICAL_DATA_SHARING_ALLOT'
                disabled={!checkOnlyOneSelect}
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
