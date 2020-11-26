/**
 * 实现功能：是否签订VMI协议
 * @author hezhi
 * @date 2020-11-4
 */
import { useRef, useState } from 'react';
import styles from './index.less';
import { utils, ExtTable, DataImport } from 'suid';
import { Button, Input, Spin, message, Modal } from 'antd';
import { Header, AutoSizeLayout, ModalForm, AdvancedForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import moment from 'moment';
import { commonUrl, downloadBlobFile, commonProps, formatTemplateBooleanParma } from '../../utils'
import {
  vmiSituationCheck as CHECK_METHOD,
  vmiSituationExport as EXPORT_METHOD,
  vmiSituationSaveList as SAVE_LIST_METHOD,
  vmiSituationSaveOne as SAVE_ONE_METHOD,
  vmiSituationRemove as REMOVE_METHOD
} from '../../services/gradeSystem';
const { recommendUrl } = commonUrl;
const {
  supplierProps,
  corporationProps,
  purchaseOrgConfig
} = commonProps;
const minxinSupplierProps = {
  ...supplierProps,
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '选择供应商'
};
const { Search } = Input;
const TRANSFORM_PARAM = true;
const MAIN_KEY_PREFIX = 'VMI_SITUATION_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = `${recommendUrl}/api/bafVmiSignedService/findByPage`;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { authAction, getUUID } = utils;
const FILENAME = '是否签订VMI协议上传模板.xlsx';
const DOWNLOADNAME = '是否签订VMI协议.xlsx'
const SEARCH_PLACEHOLDER = '供应商代码或名称';
const quickSearchProperties = ['supplierCode', 'supplierName'];
const sortOrders = [];
const FORMITEMS = [
  {
    title: '供应商',
    key: 'Q_EQ_supplierCode',
    type: 'list',
    props: minxinSupplierProps
  },
  {
    title: '公司',
    key: 'Q_EQ_corporationCode',
    type: 'list',
    props: corporationProps
  },
  {
    title: '采购组织',
    key: 'Q_EQ_purchaseOrgCode',
    type: 'list',
    props: purchaseOrgConfig
  }
];
const FIELDS = [
  {
    name: 'supplierCode',
    label: '供应商代码',
    type: 'label'
  },
  {
    name: 'supplierName',
    label: '供应商名称',
    type: 'label'
  },
  {
    name: 'corporationCode',
    label: '公司代码',
    type: 'label'
  },
  {
    name: 'corporationName',
    label: '公司名称',
    type: 'label'
  },
  {
    name: 'purchaseOrgCode',
    label: '采购组织代码',
    type: 'label'
  },
  {
    name: 'purchaseOrgName',
    label: '采购组织名称',
    type: 'label'
  },
  {
    name: 'signed',
    label: '是否签订VMI协议',
    type: 'select',
    labelOptions: [
      {
        value: true,
        text: '是'
      },
      {
        value: false,
        text: '否'
      }
    ],
    option: {
      rules: [
        {
          required: true,
          message: '签订情况不能为空',
          type: 'boolean'
        }
      ]
    }
  }
];
const COLUMNS = [
  {
    title: '供应商代码',
    dataIndex: 'supplierCode'
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName'
  },
  {
    title: '公司代码',
    dataIndex: 'corporationCode'
  },
  {
    title: '公司名称',
    dataIndex: 'corporationName'
  },
  {
    title: '采购组织代码',
    dataIndex: 'purchaseOrgCode'
  },
  {
    title: '是否签订VMI协议',
    dataIndex: 'signed',
    render(text) {
      return !!text ? '是' : '否'
    }
  }
];
const TFL = [
  {
    download: async () => {
      message.loading()
      const { success, data, message: msg } = await EXPORT_METHOD({
        downloadTemplate: true
      });
      message.destroy()
      if (success) {
        downloadBlobFile(data, FILENAME)
        message.success('下载成功')
        return
      }
      message.error(msg)
    },
    fileName: FILENAME
  }
];
function AcceptFYPMain() {
  const [tableState, sets] = useTableProps();
  const [spinning, setSpinning] = useState(false);
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
      multiSelect: true
    },
    columns: COLUMNS,
    showSearch: false,
    remotePaging: true
  }
  // 验证要导入的数据
  async function validateFunc(item) {
    toggleLoading(true)
    const transfromItems = TRANSFORM_PARAM ? item.map(t => formatTemplateBooleanParma(t, 'signed')) : item;
    console.log(transfromItems)
    const { success, data, message: msg } = await CHECK_METHOD(transfromItems)
    toggleLoading(false)
    if (success) {
      const formatData = data.map((item, index) => ({
        ...item,
        key: `${index}-validate`
      }))
      return new Promise(resolve => resolve(formatData))
    }
    message.error(msg)
  }
  // 确认导入
  async function importFunc(item) {
    setSpinning(true)
    const { success, data, message: msg } = await SAVE_LIST_METHOD(item)
    setSpinning(false)
    if (success) {
      message.success('导入成功')
      uploadTable()
      return
    }
    message.error(msg)
    const uid = getUUID()
    SETUUID(uid)
  }
  // 显示编辑框并设置数据
  async function showEditorModal() {
    await formRef.current.show()
    await formRef.current.setFormValues({
      ...singleRow,
      month: moment(singleRow?.month)
    })
  }
  // 编辑后保存数据
  async function handleEditorSave(values) {
    toggleConfirmLoading(true)
    const { success, message: msg } = await SAVE_ONE_METHOD({
      ...values,
      id: singleRow.id
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
        const { success, message: msg } = await REMOVE_METHOD(selectedRowKeys);
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 处理高级搜索
  async function handleAdvnacedSearch(v) {
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item => !!item.value)
    await setSearchValue({
      filters: filters
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 导出
  async function handleExport() {
    Modal.confirm({
      title: '导出数据',
      content: '是否导出当前查询条件下数据？',
      okText: '导出',
      cancelText: '取消',
      onOk: async () => {
        const search = {
          ...searchValue,
          quickSearchProperties
        }
        const { success, message: msg, data } = await EXPORT_METHOD(search)
        if (success) {
          downloadBlobFile(data, DOWNLOADNAME);
          message.success('导出成功')
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
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}EXPORT`}
            onClick={handleExport}
          >导出</Button>
        )
      }
      {
        authAction(
          <DataImport
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}IMPORT`}
            className={styles.btn}
            uploadBtnText='导入'
            validateAll={false}
            tableProps={{ columns: COLUMNS }}
            validateFunc={validateFunc}
            importFunc={importFunc}
            templateFileList={TFL}
            okButtonProps={{
              loading: loading
            }}
          />
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
    />
  )
  // 处理快速查询
  function handleQuickSearch(v) {
    setSearchValue({
      quickSearchValue: v
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
      <Header
        left={left}
        right={right}
        advanced
        content={
          <AdvancedForm formItems={FORMITEMS} onOk={handleAdvnacedSearch} />
        }
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

export default AcceptFYPMain