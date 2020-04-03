import React, { useState } from 'react';
import { ExtTable } from 'suid';
import { Input, Button } from 'antd';
import Header from '@/components/Header';
import AdvancedForm from '@/components/AdvancedForm';
import { connect } from 'dva';
import styles from './index.less';
import classnames from 'classnames';
const { Search } = Input
const columns = [
  {
    title: "预警",
    dataIndex: "state",
    render(state) {
      switch (state) {
        case "Waring":
          return <div className={classnames([styles.dot, styles.warning])}></div>
        case "Expire":
          return <div className={classnames([styles.dot, styles.error])}></div>
        default:
          return ""
      }
    },
    width: 96,
  },
  { title: "状态", dataIndex: "status" },
  {
    title: "审批状态",
    dataIndex: "approvalState",
    render(approvalState) {
      switch (approvalState) {
        case "Uncommitted":
          return "未提交审批"
        case "InApproval":
          return "审批中"
        case "Finish":
          return "审批完成"
        default:
          return ""
      }
    },
  },
  {
    title: "是否作废",
    dataIndex: "invalid",
    render(invalid) {
      return invalid ? "是" : "否"
    },
    width: 80,
  },
  {
    title: "是否变更",
    dataIndex: "changeable",
    render(changeable) {
      return changeable ? "是" : "否"
    },
    width: 80,
  },
  { title: "采购策略编号", dataIndex: "code" },
  { title: "采购策略名称", dataIndex: "name" },
  { title: "物料级别", dataIndex: "materialLevelName" },
  { title: "采购公司", dataIndex: "purchaseCompanyName" },
  { title: "采购组织", dataIndex: "purchaseOrganizationName" },
  { title: "专业组", dataIndex: "professionalGroupName" },
  { title: "采购组", dataIndex: "purchaseGroupName" },
  { title: "申请人", dataIndex: "creatorName" },
  { title: "创建时间", dataIndex: "createdDate" }
].map(_ => ({ ..._, align: "center" }))

function PurchaseStategy({
  dispatch,
  state
}) {
  const { dataSource, loading, pagination } = state;
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const multiple = selectedRowKeys.length > 1;
  const empty = selectedRowKeys.length === 0;
  const formItems = [
    {
      type: "grid",
      key: "purchaseCompanyName",
      title: "公司",
      props: {
        reader: {
          name: "purchaseCompanyName"
        },
        placeholder: "请选择公司",
        columns: [
          { dataIndex: "", title: "公司代码" },
          { dataIndex: "", title: "公司名称" },
          { dataIndex: "", title: "公司id" },
        ],
        width: 650
      }
    },
    {
      title: "公司",
      key: "purchaseCompanyCode",
      props: {
        placeholder: "请输入公司代码"
      }
    },
    {
      title: "条件",
      key: "searchble",
      props: {
        placeholder: "你随便输入，搜到算我输"
      }
    },
    {
      title: "条件",
      key: "searchble",
      props: {
        placeholder: "你随便输入，搜到算我输"
      }
    }
  ]
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    console.log(selectedRows)
    setRowKeys(rowKeys)
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    setRows([])
  }
  // 切换页码
  function handlePaginationChange({ current, pageSize }) {
    dispatch({
      type: "purchaseStrategy/queryDataSource",
      payload: {
        rows: pageSize,
        page: current
      }
    })
  }
  // 快速搜索
  function handleQuickSerach(v) {
    dispatch({
      type: "purchaseStrategy/queryDataSource",
      payload: {
        rows: pagination.pageSize || 30,
        page: 1,
        Quick_value: v
      }
    })
  }
  // 高级搜索
  function handleAdvnacedSearch(v) {
    console.log(v)
  }
  // 删除
  function handleRemoveItem() {
    cleanSelectedRecord()
  }
  return (
    <>
      <Header
        left={
          <>
            <Button type="primary" className={styles.btn}>新增</Button>
            <Button disabled={multiple || empty} className={styles.btn}>编辑</Button>
            <Button onClick={handleRemoveItem} disabled={empty} className={styles.btn}>删除</Button>
            <Button disabled={multiple || empty} className={styles.btn}>明细</Button>
            <Button disabled={multiple || empty} className={styles.btn}>提交审核</Button>
            <Button disabled={multiple || empty} className={styles.btn}>审核历史</Button>
            <Button disabled={multiple || empty} className={styles.btn}>变更</Button>
            <Button disabled={multiple || empty} className={styles.btn}>变更历史</Button>
          </>
        }
        right={
          <>
            <Search
              placeholder="请输入采购策略编号或名称查询"
              className={styles.btn}
              onSearch={handleQuickSerach}
              allowClear
            />
          </>
        }
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch}/>
        }
        advanced
      />
      <ExtTable
        columns={columns}
        showSearch={false}
        loading={loading}
        dataSource={dataSource}
        rowKey={(item) => item.id}
        checkbox={true}
        ellipsis={false}
        pagination={pagination}
        onSelectRow={handleSelectedRows}
        onChange={handlePaginationChange}
        selectedRowKeys={selectedRowKeys}
      />
    </>
  )
}

export default connect(({ purchaseStrategy }) => ({ state: purchaseStrategy }))(PurchaseStategy)