import styles from './index.less';
import { utils, ExtTable } from 'suid';
import { Button, Upload } from 'antd';
import { Header, AutoSizeLayout } from '../../components';
import { useTableProps } from '../../utils/hooks';

const MAIN_KEY_PREFIX = 'ACCEPT_FYP_MAIN_'
const TABLE_DATASOURCE_QUERY_PATH = '';
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { authAction } = utils;

function AcceptFYPMain() {
  const [tableState, sets] = useTableProps();
  const tableProps = {
    
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
  )
  return (
    <div>
      <Header
        left={left}
      />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              height={h}
            />
          )
        }
      </AutoSizeLayout>
    </div>
  )
}

export default AcceptFYPMain