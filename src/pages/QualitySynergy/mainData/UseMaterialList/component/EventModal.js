import React, { useEffect, useState } from 'react';
import {ComboList, ExtModal } from 'suid';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { BasicUnitList } from '../../../commonProps';
import { baseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item

const formItemLayoutLong = {
  labelCol: {span: 6},
  wrapperCol: {span: 18},
}

const EventModal = (props) => {

  const {visible, title, data, type} = props

  const onCancel = () => {
    props.onCancel()
  }

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values)
      }
    })
  }

  const {getFieldDecorator} = props.form

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'限用物质代码'}>
              {
                getFieldDecorator('limitMaterialCode', {
                  initialValue: type === 'add' ? '' : data.limitMaterialCode,
                  rules: [
                    {
                      required: true,
                      message: '限用物质代码不能为空'
                    },
                  ]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'限用物质名称'}>
              {
                getFieldDecorator('limitMaterialName', {
                  initialValue: type === 'add' ? '' : data.limitMaterialName,
                  rules: [
                    {
                      required: true,
                      message: '限用物质名称不能为空'
                    },
                  ]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'CAS.NO'}>
              {
                getFieldDecorator('casNo', {
                  initialValue: type === 'add' ? '' : data.casNo,
                  rules: [
                    {
                      required: true,
                      message: 'CAS.NO不能为空'
                    },
                  ]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'基本单位'}>
              {
                getFieldDecorator('casNo', {
                  initialValue: type === 'add' ? '' : data.casNo,
                  rules: [
                    {
                      required: true,
                      message: '基本单位不能为空'
                    },
                  ]
                })(
                  <ComboList
                    {...BasicUnitList}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'是否测试记录表中检查项'}>
              {
                getFieldDecorator('recordCheckList', {
                  initialValue: type === 'add' ? '' : data.recordCheckList,
                  valuePropName: 'checked',
                  rules: [
                    {
                      required: true,
                      message: '是否测试记录表中检查项不能为空'
                    },
                  ]
                })(
                  <Checkbox />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'排序号'}>
              {
                getFieldDecorator('orderNo', {
                  initialValue: type === 'add' ? '' : data.orderNo,
                  rules: [
                    {
                      required: true,
                      message: '排序号不能为空'
                    },
                  ]
                })(
                  <Input/>
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

EventModal.defaultProps = {
  form: {},
  type: 'add',
  data: {},
  visible: false,
  title: '',
  onCancel: () => {},
  onOk: () => {},
}

export default Form.create()(EventModal)
