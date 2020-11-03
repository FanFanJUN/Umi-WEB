/**
 * 实现功能：入厂验收批次合格率主数据
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState } from 'react';
import styles from './index.less';
import { utils, ExtTable, DataImport } from 'suid';
import { Button, Input, Spin, message } from 'antd';
import { Header, AutoSizeLayout, ModalForm } from '../../components';
import { useTableProps } from '../../utils/hooks';
import { commonUrl, downloadBlobFile } from '../../utils'
import {
  CHECKMETHOD,
  acceptSave as SAVEMETHOD,
  acceptExport as DOWNLOADMETHOD
} from '../../services/gradeSystem';
const { recommendUrl } = commonUrl;
const { Search } = Input;
const MAIN_KEY_PREFIX = 'ACCEPT_FYP_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = `${recommendUrl}/api/bafIncomingPassRateService/findByPage`;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
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
    title: '原厂代码',
    dataIndex: 'originCode'
  },
  {
    title: '原厂名称',
    dataIndex: 'originName'
  },
  {
    title: '物料分类代码',
    dataIndex: 'materialCategoryCode'
  },
  {
    title: '物料分类名称',
    dataIndex: 'materialCategoryName'
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
    title: '采购组织名称',
    dataIndex: 'purchaseOrgName'
  },
  {
    title: '月度',
    dataIndex: 'month'
  },
  {
    title: '不合格批次',
    dataIndex: 'unqualified'
  },
  {
    title: '检验总批次',
    dataIndex: 'total'
  }
];
const { authAction, getUUID } = utils;
const FILENAME = '入厂验收批次合格率上传模板.xlsx';
const SEARCH_PLACEHOLDER = '供应商代码或名称';
const quickSearchProperties = [];
const sortOrders = [];
const TFL = [
  {
    download: async () => {
      message.loading()
      const { success, data, message: msg } = await DOWNLOADMETHOD({
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
  const [KEYUUID, SETUUID] = useState('main')
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const {
    searchValue,
    selectedRowKeys,
    selectedRows
  } = tableState;
  const {
    handleSelectedRows,
    setSearchValue,
    setRowKeys
  } = sets;
  const [singleRow = {}] = selectedRows;
  const empty = selectedRowKeys.length === 0;
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
    remotePaging: true
  }
  // 验证要导入的数据
  async function validateFunc(item) {
    setSpinning(true)
    const { success, data, message: msg } = await CHECKMETHOD(item)
    setSpinning(false)
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
    const { success, data, message: msg } = await SAVEMETHOD(item)
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
      ...singleRow
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
          />
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}EDITOR`}
            // disabled={empty}
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
          >删除</Button>
        )
      }
    </>
  );
  const right = (
    <Search onSearch={handleQuickSearch} placeholder={SEARCH_PLACEHOLDER} />
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
      <ModalForm wrappedComponentRef={formRef} />
    </Spin>
  )
}

export default AcceptFYPMain