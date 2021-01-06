import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, createRef } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar } from 'suid';
import { Input, Button, message, Checkbox, Modal, Form } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import CommonForm from './CommonForm'
import { smBaseUrl } from '@/utils/commonUrl';
import { infoSuppliermaster, SaveSupplierRegister, DetailSupplierRegister } from "@/services/supplierConfig"
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { Search } = Input
const FormItem = Form.Item;
const { Item, create } = Form;
const { authAction, storage } = utils;

const tabformRef = forwardRef(({
  form,
  onBlured = () => null,
  onEditor = () => null,
  type = 'add',
  headerForm = {}
}, ref) => {
  useImperativeHandle(ref, () => ({
    sortTable,
    form
  }));
  const { getFieldDecorator, setFieldsValue } = form;
  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const commonFormRef = createRef();
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [tabtitle, setTabtitle] = useState(false);
  const [selectType, setSelectType] = useState(false);
  const { account } = storage.sessionStorage.get("Authorization");
  //const { attachment = null } = initialValue;
  /* 按钮禁用状态控制 */
  const FRAMEELEMENT = getFrameElement();
  const empty = selectRowKeys.length === 0;
  const dataSource = {
    store: {
      url: `${smBaseUrl}/api/SmSupplierConfigService/findByPage`,
      params: {
        ...searchValue,
        pageInfo: { page: 1, rows: 100 },
        quickSearchProperties: ['smFieldCode', 'smFieldName']
      },
      type: 'POST'
    },
  }
  function initdata(data) {
    return data;
  }
  function onInput(data, index) {
    return (e) => {
      const tablereflist = tableRef.current.data;
      const selectData = tablereflist.slice(0)
      selectData[index] = data;
      selectData[index].smSort = e.target.value;
      onBlured(selectData)
    }
  }
  function sortTable() {
    const sorttabledata = tableRef.current.data;
    return {
      sorttabledata
    }
  }

  const tableProps = {
    columns: [
      {
        title: '字段代码',
        dataIndex: 'smFieldCode',
        width: 220
      },
      {
        title: '字段名称',
        dataIndex: 'smFieldName',
        width: 220
      },
      {
        title: '信息分类',
        dataIndex: 'smMsgTypeName',
        width: 160
      },
      {
        title: '表名称',
        dataIndex: 'smTableName',
        width: 200
      },
      {
        title: '字段类型',
        dataIndex: 'smFieldTypeName',
        width: 120
      },
      { title: '添加人', dataIndex: 'creatorName', width: 180 },
      { title: '添加时间', dataIndex: 'createdDate', width: 200 },
      {
        title: '排序码',
        dataIndex: 'sort',
        width: 220
      },
      {
        title: '备注',
        dataIndex: 'smExplain',
        width: 220
      },
    ],
    sort: {
      multiple: false,
      field: { standby1: 'asc' },
    },
  }
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, []);

  // 数据刷新
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh()
    }
  }

  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
    tableRef.current.manualSelectedRows([])
  }

  // 新增或编辑
  function showModal() {
    setTabtitle('新增字段')
    setSelectType(false)
    cleanSelectedRecord()
    commonFormRef.current.handleModalVisible(true)
  }
  // 编辑
  function handleCheckEdit() {
    setTabtitle('编辑字段')
    setSelectType(true)
    commonFormRef.current.handleModalVisible(true)
  }
  // 获取查询输入框值
  function SerachValue(v) {
    setSearchValue({
      quickSearchValue: v.target.value
    })
  }
  // 快速查询
  function handleQuickSerach(value) {
    setSearchValue(v => ({ ...v, quickSearchValue: value.trim() }));
    uploadTable();
  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 保存
  async function masterSave() {
    commonFormRef.current.handleModalVisible(false)
    uploadTable();
  }
  // 删除
  async function handleRemove() {
    let id = selectedRows[0].id;
    Modal.confirm({
      title: '删除',
      content: '删除后无法恢复，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await DetailSupplierRegister((id))
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 右侧搜索
  const searchBtnCfg = (
    <>
      <Search
        placeholder='请输入字段代码或名称查询'
        className={styles.btn}
        onSearch={handleQuickSerach}
        allowClear
        style={{ width: '240px' }}
      />
    </>
  )
  return (
    <>
      <Header
        left={
          <>
            {
              authAction(
                <Button type='primary' ignore={DEVELOPER_ENV} key='SUPPLIER_REGISTER_CONFIGURE_TABLE_ADD' className={styles.btn} onClick={() => showModal()}>新增</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='SUPPLIER_REGISTER_CONFIGURE_TABLE_EDIT' className={styles.btn} onClick={handleCheckEdit} disabled={empty}>编辑</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='SUPPLIER_REGISTER_CONFIGURE_TABLE_DETAIL' className={styles.btn} disabled={empty} onClick={handleRemove}>删除</Button>
              )
            }
          </>
        }
        right={searchBtnCfg}
        advanced={false}
        extra={false}
        ref={headerRef}
      />
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            {...tableProps}
            showSearch={false}
            ref={tableRef}
            rowKey={(item) => item.id}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect={true}
            remotePaging={true}
            size='small'
            height={height}
            ellipsis={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            //dataSource={dataSource}
            {...initdata(dataSource)}
          />
        }
      </AutoSizeLayout>
      <CommonForm
        title={tabtitle}
        modifydata={selectedRows[0]}
        onOk={masterSave}
        type={selectType}
        wrappedComponentRef={commonFormRef}
      />
    </>
  )
}
)
const StrategyTable = create()(tabformRef)
export default StrategyTable;
