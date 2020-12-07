/*
 * @Description:  月度审核计划明细
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/MonthAuditPlan/detailList.js
 */
import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Input } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { DataExport, ExtTable, utils } from 'suid';
import moment from "moment";
import {
    AuditCauseManagementConfig,
    AuditTypeManagementNoFrozenConfig,
    CompanyConfig,
    FindByFiltersConfig,
} from '../mainData/commomService';
import { reviewWaysProps, reviewOrganizeProps } from "../AnnualAuditPlan/propsParams"
import { supplierProps } from '@/utils/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';
const supplierPropsNew = {
    allowClear: true,
    ...supplierProps,
    reader: {
      name: 'name',
      field: ['code'],
      description: 'code'
    },
    placeholder: '选择供应商'
};
const agentList = {
    allowClear: true,
    ...supplierProps,
    reader: {
      name: 'name',
      field: ['code'],
      description: 'code'
    },
    placeholder: '选择代理商'
};
const reviewWaysPropsNew = {
    allowClear: true,
    ...reviewWaysProps,
    reader: {
        name: 'name',
        field: ['code'],
        description: 'code'
    },
}
const reviewOrganizePropsNew = {
    allowClear: true,
    ...reviewOrganizeProps,
    reader: {
        field: ['code'],
        name: 'name',
        description: 'code',
    },
}
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
        epTechnicalShareDemandSearchBo: {},
        selectedRows: [],
    });

    const handleQuickSearch = (value) => {
        setData(v => ({ ...v, quickSearchValue: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    };

    // 高级查询搜索
    const handleAdvancedSearch = (value) => {
        console.log(value, '高级查询');
        delete value.lineApplyCorporationCode_name;
        delete value.materialGroupCode_name;
        delete value.purchaseTeamCode_name;
        delete value.reviewOrganizedWayCode_name
        delete value.reviewReasonCode_name;
        delete value.reviewTypeCode_name;
        delete value.reviewWayCode_name;
        delete value.specialtyTeamCode_name;
        delete value.supplierCode_name;
        delete value.agentCode_name;
        setData(v => ({ ...v, epTechnicalShareDemandSearchBo: { ...value } }));
        tableRef.current.remoteDataRefresh();
        tableRef.current.manualSelectedRows();
        headerRef.current.hide();
    };

    // 高级查询配置
    const formItems = [
        { title: '需求公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '采购组织', key: 'purchaseTeamCode', type: 'list', props: FindByFiltersConfig},
        { title: '物料分类', key: 'materialGroupCode', type: 'tree', props: materialClassProps },
        { title: '供应商', key: 'supplierCode', type: 'list', props: supplierPropsNew },
        { title: '代理商', key: 'agentCode', type: 'list', props: agentList },
        { title: '审核类型', key: 'reviewTypeCode', type: 'list', props: AuditTypeManagementNoFrozenConfig },
        { title: '审核原因', key: 'reviewReasonCode', type: 'list', props: AuditCauseManagementConfig },
        { title: '审核方式', key: 'reviewWayCode', type: 'list', props: reviewWaysPropsNew },
        { title: '审核组织形式', key: 'reviewOrganizedWayCode', type: 'list', props: reviewOrganizePropsNew },
        { title: '专业组', key: 'specialtyTeamCode', type: 'list', props: AuditCauseManagementConfig },
        { title: '审核小组组长', key: 'leaderName', props: { placeholder: '输入审核小组组长' } },
        { title: '协同人员', key: 'memberName', props: { placeholder: '输入协同人员' } },
    ];

    const columns = [
        { title: '状态', dataIndex: 'state', width: 80, render: (text) => {
            switch (text) {
                case "DRAFT":
                    return "草稿";
                case "EFFECT":
                    return "生效";
                case "CHANGING":
                    return "变更中";
            }
        } },
        { title: '审批状态', dataIndex: 'flowStatus', width: 100, render: v => {
            switch (v) {
                case 'INIT':
                    return '未进入流程';
                case 'INPROCESS':
                    return '流程中';
                case 'COMPLETED':
                    return '流程处理完成';
            }
        }, },
        { title: '月度审核计划号', dataIndex: 'reviewPlanMonthCode', width: 140, align: 'center' },
        { title: '月度', dataIndex: 'applyMonth', ellipsis: true, width: 120, align: 'center', render:(text)=>text ? text.slice(0, 7) : '' },
        { title: '拟制说明', dataIndex: 'reviewPlanMonthName', ellipsis: true, width: 200 },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 180 },
        { title: '拟制人', dataIndex: 'applyName', ellipsis: true, width: 80, align: 'center' },
        { title: '拟制日期', dataIndex: 'applyDate', ellipsis: true, width: 120, align: 'center', render: text => text.slice(0, 10) },
        { title: '行号', dataIndex: 'reviewPlanMonthLinenum', ellipsis: true, width: 80, align: 'center'},
        { title: '需求公司代码', dataIndex: 'applyCorporationCode', width: 100, ellipsis: true, align: 'center'},
        { title: '需求公司名称', dataIndex: 'applyCorporationName', width: 160, ellipsis: true, },
        { title: '采购组织代码', dataIndex: 'purchaseTeamCode', ellipsis: true, width: 100, align: 'center' },
        { title: '采购组织名称', dataIndex: 'purchaseTeamName', ellipsis: true, width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 100 },
        { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
        { title: '审核组织形式', dataIndex: 'reviewOrganizedWayName', ellipsis: true, width: 100 },
        { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
        { title: '审核内容', dataIndex: 'auditContent', ellipsis: true, width: 140 },
        { title: '组长', dataIndex: 'leaderName', ellipsis: true, width: 100 },
        { title: '组员', dataIndex: 'memberName', ellipsis: true, width: 140 },
        { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
        { title: '物料分类代码', dataIndex: 'materialGroupCode', ellipsis: true, width: 100 },
        { title: '物料分类名称', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, width: 100 },
        { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, width: 140 },
        { title: '代理商代码', dataIndex: 'agentCode', ellipsis: true, width: 140 },
        { title: '代理商名称', dataIndex: 'agentName', ellipsis: true, width: 140 },
        { title: '生产厂地址', dataIndex: 'address', ellipsis: true, width: 140, render: (text, item) => {
            return item.countryName + item.provinceName + item.cityName + item.countyName + item.address;
          },
        },
        { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 100 },
        { title: '供应商联系方式', dataIndex: 'contactUserTel', ellipsis: true, width: 140 },
        { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
        { title: '已创建审核实施计划', dataIndex: 'whetherOccupied', ellipsis: true, width: 140, render:(text)=>text ? "是" : "否"},
    ];

    // 导出
    const explainResponse = res => {
        let arr = [];
        res.data.rows.map(item => {
            arr.push({
                '状态': item.state === "DRAFT" ? "草稿" : item.state === "EFFECT" ? "生效" : "变更中",
                '审批状态': item.flowStatus === "INIT" ? "未进入流程" : item.flowStatus === "INPROCESS" ? "流程中" : "流程处理完成",
                '月度审核计划号': item.reviewPlanMonthCode,
                '月度': item.applyMonth.slice(0, 7),
                '拟制说明': item.reviewPlanMonthName,
                '拟制部门': item.applyDepartmentName,
                '拟制人': item.applyName,
                '拟制日期': item.applyDate,
                '行号': item.reviewPlanMonthLinenum,
                '需求公司代码': item.applyCorporationCode,
                '需求公司名称': item.applyCorporationName,
                '采购组织代码': item.purchaseTeamCode,
                '采购组织名称': item.purchaseTeamName,
                '审核类型': item.reviewTypeName,
                '审核原因': item.reviewReasonName,
                '审核组织形式': item.reviewOrganizedWayName,
                '审核方式': item.reviewWayName,
                '审核内容': item.auditContent,
                '组长': item.leaderName,
                '组员': item.memberName,
                '专业组': item.specialtyTeamName,
                '物料分类代码': item.materialGroupCode,
                '物料分类名称': item.materialGroupName,
                '供应商代码': item.supplierCode,
                '供应商名称': item.supplierName,
                '代理商代码': item.agentCode,
                '代理商名称': item.agentName,
                '生产厂地址': (item.countryName + item.provinceName + item.cityName + item.countyName + item.address).replace(/\s+/g,""),
                '供应商联系人': item.contactUserName,
                '供应商联系方式': item.contactUserTel,
                '备注': item.remark,
                '已创建审核实施计划': item.whetherOccupied ? "是" : "否",
            });
        });
        if (res.success) {
            return arr;
        }
        return [];
    };
    // 获取导出的数据
    const requestParams = {
        url: `${recommendUrl}/api/reviewPlanMonthService/findDetailedReviewPlanMonthAndLine`,
        data: {
            quickSearchValue: data.quickSearchValue,
            ...data.epTechnicalShareDemandSearchBo,
            pageInfo: {page: 1, rows: 100000}
        },
        method: 'POST',
    };

    const headerLeft = <>
        {
            authAction(<DataExport.Button
                requestParams={requestParams}
                explainResponse={explainResponse}
                filenameFormat={'月度审核计划明细' + moment().format('YYYYMMDD')}
                key='SUPPLIER_AUDIT_MONTH_DETAIL_EXPORT'
                ignore={DEVELOPER_ENV}
            >导出</DataExport.Button>)
        }
    </>;

    const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
        <Search
            placeholder='请输入月度审核计划号或拟制说明查询'
            className={styles.btn}
            style={{width: "20vw"}}
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
                        rowKey={(v) =>v.id + v.reviewPlanMonthLinenum}
                        height={h}
                        columns={columns}
                        store={{
                            params: {
                                quickSearchValue: data.quickSearchValue,
                                ...data.epTechnicalShareDemandSearchBo,
                            },
                            url: `${recommendUrl}/api/reviewPlanMonthService/findDetailedReviewPlanMonthAndLine`,
                            type: 'POST',
                        }}
                        allowCancelSelect={true}
                        remotePaging={true}
                        checkbox={{
                            multiSelect: true,
                        }}
                        ref={tableRef}
                        showSearch={false}
                    />
                }
            </AutoSizeLayout>
        </Fragment>
    );
}
