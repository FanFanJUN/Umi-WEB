import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Checkbox, Input, message } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
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
import { WithdrawResultsEntryApi } from './commonApi';
import { openNewTab } from '../../../utils';
import { getUserId } from '../../../components/utils/CommonUtils';
import { BASE_URL } from '../../../utils/constants';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const managementStateConfig = {
  'NOT_COMPLETED': '未填报',
  'COMPLETED': '已填报',
};

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
    isView: false,
    resultAddVisible: false,
    generationEntryVisible: false,
    checkLeaderOpinionVisible: false,
    verificationResultsVisible: false,
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

  const [managementState, setManagementState] = useState(false);


  const redirectToPage = (type) => {
    switch (type) {
      case 'resultAdd':
        setData(v => ({ ...v, resultAddVisible: true }));
        break;
      case 'generationEntry':
        setData(v => ({ ...v, generationEntryVisible: true }));
        break;
      case 'checkLeaderOpinion':
        setData(v => ({ ...v, checkLeaderOpinionVisible: true }));
        break;
      case 'verificationResults':
        setData(v => ({ ...v, verificationResultsVisible: true, isView: false }));
        break;
      case 'verificationResultsShow':
        setData(v => ({ ...v, verificationResultsVisible: true, isView: true }));
        break;
      case 'recall':
        handleRecall();
        break;
    }
  };

  // 撤回
  const handleRecall = () => {
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
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    refreshTable();
  };


  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    refreshTable();
  };

  // 高级查询配置
  const formItems = [
    { title: '需求公司', key: 'applyCorporationCode', type: 'list', props: CompanyConfig },
    { title: '采购组织', key: 'purchaseOrgCode', type: 'list', props: FindByFiltersConfig },
    { title: '物料分类', key: 'materialSecondClassifyCode', type: 'tree', props: materialClassProps },
    { title: '审核小组组长', key: 'leaderName' },
  ];

  const columns = [
    { title: '状态', dataIndex: 'state', width: 80, render: v => managementStateConfig[v] },
    {
      title: '审核需求计划号',
      dataIndex: 'reviewImplementPlanCode',
      width: 200,
      render: (v, data) => <a onClick={() => jumpOtherPage(data.reviewImplementPlanId)}>{v}</a>,
    },
    { title: '供应商', dataIndex: 'supplierName', width: 300, render: (v, data) => `${v} ${data.supplierCode}` },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
    { title: '审核时间', dataIndex: 'reviewDateStart', width: 400, render: (v, data) => `${v} - ${data.reviewDateEnd}` },
    { title: '组长', dataIndex: 'leaderName', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  // 提交审核验证
  const handleBeforeStartFlow = async () => {

  };

  const jumpOtherPage = (id) => {
    openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=detail&id=${id}`, '审核管理实施计划-明细', false);
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 提交审核完成更新列表
  function handleComplete() {

  }


  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('resultAdd')} s
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'whetherConfirm', false)}
        key='SUPPLIER_AUDIT_DEMAND_ADD'
      >结果录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('generationEntry')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0}
        key='SUPPLIER_AUDIT_DEMAND_DADD'
      >代录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('recall')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', 'COMPLETED')}
        key='SUPPLIER_AUDIT_DEMAND_WITHDRAW'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('checkLeaderOpinion')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_DEMAND_VIEW_GROUP'
        disabled={data.selectedRowKeys.length === 0}
      >查看组长意见</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('verificationResults')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'whetherConfirm', false)
          // || !judge(data.selectedRows, 'leaderId', getUserId())
        }
        key='SUPPLIER_AUDIT_DEMAND_CONFIRM'
      >审核结果确认</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('verificationResultsShow')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0
          // || !judge(data.selectedRows, 'leaderId', getUserId())
        }
        key='SUPPLIER_AUDIT_DEMAND_VIEW_RESULT'
      >审核结果查看</Button>)
    }
  </>;

  const headerRight = <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '95%' }}>
      <Checkbox checked={managementState} onClick={e => {
        setManagementState(e.target.checked);
        refreshTable();
      }}>已填报</Checkbox>
      <Checkbox checked={!managementState} onClick={e => {
        setManagementState(!e.target.checked);
        refreshTable();
      }}>未填报</Checkbox>
    </div>
    <Search
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
    console.log(rows);
    const reviewImplementPlanCode = rows[0] ? rows[0].reviewImplementPlanCode ? rows[0].reviewImplementPlanCode : '' : '';
    setData(v => ({ ...v, selectedRowKeys: keys, selectedRows: rows, resultsId: keys[0], reviewImplementPlanCode }));
  };

  const generationOk = (id) => {
    console.log(id);
    setData(v => ({ ...v, resultsId: id, resultAddVisible: true }));
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
                managementState: managementState ? 'COMPLETED' : 'NOT_COMPLETED',
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo,
              },
              url: `${window.location.origin}${BASE_URL}/${recommendUrl}/api/reviewImplementManagementService/findByPage`,
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
      <ResultsEntry
        onOk={resultsEntryOk}
        id={data.resultsId}
        onCancel={() => setData(v => ({ ...v, resultAddVisible: false }))}
        visible={data.resultAddVisible}
      />
      <GenerationEntry
        onOk={generationOk}
        onCancel={() => setData(v => ({ ...v, generationEntryVisible: false }))}
        reviewImplementPlanCode={data.reviewImplementPlanCode}
        visible={data.generationEntryVisible}
      />
      <CheckLeaderOpinion
        onCancel={() => setData(v => ({ ...v, checkLeaderOpinionVisible: false }))}
        id={data.resultsId}
        type={'demand'}
        reviewImplementPlanCode={data.reviewImplementPlanCode}
        visible={data.checkLeaderOpinionVisible}
      />
      <VerificationResults
        refreshTable={refreshTable}
        reviewImplementPlanCode={data.reviewImplementPlanCode}
        id={data.resultsId}
        isView={data.isView}
        onCancel={() => setData(v => ({ ...v, verificationResultsVisible: false }))}
        visible={data.verificationResultsVisible}
      />
    </Fragment>
  );
}
