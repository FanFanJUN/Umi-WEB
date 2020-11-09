/**
 * 实现功能：计算方式对应指标主数据
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import { utils, ExtTable } from 'suid';
import { Button, Input, Spin, message, Modal, Table } from 'antd';
import { Header, AutoSizeLayout, ModalForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { commonUrl, commonProps } from '../../utils'
import moment from 'moment';
import {
  unitRightSaveOne as SAVE_ONE_METHOD,
  unitRightRemove as REMOVE_METHOD
} from '../../services/gradeSystem';
const { recommendUrl } = commonUrl;
const {
  standardUnitProps
} = commonProps;
/** 配置修改部分 begin */
const MAIN_KEY_PREFIX = 'MATERIAL_CATEGORY_UNIT_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = `${recommendUrl}/api/samBafActualUnitConversionService/findListByMaterialCategoryUnitId`;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { authAction } = utils;
const FIELDS = [
  {
    name: 'actualUnitName',
    label: '单位',
    type: 'comboList',
    option: {
      rules: [
        {
          required: true,
          message: '单位不能为空'
        }
      ]
    },
    readers: [{
      name: 'actualUnitCode'
    }],
    props: {
      ...standardUnitProps,
      name: 'actualUnitName',
      field: ['actualUnitCode']
    }
  },
  {
    name: 'conversionRate',
    label: '转换关系',
    type: 'number',
    option: {
      rules: [
        {
          required: true,
          message: '转换关系不能为空'
        }
      ]
    },
  }
];
const COLUMNS = [
  {
    title: '实际计量单位代码',
    dataIndex: 'actualUnitCode'
  },
  {
    title: '实际计量单位名称',
    dataIndex: 'actualUnitName'
  },
  {
    title: '转换关系',
    dataIndex: 'conversionRate'
  }
];
/** 配置修改部分 end */
function Right({
  queryId = undefined
}) {
  const [tableState, sets] = useTableProps();
  const [modalType, setModalType] = useState('create');
  const [confirmLoading, toggleConfirmLoading] = useState(false);
  const [KEYUUID, SETUUID] = useState('main')
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const {
    searchValue,
    selectedRowKeys,
    selectedRows,
    loading
  } = tableState;
  const {
    handleSelectedRows,
    setRowKeys,
    toggleLoading
  } = sets;
  const [singleRow = {}] = selectedRows;
  const empty = selectedRowKeys.length === 0;
  const noSingle = selectedRowKeys.length > 1;
  const tableProps = {
    store: {
      url: TABLE_DATASOURCE_QUERY_PATH,
      type: 'GET',
      params: {
        materialCategoryUnitId: queryId
      },
    },
    selectedRowKeys,
    selectedRows,
    checkbox: {
      multiSelect: false
    },
    columns: COLUMNS,
    showSearch: false,
    remotePaging: true
  }
  // 显示编辑框并设置数据
  async function showEditorModal() {
    setModalType('editor')
    await formRef.current.show()
    await formRef.current.setFormValues({
      ...singleRow
    })
  }
  // 显示新增弹窗
  async function showCreateModal() {
    setModalType('create')
    await formRef.current.show()
  }
  // 编辑后保存数据
  async function handleEditorSave(values) {
    toggleConfirmLoading(true)
    const { success, message: msg } = await SAVE_ONE_METHOD({
      ...values,
      id: modalType === 'create' ? null : singleRow.id,
      materialCategoryUnitId: queryId
    })
    toggleConfirmLoading(false)
    if (success) {

      await formRef.current.hide()
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
  }
  // 删除
  async function handleRemove() {
    Modal.confirm({
      title: '删除数据',
      content: '是否要删除当前所选数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const [id] = selectedRowKeys;
        const { success, message: msg } = await REMOVE_METHOD({ id });
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
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}RIGHT_CREATE`}
            className={styles.btn}
            onClick={showCreateModal}
            disabled={!queryId}
          >
            新增
          </Button>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}RIGHT_EDITOR`}
            disabled={empty || noSingle}
            onClick={showEditorModal}
          >编辑</Button>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}RIGHT_REMOVE`}
            onClick={handleRemove}
            disabled={empty}
          >删除</Button>
        )
      }
    </>
  );
  // 更新列表数据
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  useEffect(() => {
    uploadTable()
  }, [queryId])
  return (
    <Spin spinning={loading}>
      <Header
        left={left}
        ref={headerRef}
      />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              key={`data-import-${KEYUUID}`}
              height={h}
              ref={tableRef}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
          )
        }
      </AutoSizeLayout>
      <ModalForm
        wrappedComponentRef={formRef}
        fields={FIELDS}
        onOk={handleEditorSave}
        confirmLoading={confirmLoading}
      />
    </Spin>
  )
}

export default Right