import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList } from 'suid';
import { materialCode } from '../../../commonProps'
import { getUserName, getMobile, getUserEmail } from '../../../../../utils'
import { Upload } from '@/components';
import moment from 'moment';
const { TextArea } = Input;
const { create, Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const BaseInfo = forwardRef(({ form, originData={}, isView }, ref) => {

  const [attachment, setAttachment] = useState(null);
  const {
    getFieldDecorator,
    getFieldValue,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  useImperativeHandle(ref, () => ({
    validateFieldsAndScroll
  }))
  return <Fragment>
    <Form>
      <Row>
        <Col span={12}>
          <FormItem label=' 供应商代码' {...formLayout}>
            {
              getFieldDecorator('supplierCode', {
                initialValue: originData.supplierCode,
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='供应商名称' {...formLayout}>
            {
              getFieldDecorator('supplierName', {
                initialValue: originData.supplierName,
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='填报截止日期' {...formLayout}>
            {
              getFieldDecorator('fillEndDate', {
                initialValue: originData.fillEndDate,
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='填报日期' {...formLayout}>
            {
              getFieldDecorator('fillDate', {
                initialValue: originData.fillDate ?  moment(originData.fillDate) : moment().format('YYYY-MM-DD'),
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='填报人员' {...formLayout}>
            {
              getFieldDecorator('fillPeopleName', {
                initialValue: originData.fillPeopleName ? originData.fillPeopleName : getUserName(),
                rules: [{ required: true, message: '请输入填报人员' }]
              })(<Input disabled={isView}/>)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='填报部门' {...formLayout}>
            {
              getFieldDecorator('fillDeptName', {
                initialValue: originData.fillDeptName,
                rules: [{ required: true, message: '请输入填报部门' }]
              })(<Input disabled={isView}/>)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='电话' {...formLayout}>
            {
              getFieldDecorator('fillPeoplePhone', {
                initialValue: originData.fillPeoplePhone ? originData.fillPeoplePhone : getMobile(),
                rules: [{ required: true, message: '请输入电话' }]
              })(<Input disabled={isView}/>)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='邮箱' {...formLayout}>
            {
              getFieldDecorator('fillPeopleEmail', {
                initialValue: originData.fillPeopleEmail ? originData.fillPeopleEmail : getUserEmail(),
                rules: [{ required: true, message: '请输入邮箱' }]
              })(<Input disabled={isView}/>)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='REACH环保符合性声明' {...formLayout}>
            {
              getFieldDecorator('reachEnvironmentId', {
                initialValue: '',
                rules: [{ required: true, message: '请上传报告附件' }]
              })(<Upload entityId={originData ? originData.reachEnvironmentId : ''} type={isView?'show':''}/>)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='传真' {...formLayout}>
            {
              getFieldDecorator('fillPeopleFax', {
                initialValue: originData.fillPeopleEmail,
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(<Input disabled={isView}/>)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='申明' {...formLayout}>
            {
              getFieldDecorator('dateTime', {
                initialValue: ''
              })(<TextArea rows={6} maxLength={500} disabled={isView}/>)
            }
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Fragment>
})

const CommonForm = create()(BaseInfo)

export default CommonForm;