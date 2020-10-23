import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal, Form, Row, Col, Select, Input, InputNumber } from 'antd';
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
  const [visible, toggleVisible] = useState(true);
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
    
  }
  function checkRangeRepeat(current, dataSource) {
    const {
      markStart,
      markStartCalsign,
      markEnd,
      markEndCalsign
    } = current;
    const hasRanges = dataSource.map(item=> ({
      markStart: item.markStart,
      markStartCalsign: item.markStartCalsign,
      markEnd: item.markEnd,
      markEndCalsign: item.markEndCalsign
    }))
  }
  return (
    <Modal
      maskClosable
      visible={visible}
      onOk={handleOk}
      title={modalTitle}
    >
      <Form {...formLayout}>
        <FormItem label='区间' required>
          <Row gutter={[6, 0]}>
            <Col span={6}>
              <FormItem>
                {
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
                          markEndCalsign: '='
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
                      min={(markStart+1)}
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