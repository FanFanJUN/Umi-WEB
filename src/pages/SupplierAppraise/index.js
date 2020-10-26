/**
 * 实现功能： 供应商评价项目
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef } from 'react';
import styles from './index.less';
import { useTableProps } from '../../utils/hooks';
import { ExtTable, utils, WorkFlow } from 'suid';
import { Button, Input, Modal, message } from 'antd';
import { recommendUrl } from '../../utils/commonUrl';
import { Header, AutoSizeLayout, AdvancedForm } from '../../components';
import { evlStatusProps, evaluateSystemProps, orgnazationProps, evlEmu } from '../../utils/commonProps';
import { getFrameElement, openNewTab } from '../../utils';
import moment from 'moment';
import { removeAppraiseProject, sponsorAppraise, withdrawAppraise, generateResult } from '../../services/appraise';
import { stopApprove } from '../../services/api';
const { Search } = Input;
const { authAction, storage } = utils;
const { StartFlow, FlowHistoryButton } = WorkFlow;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
function SupplierRevaluate() {
  const [states, sets] = useTableProps();
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const authorizations = storage.sessionStorage.get("Authorization");
  const currentUserId = authorizations?.userId;

  const FRAMELEEMENT = getFrameElement();
  const {
    selectedRowKeys,
    selectedRows,
    searchValue
  } = states;
  const {
    setRowKeys,
    setRows,
    setSearchValue
  } = sets;
  /** 按钮可用性判断变量集合 BEGIN*/
  const [signleRow = {}] = selectedRows;
  const {
    needSelectScorer, // 是否需要分配评审人
    evaluationProjectStatus, // 单据状态
    creatorId,
    flowStatus,
    id: businessKey
  } = signleRow;
  // 未选中数据的状态
  const empty = selectedRowKeys.length === 0;
  // 是不是自己的单据
  const isSelf = currentUserId === creatorId;
  // 可删除状态
  const allowRemove = evaluationProjectStatus === 'DRAFT';
  const complete = evaluationProjectStatus === 'EVALUATION_COMPLETED';
  // 已生成结果
  const resultGener = evaluationProjectStatus === 'RESULTS_GENERATED'
  // 已审批
  const flowComplete = flowStatus === 'COMPLETED';
  // 审批中
  const flowing = flowStatus === 'INPROCESS';
  // 未审批
  const flowInit = flowStatus === 'INIT';
  const columns = [
    {
      title: '状态',
      dataIndex: 'evaluationProjectStatusRemark',
      width: 80
    },
    {
      title: '需分配评审人',
      dataIndex: 'needSelectScorer',
      render(text) {
        return !!text ? '是' : '否'
      }
    },
    {
      title: '评价项目号',
      dataIndex: 'docNumber'
    },
    {
      title: '评价项目名称',
      dataIndex: 'projectName'
    },
    {
      title: '评价体系',
      dataIndex: 'mainDataEvlSystemName'
    },
    {
      title: '要求完成时间',
      dataIndex: 'askCompleteTime',
      render(text) {
        return moment(text).format('YYYY-MM-DD')
      }
    },
    {
      title: '组织部门',
      dataIndex: 'orgName',
      width: 200
    },
    {
      title: '评价期间类型',
      dataIndex: 'evlPeriodTypeEnumRemark'
    },
    {
      title: '评价期间',
      dataIndex: 'rangeTime',
      render(text, record) {
        const ft = [moment(record.evlPeriodStartTime).format('YYYY-MM-DD'), moment(record.evlPeriodEndTime).format('YYYY-MM-DD')].join('~')
        return ft
      },
      width: 200
    },
    {
      title: '创建人',
      dataIndex: 'creatorName'
    },
    {
      title: '创建日期',
      dataIndex: 'createdDate',
      render(text) {
        return moment(text).format('YYYY-MM-DD')
      }
    }
  ];
  const formItems = [
    {
      title: '状态',
      key: 'Q_EQ_evaluationProjectStatus',
      type: 'list',
      props: evlStatusProps
    },
    {
      title: '评价项目号',
      key: 'Q_LK_docNumber'
    },
    {
      title: '评价项目名称',
      key: 'Q_LK_projectName'
    },
    {
      title: '评价体系',
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
      title: '评价期间类型',
      key: 'Q_EQ_evlPeriodType',
      props: evlEmu,
      type: 'list'
    },
    {
      title: '创建人',
      key: 'Q_LK_creatorName'
    },
    {
      title: '创建日期',
      key: 'Q_GE$LE_createdDate',
      type: 'rangePicker'
    }
  ]
  function handleCreate() {
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/create?frameElementId=${id}&frameElementSrc=${pathname}`, '新建评价项目', false)
  }
  function handleEditor() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/editor?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '编辑评价项目', false)
  }
  function handleDetail() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/detail?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '评价项目详情', false)
  }
  function handleRemove() {
    const [key] = selectedRowKeys;
    Modal.confirm({
      title: '删除评 价项目',
      content: '是否删除当前所选评价项目？',
      onOk: async () => {
        const { success, message: msg } = await removeAppraiseProject({
          evaluationProjectId: key
        })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      },
      okText: '删除',
      cancelText: '取消'
    })
  }
  // 查看评价结果
  function handleCheckResult() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/evaluate/result?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '评价结果', false)
  }
  // 分配评审人
  function handleAllocation() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/allocation?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '评价项目分配评审人', false)
  }
  function handleAppraise() {
    const [key] = selectedRowKeys;
    Modal.confirm({
      title: '发起评价',
      content: '确定要对当前选中的项目发起评价吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await sponsorAppraise({
          evaluationProjectId: key
        })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  function handleWithdraw() {
    const [key] = selectedRowKeys;
    Modal.confirm({
      title: '撤回评价',
      content: '确定要撤回当前选中的项目评价吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await withdrawAppraise({
          evaluationProjectId: key
        })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  const left = (
    <>
      <Button className={styles.btn} type='primary' onClick={handleCreate}>新增</Button>
      <Button className={styles.btn} onClick={handleEditor} disabled={empty || !allowRemove || resultGener}>编辑</Button>
      <Button className={styles.btn} onClick={handleRemove} disabled={empty || !allowRemove}>删除</Button>
      <Button className={styles.btn} onClick={handleDetail} disabled={empty}>明细</Button>
      <Button className={styles.btn} onClick={handleAllocation} disabled={empty || !needSelectScorer || complete || resultGener}>分配评审人</Button>
      <Button className={styles.btn} onClick={handleAppraise} disabled={empty || !allowRemove || resultGener}>发起评价</Button>
      <Button className={styles.btn} onClick={handleWithdraw} disabled={empty || allowRemove || complete || resultGener}>撤回</Button>
      <Button className={styles.btn} disabled={empty || !complete} onClick={handleGenerateResult}>生成评价结果</Button>
      <Button className={styles.btn} disabled={empty || !flowInit || !resultGener} onClick={handleCheckResult}>查看评价结果</Button>
      <StartFlow
        businessKey={businessKey}
        businessModelCode="com.ecmp.srm.sam.entity.se.SeEvaluationProject"
        flowMapUrl='flow-web/design/showLook'
        startComplete={uploadTable}
      >
        {
          ld => (
            <Button
              className={styles.btn}
              disabled={empty || !flowInit || !resultGener}
              loading={ld}
            >提交审核</Button>
          )
        }
      </StartFlow>
      <Button className={styles.btn} disabled={empty || !flowing} onClick={handleStopApprove}>终止审核</Button>
      <FlowHistoryButton
        businessId={businessKey}
        flowMapUrl='flow-web/design/showLook'
      >
        <Button className={styles.btn} disabled={empty || flowInit}>审核历史</Button>
      </FlowHistoryButton>
    </>
  );
  const right = (
    <Search
      placeholder='请输入评价项目号或名称查询'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  );
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/seEvaluationProjectService/findByPage`,
      type: 'POST',
      params: {
        ...searchValue,
        quickSearchProperties: ['docNumber', 'projectName']
      }
    },
    columns,
    selectedRowKeys,
    checkbox: {
      multiSelect: false
    },
    rowKey: item => item.id
  };
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  // 更新列表数据
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
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
      filters: formatFields
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 处理快速查询
  function handleQuickSearch(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  // 生成评价结果
  function handleGenerateResult() {
    Modal.confirm({
      title: '生成评价结果',
      content: '是否生成当前选中评价的结果？',
      okText: '生成',
      cancelText: '取消',
      onOk: async () => {
        const [evaluationProjectId] = selectedRowKeys;
        const { success, message: msg } = await generateResult({ evaluationProjectId })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 终止审批流
  function handleStopApprove() {
    Modal.confirm({
      title: '终止审核',
      content: '是否终止当前选中数据的审核?',
      okText: '终止',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await stopApprove({ businessId: businessKey })
        if (success) {
          message.success(msg);
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  return (
    <div>
      <Header
        left={left}
        right={right}
        advanced
        ref={headerRef}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
        }
      />
      <AutoSizeLayout>
        {
          h =>
            <ExtTable
              showSearch={false}
              height={h}
              ref={tableRef}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
        }
      </AutoSizeLayout>
    </div>
  )
}
export default SupplierRevaluate