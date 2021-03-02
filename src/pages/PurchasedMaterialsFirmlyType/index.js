/**
 * 采购物料类别与认定物料类别关系
 */

import { useRef, useState } from 'react';
import { ExtTable, utils } from 'suid';
import { Button, message, Modal } from 'antd';
import { useTableProps } from '../../utils/hooks';
import { purchaseMaterialClassifyProps, fimlyMaterialClassifyProps } from '../../utils/commonProps';
import { savePurchaseMaterialsData, frozenPurchaseMaterialsData } from '../../services/gradeSystem';
import { baseUrl } from '../../utils/commonUrl';
import { Header, ModalFields, AutoSizeLayout } from '../../components';
import styles from './index.less';
const { authAction } = utils;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
function PurchasedMaterialsFirmlyType() {
  const fieldRef = useRef(null);
  const tableRef = useRef(null);
  const [type, setType] = useState('create');
  const [visible, setVisible] = useState(false);
  const [tbps, setTbps] = useTableProps();
  const { selectedRows, selectedRowKeys } = tbps;
  const { setRowKeys, setRows } = setTbps;
  const empty = selectedRowKeys.length === 0;
  const tableOptions = {
    store: {
      url: `${baseUrl}/api/buyIdentifyMaterialCategoryService/findByPage`,
      type: 'post'
    }
  }
  const fields = [
    {
      label: '采购物料类别',
      name: 'buyMaterialCategoryName',
      fieldType: 'comboTree',
      props: {
        ...purchaseMaterialClassifyProps,
        name: 'buyMaterialCategoryName',
        field: ['buyMaterialCategoryCode']
      },
      options: {
        rules: [
          {
            required: true,
            message: '请选择采购物料类别'
          }
        ]
      }
    },
    {
      label: '认定物料类别',
      name: 'identifyMaterialCategoryName',
      fieldType: 'comboList',
      props: {
        ...fimlyMaterialClassifyProps,
        name: 'identifyMaterialCategoryName',
        field: ['identifyMaterialCategoryValue']
      },
      options: {
        rules: [
          {
            required: true,
            message: '请选择认定物料类别'
          }
        ]
      }
    },
    {
      label: '排序',
      name: 'rank',
      fieldType: 'inputNumber',
      options: {
        rules: [
          {
            required: true,
            message: '请填写排序号'
          }
        ]
      }
    },
    {
      label: '冻结',
      name: 'frozen',
      fieldType: 'hide'
    }
  ];
  const columns = [
    {
      title: '采购物料类别名称',
      dataIndex: 'buyMaterialCategoryName',
      width: 200
    },
    {
      title: '采购物料类别代码',
      dataIndex: 'buyMaterialCategoryCode',
      width: 200
    },
    {
      title: '认定物料类别名称',
      dataIndex: 'identifyMaterialCategoryName',
      width: 200
    },
    {
      title: '认定物料类别代码',
      dataIndex: 'identifyMaterialCategoryValue',
      width: 200
    },
    {
      title: '排序',
      dataIndex: 'rank'
    },
    {
      title: '冻结',
      dataIndex: 'frozen',
      render(text) {
        return Object.is(null, text) ? '' : text ? '是' : '否'
      }
    }
  ];
  async function showModal(type) {
    await setVisible(true)
    await setType(type)
    if (type === 'editor') {
      const [row = {}] = selectedRows;
      await fieldRef.current.setValue(row)
    }
  }
  function hideModal() {
    setVisible(false)
  }

  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
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
  async function handlerSave() {
    const [id] = selectedRowKeys;
    const values = await fieldRef.current.validateFieldsAndScroll()
    const { success, message: msg } = await savePurchaseMaterialsData({ ...values, id: type === 'create' ? null : id })
    hideModal()
    if (success) {
      uploadTable()
      message.success(msg)
      return
    }
    message.error(msg)
  }
  function handleFrozenUnFrozen() {
    const [row] = selectedRows;
    const { id, frozen } = row;
    Modal.confirm({
      title: frozen ? '解冻数据' : '冻结数据',
      okText: frozen ? '解冻' : '冻结',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await frozenPurchaseMaterialsData({
          id,
          frozen: !frozen
        })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  const left = (
    <>
      {
        authAction(
          <Button
            className={styles.btn}
            type='primary'
            key='BUYIDENTIFYMATERIALCATEGORY_CREATE'
            onClick={() => showModal('create')}
            ignore={DEVELOPER_ENV}
          >新增</Button>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            disabled={empty}
            key='BUYIDENTIFYMATERIALCATEGORY_EDITOR'
            onClick={() => showModal('editor')}
            ignore={DEVELOPER_ENV}
          >编辑</Button>
        )
      }
      {
        authAction(
          <Button
            disabled={empty}
            className={styles.btn}
            key='BUYIDENTIFYMATERIALCATEGORY_FROZEN'
            onClick={handleFrozenUnFrozen}
            ignore={DEVELOPER_ENV}
          >冻结解冻</Button>
        )
      }
    </>
  )
  return (
    <>
      <Header left={left} />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              height={h}
              showSearch={false}
              bordered
              columns={columns}
              onSelectRow={handleSelectedRows}
              allowCancelSelect
              rowKey='id'
              ellipsis={false}
              checkbox={{ multiSelect: false }}
              remotePaging
              ref={tableRef}
              {...tableOptions}
            />
          )
        }
      </AutoSizeLayout>
      <ModalFields
        wrappedComponentRef={fieldRef}
        fields={fields}
        type={type}
        visible={visible}
        onCancel={hideModal}
        onOk={handlerSave}
      />
    </>
  )
}

export default PurchasedMaterialsFirmlyType