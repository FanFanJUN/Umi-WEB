import { useEffect, useState, forwardRef, useImperativeHandle, Fragment } from 'react'
import { Form, Row, Col, Input, Button, Modal, message, notification } from 'antd';
import { ComboList } from 'suid';
import { materialCode } from '../../../commonProps'
import { getUserName } from '../../../../../utils'
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

  const BaseInfo = forwardRef(({ form, type}, ref)=>{
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
            <FormItem label=' 供应商代码' {...formLayout}>
              {
                getFieldDecorator('data1')(<Input disabled />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='供应商名称' {...formLayout}>
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
            <FormItem label='填报截止日期' {...formLayout}>
              {
                getFieldDecorator('supplierCode')(<Input disabled />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='填报日期' {...formLayout}>
              {
                getFieldDecorator('creatorName', {
                  initialValue: moment().format('YYYY-MM-DD'),
                  required: [{ required: true, message: '请选择供应商代码' }]
                })(<Input disabled />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='填报人员' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择供应商代码' }]
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='填报部门' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择供应商代码' }]
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='电话' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择供应商代码' }]
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label='邮箱' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择供应商代码' }]
                })(<Input />)
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem label='REACH环保符合性声明' {...formLayout}>
              {
                getFieldDecorator('dateTime', {
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
                getFieldDecorator('dateTime', {
                  initialValue: '',
                  rules: [{ required: true, message: '请选择供应商代码' }]
                })(<Input disabled />)
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