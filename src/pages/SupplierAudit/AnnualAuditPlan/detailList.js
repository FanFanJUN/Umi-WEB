/*
 * @Description:  年度度审核计划明细
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
    CompanyConfig,
    FindByFiltersConfig,
} from '../mainData/commomService';
import { reviewWaysProps, reviewOrganizeProps } from "../AnnualAuditPlan/propsParams"
import { supplierProps } from '@/utils/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';
import { ShareStatusProps } from "./service";

const supplierPropsNew = {
    ...supplierProps,
    reader: {
      name: 'name',
      field: ['code'],
      description: 'code'
    },
    placeholder: '选择供应商'
};
const reviewWaysPropsNew = {
    ...reviewWaysProps,
    reader: {
        name: 'name',
        field: ['code'],
        description: 'code'
    },
}

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {

    const headerRef = useRef(null);
    const tableRef = useRef(null);

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
        delete value.materialGroupCode_name;
        delete value.purchaseTeamCode_name;
        delete value.state_name
        delete value.applyCorporationCode_name
        delete value.reviewReasonCode_name;
        delete value.reviewWayCode_name;
        delete value.supplierCode_name;
        setData(v => ({ ...v, epTechnicalShareDemandSearchBo: { ...value } }));
        tableRef.current.remoteDataRefresh();
        tableRef.current.manualSelectedRows();
        headerRef.current.hide();
    };

    // 高级查询配置
    const formItems = [
        { title: '需求公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '采购组织', key: 'purchaseTeamCode', type: 'list', props: FindByFiltersConfig},
        { title: '供应商', key: 'supplierCode', type: 'list', props: supplierPropsNew },
        { title: '物料二次分类', key: 'materialGroupCode', type: 'tree', props: materialClassProps },
        { title: '审核方式', key: 'reviewWayCode', type: 'list', props: reviewWaysPropsNew },
        { title: '审核原因', key: 'reviewReasonCode', type: 'list', props: AuditCauseManagementConfig },
        { title: '预计审核月度', key: 'reviewMonth'},
        { title: '状态', key: 'state', type: 'list', props: ShareStatusProps },
    ];

    const columns = [
        { title: '状态', dataIndex: 'state', width: 80, render: (text) => {
            switch (text) {
                case "DRAFT":
                    return "草稿";
                case "EFFECT":
                    return "生效";
            }
        } },
        { title: '审批状态', dataIndex: 'flowStatus', width: 200, render: v => {
            switch (v) {
                case 'INIT':
                    return '未进入流程';
                case 'INPROCESS':
                    return '流程中';
                case 'COMPLETED':
                    return '流程处理完成';
            }
        }, },
        { title: '年度审核需求号', dataIndex: 'reviewPlanYearCode', width: 200 },
        { title: '年度', dataIndex: 'applyYear', ellipsis: true, width: 80, render:(text)=>text ? (text + "月") : '' },
        { title: '拟制说明', dataIndex: 'reviewPlanYearName', ellipsis: true, width: 200 },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
        { title: '拟制人', dataIndex: 'applyName', ellipsis: true, width: 140 },
        { title: '拟制日期', dataIndex: 'applyDate', ellipsis: true, width: 200 },
        { title: '行号', dataIndex: 'reviewPlanYearLinenum', ellipsis: true, width: 200 },
        { title: '需求公司代码', dataIndex: 'applyCorporationCode', width: 140, ellipsis: true, },
        { title: '需求公司名称', dataIndex: 'applyCorporationName', width: 140, ellipsis: true, },
        { title: '采购组织代码', dataIndex: 'purchaseTeamCode', ellipsis: true, width: 140 },
        { title: '采购组织名称', dataIndex: 'purchaseTeamName', ellipsis: true, width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
        { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },

        { title: '预计审核月度', dataIndex: 'reviewMonth', ellipsis: true, width: 140 },
        { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
        { title: '专业组', dataIndex: 'specialtyTeamName', ellipsis: true, width: 140 },
        { title: '物料分类代码', dataIndex: 'materialGroupCode', ellipsis: true, width: 140 },
        { title: '物料分类名称', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
        { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, width: 140 },
        { title: '代理商代码', dataIndex: 'agentCode', ellipsis: true, width: 140 },
        { title: '代理商名称', dataIndex: 'agentName', ellipsis: true, width: 140 },
        { title: '生产厂地址', dataIndex: 'address', ellipsis: true, width: 140, render: (text, item) => {
            return item.countryName + item.provinceName + item.cityName + item.countyName + item.address;
          },
        },
        { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140 },
        { title: '供应商联系方式', dataIndex: 'contactUserTel', ellipsis: true, width: 140 },
        { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
        { title: '已使用', dataIndex: 'whetherOccupied', ellipsis: true, width: 140, render:(text)=>text ? "是" : "否"},
    ].map(item => ({ ...item, align: 'center' }));

    // 导出
    const explainResponse = res => {
        let arr = [];
        res.data.rows.map(item => {
            arr.push({
                '状态': item.state === "DRAFT" ? "草稿" : item.state === "EFFECT" ? "生效" : "变更中",
                '审批状态': item.flowStatus === "INIT" ? "未进入流程" : item.flowStatus === "INPROCESS" ? "流程中" : "流程处理完成",
                '年度审核需求号': item.reviewPlanYearCode,
                '年度': item.applyYear + "年",
                '拟制说明': item.reviewPlanYearName,
                '拟制部门': item.applyDepartmentName,
                '拟制人': item.applyName,
                '拟制日期': item.applyDate,
                '行号': item.reviewPlanYearLinenum,
                '需求公司代码': item.applyCorporationCode,
                '需求公司名称': item.applyCorporationName,
                '采购组织代码': item.purchaseTeamCode,
                '采购组织名称': item.purchaseTeamName,
                '审核类型': item.reviewTypeName,
                '审核原因': item.reviewReasonName,
                '审核方式': item.reviewWayName,
                '专业组': item.specialtyTeamName,
                '物料分类代码': item.materialGroupCode,
                '物料分类名称': item.materialGroupName,
                '供应商代码': item.supplierCode,
                '供应商名称': item.supplierName,
                '代理商代码': item.agentCode,
                '代理商名称': item.agentName,
                '生产厂地址': (item.countryName + item.provinceName + item.cityName + item.countyName + item.address),
                '供应商联系人': item.contactUserName,
                '供应商联系方式': item.contactUserTel,
                '备注': item.remark,
                '已使用': item.whetherOccupied ? "是" : "否",
            });
        });
        if (res.success) {
            return arr;
        }
        return [];
    };
    // 获取导出的数据
    const requestParams = {
        url: `${recommendUrl}/api/reviewPlanYearService/findDetailedReviewPlanYearAndLine`,
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
                filenameFormat={'年度审核计划明细' + moment().format('YYYYMMDD')}
                key='SUPPLIER_AUDIT_YEAR_DETAIL_EXPORT'
                ignore={DEVELOPER_ENV}
            >导出</DataExport.Button>)
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
                        rowKey={(v) =>v.id}
                        height={h}
                        columns={columns}
                        store={{
                            params: {
                                quickSearchValue: data.quickSearchValue,
                                ...data.epTechnicalShareDemandSearchBo,
                            },
                            url: `${recommendUrl}/api/reviewPlanYearService/findDetailedReviewPlanYearAndLine`,
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
