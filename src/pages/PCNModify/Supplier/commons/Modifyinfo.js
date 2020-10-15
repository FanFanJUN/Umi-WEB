import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import UploadFile from '../../../../components/Upload/index'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
let lineCode = 1;
const ModifyinfoRef = forwardRef(({
  form,
  isView = false,
  editData = [],
  headerInfo
}, ref) => {
  useImperativeHandle(ref, () => ({
    getbankform,
    setHeaderFields,
    form
  }));
  const tabformRef = useRef(null)
  const ModifyfromRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState('add');
  const [showAttach, triggerShowAttach] = useState(false);
  const [loading, triggerLoading] = useState(false);
  const [attachId, setAttachId] = useState('')
  const [title, setTitle] = useState('新增变更详情')
  let Modeltitle = '新增';
  useEffect(() => {

  }, [editData])
  const columns = [
    {
      title: '变更内容',
      dataIndex: 'lineCode',
      align: 'center',
      width: 80
    },
    {
      title: '变更描述(变更前)',
      dataIndex: 'countryName',
      align: 'center',
      width: 220,
    },
    {
      title: '变更描述（变更后）',
      dataIndex: 'provinceName',
      align: 'center',
      width: 220,
    },
    {
      title: '变更原因',
      align: 'center',
      dataIndex: 'regionName',
      width: 220,
    },
    {
      title: '证明材料（参考）',
      align: 'center',
      dataIndex: 'bankCode',
      width: 220,
    },
    {
      title: '附件',
      dataIndex: 'openingPermitId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value}/>
    }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;
  
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows); ;
     
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
  }
  // 新增
  function showModal() {
    setTitle('新增变更详情')
    setVisible(true)
  }
  // 编辑
  function handleEdit() {
    let newsbank;
    if (selectedRows.length > 1) {
      newsbank = selectedRows.splice(1);
    }else {
      newsbank = selectedRows
    }
    setTitle('编辑变更详情')
    setEdit(true)
    const [row] = newsbank;
    setInitialValue({ ...row })

  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    //tableRef.current.remoteDataRefresh()
  }
  // 取消编辑或新增
  function handleCancel() {
    //const { resetFields } = commonFormRef.current.form;
    //resetFields()
    setVisible(false)
    uploadTable()
  }
  // 新增或编辑保存
  function handleSubmit(val) {
    dataSource.map((item, index) => {
      if (item.key === val.key) {
        const copyData = dataSource.slice(0)
        copyData[index] = val;
        setDataSource(copyData)
        setRows(copyData)
      }
    })
    hideModal()
    uploadTable()
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
  // 删除
  async function handleRemove() {
    const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
    lineCode--;
    setDataSource(filterData)
  }
  
  // 获取表单值
  function getbankform() {
    const bankInfo = tabformRef.current.data;
    if (!bankInfo || bankInfo.length === 0) {
      return false;
    }
    return bankInfo;
  }
  // 设置所有表格参数
  const setHeaderFields = (fields) => {
    //const { attachmentId = null, ...fs } = fields;
    // setAttachment(attachmentId)
    // setFieldsValue(fs)
  }
  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={() => handleEdit()} disabled={empty} >编辑</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty} onClick={handleRemove}>删除</AuthButton>
      }
    </>
  );
  return (
    <>
      <Header  style={{ display: headerInfo === true ? 'none' : 'block',color: 'red' }}
        left={ headerInfo ? '' : headerleft}
        advanced={false}
        extra={false}
      />
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.key}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect={true}
            size='small'
            height={height}
            Modeltitle={Modeltitle}
            remotePaging={true}
            ellipsis={false}
            saveData={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
            //{...dataSource}
          />
        }
      </AutoSizeLayout>
      <div>
        <ModifyForm
          visible={visible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          type={modalType}
          initialValues={initialValue}
          title={title}
          wrappedComponentRef={ModifyfromRef}
          loading={loading}
          destroyOnClose
        />
        <Modal
          visible={showAttach}
          onCancel={hideAttach}
          footer={
            <Button type='ghost' onClick={hideAttach}>关闭</Button>
          }
        ></Modal>
      </div>
    </>
  )
}
)
const CommonForm = create()(ModifyinfoRef)

export default CommonForm