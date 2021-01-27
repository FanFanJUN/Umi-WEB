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
  const {
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll,
    getFieldsValue
  } = form;
  const [visible, toggleVisible] = useState(false);
  const [cacheFields, setCacheFields] = useState({})
  const [trustInfos, setTrustInfos] = useState([]);
  // const [compareDataSource, setCompareDataSource] = useState([]);
  const { id: orderId } = getFieldsValue();
  const allowTrust = trustInfos.filter(item => item.id !== orderId).some(item => item.objectRecognition);
  useImperativeHandle(ref, () => ({
    show,
    hide
  }))
  const {
    recommend,
    recommendConfirm,
    objectRecognition
  } = getFieldsValue();
  async function show(fields, ts) {
    const {
      recommendConfirm,
      objectRecognition = null,
      trust = null,
      ...cacheFieldsValues
    } = fields;
    const cfv = {
      ...cacheFieldsValues,
      trust,
      objectRecognition
    }
    await toggleVisible(true)
    await DELAY(200)
    await setTrustInfos(ts)
    await setFieldsValue({
      recommendConfirm
    })
    await setFieldsValue({
      objectRecognition
    })
    await setFieldsValue({
      trust
    })
    await setFieldsValue(fields)
    await setFieldsValue({
      trust
    })
    setCacheFields(cfv)
  }
  function hide() {
    toggleVisible(false)
  }
  async function handleOk() {
    const values = await validateFieldsAndScroll()
    hide()
    setTableDataSource(values)
  }
  useEffect(() => {
    setFieldsValue({
      ...cacheFields,
      selectRecommendInfomation: `${cacheFields.corporationCode}-${cacheFields.purchaseOrgCode}`
    })
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
            <Form.Item label='供应商代码' {...formLayout}>
              {
                getFieldDecorator('supplierCode')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='供应商名称' {...formLayout}>
              {
                getFieldDecorator('supplierName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='原厂代码' {...formLayout}>
              {
                getFieldDecorator('originName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='原厂名称' {...formLayout}>
              {
                getFieldDecorator('originName')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='业务单元代码' {...formLayout}>
              {
                getFieldDecorator('buCode')(<Box />)
              }
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label='业务单元名称' {...formLayout}>
              {
                getFieldDecorator('buName')(<Box />)
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
          <Col span={24}>
            <Form.Item label='是否拟淘汰供应商' {...formLayoutAlone}>
              {
                getFieldDecorator('weedOut', {
                  rules: [
                    {
                      required: true,
                      message: '请选择是否拟淘汰供应商'
                    }
                  ]
                })(
                  <Radio.Group>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                )
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
})

export default Form.create()(Editor);