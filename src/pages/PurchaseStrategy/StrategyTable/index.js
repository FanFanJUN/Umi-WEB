import React, { useState, createRef } from 'react';
import { ExtTable, DataImport, utils } from 'suid';
import { Button, Modal } from 'antd'
import CommonForm from './CommonForm';
import { psBaseUrl } from '../../../utils/commonUrl';
import styles from './index.less';
function StrategyTable({
  loading = false,
  dataSource = [],
  onCreateLine = () => null,
  onRemove = () => null,
  onEditor = () => null,
  type = 'add'
}) {
  const commonFormRef = createRef();
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [line, setLine] = useState(1);
  // const [showAttach, triggerShowAttach] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState("add");
  const disableEditor = selectedRowKeys.length !== 1;
  const disableRemove = selectedRowKeys.length === 0;
  const columns = [
    {
      title: '物料分类',
      dataIndex: 'materialClassificationName'
    }, {
      title: '预计需求规模（数量）',
      dataIndex: 'expectedDemandScaleAmount'
    }, {
      title: '预计需求规模（万元）',
      dataIndex: 'expectedDemandScalePrice'
    }, {
      title: '适应范围',
      dataIndex: 'adjustScopeList',
      render(text=[]) {
        return text.map(item=>item.name).join("，")
      }
    }, {
      title: '采购方式',
      dataIndex: 'purchaseTypeName'
    }, {
      title: '规划供应资源数量',
      dataIndex: 'planSupplyResourceAmountName',
      width: 150
    }, {
      title: '价格组成',
      dataIndex: 'priceCombineName'
    }, {
      title: '定价频次',
      dataIndex: 'pricingFrequencyName'
    }, {
      title: '定价时间',
      dataIndex: 'pricingDateList',
      render(text){
        return text.map(item=>item.date).join('；')
      }
    }, {
      title: '市场运行情况',
      dataIndex: 'runningOperation'
    }, {
      title: '资源保障情况',
      dataIndex: 'resourceOperation'
    }, {
      title: '成本目标',
      dataIndex: 'costTargetName'
    }, {
      title: '成本控制方式',
      dataIndex: 'costControlWay'
    }, {
      title: '库存控制方式',
      dataIndex: 'storageControlWay'
    }, {
      title: '供应商选择原则',
      dataIndex: 'supplierSelectRule'
    }, {
      title: '供应商合作方式',
      dataIndex: 'supplierCooperationWay'
    }, {
      title: '附件',
      dataIndex: ''
    }, {
      title: '备注',
      dataIndex: 'remark'
    }
  ].map(item => ({ ...item, align: 'center' }));
  // 记录列表选中
  function handleSelectedRows(rowKeys) {
    setRowKeys(rowKeys)
    const rows = dataSource.filter(i=>{
      return rowKeys.findIndex(find=>i.localId === find) !== -1
    })
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    setRows([])
  }
  // 显示新增编辑modal
  function showModal(t = "add") {
    const len = dataSource.length;
    if (t === 'add') {
      setLine(len + 1)
    }
    if (t === 'editor') {
      const [v] = selectedRowKeys;
      const [row] = selectedRows;
      const currentIndex = dataSource.findIndex(item => item.localId === v);
      setLine(currentIndex + 1)
      setInitialValue({...row})
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
    hideModal()
  }
  function handleSubmit(val) {
    if (modalType === 'add') {
      onCreateLine(val, hideModal)
      cleanSelectedRecord()
      return
    }
    onEditor(val, selectedRowKeys, hideModal)
    cleanSelectedRecord()
  }
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
  const left = type !== 'detail' && (
    <>
      <Button type='primary' className={styles.btn} onClick={()=>showModal()}>新增</Button>
      <Button className={styles.btn} onClick={() => showModal('editor')} disabled={disableEditor}>编辑</Button>
      <Button className={styles.btn} disabled={disableRemove} onClick={handleRemove}>删除</Button>
      <div style={{ display: 'inline-block' }}>
        <DataImport templateFileList={[
          {
            download: ()=> {
              utils.downloadFileByALink(`http://10.8.4.102:8088/${psBaseUrl}/purchaseStrategyDetail/downloadTemplate`)
            },
            // download: `/${psBaseUrl}/purchaseStrategyDetail/downloadTemplate`,
            fileName: '采购策略批量上传模板.xlsx',
            key: 'contract',
          },
        ]} columns={columns} uploadBtn={<Button>批量导入</Button>}></DataImport>
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
          columns={columns}
          loading={loading}
          showSearch={true}
          searchPlaceHolder='请输入物料分类查询'
          searchProperties={['materialClassificationName']}
          dataSource={dataSource}
          rowKey={(item) => `${item.localId}`}
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectedRowKeys}
          checkbox={type!=='detail'}
        />
      </div>
      <CommonForm
        visible={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        type={modalType}
        initialValues={initialValue}
        lineNumber={line}
        wrappedComponentRef={commonFormRef}
        loading={loading}
      />
      {/* <Modal visible={showAttach}>
        
      </Modal> */}
    </div>
  )
}

export default StrategyTable;