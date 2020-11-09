/**
 * 实现功能： 评定等级主数据
 * @author hezhi
 * @date 2020-09-23
 */
import { useEffect, useRef, useState } from 'react';
import styles from './index.less';
import { useTableProps } from '../../utils/hooks';
import { ExtTable, utils } from 'suid';
import { Button, message, Modal } from 'antd';
import { Header, AutoSizeLayout } from '../../components';
import CommonForm from './Form';
import { queryEvaluateLevelMain, saveEvaluateLevelMain, removeEvaluateLevelMain } from '../../services/evaluate';

const { authAction } = utils;
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
function EvaluateLevelMain() {
  const [tableState, sets] = useTableProps();
  const [type, setType] = useState('create');
  const tableRef = useRef(null);
  const formRef = useRef(null);
  const {
    selectedRowKeys,
    selectedRows,
    dataSource,
    loading
  } = tableState;
  const {
    setRowKeys,
    handleSelectedRows,
    setDataSource,
    toggleLoading
  } = sets;
  const [singleRow = {}] = selectedRows;
  const empty = selectedRowKeys.length === 0;
  const columns = [
    {
      title: '开始区间计算符',
      dataIndex: 'markStartCalsign'
    },
    {
      title: '开始区间',
      dataIndex: 'markStart'
    },
    {
      title: '结束区间计算符',
      dataIndex: 'markEndCalsign'
    },
    {
      title: '结束区间',
      dataIndex: 'markEnd'
    },
    {
      title: '评价等级',
      dataIndex: 'level'
    },
    {
      title: '处理建议',
      dataIndex: 'dealAdviceName'
    },
    {
      title: '排序码',
      dataIndex: 'rank'
    }
  ];
  const left = (
    <>
      {
        authAction(
          <Button
            ignore={DEVELOPER_ENV}
            key='EVALUATE_LEVEL_CREATE'
            className={styles.btn}
            onClick={handleShowCreate}
          >新增</Button>
        )
      }
      {
        authAction(
          <Button
            ignore={DEVELOPER_ENV}
            key='EVALUATE_LEVEL_EDITOR'
            className={styles.btn}
            disabled={empty}
            onClick={handleShowEditor}
          >编辑</Button>
        )
      }
      {
        authAction(
          <Button
            ignore={DEVELOPER_ENV}
            key='EVALUATE_LEVEL_REMOVE'
            className={styles.btn}
            disabled={empty}
            onClick={handleRemove}
          >删除</Button>
        )
      }
    </>
  );
  function handleShowCreate() {
    setType('create')
    formRef.current.show()
  }
  function handleShowEditor() {
    setType('editor')
    formRef.current.show();
    formRef.current.setFieldsValue({ ...singleRow })
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  async function handleSave(values, sl) {
    sl(true)
    const { success, message: msg, data } = await saveEvaluateLevelMain(values)
    sl(false)
    if (success) {
      message.success(msg)
      formRef.current.hide()
      cleanSelectedRecord()
      initialDatasource()
      return
    }
    message.error(msg)
  }
  function handleRemove() {
    Modal.confirm({
      title: '删除当前项',
      content: '是否删除当前所选项?',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const [id] = selectedRowKeys;
        const { success, message: msg } = await removeEvaluateLevelMain({ id })
        if (success) {
          cleanSelectedRecord()
          initialDatasource()
          message.success(msg)
          return
        }
        message.error(msg)
      }
    })
  }
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
              bordered
              height={h}
              columns={columns}
              loading={loading}
              showSearch={false}
              dataSource={dataSource}
              checkbox={{
                multiSelect: false
              }}
              rowKey={item => item?.id}
              ref={tableRef}
              allowCancelSelect
              onSelectRow={handleSelectedRows}
              selectedRowKeys={selectedRowKeys}
            />
          )
        }
      </AutoSizeLayout>
      <CommonForm
        wrappedComponentRef={formRef}
        type={type}
        onOk={handleSave}
        dataSource={dataSource}
      />
    </div>
  )
}

export default EvaluateLevelMain