import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Input } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
  ApplyOrganizationProps,
  AuditCauseManagementConfig,
  AuditTypeManagementConfig,
  CompanyConfig, DeleteAuditRequirementsManagement, EndFlow,
  FindByFiltersConfig, SupplierConfig,
} from '../mainData/commomService';
import {
  flowProps, judge,
  stateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { materialClassProps } from '../../../utils/commonProps';
import ResultsEntry from './component/ResultsEntry';
import GenerationEntry from './component/GenerationEntry';
import CheckLeaderOpinion from './component/CheckLeaderOpinion';
import VerificationResults from './component/VerificationResults';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function() {


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
    resultAddVisible: false,
    generationEntryVisible: false,
    checkLeaderOpinionVisible: false,
    verificationResultsVisible: true,
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
      case 'resultAdd':
        setData(v => ({...v, resultAddVisible: true}))
        break;
      case 'generationEntry':
        setData(v => ({...v, generationEntryVisible: true}))
        break;
      case 'checkLeaderOpinion':
        setData(v => ({...v, checkLeaderOpinionVisible: true}))
        break;
      case 'verificationResults':
        setData(v => ({...v, verificationResultsVisible: true}))
        break;
    }
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
    console.log(value, 'value');
  };


  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 高级查询配置
  const formItems = [
    { title: '需求公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig, },
    { title: '采购组织', key: 'purchaseOrgCode', type: 'list', props: FindByFiltersConfig, },
    { title: '物料分类', key: 'materialSecondClassifyCode', type: 'tree', props: materialClassProps },
    { title: '审核小组组长', key: 'flowState', type: 'list', props: flowProps },
  ];

  const columns = [
    {
      title: '状态', dataIndex: 'state', width: 80, render: v => {
        switch (v) {
          case 'DRAFT':
            return '草稿';
          case 'EFFECT':
            return '生效';
          case 'CHANGING':
            return '变更中';
        }
      },
    },
    {
      title: '审批状态', dataIndex: 'flowStatus', width: 200, render: v => {
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
    { title: '审核需求号', dataIndex: 'reviewRequirementCode', width: 200 },
    { title: '申请说明', dataIndex: 'reviewRequirementName', ellipsis: true, width: 250 },
    { title: '申请公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200 },
    { title: '申请部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
    { title: '采购组织', dataIndex: 'orgName', ellipsis: true, width: 200 },
    { title: '申请人员', dataIndex: 'applyName', ellipsis: true, width: 200 },
    { title: '申请时间', dataIndex: 'applyDate', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  // 提交审核验证
  const handleBeforeStartFlow = async () => {

  };

  // 提交审核完成更新列表
  function handleComplete() {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  }


  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('resultAdd')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_ADD'
      >结果录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('generationEntry')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_EDIT'
      >代录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DELETE'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('checkLeaderOpinion')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DETAIL'
      >查看组长意见</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('verificationResults')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DETAIL'
      >审核结果确认</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DETAIL'
      >审核结果查看</Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <Search
      placeholder='请输入审核实施计划号或供应商名称'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>;

  const onSelectRow = (value, rows) => {
    console.log(value, rows);

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
      <ResultsEntry
        onCancel={() => setData(v => ({...v, resultAddVisible: false}))}
        visible={data.resultAddVisible}
      />
      <GenerationEntry
        onCancel={() => setData(v => ({...v, generationEntryVisible: false}))}
        visible={data.generationEntryVisible}
      />
      <CheckLeaderOpinion
        onCancel={() => setData(v => ({...v, checkLeaderOpinionVisible: false}))}
        visible={data.checkLeaderOpinionVisible}
      />
      <VerificationResults
        onCancel={() => setData(v => ({...v, verificationResultsVisible: false}))}
        visible={data.verificationResultsVisible}
      />
    </Fragment>
  );
}
