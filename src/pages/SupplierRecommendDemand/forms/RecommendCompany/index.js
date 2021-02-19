import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { Button, message } from 'antd';
import { ExtTable, ExtModal, ComboList } from 'suid';
import { commonProps } from '../../../../utils';
import styles from './index.less';
import { baseUrl } from '../../../../utils/commonUrl';

const { corporationProps, thatTypeProps } = commonProps;
const columns = [
  {
    title: '采购组织名称',
    dataIndex: 'purchaseOrgName',
    width: 250
  },
  {
    title: '采购组织代码',
    dataIndex: 'purchaseOrgCode'
  },
  {
    title: '公司名称',
    dataIndex: 'corporationName'
  },
  {
    title: '公司代码',
    dataIndex: 'corporationCode'
  },
  {
    title: '业务单元名称',
    dataIndex: 'buName'
  },
  {
    title: '业务单元代码',
    dataIndex: 'buCode'
  },
]
const Ctx = forwardRef(({
  onContinue = () => null,
  onOk = () => null,
  initialDataSource = []
}, ref) => {
  useImperativeHandle(ref, () => ({
    cancel,
    show
  }))
  const [visible, setVisible] = useState(false)
  const [selectedRows, setRows] = useState([]);
  const [selectedRowKeys, setKeys] = useState([]);
  const [corporation, setCorporation] = useState({});
  const [thatType, setThatType] = useState(null);
  const tableRef = useRef(null);
  const tableProps = {
    store: {
      url: `${baseUrl}/api/buCompanyPurchasingOrganizationService/findBySearch`,
      params: {
        filters: [
          {
            fieldName: 'frozen',
            operator: 'EQ',
            value: false,
            fieldType: 'Boolean'
          },
          {
            fieldName: 'whetherDelete',
            operator: 'EQ',
            value: false,
            fieldType: 'Boolean'
          }
        ]
      },
      type: 'post'
    },
  }
  function cancel() {
    setCorporation({})
    setVisible(!visible)
  }
  function show() {
    setVisible(!visible)
  }
  // 更新列表数据
  function uploadTable() {
    // cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setKeys(rowKeys);
    setRows(rows);
  }
  // 查重并合并最新选择项
  function formatModalSelectedRows() {
    const ids = initialDataSource.map(item => `${item.purchaseOrgCode}-${item.corporationCode}`);
    const filterSelectedRows = selectedRows
      .filter(item => !ids.includes(`${item.purchaseOrgCode}-${item.corporationCode}`))
      .map(item => ({
        ...item,
        id: null,
        identifyTypeCode: thatType.value,
        identifyTypeName: thatType.name,
        purchaseOrgCode: item.purchaseOrgCode,
        purchaseOrgName: item.purchaseOrgName,
        corporationCode: item.corporationCode,
        corporationName: item.corporationName
      }))
    return [...filterSelectedRows, ...initialDataSource]
  }
  /**
   * 
   * corporationCode: "A000"
  corporationName: "广东长虹电子有限公司"
  display: null
  id: "7E7254C4-35FA-11EB-8021-0242C0A8441B"
  identifyTypeCode: "0001"
  identifyTypeName: "全新供应商"
  materialCategoryCode: null
  materialCategoryName: null
  purchaseOrgCode: "A000"
  purchaseOrgName: "广东长虹采购组织"
  recommendDemandId: "7B457E78-35FA-11EB-8021-0242C0A8441B"
  tenantCode: "10000028"
  unitCode: null
  unitName: null
  
  
  code: "A000"
  corporationCode: "A000"
  corporationName: "广东长虹电子有限公司"
  frozen: false
  id: "48F10491-878B-11EA-9385-0242C0A84405"
  name: "广东长虹采购组织"
  rank: 0
  tenantCode: "10000028"
  virtual: false
   */
  function handleContinue() {
    if (!thatType) {
      message.error('请选择认定类型')
      return
    }
    const s = formatModalSelectedRows();
    onContinue(s)
    setKeys([]);
    setRows([]);
    setThatType(null)
  }
  function handleOk() {
    if (!thatType) {
      message.error('请选择认定类型')
      return
    }
    const s = formatModalSelectedRows();
    onOk(s)
    cancel()
    setKeys([]);
    setRows([]);
    setThatType(null)
  }
  function handleThatTypeSelect(item) {
    setThatType(item)
  }
  return (
    <ExtModal
      visible={visible}
      title='选择拟推荐数据'
      destroyOnClose
      onCancel={cancel}
      width={'80vw'}
      bodyStyle={{
        height: '75vh',
        overflowY: 'scroll'
      }}
      centered
      footer={
        <>
          <Button onClick={handleContinue}>确定并继续</Button>
          <Button onClick={handleOk} type='primary'>确定</Button>
          <Button onClick={cancel}>取消</Button>
        </>
      }
    >
      <div className={styles.title}>
        认定类型
      </div>
      <ComboList value={thatType?.name} {...thatTypeProps} afterSelect={handleThatTypeSelect}></ComboList>
      <div className={styles.title}>
        选择采购组织
      </div>
      <ExtTable
        {...tableProps}
        columns={columns}
        ref={tableRef}
        checkbox={{ multiSelect: true }}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        rowKey={item => `${item.purchaseOrgCode}-${item.corporationCode}`}
      />
    </ExtModal>
  )
})

// const ForwardCtx = forwardRef(Ctx);

export default Ctx;