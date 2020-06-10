import React, { useState, createRef, useLayoutEffect } from 'react';
import { ExtTable, DataImport, utils } from 'suid';
import { Button, Modal, message, Table } from 'antd'
import CommonForm from './CommonForm';
import { ComboAttachment, Upload } from '@/components';
// import { psBaseUrl } from '../../../utils/commonUrl';
import { getUserAccount, downloadBlobFile } from '../../../utils';
import { downloadExcelDataImportTemplate } from '../../../services/strategy';
import styles from './index.less';
const importColumns = [
  {
    title: '物料分类',
    dataIndex: 'materialClassificationName'
  },
  {
    title: '预计需求规模(数量)',
    dataIndex: 'expectedDemandScaleAmount'
  },
  {
    title: '预计需求规模(数量)',
    dataIndex: 'expectedDemandScalePrice'
  },
  {
    title: '适应范围',
    dataIndex: 'adjustScope'
  },
  {
    title: '采购方式',
    dataIndex: 'purchaseTypeName'
  },
  {
    title: '规划供应资源类型名称',
    dataIndex: 'planSupplyResourceTypeName'
  },
  {
    title: '价格组成',
    dataIndex: 'priceCombineName'
  },
  {
    title: '定价频次',
    dataIndex: 'pricingFrequencyName'
  },
  {
    title: '定价时间',
    dataIndex: 'pricingTime'
  },
  {
    title: '市场运行情况',
    dataIndex: 'runningOperation'
  },
  {
    title: '资源保障情况',
    dataIndex: 'resourceOperation'
  },
  {
    title: '成本目标',
    dataIndex: 'costTarget'
  },
  {
    title: '成本控制方式',
    dataIndex: 'costControlWay'
  },
  {
    title: '库存控制方式',
    dataIndex: 'storageControlWay'
  },
  {
    title: '供应商选择原则',
    dataIndex: 'supplierSelectRule'
  },
  {
    title: '供应商合作方式',
    dataIndex: 'supplierCooperationWay'
  },
  {
    title: '备注',
    dataIndex: 'remark'
  }
]
function StrategyTable({
  loading = false,
  dataSource = [],
  onCreateLine = () => null,
  onRemove = () => null,
  onEditor = () => null,
  onImportData = () => null,
  onInvalidChange = () => null,
  type = 'add',
  headerForm = {}
}) {
  const commonFormRef = createRef();
  const [selectedRowKeys,
    setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState(1);
  const [showAttach, triggerShowAttach] = useState(false);
  const [attachId, setAttachId] = useState('')
  const [levelCode, setLevelCode] = useState('');
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState('add');
  const disableEditor = selectedRowKeys.length !== 1;
  const disableRemove = selectedRowKeys.length === 0;
  const [single = {}] = selectedRows;
  const { changeable = true, id: singleRowId } = single;
  const [count, setCount] = useState(0);
  const columns = [
    {
      title: '物料分类',
      dataIndex: 'materialClassificationName'
    },
    {
      title: '预计需求规模（数量）',
      dataIndex: 'expectedDemandScaleAmount'
    },
    {
      title: '预计需求规模（万元）',
      dataIndex: 'expectedDemandScalePrice'
    },
    {
      title: '适应范围',
      dataIndex: 'adjustScopeList',
      render(text = []) {
        return (
          <Button type='link' onClick={()=>checkAdjustScopeList(text)}>
            查看
          </Button>
        )
      }
    },
    {
      title: '采购方式',
      dataIndex: 'purchaseTypeName'
    },
    {
      title: '规划供应资源名称',
      dataIndex: 'planSupplyResourceTypeName',
      width: 150
    },
    {
      title: '规划供应资源数量',
      dataIndex: 'planSupplyResourceTypeAmount',
      width: 150
    },
    {
      title: '价格组成',
      dataIndex: 'priceCombineName'
    },
    {
      title: '定价频次',
      dataIndex: 'pricingFrequencyName'
    },
    {
      title: '定价时间',
      dataIndex: 'pricingDateList',
      render(text) {
        return text.map(item => item.date).join('；')
      }
    },
    {
      title: '市场运行情况',
      dataIndex: 'runningOperation'
    },
    {
      title: '资源保障情况',
      dataIndex: 'resourceOperation'
    },
    {
      title: '成本目标',
      dataIndex: 'costTargetName'
    },
    {
      title: '成本目标说明',
      dataIndex: 'costTargetRemark',
      render(costTargetRemark,{ costTarget }) {
        if(!costTargetRemark) {
          return ""
        }
        const suffix = costTarget === 'DropRatio' ? '%' : '万元';
        return `${costTargetRemark}${suffix}`
      }
    },
    {
      title: '成本控制方式',
      dataIndex: 'costControlWay'
    },
    {
      title: '库存控制方式',
      dataIndex: 'storageControlWay'
    },
    {
      title: '供应商选择原则',
      dataIndex: 'supplierSelectRule'
    },
    {
      title: '供应商合作方式',
      dataIndex: 'supplierCooperationWay'
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      render: (text) => {
        return !!text ? <Upload entityId={text} type='show'/> : '无'
        return <Button onClick={() => {
          setAttachId(text)
          triggerShowAttach(true)
        }}>查看附件</Button>
      }
    },
    {
      title: '备注',
      dataIndex: 'remark'
    }
  ].map(item => ({ ...item, align: 'center' }));
  const changeColumns = [
    {
      title: '是否作废',
      dataIndex: 'invalid',
      render(text) {
        return text ? '是' : '否'
      },
      align: 'center'
    },
    ...columns
  ]
  useLayoutEffect(() => {
    if (dataSource.length === 0) {
      cleanSelectedRecord()
    }
  }, [dataSource])
  // 记录列表选中
  function handleSelectedRows(rowKeys, rowItems) {
    setRowKeys(rowKeys)
    const rows = dataSource.filter(i => {
      return rowKeys.findIndex(find => i.localId === find) !== -1
    })
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    setRows([])
  }
  // 显示新增编辑modal
  function showModal(t = 'add') {
    const { getFieldValue } = headerForm.current.form;
    const lc = getFieldValue('materialLevelCode');
    if(!lc) {
      message.error('请先选择物料级别')
      return
    }
    setLevelCode(lc);
    const len = dataSource.length;
    if (t === 'add') {
      setLine(len + 1)
    }
    if (t === 'editor') {
      const [v] = selectedRowKeys;
      const [row] = selectedRows;
      const currentIndex = dataSource.findIndex(item => item.localId === v);
      setLine(currentIndex + 1)
      setInitialValue({ ...row })
    }
    setVisible(true)
    setModalType(t)
  }
  function hideModal() {
    setVisible(false)
    setInitialValue({})
  }
  // 取消编辑或新增
  function handleCancel() {
    const { resetFields } = commonFormRef.current.form;
    resetFields()
    hideModal()
  }
  // 查看适应范围
  function checkAdjustScopeList(list) {
    const columns = [
      {
        title: '公司代码',
        dataIndex: 'code'
      },
      {
        title: '公司名称',
        dataIndex: 'name'
      }
    ]
    Modal.info({
      title: '适应范围',
      content: <Table size='small' bordered columns={columns} dataSource={list} rowKey={({ id })=> id}/>,
      icon: 'exception',
      okText: '关闭',
      width: '60vw',
      centered: true
    })
  }
  function handleSubmit(val) {
    const { resetFields } = commonFormRef.current.form;
    if (modalType === 'add') {
      onCreateLine(val, ()=>{
        hideModal()
        resetFields()
      })
      cleanSelectedRecord()
      return
    }
    onEditor(val, selectedRowKeys, ()=>{
      hideModal()
      resetFields()
    })
    cleanSelectedRecord()
  }
  function handleLineInvalidChange() {
    onInvalidChange({ ids: selectedRowKeys })
  }
  // 处理删除行
  function handleRemove() {
    Modal.confirm({
      title: '删除标的物',
      content: '是否删除当前选择标的物?',
      onOk: () => {
        onRemove(selectedRowKeys, selectedRows)
        cleanSelectedRecord()
      },
      okText: '删除',
      cancelText: '取消'
    })
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  function importDataValidate(column) {
    const {
      materialClassificationName,
      expectedDemandScaleAmount,
      expectedDemandScalePrice,
      adjustScope,
      purchaseTypeName,
      planSupplyResourceTypeName,
      priceCombineName,
      pricingFrequencyName,
      pricingTime,
      runningOperation,
      resourceOperation,
      costTarget,
      costControlWay,
      storageControlWay,
      supplierSelectRule,
      supplierCooperationWay
    } = column;
    const timeDisabled = pricingFrequencyName === '按单' || pricingFrequencyName === '按需';
    const error = {
      validate: false,
      status: '不通过',
      statusCode: 'error'
    }
    if (!materialClassificationName) {
      return {
        ...error,
        ...column,
        message: '未填写物料二次分类'
      }
    }
    if (!expectedDemandScaleAmount) {
      return {
        ...error,
        ...column,
        message: '未填写预计需求数量'
      }
    }
    if (!expectedDemandScalePrice) {
      return {
        ...error,
        ...column,
        message: '未填写预计需求规模'
      }
    }
    if (!adjustScope) {
      return {
        ...error,
        ...column,
        message: '未填写适应范围'
      }
    }
    if (!purchaseTypeName) {
      return {
        ...error,
        ...column,
        message: '未填写采购方式'
      }
    }
    if (!planSupplyResourceTypeName) {
      return {
        ...error,
        ...column,
        message: '未填写规划供应资源类型名称'
      }
    }
    if (!priceCombineName) {
      return {
        ...error,
        ...column,
        message: '未填写价格组成'
      }
    }
    if (!pricingFrequencyName) {
      return {
        ...error,
        ...column,
        message: '未填写定价频次'
      }
    }
    if (!timeDisabled && !pricingTime) {
      return {
        ...error,
        ...column,
        message: '未填写定价时间'
      }
    }
    if (!costTarget) {
      return {
        ...error,
        ...column,
        message: '未填写成本目标'
      }
    }
    if (!supplierSelectRule) {
      return {
        ...error,
        ...column,
        message: '未填写供应商选择原则'
      }
    }
    if (!supplierCooperationWay) {
      return {
        ...error,
        ...column,
        message: '未填写供应商合作方式'
      }
    }
    return {
      validate: true,
      status: '数据完整',
      statusCode: 'success',
      message: '表单填写完整',
      ...column
    }
  }
  const left = type !== 'detail' && (
    <>
      <Button type='primary' className={styles.btn} onClick={() => showModal()}>新增</Button>
      <Button className={styles.btn} onClick={() => showModal('editor')} disabled={disableEditor}>编辑</Button>
      <Button className={styles.btn} disabled={disableRemove || !changeable} onClick={handleRemove}>删除</Button>
      {
        type === 'change' ?
          <Button className={styles.btn} onClick={handleLineInvalidChange} disabled={disableRemove || !singleRowId}>作废/取消作废</Button> : null
      }
      <div style={{ display: 'inline-block' }}>
        <DataImport
          key={`data-import-${count}`}
          templateFileList={[
            {
              download: async () => {
                const useAccount = getUserAccount();
                message.loading()
                const { success, data, message: msg } = await downloadExcelDataImportTemplate({ useAccount })
                message.destroy()
                if (success) {
                  downloadBlobFile(data, '采购策略批量上传模板.xlsx')
                  message.success('下载成功')
                  return
                }
                message.error(msg)
              },
              fileName: '采购策略批量上传模板.xlsx',
              key: 'contract',
            },
          ]}
          uploadBtnText='批量导入'
          validateAll={false}
          tableProps={{
            columns: importColumns
          }}
          validateFunc={(item) => {
            return item.map(importDataValidate)
          }}
          importFunc={(item) => {
            onImportData(item);
            setCount(count + 1)
          }}
        >
        </DataImport>
      </div>
    </>
  )
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>标的物</div>
      <div className={styles.content}>
        <ExtTable
          toolBar={{
            left: left
          }}
          allowCancelSelect
          columns={type === 'change' ? changeColumns : columns}
          loading={loading}
          showSearch={true}
          searchPlaceHolder='请输入物料分类查询'
          searchProperties={['materialClassificationName']}
          dataSource={dataSource}
          rowKey={(item) => `${item.localId}`}
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectedRowKeys}
          checkbox={
            type !== 'detail' ? { multiSelect: false } : false
          }
        />
      </div>
      <CommonForm
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        type={modalType}
        mode={type}
        initialValues={initialValue}
        lineNumber={line}
        wrappedComponentRef={commonFormRef}
        loading={loading}
        levelCode={levelCode}
        destroyOnClose
      />
      <Modal
        visible={showAttach}
        onCancel={hideAttach}
        footer={
          <Button type='ghost' onClick={hideAttach}>关闭</Button>
        }
      >
        <ComboAttachment
          allowPreview={false}
          allowDelete={false}
          showViewType={false}
          uploadButton={{
            disabled: true
          }}
          multiple={false}
          attachment={attachId}
          customBatchDownloadFileName={true}
        />
      </Modal>
    </div>
  )
}

export default StrategyTable;
