import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList } from 'suid';
import { materialCode } from '../../../commonProps'
import { getUserName, getMobile, getUserEmail } from '../../../../../utils'
import { ComboAttachment } from '@/components';
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

const BaseInfo = forwardRef(({ form, originData }, ref) => {

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
                initialValue: originData && originData.supplierCode,
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='供应商名称' {...formLayout}>
            {
              getFieldDecorator('supplierName', {
                initialValue: originData && originData.supplierName,
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
                initialValue: originData && originData.fillEndDate,
              })(<Input disabled />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='填报日期' {...formLayout}>
            {
              getFieldDecorator('fillDate', {
                initialValue: moment().format('YYYY-MM-DD'),
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
                initialValue: getUserName(),
                rules: [{ required: true, message: '请输入填报人员' }]
              })(<Input />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='填报部门' {...formLayout}>
            {
              getFieldDecorator('fillDeptName', {
                initialValue: '',
                rules: [{ required: true, message: '请输入填报部门' }]
              })(<Input />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='电话' {...formLayout}>
            {
              getFieldDecorator('fillPeoplePhone', {
                initialValue: getMobile(),
                rules: [{ required: true, message: '请输入电话' }]
              })(<Input />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='邮箱' {...formLayout}>
            {
              getFieldDecorator('fillPeopleEmail', {
                initialValue: getUserEmail(),
                rules: [{ required: true, message: '请输入邮箱' }]
              })(<Input />)
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label='REACH环保符合性声明' {...formLayout}>
            {
              getFieldDecorator('reachEnvironmentId', {
                initialValue: ''
              })(<ComboAttachment
                uploadButton={{ disabled: false }}
                allowDelete={false}
                showViewType={true}
                customBatchDownloadFileName={false}
                attachment={attachment} />)
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label='传真' {...formLayout}>
            {
              getFieldDecorator('fillPeopleFax', {
                initialValue: '',
                rules: [{ required: true, message: '请选择供应商代码' }]
              })(<Input />)
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
              })(<TextArea rows={6} maxLength={500} />)
            }
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Fragment>
})

const CommonForm = create()(BaseInfo)

export default CommonForm;