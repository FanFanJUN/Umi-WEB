import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList } from 'suid';
import { buList } from '../../../commonProps'
import { getUserName, getMobile, getUserId, getUserAccount } from '../../../../../utils'
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

const BaseInfo = forwardRef(({ form, isView, setBuCode, originData={} }, ref) => {
  useImperativeHandle(ref, () => ({
    getFormInfo,
    validateFieldsAndScroll
  }))
  const [attachment, setAttachment] = useState(null);
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  const getFormInfo = ()=>{
    const baseInfo = {}
    validateFieldsAndScroll((err, values)=>{
      console.log(values, err)
      if(!err) {
        baseInfo = {...values}
      }
    })
    return baseInfo;
  }
  return <Fragment>
    <Form>
      <Row>
        <Col span={12}>
          <FormItem label='来源' {...formLayout}>
            {
              getFieldDecorator('sourceName',{
                initialValue: isView? originData.sourceName : 'SRM',
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建人' {...formLayout}>
            {
              getFieldDecorator('applyPersonId', {initialValue: getUserId()}),
              getFieldDecorator('applyPersonAccount', {initialValue: getUserAccount()}),
              getFieldDecorator('applyPersonName', {
                initialValue: isView? originData.applyPersonName : getUserName()
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='业务单元' {...formLayout}>
            {
              getFieldDecorator('buId'),
              getFieldDecorator('buName'),
              getFieldDecorator('buCode', {
                initialValue: isView ? originData.buCode : '',
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(
                <ComboList
                  form={form}
                  disabled={isView}
                  {...buList}
                  name='buCode'
                  field={['buName', 'buId']}
                  afterSelect={(item)=>{
                    setBuCode(item.buCode)
                  }}
                />
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='创建人联系方式' {...formLayout}>
            {
              getFieldDecorator('applyPersonPhone', {
                initialValue: isView ? originData.applyPersonPhone : getMobile(),
                rules: [{ required: true, message: '请输入创建人联系方式'}]
              })(<Input disabled={isView} />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>

        <Col span={12}>
          <FormItem label='申请日期' {...formLayout}>
            {
              getFieldDecorator('dateTime', {
                initialValue: isView ? originData.dateTime : moment().format('YYYY-MM-DD')
              })(<Input disabled/>)
            }
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Fragment>
})

const CommonForm = create()(BaseInfo)

export default CommonForm;