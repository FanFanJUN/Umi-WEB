/**
 * 实现功能： 物料单位转换关系主数据
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState } from 'react';
import styles from './index.less';
import { utils, ExtTable } from 'suid';
import { Button, Input, Spin, message, Modal, Row, Col } from 'antd';
import { Header, AutoSizeLayout, ModalForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { commonUrl, commonProps } from '../../utils';
import Right from './Right';
import {
  materialCategoryUnitSaveOne as SAVE_ONE_METHOD,
  materialCategoryUnitRemove as REMOVE_METHOD
} from '../../services/gradeSystem';
const { recommendUrl } = commonUrl;
const {
  documentMaterialClassProps,
  standardUnitProps
} = commonProps;
const { Search } = Input;
/** 配置修改部分 begin */
const MAIN_KEY_PREFIX = 'MATERIAL_CATEGORY_UNIT_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = `${recommendUrl}/api/samBafMaterialCategoryUnitService/findByPage`;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { authAction } = utils;
const SEARCH_PLACEHOLDER = '物料分类代码或名称';
const quickSearchProperties = ['materialCategoryName', 'materialCategoryCode'];
const sortOrders = [];
const FIELDS = [
  {
    name: 'materialCategoryName',
    label: '物料分类',
    type: 'comboTree',
    option: {
      rules: [
        {
          required: true,
          message: '物料分类不能为空'
        }
      ]
    },
    readers: [{
      name: 'materialCategoryCode'
    }],
    props: {
      ...documentMaterialClassProps,
      name: 'materialCategoryName',
      field: ['materialCategoryCode'],
      reader: {
        name: 'showName',
        field: ['code']
      },
      treeNodeProps: (node) => {
        if (node.nodeLevel < 2) {
          return {
            selectable: false,
            disabled: true
          }
        }
      }
    }
  },
  {
    name: 'standardUnitName',
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
      name: 'standardUnitCode'
    }],
    props: {
      ...standardUnitProps,
      name: 'standardUnitName',
      field: ['standardUnitCode']
    }
  }
];
const COLUMNS = [
  {
    title: '物料分类代码',
    dataIndex: 'materialCategoryCode'
  },
  {
    title: '物料分类名称',
    dataIndex: 'materialCategoryName'
  },
  {
    title: '标准单位代码',
    dataIndex: 'standardUnitCode'
  },
  {
    title: '标准单位名称',
    dataIndex: 'standardUnitName'
  }
];
/** 配置修改部分 end */
function AcceptFYPMain() {
  const [tableState, sets] = useTableProps();
  const [spinning, setSpinning] = useState(false);
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
    setSearchValue,
    setRowKeys,
    toggleLoading
  } = sets;
  const [singleRow = {}] = selectedRows;
  const [queryId] = selectedRowKeys;
  const empty = selectedRowKeys.length === 0;
  const noSingle = selectedRowKeys.length > 1;
  const tableProps = {
    store: {
      url: TABLE_DATASOURCE_QUERY_PATH,
      type: 'POST',
      params: {
        quickSearchProperties,
        sortOrders,
        ...searchValue
      },
    },
    selectedRowKeys,
    selectedRows,
    checkbox: {
      multiSelect: false
    },
    columns: COLUMNS,
    showSearch: false,
    remotePaging: true,
    bordered: true
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
      id: modalType === 'create' ? null : singleRow.id
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
            key={`${MAIN_KEY_PREFIX}CREATE`}
            className={styles.btn}
            onClick={showCreateModal}
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
            key={`${MAIN_KEY_PREFIX}EDITOR`}
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
            key={`${MAIN_KEY_PREFIX}REMOVE`}
            onClick={handleRemove}
            disabled={empty}
          >删除</Button>
        )
      }
    </>
  );
  const right = (
    <Search
      onSearch={handleQuickSearch}
      placeholder={SEARCH_PLACEHOLDER}
      allowClear
    />
  )
  // 处理快速查询
  function handleQuickSearch(v) {
    setSearchValue({
      quickSearchValue: v.trim()
    })
    uploadTable()
  }
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
  return (
    <Spin spinning={spinning}>
      <Row>
        <Col span={14}>
          <Header
            left={left}
            right={right}
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
        </Col>
        <Col span={9} offset={1}>
          <Right queryId={queryId} />
        </Col>
      </Row>
    </Spin>
  )
}

export default AcceptFYPMain