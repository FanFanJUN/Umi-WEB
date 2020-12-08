import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
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

  const [managementState, setManagementState] = useState(true);

  const [unManagementState, setUnManagementState] = useState(true);


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
    {
      title: '实施审核计划号',
      dataIndex: 'reviewImplementPlanCode',
      width: 140,
      render: (v, data) => <a onClick={() => jumpOtherPage(data.reviewImplementPlanId)}>{v}</a>,
    },
    { title: '供应商', dataIndex: 'supplierName', width: 250, render: (v, data) => `${v} ${data.supplierCode}` },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
    { title: '审核时间', dataIndex: 'reviewDateStart', width: 200, render: (v, data) => `${v} - ${data.reviewDateEnd}` },
    { title: '组长', dataIndex: 'leaderName', ellipsis: true, width: 70 },
  ].map(item => ({ ...item, align: 'center' }));

  const jumpOtherPage = (id) => {
    openNewTab(`supplierAudit/AuditImplementationPlan/editPage?pageState=detail&id=${id}`, '审核管理实施计划-明细', false);
  };

  // 刷新table
  const refreshTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };


  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('resultAdd')} s
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0
        // 判断结果是否确认
        || !judge(data.selectedRows, 'whetherConfirm', false)
        // 已填报不能再次录入
        || !judge(data.selectedRows, 'state', 'NOT_COMPLETED')}
        key='SUPPLIER_AUDIT_DEMAND_ADD'
      >结果录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('generationEntry')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0
        // 判断结果是否确认
        || !judge(data.selectedRows, 'whetherConfirm', false)}
        key='SUPPLIER_AUDIT_DEMAND_DADD'
      >代录入</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('recall')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0
        || !judge(data.selectedRows, 'state', 'COMPLETED')
        || !judge(data.selectedRows, 'whetherConfirm', false)}
        key='SUPPLIER_AUDIT_DEMAND_WITHDRAW'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('checkLeaderOpinion')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_AUDIT_DEMAND_VIEW_GROUP'
        disabled={data.selectedRowKeys.length === 0
          // || !judge(data.selectedRows, 'state', 'COMPLETED')
        }
      >查看组长意见</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('verificationResults')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'whetherConfirm', false)
        || !judge(data.selectedRows, 'leaderId', getUserId())
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
        || !judge(data.selectedRows, 'state', 'COMPLETED')
        || !judge(data.selectedRows, 'leaderId', getUserId())
        }
        key='SUPPLIER_AUDIT_DEMAND_VIEW_RESULT'
      >审核结果查看</Button>)
    }
  </>;

  const headerRight = <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '50%' }}>
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
      placeholder='请输入审核实施计划号或供应商名称'
      style={{ width: '400px' }}
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
    setData(v => ({ ...v, resultsId: id, generationEntryVisible: false, resultAddVisible: true }));
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
                usedType: '1',
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
