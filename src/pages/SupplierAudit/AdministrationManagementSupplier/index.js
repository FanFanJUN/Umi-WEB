import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
  ApplyOrganizationProps,
  AuditCauseManagementConfig,
  AuditTypeManagementConfig,
  CompanyConfig, DeleteAuditRequirementsManagement, EndFlow, FindAllByFiltersConfig,
  FindByFiltersConfig, SearchAllCompanyConfig, SupplierConfig,
} from '../mainData/commomService';
import {
  flowProps, judge,
  stateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';
import { WithdrawResultsEntryApi } from '../AdministrationManagementDemand/commonApi';
import CheckLeaderOpinion from '../AdministrationManagementDemand/component/CheckLeaderOpinion';
import IssuesManagementModal from './component/IssuesManagementModal';
import SelfEvaluation from '../AdministrationManagementDemand/component/component/SelfEvaluation';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const managementStateConfig = {
  'NOT_COMPLETED': '未填报',
  'COMPLETED': '已填报',
};

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
    selfEvaluationVisible: false,
    issuesManagementVisible: false,
    checkLeaderOpinionVisible: false,
    selfAssessmentVisible: false,
    spinning: false,
    reviewImplementPlanCode: '',
    resultsId: '',
    flowId: '',
    checkedCreate: false,
    checkedDistribution: false,
    quickSearchValue: '',
    epTechnicalShareDemandSearchBo: {},
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [managementState, setManagementState] = useState(true);

  const [unManagementState, setUnManagementState] = useState(true);


  const redirectToPage = (type) => {
    switch (type) {
      case 'selfEvaluation':
        setData(v => ({ ...v, selfEvaluationVisible: true }));
        break;
      case 'checkLeaderOpinion':
        setData(v => ({ ...v, checkLeaderOpinionVisible: true }));
        break;
      case 'issuesManagement':
        setData(v => ({ ...v, issuesManagementVisible: true }));
        break;
      case 'recall':
        handleRecall();
        break;
    }
  };

  // 撤回
  const handleRecall = () => {
    Modal.confirm({
      title: '撤回',
      content: '请确认撤回选中数据!',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        WithdrawResultsEntryApi({
          id: data.selectedRowKeys[0],
        }).then(res => {
          if (res.success) {
            message.success('撤回成功!');
            refreshTable();
          } else {
            message.error(res.message);
          }
        }).catch(err => {
          message.error(err.message);
        });
      },
    });
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    refreshTable();
  };


  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    headerRef.current.hide();
    refreshTable();
  };

  // 高级查询配置
  const formItems = [
    { title: '需求公司', key: 'applyCorporationCode', type: 'list', props: SearchAllCompanyConfig },
    { title: '采购组织', key: 'purchaseOrgCode', type: 'list', props: FindAllByFiltersConfig },
    { title: '物料分类', key: 'materialSecondClassifyCode', type: 'tree', props: materialClassProps },
    { title: '审核小组组长', key: 'leaderName' },
  ];

  const columns = [
    { title: '状态', dataIndex: 'state', width: 70, render: v => managementStateConfig[v] },
    { title: '实施审核计划号', dataIndex: 'reviewImplementPlanCode', width: 140, render: v => <a>{v}</a> },
    // { title: '供应商', dataIndex: 'supplierName', width: 250, render: (v, data) => `${v} ${data.supplierCode}` },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 170 },
    { title: '审核时间', dataIndex: 'reviewDateStart', width: 270, render: (v, data) => `${v} - ${data.reviewDateEnd}` },
    { title: '组长', dataIndex: 'leaderName', ellipsis: true, width: 70 },
  ].map(item => ({ ...item, align: 'center' }));

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('selfEvaluation')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0}
        key='SUPPLIER_AUDIT_SUPPLIER_SELF_EVALUATION'
      >自评</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('recall')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', 'COMPLETED')}
        key='SUPPLIER_AUDIT_SUPPLIER_WITHRAW'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('checkLeaderOpinion')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_SUPPLIER_VIEW'
        disabled={data.selectedRowKeys.length === 0}
      >查看退回信息</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('issuesManagement')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0}
        key='SUPPLIER_AUDIT_SUPPLIER_QUESTION'
      >问题管理</Button>)
    }
  </>;

  const headerRight = <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '55%' }}>
      <Checkbox checked={managementState} onClick={e => {
        setManagementState(e.target.checked);
        refreshTable();
      }}>已填报</Checkbox>
      <Checkbox checked={unManagementState} onClick={e => {
        setUnManagementState(e.target.checked);
        refreshTable();
      }}>未填报</Checkbox>
    </div>
    <Search
      style={{ width: '350px' }}
      placeholder='请输入审核实施计划号或供应商名称'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>;

  // 结果录入成功触发
  const resultsEntryOk = () => {
    setData(v => ({ ...v, resultAddVisible: false, generationEntryVisible: false }));
    refreshTable();
  };

  const onSelectRow = (keys, rows) => {
    const reviewImplementPlanCode = rows[0] ? rows[0].reviewImplementPlanCode ? rows[0].reviewImplementPlanCode : '' : '';
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRows: rows, resultsId: keys[0], reviewImplementPlanCode }));
  };

  return (
    <Fragment>
      <Header
        left={headerLeft}
        right={headerRight}
        hiddenClose
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
                stateList: [managementState ? 'COMPLETED' : '', unManagementState ? 'NOT_COMPLETED' : ''],
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo,
                usedType: '2',
              },
              url: `${recommendUrl}/api/reviewImplementManagementService/findByPage`,
              type: 'POST',
            }}
            allowCancelSelect={true}
            remotePaging={true}
            checkbox={{
              multiSelect: false,
            }}
            ref={tableRef}
            showSearch={false}
            onSelectRow={onSelectRow}
            selectedRowKeys={data.selectedRowKeys}
          />
        }
      </AutoSizeLayout>
      <CheckLeaderOpinion
        onCancel={() => setData(v => ({ ...v, checkLeaderOpinionVisible: false }))}
        id={data.resultsId}
        reviewImplementPlanCode={data.reviewImplementPlanCode}
        visible={data.checkLeaderOpinionVisible}
      />
      <IssuesManagementModal
        onCancel={() => setData(v => ({ ...v, issuesManagementVisible: false }))}
        reviewImplementPlanCode={data.reviewImplementPlanCode}
        visible={data.issuesManagementVisible}
      />
      <SelfEvaluation
        onCancel={() => setData(v => ({ ...v, selfEvaluationVisible: false }))}
        reviewImplementPlanCode={data.resultsId}
        visible={data.selfEvaluationVisible}
      />
    </Fragment>
  );
}
