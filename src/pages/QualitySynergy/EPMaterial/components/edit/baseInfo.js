import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList } from 'suid';
import { buList } from '../../../commonProps'
import { getUserName, getMobile } from '../../../../../utils'
import moment from 'moment'
const { create, Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const BaseInfo = forwardRef(({ form, type }, ref) => {
  useImperativeHandle(ref, () => ({

  }))
  const [attachment, setAttachment] = useState(null);
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;

  return <Fragment>
    <Form>
      <Row>
        <Col span={12}>
          <FormItem label='来源' {...formLayout}>
            {
              getFieldDecorator('sourceName')(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建人' {...formLayout}>
            {
              getFieldDecorator('creatorName', {
                initialValue: getUserName()
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='业务单元' {...formLayout}>
            {
              getFieldDecorator('buCode', {
                initialValue: '',
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(
                <ComboList
                  form={form}
                  disabled
                  {...buList}
                  name='buCode'
                  field={['buName']}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建人联系方式' {...formLayout}>
            {
              getFieldDecorator('creatorName', {
                initialValue: getMobile(),
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>

        <Col span={12}>
          <FormItem label='申请日期' {...formLayout}>
            {
              getFieldDecorator('dateTime', {
                initialValue: moment().format('YYYY-MM-DD')
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Fragment>
})

const CommonForm = create()(BaseInfo)

export default CommonForm;