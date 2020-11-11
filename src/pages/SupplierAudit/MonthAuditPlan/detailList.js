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
    ApplyOrganizationProps,
    AuditCauseManagementConfig,
    AuditTypeManagementConfig,
    CompanyConfig,
    FindByFiltersConfig,
    SupplierConfig,
} from '../mainData/commomService';
import { reviewWaysProps, reviewOrganizeProps } from "../AnnualAuditPlan/propsParams"
import {
    ShareDistributionProps,
    ShareStatusProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {


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
        selectedRowKeys: [],
        selectedRows: [],
    });

    const handleQuickSearch = (value) => {
        setData(v => ({ ...v, quickSearchValue: value }));
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
        console.log(value, 'value');
    };

    // 高级查询搜索
    const handleAdvancedSearch = (value) => {
        console.log(value, '高级查询');
    };

    // 高级查询配置
    const formItems = [
        { title: '需求公司', key: 'lineApplyCorporationCode', type: 'list', props: CompanyConfig },
        { title: '采购组织', key: 'purchaseTeamCode', type: 'list', props: FindByFiltersConfig},
        { title: '物料分类', key: 'materialGroupCode', type: 'tree', props: materialClassProps },
        { title: '供应商', key: 'supplierCode', type: 'tree', props: SupplierConfig },
        { title: '代理商', key: 'agentCode', type: 'tree', props: materialClassProps },
        { title: '审核类型', key: 'reviewTypeCode', type: 'list', props: AuditTypeManagementConfig },
        { title: '审核原因', key: 'reviewReasonCode', type: 'list', props: AuditCauseManagementConfig },
        { title: '审核方式', key: 'reviewWayCode', type: 'list', props: reviewWaysProps },
        { title: '审核组织形式', key: 'reviewOrganizedWayCode', type: 'list', props: reviewOrganizeProps },
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
        { title: '月度审核计划号', dataIndex: 'reviewPlanMonthCode', width: 200 },
        { title: '月度', dataIndex: 'applyMonth', ellipsis: true, width: 250 },
        { title: '拟制说明', dataIndex: 'reviewPlanMonthName', ellipsis: true, width: 200 },
        { title: '拟制公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200 },
        { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
        { title: '拟制人', dataIndex: 'applyName', ellipsis: true, width: 200 },
        { title: '拟制日期', dataIndex: 'applyDate', ellipsis: true, width: 200 },
        { title: '需求公司代码', dataIndex: 'applyCorporationCode', width: 140, ellipsis: true, },
        { title: '需求公司名称', dataIndex: 'applyCorporationName', width: 140, ellipsis: true, },
        { title: '采购组织代码', dataIndex: 'purchaseTeamCode', ellipsis: true, width: 140 },
        { title: '采购组织名称', dataIndex: 'purchaseTeamName', ellipsis: true, width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', ellipsis: true, width: 140 },
        { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
        { title: '审核组织形式', dataIndex: 'reviewOrganizedWayName', ellipsis: true, width: 140 },
        { title: '审核方式', dataIndex: 'reviewWayName', ellipsis: true, width: 140 },
        { title: '审核内容', dataIndex: 'treeData', ellipsis: true, width: 140 },
        { title: '组长', dataIndex: 'leaderName', ellipsis: true, width: 140 },
        { title: '组员', dataIndex: 'measureUnit56', ellipsis: true, width: 140 },
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
        { title: '已创建审核实施计划', dataIndex: 'whetherOccupied', ellipsis: true, width: 140, render:(text)=>text ? "是" : "否"},
    ].map(item => ({ ...item, align: 'center' }));

    // 导出
    const explainResponse = res => {
        let arr = [];
        res.data.rows.map(item => {
            arr.push({
                '状态': item.state,
                '分配供应商状态': item.allotSupplierState,
                '来源': item.source,
                '分享需求号': item.shareDemanNumber,
                '分享需求行号': item.technicalLineNumber,
                '物料代码': item.materialCode,
                '物料描述': item.materialName,
                '物料组代码': item.materialGroupCode,
                '物料组描述': item.materialGroupName,
                '战略采购代码': item.strategicPurchaseCode,
                '战略采购名称': item.strategicPurchaseName,
                '业务单元代码': item.buCode,
                '业务单元名称': item.buName,
                '申请人': item.applyPeopleName,
                '申请人联系方式': item.applyPersonPhone,
                '申请日期': item.applyDate,
                '文件类别': item.fileCategoryName,
                '文件版本': item.fileVersion,
                '图纸状态': item.drawFlag,
                '样品需求数量': item.sampleRequirementNum,
                '计量单位': item.measureUnit,
                '样品需求日期': item.sampleRequirementDate,
                '样品收件人姓名': item.sampleReceiverName,
                '样品收件人联系方式': item.sampleReceiverTel,
                '备注': item.remark,
            });
        });
        if (res.success) {
            return arr;
        }
        return [];
    };
    // 获取导出的数据
    const requestParams = {
        url: `${recommendUrl}/api/epTechnicalShareDemandService/findTechnicalDataShareDetail`,
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
                filenameFormat={'技术资料分享明细' + moment().format('YYYYMMDD')}
                key='TECHNICAL_DATA_SHARINGDETAIL_EXPORT'
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
                        onSelectRow={onSelectRow}
                        selectedRowKeys={data.selectedRowKeys}
                    />
                }
            </AutoSizeLayout>
        </Fragment>
    );
}
