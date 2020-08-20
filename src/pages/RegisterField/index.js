import React, { useState, useRef, useEffect, createRef } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar } from 'suid';
import { Input, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import CommonForm from './CommonForm'
import {formatSaveParams} from '../../utils'
import {supplierManagerBaseUrl } from '@/utils/commonUrl';
import { SaveSupplierRegister,DetailSupplierRegister } from "@/services/supplierConfig"
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { Search } = Input
const { authAction, storage } = utils;
function RegisterField({
  type = 'add',
  onCreateLine = () => null,
  onEditor = () => null,
  headerForm = {}
}) {
  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const commonFormRef = createRef();
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState('add');
  const [showAttach, triggerShowAttach] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, triggerLoading] = useState(false);
  const [singleRow = {}] = selectedRows;
  const [onlyMe, setOnlyMe] = useState(true);
  const [attachId, setAttachId] = useState('')
  const { account } = storage.sessionStorage.get("Authorization");
  const {
    state: rowState,
    approvalState: rowApprovalState,
    changeable: rowChangeable,
    flowId: businessId
  } = singleRow;

  const columns = [
    {
      title: '字段代码',
      dataIndex: 'smFieldCode',
      width: 180
    },
    {
      title: '字段名称',
      dataIndex: 'smFieldName',
      width: 180
    },
    {
      title: '信息分类',
      dataIndex: 'smMsgTypeName',
      // render(smMsgTypeCode) {
      //   switch (smMsgTypeCode) {
      //     case '0':
      //       return '基本信息'
      //     case '1':
      //       return '帐号信息'
      //     case '2':
      //       return '业务信息'
      //     case '3':
      //       return '供货信息'
      //     case '4':
      //       return '泛虹信息'
      //     case '5':
      //       return '资质信息'
      //     case '6':
      //       return '委托授权人信息'
      //     case '7':
      //       return '银行信息'
      //     case '8':
      //       return '原厂信息'
      //     default:
      //       return ''
      //   }
      // },
      width: 220
    },
    { title: '添加人', dataIndex: 'creatorName' },
    { title: '添加时间', dataIndex: 'createdDate', width: 180 },
  ].map(_ => ({ ..._, align: 'center' }))
  /* 按钮禁用状态控制 */
  const FRAMEELEMENT = getFrameElement();
  const empty = selectedRowKeys.length === 0;
  const dataSource = {
    store: {
      url: `${supplierManagerBaseUrl}/SmSupplierConfig/findVoListByPage`,
      params: {
        ...searchValue,
        quickSearchProperties:['smMsgTypeCode','smMsgTypeName'],
        filters: searchValue.filters ?
          searchValue.filters.concat([{
            fieldName: 'creatorAccount',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }]) : [{
            fieldName: 'creatorAccount',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }]
      },
      type: 'POST'
    }
  }
  // 右侧搜索
  const searchBtnCfg = (
    <>
      <Input
        placeholder='请输入字段代码或名称查询'
        className={styles.btn}
        onChange={SerachValue}
        allowClear
      />
      <Button type='primary' onClick={handleQuickSerach}>查询</Button>
    </>
  )

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
    setRowKeys([])
  }

  // 新增或编辑
  function showModal(t = 'add') {
    if (t === 'editor') {
      const [v] = selectedRowKeys;
      const [row] = selectedRows;
      setInitialValue({ ...row })
    }
    setVisible(true)
    setModalType(t)
  }

  // 获取查询输入框值
  function SerachValue(v) {
    setSearchValue({
      quickSearchValue: v.target.value
    })
  }
  // 快速查询
  function handleQuickSerach() {
    uploadTable();
  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 取消编辑或新增
  function handleCancel() {
    const { resetFields } = commonFormRef.current.form;
    resetFields()
    hideModal()
  }
  // 新增或编辑保存
  async function handleSubmit(val, keys, hide) {
    triggerLoading(true)
    const { success, message: msg } = await SaveSupplierRegister({SmSupplierConfigVo: JSON.stringify(val)});
    if (success) {
      triggerLoading(false)
      tableRef.current.remoteDataRefresh()
      message.success(msg)
      hideModal();
      return
    }
    triggerLoading(false)
    message.error(msg)
    tableRef.current.remoteDataRefresh()
  }
  // 关闭弹窗
  function hideModal() {
    setVisible(false)
    setInitialValue({})
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  //
  function handleRemove() {
    Modal.confirm({
      title: '删除',
      content: '删除后无法恢复，是否继续？',
      onOk: removeListItem,
      okText: '确定',
      cancelText: '取消'
    })
  }
  async function removeListItem() {
    triggerLoading(true)
    const [item] = selectedRows;
    const { id } = item;
    const { success, message: msg } = await DetailSupplierRegister({
      id: id
    })
    if (success) {
      message.success(msg)
      tableRef.current.remoteDataRefresh()
      return
    }
    message.error(msg)
  }
  return (
    <>
      <Header
        left={
          <>
            {
              authAction(
                <Button type='primary' ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={() => showModal()}>新增</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={() => showModal('editor')} disabled={empty}>编辑</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} disabled={empty} onClick={() => handleRemove()}>删除</Button>
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
            columns={columns}
            showSearch={false}
            ref={tableRef}
            rowKey={(item) => item.id}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            //dataSource={dataSource}
            {...dataSource}
          />
        }
      </AutoSizeLayout>
      <CommonForm
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        type={modalType}
        mode={type}
        initialValues={initialValue}
        wrappedComponentRef={commonFormRef}
        //loading={loading}
        destroyOnClose
      />
      <Modal
        visible={showAttach}
        onCancel={hideAttach}
        footer={
          <Button type='ghost' onClick={hideAttach}>关闭</Button>
        }
      ></Modal>

    </>
  )
}

export default RegisterField
