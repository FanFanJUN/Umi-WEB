import { useState, useRef } from 'react';
import Header from '../Header';
import ModalFields from '../ModalFields';
import { ExtTable, utils, DataImport } from 'suid';
import { Button, Modal, message } from 'antd';
import { useTableProps } from '../../utils/hooks';
import styles from './index.less';
import UploadFile from '../Upload';
import moment from 'moment';

const { getUUID } = utils;

function EditorTable({
  okText = '确定',
  cancelText = '取消',
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
  validateLoading = false,
  exportFunc = () => null,
  setDataSource = () => null,
  fields = [],
  mode = 'create',
  beforeEditor = () => null,
  formLayout = {
    labelCol: {
      span: 12,
    },
    wrapperCol: {
      span: 12,
    }
  }
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
    const [row] = selectedRows;
    const transferKeys = fields.filter(item => item?.fieldType === ('datePicker' || 'yearPicker')).map(item => item.name);
    const rkeys = Object.keys(row)
    const fieldsValues = rkeys.reduce((prev, cur) => {
      if (transferKeys.includes(cur)) {
        return {
          ...prev,
          [cur]: !!row[cur] ? moment(row[cur]) : null
        }
      }
      return { ...prev, [cur]: row[cur] }
    }, {})
    await beforeEditor(row)
    await setVisible(true)
    await setType('editor')
    await formRef.current.setValue(fieldsValues)
  }
  function handleRemove() {
    Modal.confirm({
      title: '删除数据',
      content: '是否确定删除所选数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        if (copyLine && dataSource.length === 1) {
          message.error('当前列表至少需要保留一条数据')
          return
        }
        const [key] = selectedRowKeys;
        const filterDataSource = d.filter(item => item.guid !== key)
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
        [...d, { ...val, guid: gid, filled: true }]
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
      return { ...item, filled: true }
    })
    await setDataSource(nd)
    await setVisible(false)
    toggleLoading(false)
    cleanSelectedRecord()
  }
  async function importFunc(ims) {
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
            okButtonProps={{ loading: validateLoading }}
            importFunc={importFunc}
          /> : null
      }
      {
        allowExport ?
          <Button
            className={styles.btn}
            onClick={exportFunc}
          >导出</Button> : null
      }
    </>
  );
  const footer = (
    <>
      <Button
        className={styles.btn}
        onClick={() => setVisible(false)}
      >{cancelText}</Button>
      <Button
        className={styles.btn}
        type='primary'
        loading={loading}
        onClick={handleConfirm}
      >{okText}</Button>
    </>
  );
  const formatColumns = columns.map(item => {
    const { type = 'text', dateFormat = 'YYYY-MM-DD' } = item;
    if (type === 'uploadFile') {
      return ({
        ...item,
        render(text) {
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
        formLayout={formLayout}
        type={type}
        wrappedComponentRef={formRef}
        onCancel={() => setVisible(false)}
        onOk={handleConfirm}
        copyLine={copyLine}
        copyFields={copyLine ? copyFields : []}
      />
    </div>
  )
}

export default EditorTable;