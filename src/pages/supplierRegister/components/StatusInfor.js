/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, message } from 'antd';

const { create } = Form;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const StatusInfor = forwardRef(({
  form,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));

  useEffect(() => {

  }, [editData])

  return (
    <Form>
            <Row>
                <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label={'状态'}
                    >
                        <span>{editData && editData.supplierVo && editData.supplierVo.supplierStatusRemark ? editData && editData.supplierVo && editData.supplierVo.supplierStatusRemark : ''}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label={'方案冻结状态'}
                    >
                        <span>{editData && editData.supplierVo && editData.supplierVo.planFrozen === false ? '否' : '是'}</span>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label={'报价冻结状态'}
                    >
                        <span>{editData && editData.extendVo && editData.supplierVo.offerFrozen === false ? '否' : '是'}</span>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label={'下单冻结状态'}
                    >
                        <span>{editData && editData.supplierVo && editData.supplierVo.orderFrozen === false ? '否' : '是'}</span>
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem
                        {...formItemLayout}
                        label={'付款冻结状态'}
                    >
                        <span>{editData && editData.supplierVo && editData.supplierVo.payFrozen === false ? '否' : '是'}</span>
                    </FormItem>
                </Col>

            </Row>
        </Form>
  )
})

const CommonForm = create()(StatusInfor)

export default CommonForm