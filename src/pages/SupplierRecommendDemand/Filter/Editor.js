import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from 'react';
import { Form, Modal, Row, Col, Input, Radio } from 'antd';
import styles from './Editor.less';
import { ComboGrid } from 'suid';
import { DELAY } from '../../../utils';

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};
const formLayoutAlone = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
}
const Box = ({ value }) => <div>{value}</div>;
const VerdictBox = ({ value, trueText = '是', falseText = '否' }) => <div>{value ? trueText : falseText}</div>

const Editor = forwardRef(({
  form,
  setTableDataSource = () => null
}, ref) => {
  const [visible, toggleVisible] = useState(false);
  const [cacheFields, setCacheFields] = useState({})
  const [trustInfos, setTrustInfos] = useState([]);
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))
  const trustInfoProps = {
    dataSource: trustInfos,
    columns: [
      {
        title: '供应商',
        dataIndex: 'supplierName',
        width: 120
      },
      {
        title: '原厂',
        dataIndex: 'originFactoryName',
        width: 100
      },
      {
        title: '公司',
        dataIndex: 'corporationCode',
        width: 80
      },
      {
        title: '采购组织',
        dataIndex: 'purchaseOrgCode',
        width: 80
      },
      {
        title: '拟推荐',
        dataIndex: 'recommend',
        render(text) {
          return text ? '是' : '否'
        },
        align: 'center',
        width: 100
      },
      {
        title: '是否实物认定',
        dataIndex: 'objectRecognition',
        render(text) {
          return text ? '是' : '否'
        },
        align: 'center',
        width: 150
      },
    ],
    reader: {
      name: item => `${item.corporationCode}-${item.purchaseOrgCode}`,
      field: ['corporationCode', 'corporationName', 'purchaseOrgCode', 'purchaseOrgName']
    },
    style: {
      width: '100%'
    },
    form,
    field: ['trustCorporationCode', 'trustCorporationName', 'trustPurchaseOrgCode', 'trustPurchaseOrgName']
  }
  const {
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll,
    getFieldsValue
  } = form;
  const { recommend, recommendConfirm } = getFieldsValue();
  async function show(fields, ts) {
    const { recommendConfirm, ...cacheFieldsValues } = fields;
    toggleVisible(true)
    await DELAY(200)
    setTrustInfos(ts)
    setFieldsValue(fields)
    setCacheFields(cacheFieldsValues)
  }
  function hide() {
    toggleVisible(false)
  }
  async function handleOk() {
    const values = await validateFieldsAndScroll()
    hide()
    setTableDataSource(values)
  }
  function handleRecommendConfirmChange() {
    console.log()
  }
  useEffect(() => {
    setFieldsValue({ ...cacheFields, selectRecommendInfomation: `${cacheFields.corporationCode}-${cacheFields.purchaseOrgCode}` })
  }, [cacheFields])
  return (
    <Modal
      visible={visible}
      onCancel={hide}
      destroyOnClose
      centered
      forceRender={true}
      onOk={handleOk}
      title='意见筛选编辑'
      width='80vw'
      bodyStyle={{
        height: '70vh',
        overflowY: 'scroll'
      }}
    >
      <Form>
        {
          getFieldDecorator('id')
        }
        <Row gutter={[12, 24]}>
          <Col span={12}>
            <Form.Item label='公司' {...formLayout}>
              {
                getFieldDecorator('corporationName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='采购组织' {...formLayout}>
              {
                getFieldDecorator('purchaseOrgName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='物料分类' {...formLayout}>
              {
                getFieldDecorator('materialCategoryName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='供应商' {...formLayout}>
              {
                getFieldDecorator('supplierName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='原厂' {...formLayout}>
              {
                getFieldDecorator('orginFactoryName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='是否拟推荐' {...formLayout}>
              {
                getFieldDecorator('recommend')(<VerdictBox />)
              }
            </Form.Item>
          </Col>
        </Row>
        <div className={styles.commonTitle}>筛选比对评价及结果</div>
        <Row gutter={[12, 24]}>
          <Col span={24}>
            <Form.Item label='供应商分析' {...formLayoutAlone}>
              {
                getFieldDecorator('supplierAnalysis', {
                  rules: [
                    {
                      required: true,
                      message: '供应商分析不能为空'
                    }
                  ]
                })(<Input.TextArea rows={6} />)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[12, 24]}>
          {
            recommend ?
              <Col span={24}>
                <Form.Item label='是否准入推荐' {...formLayoutAlone}>
                  {
                    getFieldDecorator('recommendConfirm')(
                      <Radio.Group onChange={handleRecommendConfirmChange}>
                        <Radio value={true}>是</Radio>
                        <Radio value={false}>否</Radio>
                      </Radio.Group>
                    )
                  }
                </Form.Item>
              </Col> : null
          }
          {
            !recommendConfirm && recommendConfirm !== undefined ?
              <Col span={24}>
                <Form.Item label='不推荐理由' {...formLayoutAlone}>
                  {
                    getFieldDecorator('noRecommendReason')(
                      <Input.TextArea rows={6} />
                    )
                  }
                </Form.Item>
              </Col> : null
          }
          {
            recommendConfirm ? <>
              <Col span={12}>
                <Form.Item label='选择推荐信息' {...formLayout}>
                  {
                    getFieldDecorator('selectRecommendInfomation')(
                      <ComboGrid {...trustInfoProps} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='信任公司' {...formLayout}>
                  {
                    getFieldDecorator('trustCorporationCode'),
                    getFieldDecorator('trustCorporationName')(
                      <ComboGrid disabled {...trustInfoProps} />
                    )
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='信任采购组织' {...formLayout}>
                  {
                    getFieldDecorator('trustPurchaseOrgCode'),
                    getFieldDecorator('trustPurchaseOrgName')(
                      <ComboGrid disabled {...trustInfoProps} />
                    )
                  }
                </Form.Item>
              </Col>
            </> : null
          }
        </Row>
      </Form>
    </Modal>
  )
})

export default Form.create()(Editor);