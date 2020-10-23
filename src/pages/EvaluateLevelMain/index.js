/**
 * 实现功能： 评定等级主数据
 * @author hezhi
 * @date 2020-09-23
 */
import { useEffect } from 'react';
import styles from './index.less';
import { useTableProps } from '../../utils/hooks';
import { ExtTable } from 'suid';
import { Button, message } from 'antd';
import { Header, AutoSizeLayout } from '../../components';
import CommonForm from './Form';
import { queryEvaluateLevelMain } from '../../services/evaluate';

function EvaluateLevelMain() {
  const [tableState, sets] = useTableProps()
  const {
    selectedRowKeys,
    selectedRows,
    dataSource,
    loading
  } = tableState;
  const {
    setRows,
    setRowKeys,
    handleSelectedRows,
    setDataSource,
    toggleLoading
  } = sets;
  const columns = [];
  const left = (
    <>
      <Button className={styles.btn}>新增</Button>
      <Button className={styles.btn}>编辑</Button>
      <Button className={styles.btn}>删除</Button>
    </>
  );
  async function initialDatasource() {
    toggleLoading(true)
    const { data, success, message: msg } = await queryEvaluateLevelMain();
    toggleLoading(false)
    if (success) {
      setDataSource(data)
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    initialDatasource()
  }, [])
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
              columns={columns}
              loading={loading}
              showSearch={false}
              dataSource={dataSource}
              onSelectRow={handleSelectedRows}
              selectedRowKeys={selectedRowKeys}
            />
          )
        }
      </AutoSizeLayout>
      <CommonForm />
    </div>
  )
}

export default EvaluateLevelMain