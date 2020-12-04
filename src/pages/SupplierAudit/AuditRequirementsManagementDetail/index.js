import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Input } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, DataExport } from 'suid';
import {
  ApplyOrganizationProps,
  AuditCauseManagementConfig,
  AuditTypeManagementConfig,
  CompanyConfig,
  FindByFiltersConfig, flowStatusConfig, stateConfig, SupplierConfig,
} from '../mainData/commomService';
import {
  flowProps, stateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';
import moment from 'moment';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function() {
  const tableRef = useRef(null);

  const [data, setData] = useState({
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
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 高级查询配置
  const formItems = [
    {
      title: '公司',
      key: 'applyCorporationCode',
      type: 'list',
      props: CompanyConfig,
      rules: { rules: [{ required: true, message: '请选择公司' }] },
    },
    {
      title: '采购组织',
      key: 'purchaseOrgCode',
      type: 'list',
      props: FindByFiltersConfig,
      rules: { rules: [{ required: true, message: '请选择采购组织' }] },
    },
    { title: '申请部门', key: 'applyDepartmentCode', type: 'tree', props: ApplyOrganizationProps },
    { title: '申请人', key: 'applyName', props: { placeholder: '输入申请人' } },
    { title: '申请日期', key: 'applyDateStart', type: 'datePicker', props: { placeholder: '输入申请日期' } },
    { title: '供应商', key: 'supplierCode', type: 'list', props: SupplierConfig },
    { title: '物料分类', key: 'materialSecondClassifyCode', type: 'tree', props: materialClassProps },
    { title: '审核类型', key: 'reviewTypeCode', type: 'list', props: AuditTypeManagementConfig },
    { title: '审核原因', key: 'reviewReasonCode', type: 'list', props: AuditCauseManagementConfig },
    { title: '状态', key: 'state', type: 'list', props: stateProps },
    { title: '审批状态', key: 'flowState', type: 'list', props: flowProps },
  ];

  const columns = [
    {
      title: '状态', dataIndex: 'state', width: 80, render: (v, data) => stateConfig[data.reviewRequirementVo.state],
    },
    {
      title: '审批状态',
      dataIndex: 'flowStatus',
      width: 200,
      render: (v, data) => flowStatusConfig[data.reviewRequirementVo.flowStatus],
    },
    {
      title: '审核需求号',
      dataIndex: 'reviewRequirementCode',
      width: 200,
      render: (v, data) => data.reviewRequirementVo.reviewRequirementCode,
    },
    {
      title: '申请说明',
      dataIndex: 'reviewRequirementName',
      ellipsis: true,
      width: 250,
      render: (v, data) => data.reviewRequirementVo.reviewRequirementName,
    },
    {
      title: '申请公司',
      dataIndex: 'applyCorporationName',
      ellipsis: true,
      width: 200,
      render: (v, data) => data.reviewRequirementVo.applyCorporationName,
    },
    {
      title: '申请部门',
      dataIndex: 'applyDepartmentName',
      width: 200,
      render: (v, data) => data.reviewRequirementVo.applyDepartmentName,
    },
    {
      title: '采购组织',
      dataIndex: 'purchaseOrgName',
      width: 200,
      render: (v, data) => data.reviewRequirementVo.purchaseOrgName,
    },
    {
      title: '申请人员',
      dataIndex: 'applyName',
      width: 200,
      render: (v, data) => data.reviewRequirementVo.applyName,
    },
    {
      title: '申请时间',
      dataIndex: 'applyDate',
      width: 200,
      render: (v, data) => data.reviewRequirementVo.applyDate,
    },
    { title: '行号', dataIndex: 'reviewRequirementLinenum', width: 200 },
    { title: '审核体系', dataIndex: 'reviewSystem', width: 200 },
    { title: '审核类型', dataIndex: 'reviewTypeName', width: 200 },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 200 },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
    { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 200 },
    { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 200 },
    {
      title: '生产厂地址', dataIndex: 'countryName', width: 200, render: (v, data) =>
        <span>{`${data.countryName + data.provinceName + data.cityName + data.countyName + data.address}`}</span>,
    },
    { title: '供应商联系人', dataIndex: 'contactUserName', width: 200 },
    { title: '供应商联系方式', dataIndex: 'contactUserTel', width: 200 },
    { title: '备注', dataIndex: 'remark', width: 200 },
    { title: '已使用', dataIndex: 'whetherOccupied', width: 200, render: v => v ? '是' : '否' },
  ].map(item => ({ ...item, align: 'center' }));

  const requestParams = {
    method: 'POST',
    data: {
      pageInfo: { page: 1, rows: 9999 },
      quickSearchProperties: ['code', 'name'],
      usedType: '1',
      quickSearchValue: data.quickSearchValue,
      ...data.epTechnicalShareDemandSearchBo,
    },
    url: `${recommendUrl}/api/reviewRequirementLineService/findForList`,
  };

  const explainResponse = res => {
    let arr = [];
    res.data.rows.map(item => {
      const { reviewRequirementVo } = item;
      arr.push({
        '状态': stateConfig[reviewRequirementVo.state],
        '审批状态': flowStatusConfig[reviewRequirementVo.flowStatus],
        '审核需求号': reviewRequirementVo.reviewRequirementCode,
        '申请说明': reviewRequirementVo.reviewRequirementName,
        '申请公司': reviewRequirementVo.applyCorporationName,
        '申请部门': reviewRequirementVo.applyDepartmentName,
        '采购组织': reviewRequirementVo.materialGroupCode,
        '申请人员': reviewRequirementVo.applyName,
        '申请时间': reviewRequirementVo.applyDate,
        '行号': item.reviewRequirementLinenum,
        '审核体系': item.reviewSystem,
        '审核类型': item.reviewTypeName,
        '审核原因': item.reviewReasonName,
        '物料分类': item.materialGroupName,
        '供应商': item.supplierName,
        '代理商': item.agentName,
        '生产厂地址': `${item.countryName + item.provinceName + item.cityName + item.countyName + item.address}`,
        '供应商联系人': item.contactUserName,
        '供应商联系方式': item.contactUserTel,
        '备注': item.remark,
        '已使用': item.whetherOccupied ? '是' : '否',
      });
    });
    if (res.success) {
      return arr;
    }
    return [];
  };

  const headerLeft = <>
    {
      authAction(<DataExport.Button
        requestParams={requestParams}
        explainResponse={explainResponse}
        filenameFormat={'审核需求明细' + moment().format('YYYYMMDD')}
        type='primary'
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_DETAIL_EXPORT'
      >导出</DataExport.Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <Search
      placeholder='请输入审核需求号或申请说明查询'
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
          <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch}/>
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
                usedType: '1',
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo,
              },
              url: `${recommendUrl}/api/reviewRequirementLineService/findForList`,
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
