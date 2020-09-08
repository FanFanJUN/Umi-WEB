import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { Button, message } from 'antd';
import { ExtTable, ExtModal, ComboList } from 'suid';
import { Header } from '../../../../components'
import { commonProps } from '../../../../utils';
import styles from './index.less';
import { smBaseUrl, baseUrl } from '../../../../utils/commonUrl';

const { corporationProps, thatTypeProps } = commonProps;
const columns = [
  {
    title: '采购组织代码',
    dataIndex: 'code'
  },
  {
    title: '采购组织名称',
    dataIndex: 'name'
  }
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
      url: `${baseUrl}/corporationPurchaseOrg/findPurOrgsByCorpCode?corpCode=${corporation?.code}`,
      params: {
        corpCode: corporation?.code
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
    const ids = initialDataSource.map(item => `${item.code}-${item.corporationCode}`);
    const filterSelectedRows = selectedRows
      .filter(item => !ids.includes(`${item.code}-${item.corporationCode}`))
      .map(item => ({
        ...item,
        id: null,
        identifyTypeCode: thatType.value,
        identifyTypeName: thatType.name,
        purchaseOrgCode: item.code,
        purchaseOrgName: item.name
      }))
    return [...filterSelectedRows, ...initialDataSource]
  }

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
          <Button onClick={handleOk}>确定</Button>
          <Button onClick={cancel}>取消</Button>
        </>
      }
    >
      <div className={styles.title}>
        选择公司
      </div>
      <ComboList
        {...corporationProps}
        style={{ width: '300px' }}
        afterSelect={(item) => {
          setCorporation({ ...item })
          uploadTable()
        }}
        value={corporation?.name}
        placeholder='选择公司'
      />
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
        rowKey={item => `${item.code}-${item.corporationCode}`}
      />
      <div className={styles.title}>
        认定类型
      </div>
      <ComboList value={thatType?.name} {...thatTypeProps} afterSelect={handleThatTypeSelect}></ComboList>
    </ExtModal>
  )
})

// const ForwardCtx = forwardRef(Ctx);

export default Ctx;