/**
 * @description 左组织机构树，右表人员选择，可选全部人员，弹出弹窗选择
 * @author hezhi
 * @date 2020.9.18
 */
import React, { useRef, useState } from "react";
import { Input, Button } from "antd";
import styles from './index.less';
import { ExtTable, ExtModal } from "suid";
import PropTypes from 'prop-types';
import { useTableProps } from "../../utils/hooks";
import Header from '../Header';
const Search = Input.Search;
function ComboModalList({
  store = {},
  columns = [],
  form = {},
  disabled = false,
  wrapperClass,
  width = 800,
  nodeKey,
  value = [],
  alias = '',
  afterSelect = () => null,
  onOk = () => null,
  children = '',
  title = '',
  ...props
}) {
  const tableRef = useRef(null);
  const [tableState, sets] = useTableProps();
  const [visible, toggleVisible] = useState(false);
  const {
    selectedRowKeys,
    selectedRows,
    searchValue
  } = tableState;
  const { setRowKeys, setRows, setSearchValue } = sets
  function showModal() {
    toggleVisible(true)
  }
  function hideModal() {
    toggleVisible(false)
  }
  function handleOnOk() {
    toggleVisible(false)
    onOk(selectedRows)
    setRows([])
  }
  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 处理快速搜素
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  const tableProps = {
    store: {
      ...store,
      params: {
        ...store.params,
        ...searchValue
      }
    },
    columns,
    selectedRowKeys,
    showSearch: false,
    ellipsis: false,
    checkbox: {
      multiSelect: true
    },
    remotePaging: true,
    height: '53vh'
  }
  return (
    <div className={styles.inline}>
      <Button disabled={disabled} onClick={showModal} {...props}>{children}</Button>
      <ExtModal
        visible={visible}
        width={width}
        title={title}
        centered
        onCancel={hideModal}
        onOk={handleOnOk}
        maskClosable
        destroyOnClose
        bodyStyle={{
          height: '70vh',
          overflowY: 'scroll'
        }}
      >
        <div>
          <Header
            right={
              <Search
                onSearch={handleQuickSerach}
                allowClear
                placeholder='快速搜索'
              />
            }
          />
          <ExtTable
            {...tableProps}
            onSelectRow={handleSelectedRows}
            ref={tableRef}
          />
        </div>
      </ExtModal>
    </div>
  )
}
ComboModalList.propTypes = {
  // 点击确定回调
  onOk: PropTypes.func,
  //人员选择后回调方法
  onRowsChange: PropTypes.func,
  onChange: PropTypes.func,
}

export default ComboModalList;