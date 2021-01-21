import { useRef, useState } from 'react';
import Header from '../../components/Header';
import ModalFields from '../../components/ModalFields';
import AutoSizeLayout from '../../components/AutoSizeLayout';
import { Button, message, Modal } from 'antd'
import { ExtTable } from 'suid';
import styles from './index.less';
import { useTableProps } from '../../utils/hooks';
import { recommendUrl } from '../../utils/commonUrl';
import { materialLevelProps } from '../../utils/commonProps';
import { savePassStandard, removePassStandard } from '../../services/passStandard';

function PassStandard() {
  const tableRef = useRef(null);
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState('create');
  const [ts, sets] = useTableProps();
  const {
    selectedRowKeys,
    selectedRows
  } = ts;
  const {
    handleSelectedRows,
    setRowKeys,
  } = sets;
  // 未选中数据状态
  const empty = selectedRowKeys.length === 0;
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/bafPassStandardService/findByPage`,
      type: 'post'
    },
    columns: [
      {
        title: '物料级别',
        dataIndex: 'materialGrade',
      },
      {
        title: '最低准入综合百分比(%)',
        dataIndex: 'integratedPercent',
        width: 200
      },
      {
        title: '最低准入子项百分比(%)',
        dataIndex: 'subItemPercentage',
        width: 200
      }
    ],
    selectedRowKeys,
    bordered: true,
    size: 'small',
    checkbox: {
      multiSelect: false
    },
    allowCancelSelect: true,
    ellipsis: false,
    remotePaging: true,
    showSearch: false,
    onSelectRow: handleSelectedRows
  }
  // 清除选中项
  function cleanSelectedRecord() {
    tableRef.current.manualSelectedRows([])
    setRowKeys([])
  }
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 处理新增
  async function handleCreate() {
    await setType('create')
    await setVisible(true)
  }
  async function handleEditor() {
    const [sl] = selectedRows;
    await setType('editor')
    await setVisible(true)
    await modalRef.current.setValue(sl)
  }
  function handleRemove() {
    Modal.confirm({
      title: '删除数据',
      content: '是否确定删除当前选中数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const [id] = selectedRowKeys;
        const { success, message: msg } = await removePassStandard({ id })
        if (success) {
          uploadTable()
          message.success(msg)
          return
        }
        message.error(msg)
      }
    })
  }
  // 处理数据填写完成后点击确定
  async function handleConfirm() {
    const [sl = {}] = selectedRows;
    const { id = null } = sl;
    const value = await modalRef.current.validateFieldsAndScroll();
    const { success, data, message: msg } = await savePassStandard({
      ...value,
      id: type === 'create' ? null : id
    })
    if (success) {
      message.success(msg)
      await setVisible(false)
      await uploadTable()
      return
    }
    message.error(msg)
  }
  const left = (
    <>
      <Button
        type='primary'
        className={styles.btn}
        onClick={handleCreate}
      >新增</Button>
      <Button
        disabled={empty}
        className={styles.btn}
        onClick={handleEditor}
      >编辑</Button>
      <Button
        disabled={empty}
        className={styles.btn}
        onClick={handleRemove}
      >删除</Button>
    </>
  );
  const fields = [
    {
      label: '物料级别',
      name: 'materialGrade',
      fieldType: 'comboList',
      props: {
        ...materialLevelProps,
        name: 'materialGrade',
        field: [],
        placeholder: '选择物料级别'
      },
      options: {
        rules: [
          {
            required: true,
            message: '请选择物料级别'
          }
        ]
      }
    },
    {
      label: '最低准入综合百分比',
      name: 'integratedPercent',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        max: 100,
        placeholder: '输入百分比'
      },
      options: {
        rules: [
          {
            required: true,
            message: '最低准入综合百分比不能为空'
          }
        ]
      }
    },
    {
      label: '最低准入子项百分比',
      name: 'subItemPercentage',
      fieldType: 'inputNumber',
      props: {
        min: 0,
        max: 100,
        placeholder: '输入百分比'
      },
      options: {
        rules: [
          {
            required: true,
            message: '最低准入子项百分比不能为空'
          }
        ]
      }
    }
  ]
  return (
    <div>
      <Header left={left} />
      <AutoSizeLayout>
        {
          (h) => (
            <ExtTable
              {...tableProps}
              height={h}
              ref={tableRef}
            />
          )
        }
      </AutoSizeLayout>
      <ModalFields
        wrappedComponentRef={modalRef}
        fields={fields}
        type={type}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleConfirm}
      />
    </div>
  )
}

export default PassStandard;