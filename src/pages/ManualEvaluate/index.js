/**
 * 实现功能： 人工评价
 * @author hezhi
 * @date 2020-09-23
 */

import { useRef } from 'react';
import styles from './index.less';
import { ExtTable, WorkFlow } from 'suid';
import { Button, Input, Modal, message } from 'antd';
import { Header, AutoSizeLayout, AdvancedForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { recommendUrl } from '../../utils/commonUrl';
import { evlStatusProps, evaluateSystemProps, orgnazationProps, evlEmu } from '../../utils/commonProps';
import { formatYMDHmsToYMD, getFrameElement, openNewTab } from '../../utils';
import { stopApprove } from '../../services/api';
const { Search } = Input;
const { StartFlow } = WorkFlow;

function ManualEvaluate() {
  const tableRef = useRef(null)
  const headerRef = useRef(null)
  const [tableState, sets] = useTableProps();
  const {
    selectedRowKeys,
    selectedRows,
    searchValue
  } = tableState;
  const {
    setRowKeys,
    handleSelectedRows,
    setSearchValue
  } = sets;
  const [singleRow = {}] = selectedRows;
  const {
    seEvaluationProject = {},
    flowStatus, // 审核状态
    id: flowId
  } = singleRow;
  // const { evaluationProjectStatus } = seEvaluationProject;
  // 未提交审核状态
  const noSubmit = flowStatus === 'INIT';
  // 未选中数据的状态
  const empty = selectedRowKeys.length === 0;
  const FRAMELEEMENT = getFrameElement();
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
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/seSubEvaluationProjectService/findByPage`,
      type: 'POST',
      params: {
        ...searchValue,
        quickSearchProperties: ['seEvaluationProject.docNumber', 'seEvaluationProject.projectName']
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
        title: '评价状态',
        dataIndex: 'evaluationStatusRemark'
      },
      {
        title: '审核状态',
        dataIndex: 'flowStatus',
        render(text) {
          switch (text) {
            case 'INIT':
              return '未提交审批'
            case 'INPROCESS':
              return '审批中'
            case 'COMPLETED':
              return '审批完成'
            default:
              return ''
          }
        },
      },
      {
        title: '评价单号',
        dataIndex: 'docNumber'
      },
      {
        title: '评价项目名称',
        dataIndex: 'seEvaluationProject.projectName'
      },
      {
        title: '评价体系',
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
        title: '评价期间类型',
        dataIndex: 'seEvaluationProject.evlPeriodTypeEnumRemark'
      },
      {
        title: '评价期间',
        dataIndex: 'rangeTime',
        render(text, record) {
          const st = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodStartTime);
          const et = formatYMDHmsToYMD(record.seEvaluationProject.evlPeriodEndTime);
          return `${st}~${et}`
        },
        width: 200
      },
      {
        title: '评价人',
        dataIndex: 'seEvaluationProject.creatorName'
      },
      {
        title: '评价日期',
        dataIndex: 'seEvaluationProject.createdDate',
        render(text) {
          return formatYMDHmsToYMD(text)
        }
      }
    ]
  }
  const left = (
    <>
      <Button className={styles.btn} disabled={!noSubmit || empty} onClick={handleEvaluate}>评价</Button>
      <Button className={styles.btn} disabled={empty}>明细</Button>
      <StartFlow
        className={styles.btn}
        type='primary'
        startComplete={uploadTable}
        businessKey={flowId}
        businessModelCode='com.ecmp.srm.sam.entity.se.SeSubEvaluationProject'
      >
        {
          loading => <Button loading={loading} className={styles.btn} disabled={empty || !noSubmit}>提交审核</Button>
        }
      </StartFlow>
      <Button className={styles.btn} disabled={empty || noSubmit} onClick={handleStopApprove}>终止审核</Button>
      <Button className={styles.btn} disabled={empty || noSubmit}>审核历史</Button>
    </>
  )
  const right = (
    <Search
      className={styles.btn}
      onSearch={handleQuickSearch}
      placeholder="请输入评价项目号或名称查询"
      allowClear
    />
  )
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
        fieldName: `seEvaluationProject.${item.fieldName}`
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
  // 评价
  function handleEvaluate() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/appraise/project/manual/evaluate?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}&flowId=${flowId}`, '评价', false)
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