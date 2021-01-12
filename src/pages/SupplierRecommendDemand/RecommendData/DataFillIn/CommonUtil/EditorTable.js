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
  setDataSource = () => null,
  fields = [
    {
      name: 'name',
      label: '姓名',
      option: {
        rules: [
          {
            required: true,
            message: '姓名不能为空'
          }
        ]
      },
      props: {
        disabled: true
      }
    },
    {
      name: 'year',
      label: '年月日',
      fieldType: 'datePicker',
      option: {
        rules: [
          {
            required: true,
            message: '选择日期'
          }
        ]
      },
      disabledDate: (ct, mt, tv) => {
        return ct && ct > tv
      },
      disabledTarget: 'month'
    },
    {
      name: 'month',
      label: '年月日',
      fieldType: 'datePicker',
      option: {
        rules: [
          {
            required: true,
            message: '选择日期'
          }
        ]
      },
      disabledDate: (ct, mt, tv) => {
        return ct && ct < tv
      },
      disabledTarget: 'year'
    }
  ]
}) {
  const formRef = useRef(null);
  const [tps, sets] = useTableProps();
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('create');
  const { handleSelectedRows } = sets;
  const { selectedRowKeys } = tps;
  const empty = selectedRowKeys.length === 0;
  const d = dataSource.map(item => ({
    ...item,
    guid: !!item.guid ? item?.guild : !!item?.id ? item?.id : getUUID()
  }))
  function handleCreate() {
    setVisible(true)
    setType('create')
  }
  function handleEditor() {
    setVisible(true)
    setType('editor')
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
  function handleConfirm() {
    console.log(formRef)
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