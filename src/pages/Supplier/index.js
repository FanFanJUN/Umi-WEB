import { useRef } from 'react';
import styles from './index.less';
import { useState, useEffect } from 'react';
import { ExtTable, ExtModal, WorkFlow } from 'suid';
import { Button, Input, message, Modal } from 'antd';
import { AutoSizeLayout, Header, AdvancedForm } from '../../components';
import { openNewTab, getFrameElement, commonProps } from '../../utils';
import { removeViewModify, stopApproveingOrder } from '../../services/supplier';
import { smBaseUrl } from '../../utils/commonUrl';
const { supplierProps, flowStatusProps, orgnazationProps } = commonProps;
const minxinSupplierProps = {
  ...supplierProps,
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '选择供应商'
};
const { Search } = Input;
const { FlowHistoryButton } = WorkFlow;
export default function () {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  const FRAMELEEMENT = getFrameElement();
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [visible, triggerVisible] = useState(false);
  /** 按钮可用性判断变量集合 BEGIN*/
  const [signleRow = {}] = selectedRows;
  const { flowStatus: signleFlowStatus, id: flowId } = signleRow;
  // 已提交审核状态
  const underWay = signleFlowStatus !== 'INIT';
  // 未选中数据的状态
  const empty = selectedRowKeys.length === 0;
  /** 按钮可用性判断变量集合 END*/
  const tableProps = {
    store: {
      url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
      params: {
        ...searchValue,
        sortOrders: [
          {
            property: 'docNumber',
            direction: 'DESC'
          }
        ]
      },
      type: 'post'
    }
  }
  const headerLeft = <>
    <Button type='primary' onClick={handleCreate} className={styles.btn}>新增</Button>
    <Button className={styles.btn} disabled={empty} onClick={handleEditor}>编辑</Button>
    <Button className={styles.btn} disabled={empty} onClick={handleRemoveItem}>删除</Button>
    <Button className={styles.btn} disabled={empty} onClick={handleDetail}>明细</Button>
    <Button className={styles.btn} disabled={empty || underWay}>提交审核</Button>
    <Button className={styles.btn} disabled={empty || !underWay} onClick={stopApprove}>终止审核</Button>
    <FlowHistoryButton
      businessId={flowId}
      flowMapUrl='flow-web/design/showLook'
    >
      <Button className={styles.btn} disabled={empty || !underWay}>审核历史</Button>
    </FlowHistoryButton>
  </>
  const headerRight = <>
    <Search
      placeholder='供应商代码或名称'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </>
  const columns = [
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
      }
    },
    {
      title: '单号',
      dataIndex: 'docNumber',
      width: 150
    },
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '变更说明',
      dataIndex: 'reason'
    },
    {
      title: '申请部门',
      dataIndex: 'orgName'
    },
    {
      title: '申请人',
      dataIndex: 'creatorName'
    },
    {
      title: '申请日期',
      dataIndex: 'createdDate',
      width: 150
    }
  ].map(item => ({ ...item, align: 'center' }));
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  // 更新列表数据
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 监听二级路由关闭更新列表
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh()
    }
  }
  // 处理快速查询
  function handleQuickSearch(v) {
    console.log(v)
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
    console.log(filters)
    setSearchValue({
      filters: filters
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  // 显示审核历史
  function showHistory() {
    triggerVisible(true)
  }
  // 隐藏审核历史
  function hideHistory() {
    triggerVisible(false)
  }
  // 高级查询配置
  const formItems = [
    {
      title: '单号',
      key: "Q_EQ_docNumber",
      props: {
        placeholder: '输入单号查询'
      }
    },
    {
      title: '供应商名称',
      key: 'Q_EQ_supplierCode',
      type: 'list',
      props: minxinSupplierProps
    },
    {
      title: '审核状态',
      key: 'Q_EQ_flowStatus',
      type: 'list',
      props: flowStatusProps
    },
    {
      title: '推荐部门',
      key: 'Q_EQ_orgCode',
      type: 'tree',
      props: orgnazationProps
    }
  ]
  // 处理编辑页签打开
  function handleEditor() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/purchase/accounting/editor?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '编辑采购策略', false)
  }
  // 处理新增页签打开
  function handleCreate() {
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/purchase/accounting/create?frameElementId=${id}&frameElementSrc=${pathname}`, '新增采购会计视图变更', false)
  }
  // 处理详情页签打开
  function handleDetail() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/purchase/accounting/detail?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '编辑采购策略', false)
  }
  // 删除一行数据
  async function handleRemoveItem() {
    const [supplierFinanceViewModifyId] = selectedRowKeys;
    Modal.confirm({
      title: '删除供应商采购会计视图',
      content: '删除后不可恢复，是否继续？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await removeViewModify({ supplierFinanceViewModifyId })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 终止审核
  function stopApprove() {
    Modal.confirm({
      title: '终止审批流程',
      content: '流程终止后无法恢复，是否继续？',
      onOk: handleStopApproveRecord,
      okText: '确定',
      cancelText: '取消'
    })
  }
  async function handleStopApproveRecord() {
    const [row] = selectedRows
    const { flowId } = row
    const { success, message: msg } = await stopApproveingOrder({
      businessId: flowId
    })
    if (success) {
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, []);
  return (
    <div>
      <Header
        left={headerLeft}
        right={headerRight}
        ref={headerRef}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
        }
        advanced
      />
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            columns={columns}
            bordered
            height={h}
            allowCancelSelect
            showSearch={false}
            checkbox={{ multiSelect: false }}
            ref={tableRef}
            rowKey={(item) => item.id}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            {...tableProps}
          />
        }
      </AutoSizeLayout>
    </div>
  )
}