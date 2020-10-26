import { forwardRef, useImperativeHandle, useState } from 'react';
import { Modal, Form, Row, Col, Select, InputNumber } from 'antd';
import { ComboList } from 'suid';
import { dealAdviceProps } from '../../utils/commonProps';
const { create, Item: FormItem } = Form
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  }
};
const CommonForm = forwardRef(({
  form,
  type = 'create',
  dataSource = [],
  onOk = () => new Promise(resolve => resolve(false))
}, ref) => {
  useImperativeHandle(ref, () => ({
    show,
    hide,
    setFieldsValue
  }))
  const modalTitle = type === 'create' ? '新增' : '编辑'
  const [visible, toggleVisible] = useState(false);
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState({
    validateStatus: '',
    help: ''
  })
  const {
    getFieldValue,
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  const markStartCalsign = getFieldValue('markStartCalsign');
  const markStart = getFieldValue('markStart');
  function show() {
    toggleVisible(true)
  }
  function hide() {
    toggleVisible(false)
  }
  async function handleOk() {
    const values = await validateFieldsAndScroll();
    setError({ validateStatus: '', help: '' })
    const validate = await checkRangeRepeat(values, dataSource)
    if (validate) {
      onOk(values, toggleLoading)
    }
  }
  function validateRangeRepeat(item, current) {
    const SIGN = { EQ: "=", GT: ">", GE: ">=", LT: "<", LE: "<=" };
    const {
      markStart: s,
      markStartCalsign: sc,
      markEnd: e,
      markEndCalsign: ec,
      id
    } = current;
    const {
      markStart: cs,
      markStartCalsign: csc,
      markEnd: ce,
      markEndCalsign: cecl,
      id: cid
    } = item;
    if (id == cid) {
      return true
    }
    if (s >= cs && s <= ce) {
      if (s > cs && s < ce) {
        return false;
      } else if (s === ce) {
        if (ec === SIGN.GE || ec === SIGN.EQ) {
          if (cecl === SIGN.LE || cecl === SIGN.EQ) {
            return false;
          }
        }
      }
    }
    if (e >= cs && e <= ce) {
      if (e > cs && e < ce) {
        return false;
      } else if (e === cs) {
        if (ec === SIGN.LE || ec === SIGN.EQ) {
          if (csc === SIGN.GE || csc === SIGN.EQ) {
            return false;
          }
        }
      }
    }
    if (e > ce && s < cs) {
      return false;
    }
    if (e === ce && s === cs) {
      return false;
    }
    return true
  }
  function checkRangeRepeat(current, ds = []) {
    const hasRanges = ds.every(item => validateRangeRepeat(item, current));
    console.log(hasRanges)
    return new Promise((resolve, reject) => {
      if (!hasRanges) {
        reject('区间重复')
        return
      }
      resolve(true)
    }).catch(error => setError({ validateStatus: 'error', help: error }))
  }
  return (
    <Modal
      maskClosable
      visible={visible}
      confirmLoading={loading}
      onOk={handleOk}
      title={modalTitle}
      onCancel={hide}
      destroyOnClose
    >
      <Form {...formLayout}>
        <FormItem label='区间' {...error} required>
          <Row gutter={[6, 0]}>
            <Col span={6}>
              <FormItem>
                {
                  getFieldDecorator('id'),
                  getFieldDecorator('markStartCalsign', {
                    rules: [
                      {
                        required: true,
                        message: '请选择计算方式'
                      }
                    ]
                  })(
                    <Select onSelect={(v) => {
                      if (v === '=') {
                        setFieldsValue({
                          markEndCalsign: '=',
                          markEnd: markStart
                        })
                        return
                      }
                      setFieldsValue({
                        markEndCalsign: undefined
                      })
                    }}>
                      <Option value=">">></Option>
                      <Option value=">=">>=</Option>
                      <Option value="=">=</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {
                  getFieldDecorator('markStart', {
                    rules: [
                      {
                        required: true,
                        message: '开始区间不能为空'
                      }
                    ]
                  })(
                    <InputNumber max={100} min={0} onChange={v => {
                      if (markStartCalsign === '=') {
                        setFieldsValue({
                          markEnd: v
                        })
                        return
                      }
                    }} />
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {
                  getFieldDecorator('markEndCalsign', {
                    rules: [
                      {
                        required: true,
                        message: '请选择计算方式'
                      }
                    ]
                  })(
                    <Select disabled={!markStartCalsign || markStartCalsign === '='}>
                      <Option value="<">{`<`}</Option>
                      <Option value="<=">{`<=`}</Option>
                      <Option value="=" disabled={markStartCalsign !== '='}>=</Option>
                    </Select>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem>
                {
                  getFieldDecorator('markEnd', {
                    rules: [
                      {
                        required: true,
                        message: '结束区间不能为空'
                      }
                    ]
                  })(
                    <InputNumber
                      min={markStartCalsign === '=' ? 0 : (markStart + 1) || 0}
                      max={100}
                      disabled={
                        !markStartCalsign ||
                        markStartCalsign === '=' ||
                        markStart === undefined ||
                        markStart === null
                      }
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label='评价等级'>
          {
            getFieldDecorator('level',
              {
                rules: [
                  {
                    required: true,
                    message: '评价等级不能为空'
                  }
                ]
              })(
                <Select style={{ width: 220 }} placeholder='选择评价等级'>
                  <Option value='A'>A</Option>
                  <Option value='B'>B</Option>
                  <Option value='C'>C</Option>
                  <Option value='D'>D</Option>
                  <Option value='E'>E</Option>
                </Select>
              )
          }
        </FormItem>
        <FormItem label='处理建议'>
          {
            getFieldDecorator('dealAdviceValue'),
            getFieldDecorator('dealAdviceName',
              {
                rules: [
                  {
                    required: true,
                    message: '处理建议不能为空'
                  }
                ]
              })(
                <ComboList style={{ width: 220 }} {...dealAdviceProps} form={form} name='dealAdviceName' field={['dealAdviceValue']} showSearch={false} pagination={false} />
              )
          }
        </FormItem>
        <FormItem label='排序码'>
          {
            getFieldDecorator('rank',
              {
                rules: [
                  {
                    required: true,
                    message: '排序码不能为空'
                  }
                ]
              })(
                <InputNumber />
              )
          }
        </FormItem>
      </Form>
    </Modal>
  )
})

export default create()(CommonForm)