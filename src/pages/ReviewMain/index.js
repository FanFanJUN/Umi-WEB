/**
 * 实现功能：评审人配置主数据
 * @author hezhi
 * @date 2020-09-23
 */

import { useState, useRef } from 'react';
import styles from './index.less';
import { useTableProps } from '../../utils/hooks';
import { ExtTable, DataImport, utils } from 'suid';
import { Button, message, Spin, Modal, Input } from 'antd';
import { Header, AutoSizeLayout } from '../../components';
import { donwloadExcelDataImportTemplate, checkExCelData, saveExcelData, removeData, exportData } from '../../services/reviewMain';
import { downloadBlobFile } from '../../utils';
import { recommendUrl } from '../../utils/commonUrl';
const { Search } = Input;
const { authAction } = utils;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
function ReviewMain() {
  const [state, sets] = useTableProps();
  const [count, setCount] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const tableRef = useRef(null);
  const headerRef = useRef(null);
  const {
    selectedRowKeys,
    // selectedRows,
    searchValue,
  } = state;
  const {
    setSearchValue,
    handleSelectedRows,
    setRowKeys
  } = sets;
  const empty = selectedRowKeys.length === 0;
  const columns = [
    {
      title: '指标代码',
      dataIndex: 'ruleCode'
    },
    {
      title: '指标名称',
      dataIndex: 'ruleName',
      width: 150
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
      title: '评审人员工编号',
      dataIndex: 'scorerCode'
    },
    {
      title: '评审人员工名称',
      dataIndex: 'scorerName'
    },
    {
      title: '排序',
      dataIndex: 'rank'
    }
  ];
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/scorerConfigService/findByPage`,
      params: {
        ...searchValue,
        quickSearchProperties: ['ruleCode', 'ruleName'],
        sortOrders: [
          {
            property: 'rank',
            direction: 'DESC'
          }
        ]
      },
      type: 'POST'
    },
    remotePaging: true,
    columns: columns,
    selectedRowKeys: selectedRowKeys,
    ellipsis: false,
    size: 'small',
    allowCancelSelect: true,
    rowKey: item => item.id,
    showSearch: false,
    checkbox: { multiSelect: true },
    ref: tableRef
  }
  const left = (
    <>
      {
        authAction(
          <Button
            key='REVIEW_MAIN_EXPORT'
            ignore={DEVELOPER_ENV}
            onClick={handleExport}
            className={styles.btn}
          >导出</Button>
        )
      }
      {
        authAction(
          <DataImport
            key='REVIEW_MAIN_IMPORT'
            ignore={DEVELOPER_ENV}
            templateFileList={[
              {
                download: async () => {
                  message.loading()
                  const { success, data, message: msg } = await donwloadExcelDataImportTemplate();
                  message.destroy()
                  if (success) {
                    downloadBlobFile(data, '评审人配置批量上传模板.xlsx')
                    message.success('下载成功')
                    return
                  }
                  message.error(msg)
                },
                fileName: '评审人配置批量上传模板.xlsx',
                key: 'contract'
              }
            ]}
            uploadBtnText='导入'
            validateAll={false}
            tableProps={{
              columns: columns
            }}
            validateFunc={validateFunc}
            importFunc={importFunc}
          />
        )
      }
      {
        authAction(
          <Button
            onClick={handleRemove}
            className={styles.btn}
            disabled={empty}
            key='REVIEW_MAIN_REMOVE'
            ignore={DEVELOPER_ENV}
          >删除</Button>
        )
      }
    </>
  );
  const right = (
    <>
      <Search
        placeholder='请输入指标代码或名称查询'
        className={styles.btn}
        onSearch={handleQuickSerach}
        allowClear
      />
    </>
  )
  async function validateFunc(item) {
    setSpinning(true)
    const { success, data, message: msg } = await checkExCelData(item)
    setSpinning(false)
    const formatData = data.map((item, index) => ({ ...item, key: `${index}-validate` }))
    return new Promise(resolve => {
      resolve(formatData)
    })
  }
  async function importFunc(item) {
    setSpinning(true)
    const { success, message: msg, data } = await saveExcelData(item);
    setSpinning(false)
    if (success) {
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
    setCount(count + 1)
  }
  // 快速搜索
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  function handleExport() {
    Modal.confirm({
      title: '配置导出',
      content: '确认导出当前查询到的配置数据？',
      onOk: async () => {
        const { data, success, message: msg } = await exportData(searchValue);
        if (success) {
          downloadBlobFile(data, '评审人配置.xlsx')
          message.success(msg)
          return
        }
        message.error(msg)
      },
      okText: '导出',
      cancelText: '取消'
    })
  }
  async function handleRemove() {
    Modal.confirm({
      title: '删除评审人配置',
      content: '确定删除当前选中的评审人配置？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await removeData(selectedRowKeys);
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    tableRef.current.manualSelectedRows([])
  }
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  return (
    <div>
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
                {...tableProps}
                onSelectRow={handleSelectedRows}
                height={h}
              />
            )
          }
        </AutoSizeLayout>
      </Spin>
    </div>
  )
}

export default ReviewMain