import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Input, message, Modal, Spin } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
  ApplyOrganizationProps, AuditCauseManagementByReviewTypeCodeConfig,
  AuditCauseManagementConfig,
  AuditTypeManagementConfig, AuditTypeManagementUnfrozenConfig,
  CompanyConfig, DeleteAuditRequirementsManagement, EndFlow,
  FindByFiltersConfig, HeightSearchApplyOrganizationProps, SupplierConfig,
} from '../mainData/commomService';
import {
  flowProps, judge, managementStateProps,
  stateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab } from '../../../utils';
import { materialClassProps } from '../../../utils/commonProps';
import { StartFlow } from 'seid';
import moment from 'moment/moment';
import { getUserId } from '../../../components/utils/CommonUtils';

const { FlowHistoryButton } = WorkFlow;

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function() {
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
    spinning: false,
    flowId: '',
    checkedCreate: false,
    checkedDistribution: false,
    quickSearchValue: '',
    epTechnicalShareDemandSearchBo: {},
    selectedRowKeys: [],
    selectedRows: [],
  });


  const redirectToPage = (type) => {
    switch (type) {
      case 'add':
        openNewTab('supplierAudit/AuditRequirementsManagementAdd?pageState=add', '新增审核需求', false);
        break;
      case 'edit':
        openNewTab(`supplierAudit/AuditRequirementsManagementAdd?pageState=edit&id=${data.selectedRows[0].id}&reviewRequirementCode=${data.selectedRows[0].reviewRequirementCode}`, '编辑审核需求', false);
        break;
      case 'detail':
        openNewTab(`supplierAudit/AuditRequirementsManagementAdd?pageState=detail&id=${data.selectedRows[0].id}&reviewRequirementCode=${data.selectedRows[0].reviewRequirementCode}`, '审核需求明细', false);
        break;
      case 'delete':
        deleteList();
        break;
      case 'endFlow':
        endFlow();
        break;
    }
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
    console.log(value, 'value');
  };

  const endFlow = () => {
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

  // 删除
  const deleteList = () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        const codeArr = data.selectedRows.map(item => item.reviewRequirementCode);
        DeleteAuditRequirementsManagement(codeArr).then(res => {
          if (res.success) {
            message.success(res.message);
            tableRef.current.manualSelectedRows();
            tableRef.current.remoteDataRefresh();
          } else {
            message.error(res.message);
          }
        }).catch(err => message.error(err.message));
      },
    });
  };

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    console.log(value, '高级查询');
    if (value.applyDate) {
      value.applyDateStart = value.applyDate[0] ? moment(value.applyDate[0]).format('YYYY-MM-DD') : null;
      value.applyDateEnd = value.applyDate[1] ? moment(value.applyDate[1]).format('YYYY-MM-DD') : null;
      delete value.applyDate;
    }
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    headerRef.current.hide();
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
    { title: '申请部门', key: 'applyDepartmentCode', type: 'tree', props: HeightSearchApplyOrganizationProps },
    { title: '申请人', key: 'applyName', props: { placeholder: '输入申请人' } },
    { title: '申请日期', key: 'applyDate', type: 'rangePicker', props: { placeholder: '输入申请日期' } },
    { title: '供应商', key: 'supplierCode', type: 'list', props: SupplierConfig },
    { title: '物料分类', key: 'materialSecondClassifyCode', type: 'tree', props: materialClassProps },
    { title: '审核类型', key: 'reviewTypeCode', type: 'list', props: AuditTypeManagementUnfrozenConfig },
    {
      title: '审核原因',
      key: 'reviewReasonCode',
      type: 'list',
      props: AuditCauseManagementByReviewTypeCodeConfig,
      params: 'reviewTypeCode',
      paramsKey: 'findByReviewTypeCode',
    },
    { title: '状态', key: 'state', type: 'list', props: managementStateProps },
    { title: '审批状态', key: 'flowState', type: 'list', props: flowProps },
  ];

  const columns = [
    {
      title: '状态', dataIndex: 'state', width: 50, align: 'center', render: v => {
        switch (v) {
          case 'DRAFT':
            return '草稿';
          case 'EFFECT':
            return '生效';
        }
      },
    },
    {
      title: '审批状态', dataIndex: 'flowStatus', width: 100, align: 'left', render: v => {
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
    { title: '审核需求号', dataIndex: 'reviewRequirementCode', align: 'right', width: 140 },
    { title: '申请说明', dataIndex: 'reviewRequirementName', ellipsis: true, align: 'left', width: 150 },
    { title: '申请公司', dataIndex: 'applyCorporationName', ellipsis: true, align: 'left', width: 150 },
    { title: '申请部门', dataIndex: 'applyDepartmentName', align: 'left', ellipsis: true, width: 150 },
    { title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, align: 'left', width: 150 },
    { title: '申请人员', dataIndex: 'applyName', ellipsis: true, width: 80, align: 'left' },
    { title: '申请时间', dataIndex: 'applyDate', ellipsis: true, width: 180, align: 'center' },
  ];

  // 提交审核完成更新列表
  function handleComplete() {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  }

  // 提交审核验证
  const handleBeforeStartFlow = async () => {

  };

  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_EDIT'
        disabled={!judge(data.selectedRows, 'state', 'DRAFT')
        || data.selectedRowKeys.length !== 1
        || !judge(data.selectedRows, 'flowStatus', 'INIT')
        || !judge(data.selectedRows, 'applyId', getUserId())}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_DELETE'
        disabled={data.selectedRowKeys.length === 0
        || !judge(data.selectedRows, 'state', 'DRAFT')
        || !judge(data.selectedRows, 'flowStatus', 'INIT')
        || !judge(data.selectedRows, 'applyId', getUserId())}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_DETAIL'
        disabled={data.selectedRowKeys.length !== 1}
      >明细</Button>)
    }
    {
      authAction(<StartFlow
        style={{ marginRight: '5px' }}
        ignore={DEVELOPER_ENV}
        needConfirm={handleBeforeStartFlow}
        businessKey={data.flowId}
        callBack={handleComplete}
        disabled={!judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length !== 1}
        businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewRequirement'
        key='SUPPLIER_AUDIT_REQUIREMENT_EXAMINE'
      >提交审核</StartFlow>)
    }
    {
      authAction(<FlowHistoryButton
        businessId={data.flowId}
        flowMapUrl='flow-web/design/showLook'
        ignore={DEVELOPER_ENV}
        disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length !== 1}
        key='SUPPLIER_AUDIT_REQUIREMENT_HISTORY'
      >
        <Button className={styles.btn} disabled={data.selectedRowKeys.length !== 1}>审核历史</Button>
      </FlowHistoryButton>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('endFlow')}
        loading={data.spinning}
        disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length !== 1}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_REQUIREMENT_ALLOT'
      >终止审核</Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <Search
      style={{ width: '300px' }}
      placeholder='请输入审核需求号或申请说明查询'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>;

  const onSelectRow = (value, rows) => {
    console.log(value, rows);
    const [flowData = {}] = rows;
    setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows, flowId: flowData.id }));
  };

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
                ...data.checkedCreate ? { onlyOwn: data.checkedCreate } : null,
                ...data.checkedDistribution ? { onlyAllocation: data.checkedDistribution } : null,
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo,
              },
              url: `${recommendUrl}/api/reviewRequirementService/findByPage`,
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
