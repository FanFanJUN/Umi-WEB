import {
  useState,
  useImperativeHandle,
  forwardRef,
  useRef
} from 'react';
import { Button, message, Form, Radio } from 'antd';
import { ExtTable, ExtModal, ComboList, utils } from 'suid';
import { commonProps, commonUrl } from '../../utils';
import styles from './SelectRecommendData.less';
const { getUUID } = utils;
const { baseUrl } = commonUrl;
const {
  corporationProps,
  thatTypeProps
} = commonProps;
const { create, Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;
const columns = [
  {
    title: '采购组织代码',
    dataIndex: 'code'
  },
  {
    title: '采购组织名称',
    dataIndex: 'name',
    width: 200
  }
]
const Ctx = forwardRef(({
  onOk = () => null,
  initialDataSource = [],
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    cancel,
    show
  }))
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
    getFieldsValue
  } = form;
  const [visible, setVisible] = useState(false)
  const [selectedRows, setRows] = useState([]);
  const [selectedRowKeys, setKeys] = useState([]);
  const [corporation, setCorporation] = useState({});
  const tableRef = useRef(null);
  const allowTrust = initialDataSource.some(item=> item.objectRecognition);
  const {
    objectRecognition
  } = getFieldsValue();
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
  function formatModalSelectedRows(values) {
    const {
      identifyTypeCode,
      identifyTypeName,
      trust,
      objectRecognition,
      corporationCode,
      corporationName
    } = values;
    const ids = initialDataSource.map(item => `${item.purchaseOrgCode}-${item.corporationCode}`);
    const filterSelectedRows = selectedRows
      .filter(item => !ids.includes(`${item.code}-${item.corporationCode}`))
      .map(item => ({
        ...item,
        id: null,
        identifyTypeCode,
        identifyTypeName,
        corporationCode,
        corporationName,
        purchaseOrgCode: item.code,
        purchaseOrgName: item.name,
        trust,
        objectRecognition,
        guid: getUUID()
      }))
    return [
      ...filterSelectedRows,
      ...initialDataSource,
    ]
  }
  async function handleOk() {
    const values = await validateFieldsAndScroll()
    const s = formatModalSelectedRows(values);
    onOk(s)
    cancel()
    setKeys([]);
    setRows([]);
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
          <Button onClick={handleOk} type='primary'>确定</Button>
          <Button onClick={cancel}>取消</Button>
        </>
      }
    >
      <Form>
        <FormItem
          label={
            <span className={styles.title}>选择公司</span>
          }
          colon={false}
        >
          {
            getFieldDecorator('corporationCode'),
            getFieldDecorator('corporationName', {
              rules: [
                {
                  required: true,
                  message: '公司不能为空'
                }
              ]
            })(
              <ComboList
                {...corporationProps}
                style={{ width: '300px' }}
                afterSelect={async (item) => {
                  await setCorporation({ ...item })
                  uploadTable()
                }}
                name='corporationName'
                field={['corporationCode']}
                form={form}
                placeholder='选择公司'
              />
            )
          }
        </FormItem>
        <div className={styles.title}>选择采购组织</div>
        <ExtTable
          {...tableProps}
          columns={columns}
          ref={tableRef}
          checkbox={{ multiSelect: true }}
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectedRowKeys}
          rowKey={item => `${item.code}-${item.corporationCode}`}
        />
        <FormItem
          label={
            <span className={styles.title}>认定类型</span>
          }
          colon={false}
        >
          {
            getFieldDecorator('identifyTypeCode'),
            getFieldDecorator('identifyTypeName', {
              rules: [
                {
                  required: true,
                  message: '请选择认定类型'
                }
              ]
            })(
              <ComboList
                {...thatTypeProps}
                reader={{
                  ...thatTypeProps.reader,
                  field: ['value']
                }}
                form={form}
                name='identifyTypeName'
                field={['identifyTypeCode']}
              ></ComboList>
            )
          }
        </FormItem>
        <FormItem
          label={<span className={styles.title}>是否实物认定</span>}
          colon={false}
        >
          {
            getFieldDecorator('objectRecognition', {
              rules: [
                {
                  required: true,
                  message: '请选择是否实物认定'
                }
              ]
            })(
              <RadioGroup>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        {
          typeof objectRecognition === 'boolean' && !objectRecognition ?
            <FormItem
              label={<span className={styles.title}>是否信任</span>}
              colon={false}
            >
              {
                getFieldDecorator('trust', {
                  rules: [
                    {
                      required: allowTrust,
                      message: '请选择是否信任'
                    }
                  ]
                })(
                  <RadioGroup disabled={!allowTrust}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </RadioGroup>
                )
              }
            </FormItem> : null
        }
      </Form>
    </ExtModal>
  )
})

const FormWrapper = create()(Ctx)

export default FormWrapper;