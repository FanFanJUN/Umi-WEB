import { useState, useRef } from 'react';
import Header from '../../../../../components/Header';
import ModalFields from './ModalFields';
import { ExtTable, utils } from 'suid';
import { Button, Modal } from 'antd';
import { useTableProps } from '../../../../../utils/hooks';
import styles from '../index.less';

const { getUUID } = utils;

function EditorTable({
  columns = [],
  dataSource = [],
  allowCreate = true,
  allowEditor = true,
  allowRemove = true,
  allowOperation = true,
  copyLine = false,
  copyFields = ['productCode', 'productName'],
  setDataSource = () => null,
  fields = []
}) {
  const formRef = useRef(null);
  const [tps, sets] = useTableProps();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('create');
  const { handleSelectedRows } = sets;
  const { selectedRowKeys, selectedRows } = tps;
  const empty = selectedRowKeys.length === 0;
  const d = dataSource.map(item => ({
    ...item,
    guid: !!item.guid ? item?.guid : !!item?.id ? item?.id : getUUID()
  }))
  async function handleCreate() {
    await setVisible(true)
    await setType('create')
    if (copyLine) {
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
  async function handleEditor() {
    const [row] = selectedRows;
    await setVisible(true)
    await setType('editor')
    await formRef.current.setValue({
      ...row
    })
  }
  function handleRemove() {
    Modal.confirm({
      title: '删除数据',
      content: '是否确定删除所选数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        const [key] = selectedRowKeys;
      }
    })
  }
  async function handleConfirm() {
    const val = await formRef.current.validateFieldsAndScroll();
    await setVisible(false)
    if (type === 'create') {
      const gid = getUUID();
      await setDataSource([...d, { ...val, guid: gid }])
      return
    }
    const [sk] = selectedRowKeys;
    const nd = d.map(item => {
      if (item.guid === sk) {
        return {
          ...val
        }
      }
      return item
    })
    await setDataSource(nd)
  }
  const left = (
    <>
      {
        allowCreate ?
          <Button className={styles.btn} onClick={handleCreate}>新增</Button> : null
      }
      {
        allowEditor ?
          <Button className={styles.btn} disabled={empty} onClick={handleEditor}>编辑</Button> : null
      }
      {
        allowRemove ?
          <Button className={styles.btn} disabled={empty} onClick={handleRemove}>删除</Button> : null
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
        onClick={handleConfirm}
      >确定</Button>
    </>
  )
  return (
    <div>
      <Header left={left} />
      <ExtTable
        columns={columns}
        dataSource={d}
        showSearch={false}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        rowKey={item => item.guid}
        bordered
        size='small'
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