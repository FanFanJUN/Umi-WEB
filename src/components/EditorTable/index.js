import { useState, useRef } from 'react';
import Header from '../Header';
import ModalFields from '../ModalFields';
import { ExtTable, utils, DataExport, DataImport, message } from 'suid';
import { Button, Modal } from 'antd';
import { useTableProps } from '../../utils/hooks';
import styles from './index.less';
import UploadFile from '../Upload';
import moment from 'moment';

const { getUUID } = utils;

function EditorTable({
  columns = [],
  dataSource = [],
  allowCreate = true,
  allowEditor = true,
  allowRemove = true,
  allowOperation = true,
  allowImport = false,
  allowExport = false,
  copyLine = false,
  copyFields = ['productCode', 'productName'],
  validateFunc = () => null,
  setDataSource = () => null,
  fields = [],
  mode = 'create',
  beforeEditor = () => null
}) {
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const [tps, sets] = useTableProps();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('create');
  const { handleSelectedRows, setRowKeys, toggleLoading } = sets;
  const { selectedRowKeys, selectedRows, loading } = tps;

  const empty = selectedRowKeys.length === 0;
  const d = dataSource.map(item => ({
    ...item,
    guid: !!item.guid ? item?.guid : !!item?.id ? item?.id : getUUID()
  }))
  async function handleCreate() {
    if (copyLine && dataSource.lenght === 0) {
      message.error('新增需至少有一行已自动带出的数据')
      return
    }
    await setVisible(true)
    await setType('create')
    if (copyLine && dataSource.length > 0) {
      const [line] = dataSource;
      const cfs = copyFields.reduce((prev, current) => {
        return {
          ...prev,
          [current]: line[current]
        }
      }, {})
      await formRef.current.setValue(cfs)
    }
  }
  function cleanSelectedRecord() {
    tableRef.current.manualSelectedRows([])
    setRowKeys([])
  }
  async function handleEditor() {
    await beforeEditor()
    const [row] = selectedRows;
    await setVisible(true)
    await setType('editor')
    await formRef.current.setValue({
      ...row
    })
  }
  async function handleExport() { }
  function handleRemove() {
    Modal.confirm({
      title: '删除数据',
      content: '是否确定删除所选数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const [key] = selectedRowKeys;
        const filterDataSource = dataSource.filter(item => item.guid !== key)
        await setDataSource(filterDataSource)
        cleanSelectedRecord()
      }
    })
  }
  async function handleConfirm() {
    toggleLoading(true)
    const val = await formRef.current.validateFieldsAndScroll((err, values) => {
      if (err) {
        toggleLoading(false)
      }
      return values
    })
    if (type === 'create') {
      const gid = getUUID();
      await setDataSource(
        [...d, { ...val, guid: gid }]
      )
      await setVisible(false)
      toggleLoading(false)
      return
    }
    const [sk] = selectedRowKeys;
    const nd = d.map(item => {
      if (item.guid === sk) {
        return {
          ...item,
          ...val,
          filled: true
        }
      }
      return item
    })
    await setDataSource(nd)
    await setVisible(false)
    toggleLoading(false)
    cleanSelectedRecord()
  }
  function importFunc(ims) {
    const formatIms = ims.map(item => ({
      ...item,
      guid: !!item.guid ? item?.guid : !!item?.id ? item?.id : getUUID()
    }))
    setDataSource(formatIms)
  }
  const left = (
    <>
      {
        allowCreate ?
          <Button
            className={styles.btn}
            onClick={handleCreate}
            disabled={mode === 'detail'}
            type='primary'
          >新增</Button> : null
      }
      {
        allowEditor ?
          <Button
            className={styles.btn}
            disabled={empty || mode === 'detail'}
            onClick={handleEditor}
          >编辑</Button> : null
      }
      {
        allowRemove ?
          <Button
            className={styles.btn}
            disabled={empty || mode === 'detail'}
            onClick={handleRemove}
          >删除</Button> : null
      }
      {
        allowImport ?
          <DataImport
            className={styles.btn}
            uploadBtnText='导入'
            validateAll={false}
            tableProps={{ columns }}
            validateFunc={validateFunc}
            importFunc={importFunc}
          /> : null
      }
      {
        allowExport ?
          <Button
            className={styles.btn}
            onClick={handleExport}
          >导出</Button> : null
      }
    </>
  );
  const footer = (
    <>
      <Button
        className={styles.btn}
        onClick={() => setVisible(false)}
      >取消</Button>
      <Button
        className={styles.btn}
        type='primary'
        loading={loading}
        onClick={handleConfirm}
      >确定</Button>
    </>
  );
  const formatColumns = columns.map(item => {
    const { type = 'text', dateFormat = 'YYYY-MM-DD' } = item;
    if (type === 'uploadFile') {
      return ({
        ...item,
        render: (text) => {
          return <UploadFile entityId={text} type='show' />
        }
      })
    }
    if (type === 'date') {
      return ({
        ...item,
        render: (text) => text && moment(text).format(dateFormat)
      })
    }
    return item
  })
  return (
    <div>
      <Header left={left} />
      <ExtTable
        columns={formatColumns}
        dataSource={d}
        showSearch={false}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        rowKey={item => item.guid}
        bordered
        size='small'
        ref={tableRef}
        checkbox={
          allowOperation ?
            { multiSelect: false } : false
        }
        allowCancelSelect
      />
      <ModalFields
        visible={visible}
        fields={fields}
        footer={footer}
        type={type}
        wrappedComponentRef={formRef}
        onCancel={() => setVisible(false)}
        onOk={handleConfirm}
      />
    </div>
  )
}

export default EditorTable;