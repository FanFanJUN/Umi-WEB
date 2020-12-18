/**
 * 实现功能： 人工评审
 * @author hezhi
 * @date 2020-09-23
 */

import { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import { ExtTable, WorkFlow, utils } from 'suid';
import { Button, Input, Modal, message, Checkbox } from 'antd';
import { Header, AutoSizeLayout, AdvancedForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { recommendUrl } from '../../utils/commonUrl';
import {
  evlStatusProps,
  evaluateSystemProps,
  orgnazationProps,
  evlEmu,
  flowStatusProps
} from '../../utils/commonProps';
import { useLocation } from 'dva/router';
import { formatYMDHmsToYMD, getFrameElement, openNewTab } from '../../utils';
import { checkEvaluateData } from '../../services/evaluate';
import { stopApprove } from '../../services/api';
const { Search } = Input;
const { StartFlow, FlowHistoryButton } = WorkFlow;

const { authAction, storage } = utils;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()

const minxiEvlStatusProps = {
  ...evlStatusProps,
  dataSource: [
    {
      code: 'NOT_EVALUATE',
      name: '未评审'
    },
    {
      code: 'EVALUATED',
      name: '已评审'
    }
  ],
  placeholder: '请选择评审状态'
}

function ManualEvaluate() {
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const [tableState, sets] = useTableProps();
  const {
    selectedRowKeys,
    selectedRows,
    searchValue,
    onlyMe,
  } = tableState;
  const {
    setRowKeys,
    handleSelectedRows,
    setSearchValue,
    setOnlyMe
  } = sets;
  const { query } = useLocation();
  const [approveLoading, toggleApproveLoading] = useState(false)
  const [singleRow = {}] = selectedRows;
  const authorizations = storage.sessionStorage.get("Authorization");
  const account = authorizations?.account;
  const {
    seEvaluationProject = {},
    flowStatus, // 审核状态
    id: flowId,
    scorerCode
  } = singleRow;
  // const { evaluationProjectStatus } = seEvaluationProject;
  // 未提交审核状态
  const noSubmit = flowStatus === 'INIT';
  const isSelf = scorerCode === account;
  const completed = flowStatus === 'COMPLETED'
  // 未选中数据的状态
  const empty = selectedRowKeys.length === 0;
  const FRAMELEEMENT = getFrameElement();
  const formItems = [
    {
      title: '评审状态',
      key: 'Q_EQ_evaluationStatus',
      type: 'list',
      props: minxiEvlStatusProps
    },
    {
      title: '审核状态',
      key: 'Q_EQ_flowStatus',
      type: 'list',
      props: flowStatusProps
    },
    {
      title: '评审项目号',
      key: 'Q_LK_docNumber',
      props: {
        placeholder: '输入评审项目号'
      }
    },
    {
      title: '评审项目名称',
      key: 'Q_LK_projectName',
      props: {
        placeholder: '输入评审项目名称'
      }
    },
    {
      title: '评审体系',
      key: 'Q_EQ_mainDataEvlSystemId',
      type: 'list',
      props: evaluateSystemProps
    },
    {
      title: '组织部门',
      key: 'Q_EQ_orgCode',
      props: { ...orgnazationProps, placeholder: '请选择组织部门' },
      type: 'list'
    },
    {
      title: '评审期间类型',
      key: 'Q_EQ_evlPeriodType',
      props: evlEmu,
      type: 'list'
    },
    {
      title: '创建人',
      key: 'Q_LK_creatorName',
      props: {
        placeholder: '输入创建人姓名'
      }
    },
    {
      title: '创建日期',
      key: 'Q_GE$LE_createdDate',
      type: 'rangePicker'
    }
  ]
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/seSubEvaluationProjectService/findByPage`,
      type: 'POST',
      params: {
        ...searchValue,
        filters: searchValue.filters ?
          searchValue.filters.concat([{
            fieldName: 'scorerCode',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }]) : [{
            fieldName: 'scorerCode',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }],
        quickSearchProperties: ['seEvaluationProject.docNumber', 'seEvaluationProject.projectName'],
        sortOrders: [
          {
            property: 'createdDate',
            direction: 'DESC'
          }
        ]
      }
    },
    remotePaging: true,
    selectedRowKeys,
    selectedRows,
    checkbox: {
      multiSelect: false
    },
    rowKey: (item) => item.id,
    columns: [
      {
        title: '评审状态',
        dataIndex: 'evaluationStatusRemark'
      },
      {
        title: '审核状态',
        dataIndex: 'flowStatus',
        render(text) {
          switch (text) {
            case 'INIT':
              return '未提交审核'
            case 'INPROCESS':
              return '审核中'
            case 'COMPLETED':
              return '审核完成'
            default:
              return ''
          }
        },
      },
      {
        title: '评审单号',
        dataIndex: 'docNumber',
        width: 200
      },
      {
        title: '评审项目名称',
        dataIndex: 'seEvaluationProject.projectName'
      },
      {
        title: '评审体系',
        dataIndex: 'seEvaluationProject.mainDataEvlSystemName'
      },
      {
        title: '要求完成时间',
        dataIndex: 'seEvaluationProject.askCompleteTime',
        render(text) {
          return formatYMDHmsToYMD(text)
        }
      },
      {
        title: '组织部门',
        dataIndex: 'seEvaluationProject.orgName'
      },
      {
        title: '评审期间类型',
        dataIndex: 'seEvaluationProject.evlPeriodTypeEnumRemark'
      },
      {
        title: '评审期间',
        dataIndex: 'rangeTime',
        render(text, record) {
          const st = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodStartTime);
          const et = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodEndTime);
          return `${st}~${et}`
        },
        width: 200
      },
      {
        title: '评审人',
        dataIndex: 'scorerName'
      },
    ]
  }
  const left = (
    <>
      {
        authAction(
          <Button
            className={styles.btn}
            disabled={!noSubmit || empty || !isSelf}
            onClick={handleEvaluate}
            ignore={DEVELOPER_ENV}
            key='MANUAL_EVALUATE'
          >评审</Button>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            disabled={empty}
            ignore={DEVELOPER_ENV}
            onClick={handleCheckDetail}
            key='MANUAL_EVALUATE_DETAIL'
          >明细</Button>
        )
      }
      {
        authAction(
          <StartFlow
            className={styles.btn}
            type='primary'
            ignore={DEVELOPER_ENV}
            key='MANUAL_EVALUATE_APPROVE'
            startComplete={uploadTable}
            beforeStart={handleBeforeSubmit}
            disabled={approveLoading}
            businessModelCode='com.ecmp.srm.sam.entity.se.SeSubEvaluationProject'
          >
            {
              loading => <Button loading={loading} className={styles.btn} disabled={empty || !noSubmit || !isSelf}>提交审核</Button>
            }
          </StartFlow>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            disabled={empty || noSubmit || completed || !isSelf}
            onClick={handleStopApprove}
            ignore={DEVELOPER_ENV}
            key='MANUAL_EVALUATE_APPROVE_STOP'
          >终止审核</Button>
        )
      }
      {
        authAction(
          <FlowHistoryButton
            businessId={flowId}
            flowMapUrl='flow-web/design/showLook'
            ignore={DEVELOPER_ENV}
            key='MANUAL_EVALUATE_APPROVE_HISTORY'
          >
            <Button className={styles.btn} disabled={empty || noSubmit}>审核历史</Button>
          </FlowHistoryButton>
        )
      }
      <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe}>仅我的</Checkbox>
    </>
  )
  const right = (
    <Search
      className={styles.btn}
      onSearch={handleQuickSearch}
      placeholder="请输入评审项目号或名称查询"
      allowClear
    />
  )
  // 提交审核前检查
  async function handleBeforeSubmit() {
    toggleApproveLoading(true)
    const { success, message: msg, data } = await checkEvaluateData({ subEvaluationProjectId: flowId })
    toggleApproveLoading(false)
    return new Promise((resolve) => {
      if (data) {
        resolve({
          success: data,
          message: msg,
          data: {
            businessKey: flowId
          }
        })
        return
      }
      resolve({
        success: data,
        message: '数据校验不通过，请检查评分是否已经完成'
      })
    })
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  // 处理快速查询
  function handleQuickSearch(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  // 切换仅查看我
  function handleOnlyMeChange(e) {
    setOnlyMe(e.target.checked)
    uploadTable()
  }
  // 处理高级搜索
  function handleAdvnacedSearch(v) {
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item => !!item.value)
    const range = filters.find(item => Array.isArray(item.value));
    const formatRangeValues = (rs) => {
      if (!rs) {
        return [{ value: undefined }]
      }
      if (rs.value && rs.value.length > 0) {
        const [begin, end] = rs.value;
        const be = begin.format('YYYY-MM-DD HH:mm:ss')
        const en = end.format('YYYY-MM-DD HH:mm:ss')
        return [
          {
            fieldName: 'createdDate',
            operator: 'GE',
            value: be,
            fieldType: 'Date'
          },
          {
            fieldName: 'createdDate',
            operator: 'LE',
            value: en,
            fieldType: 'Date'
          }
        ]
      }
      return [{ value: undefined }]
    }
    const athoerFields = formatRangeValues(range);
    const formatFields = filters.concat(athoerFields).filter(item => !!item.value && !Array.isArray(item.value));
    setSearchValue({
      filters: formatFields.map(item => ({
        ...item,
        fieldName: (
          item.fieldName === 'evaluationStatus' ||
          item.fieldName === 'flowStatus'
        ) ? item.fieldName : `seEvaluationProject.${item.fieldName}`
      }))
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 更新列表数据
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 评审
  function handleEvaluate() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/manual/evaluate?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}&flowId=${flowId}`, '评审', false)
  }
  // 查看明细页面
  function handleCheckDetail() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/manual/evaluate/detail?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}&flowId=${flowId}`, '评审明细', false)
  }
  // 终止审批流
  function handleStopApprove() {
    Modal.confirm({
      title: '终止审核',
      content: '是否终止当前选中数据的审核?',
      okText: '终止',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await stopApprove({ businessId: flowId })
        if (success) {
          message.success(msg);
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 监听二级路由关闭更新列表
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh()
    }
  }
  function analysisParams(params = {}) {
    const { scored = null, flowStatus = null } = params;
    const filters = [
      {
        fieldName: 'scored',
        operator: 'EQ',
        value: JSON.parse(scored)
      },
      {
        fieldName: 'flowStatus',
        operator: 'EQ',
        value: flowStatus
      }
    ].filter(item => !Object.is(null, item.value));
    return filters
  }
  useEffect(() => {
    const filters = analysisParams(query);
    setSearchValue({ filters })
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, [])
  return (
    <div>
      <Header
        left={left}
        right={right}
        ref={headerRef}
        advanced
        content={
          <AdvancedForm
            onOk={handleAdvnacedSearch}
            formItems={formItems}
          />
        }
      />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              {...tableProps}
              height={h}
              showSearch={false}
              ref={tableRef}
              onSelectRow={handleSelectedRows}
              allowCancelSelect
            />
          )
        }
      </AutoSizeLayout>
    </div>
  )
}

export default ManualEvaluate;