/**
 * @Description: 审核报告管理
 * @Author: M!keW
 * @Date: 2020-11-16
 */
import React, { useState, useRef, useEffect, Fragment, forwardRef } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import styles from '../../QualitySynergy/TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils, WorkFlow } from 'suid';
import {
  CompanyConfig, DeleteAuditRequirementsManagement, EndFlow,
  FindByFiltersConfig, SupplierConfig,
} from '../mainData/commomService';
import {
  flowProps, judge, reportStateProps,
  stateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { openNewTab } from '../../../utils';
import { materialClassProps } from '../../../utils/commonProps';
import { StartFlow } from 'seid';
import AddModal from './components/AddModal';
import { supplierProps } from '../../../utils/commonProps';

const { FlowHistoryButton } = WorkFlow;
const { authAction } = utils;
const { Search } = Input;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const supplierPropsNew = {
  ...supplierProps,
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '选择供应商'
};
const agentList = {
  ...supplierProps,
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '选择代理商'
};
const AuditReportManagement = forwardRef(({}, ref,) => {
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
    checkedCreate: true,
    quickSearchValue: '',
    advancedSearchValue: {},
    selectedRowKeys: [],
    selectedRows: [],
    modalVisible:false
  });

  const getModalRef = useRef(null);

  const onChangeCreate = (e) => {
    setData(v => ({ ...v, checkedCreate: e.target.checked }));
    tableRef.current.remoteDataRefresh();
  };

  const redirectToPage = (type) => {
    switch (type) {
      case 'add':
        showModal();
        break;
      case 'edit':
        openNewTab('supplierAudit/AuditReportManagementEdit?pageState=edit&id='+data.selectedRows[0].id, '审核报告管理-编辑', false);
        break;
      case 'detail':
        openNewTab('supplierAudit/AuditReportManagementDetail?pageState=detail&id='+data.selectedRows[0].id, '审核报告管理-明细', false);
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
  };

  // 新增
  const showModal=()=> {
    getModalRef.current.handleModalVisible(true);
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
    setData(v => ({ ...v, advancedSearchValue: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 高级查询配置
  const formItems = [
    {
      title: '需求公司',
      key: 'applyCorporationCode',
      type: 'list',
      props: CompanyConfig,
    },
    {
      title: '采购组织',
      key: 'purchaseOrgCode',
      type: 'list',
      props: FindByFiltersConfig,
    },
    { title: '拟制人', key: 'applyName', props: { placeholder: '输入拟制人' } },
    { title: '拟制日期', key: 'applyDateStart', type: 'datePicker', props: { placeholder: '选择拟制日期' } },
    { title: '状态', key: 'status', type: 'list', props: reportStateProps },
    { title: '审批状态', key: 'flowState', type: 'list', props: flowProps },
    { title: '供应商', key: 'supplierCode', type: 'list', props: supplierPropsNew },
    { title: '代理商', key: 'agentCode', type: 'list', props: agentList },
    { title: '物料分类', key: 'materialGroupCode', type: 'tree', props: materialClassProps },
  ];

  const columns = [
    {
      title: '状态', dataIndex: 'status', width: 80, render: v => {
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
    { title: '审核报告', dataIndex: 'auditReportManagCode', width: 200 },
    { title: '审核实施计划号', dataIndex: 'reviewImplementPlanCode', width: 200 },
    { title: '需求公司', dataIndex: 'applyCorporationName', ellipsis: true, width: 200 },
    { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 200 },
    { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 200 },
    { title: '拟制人员', dataIndex: 'applyAccount', ellipsis: true, width: 200 },
    { title: '拟制时间', dataIndex: 'applyName', ellipsis: true, width: 200 },
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
        disabled={!judge(data.selectedRows, 'state', 'DRAFT') || data.selectedRowKeys.length !== 1 || !judge(data.selectedRows, 'flowStatus', 'INIT')}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DELETE'
        disabled={data.selectedRowKeys.length === 0}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DETAIL'
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
        disabled={!judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length === 0}
        businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewRequirement'
        key='SRM-SM-SUPPLIERMODEL_EXAMINE'
      >提交审核</StartFlow>)
    }
    {
      authAction(<FlowHistoryButton
        businessId={data.flowId}
        flowMapUrl='flow-web/design/showLook'
        ignore={DEVELOPER_ENV}
        disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
        key='SRM-SM-SUPPLIERMODEL_HISTORY'
      >
        <Button className={styles.btn} disabled={data.selectedRowKeys.length !== 1}>审核历史</Button>
      </FlowHistoryButton>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('endFlow')}
        loading={data.spinning}
        disabled={!judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_ALLOT'
      >终止审核</Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '100px' }}>
      <Checkbox onChange={onChangeCreate} checked={data.checkedCreate}>仅我创建</Checkbox>
    </div>
    <Search
      placeholder='请输入审核报告或审核实施计划号'
      className={styles.btn}
      style={{ width: '280px' }}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>;

  const onSelectRow = (value, rows) => {
    const [flowData = {}] = rows;
    setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows, flowId: flowData.id }));
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
                ...data.checkedCreate ? { onlyMy: data.checkedCreate } : null,
                quickSearchValue: data.quickSearchValue,
                ...data.advancedSearchValue,
              },
              url: `${recommendUrl}/api/arAuditReportManagService/findListByPage`,
              type: 'POST',
            }}
            checkbox
            allowCancelSelect={true}
            remotePaging={true}
            ref={tableRef}
            showSearch={false}
            onSelectRow={onSelectRow}
            selectedRowKeys={data.selectedRowKeys}
          />
        }
      </AutoSizeLayout>
      <AddModal
          wrappedComponentRef={getModalRef}
      />
    </Fragment>
  );
});

export default AuditReportManagement;
