import { useRef } from 'react';
import styles from './index.less';
import { utils, ExtTable } from 'suid';
import { Button, Upload, Input } from 'antd';
import { Header, AutoSizeLayout } from '../../components';
import { useTableProps } from '../../utils/hooks';

const { Search } = Input;

const MAIN_KEY_PREFIX = 'ACCEPT_FYP_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = ``;
const DEVELOPER_ENV = process.env.NODE_ENV === 'development';
const COLUMNS = [];
const { authAction } = utils;

function AcceptFYPMain() {
  const [tableState, sets] = useTableProps();
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
  const tableRef = useRef(null);
  const tableProps = {
    store: {
      url: TABLE_DATASOURCE_QUERY_PATH,
      type: 'POST',
      params: {
        quickSearchProperties: ['docNumber', 'projectName'],
        sortOrders: [
          {
            property: 'createdDate',
            direction: 'DESC'
          }
        ],
        ...searchValue
      },
      selectedRowKeys,
      selectedRows,
      checkbox: {
        multiSelect: false
      },
      columns: COLUMNS
    },

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
          <Upload
            className={styles.btn}
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}IMPORT`}
          >
            <Button>导入</Button>
          </Upload>
        )
      }
      {
        authAction(
          <Button
            className={styles.btn}
            ignore={DEVELOPER_ENV}
            key={`${MAIN_KEY_PREFIX}EDITOR`}
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
    <Search onSearch={handleQuickSearch} />
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
    <div>
      <Header
        left={left}
        right={}
      />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              height={h}
              ref={tableRef}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
          )
        }
      </AutoSizeLayout>
    </div>
  )
}

export default AcceptFYPMain