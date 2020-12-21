/**
 * @Description: 审核简报管理
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
  CompanyConfig, deleteBriefingById, EndFlow, exportById,

} from '../mainData/commomService';
import {
 flowStatus, judge, reportStateProps,
} from '../../QualitySynergy/commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../utils/commonUrl';
import { downloadPDFFile, getUserId, openNewTab } from '../../../utils';
import AddModal from './components/AddModal';

const { FlowHistoryButton, StartFlow } = WorkFlow;
const { authAction } = utils;
const { Search } = Input;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

const AuditBriefingManagement = forwardRef(({}, ref) => {
  const tableRef = useRef(null);
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
  }, []);

  const listenerParentClose = (event) => {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
    }
  };

  const [data, setData] = useState({
    spinning: false,
    exportSpinning: false,
    flowId: '',
    checkedCreate: true,
    quickSearchValue: '',
    advancedSearchValue: {},
    selectedRowKeys: [],
    selectedRows: [],
    modalVisible: false,
  });
  const currentUserId = getUserId();
  const headerRef = useRef(null);
  const getModalRef = useRef(null);

  const onChangeCreate = (e) => {
    setData(v => ({ ...v, checkedCreate: e.target.checked }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  const redirectToPage = (type) => {
    switch (type) {
      case 'add':
        showModal();
        break;
      case 'edit':
        openNewTab('supplierAudit/AuditBriefingManagementViewEdit?pageState=edit&id=' + data.selectedRows[0].id, '审核简报管理-编辑', false);
        break;
      case 'detail':
        openNewTab('supplierAudit/AuditBriefingManagementViewDetail?pageState=detail&id=' + data.selectedRows[0].id, '审核简报管理-明细', false);
        break;
    }
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 新增
  const showModal = () => {
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
        setData(v => ({ ...v, spinning: false }));
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
        deleteBriefingById({ id: data.selectedRows[0].id }).then(res => {
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

  //导出
  const exportItem = () => {
    setData(v => ({ ...v, exportSpinning: true }));
    exportById({ id: data.selectedRows[0].id }).then(res => {
      if (res.success) {
        setData(v => ({ ...v, exportSpinning: false }));
        downloadPDFFile(res.data, '审核简报导出.pdf');
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
      } else {
        setData(v => ({ ...v, exportSpinning: false }));
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    setData(v => ({ ...v, advancedSearchValue: value }));
    headerRef.current.hide();
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

// 高级查询配置
  const formItems = [
    {
      title: '拟制公司',
      key: 'statisticCorporationCode',
      type: 'list',
      props: CompanyConfig,
    },
    { title: '拟制人', key: 'applyName', props: { placeholder: '输入拟制人' } },
    { title: '拟制日期', key: 'applyDateStart', type: 'datePicker', props: { placeholder: '选择拟制日期' } },
    { title: '状态', key: 'state', type: 'list', props: reportStateProps },
    { title: '审批状态', key: 'flowStatus', type: 'list', props: flowStatus },
  ];

  const columns = [
    { title: '状态', dataIndex: 'arAuditReportManagStatusRemark', width: 80 },
    {
      title: '审批状态', dataIndex: 'flowStatusRemark', width: 120, render: v => {
        switch (v) {
          case 'INIT':
            return '未进入流程';
          case 'INPROCESS':
            return '审批中';
          case 'COMPLETED':
            return '流程处理完成';
        }
      },
    },
    { title: '审核简报编号', dataIndex: 'auditRbriefingManageCode', width: 140 },
    {
      title: '统计期间', dataIndex: 'reviewRequirementCode', width: 200,
      render: (text, record) => {
        return (record.currentPeriodStart ? record.currentPeriodStart.substring(0, 10) : '') + '到' + (record.currentPeriodEnd ? record.currentPeriodEnd.substring(0, 10) : '');
      },
    },
    { title: '拟制公司', dataIndex: 'statisticCorporationName', ellipsis: true, width: 200 },
    { title: '拟制部门', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
    { title: '拟制人员', dataIndex: 'applyName', ellipsis: true, width: 120 },
    { title: '拟制时间', dataIndex: 'createdDate', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }));


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
        key='SRM-SM-AUDITBRIEFING-ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SRM-SM-AUDITBRIEFING-EDIT'
        disabled={(data.selectedRows && data.selectedRows.length > 0 && data.selectedRows[0].creatorId !== currentUserId) || !judge(data.selectedRows, 'status', 'Draft') || data.selectedRowKeys.length !== 1 || !judge(data.selectedRows, 'flowStatus', 'INIT')}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => deleteList()}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SRM-SM-AUDITBRIEFING-DELETE'
        disabled={(data.selectedRows && data.selectedRows.length > 0 && data.selectedRows[0].creatorId !== currentUserId) || !judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length !== 1}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SRM-SM-AUDITBRIEFING-DETAIL'
        disabled={data.selectedRowKeys.length !== 1}
      >明细</Button>)
    }
    {
      authAction(<StartFlow
        style={{ marginRight: '5px' }}
        ignore={DEVELOPER_ENV}
        businessKey={data.flowId}
        startComplete={handleComplete}
        businessModelCode='com.ecmp.srm.sam.entity.ab.AbAuditBriefingManage'
        key='SRM-SM-AUDITBRIEFING-APPROVE'
      >{
        loading => <Button
          disabled={(data.selectedRows && data.selectedRows.length > 0 && data.selectedRows[0].creatorId !== currentUserId) || !judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length === 0}
          className={styles.btn} loading={loading}>提交审核</Button>
      }</StartFlow>)
    }
    {
      authAction(<FlowHistoryButton
        businessId={data.flowId}
        flowMapUrl='flow-web/design/showLook'
        ignore={DEVELOPER_ENV}
        disabled={judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length !== 1}
        key='SRM-SM-AUDITBRIEFING-APPROVEHISTORY'
      >
        <Button className={styles.btn}
                disabled={judge(data.selectedRows, 'flowStatus', 'INIT') || data.selectedRowKeys.length !== 1}>审核历史</Button>
      </FlowHistoryButton>)
    }
    {
      authAction(<Button
        onClick={() => endFlow()}
        loading={data.spinning}
        disabled={(data.selectedRows && data.selectedRows.length > 0 && data.selectedRows[0].creatorId !== currentUserId) || !judge(data.selectedRows, 'flowStatus', 'INPROCESS') || data.selectedRowKeys.length === 0}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SRM-SM-AUDITBRIEFING-ENDAPPROVE'
      >终止审核</Button>)
    }
    {
      authAction(<Button
        onClick={() => exportItem()}
        loading={data.exportSpinning}
        disabled={data.selectedRowKeys.length === 0}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='SRM-SM-AUDITBRIEFING-EXPORT'
      >导出PDF</Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '100px' }}>
      <Checkbox onChange={onChangeCreate} checked={data.checkedCreate}>仅我创建</Checkbox>
    </div>
    <Search
      placeholder='请输入审核简报编号查询'
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
        hiddenClose
        left={headerLeft}
        right={headerRight}
        ref={headerRef}
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
              url: `${recommendUrl}/api/abAuditBriefingManageService/findListByPage`,
              type: 'POST',
            }}
            checkbox={{ multiSelect: false }}
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

export default AuditBriefingManagement;
