import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { onlyNumber, toUpperCase, onMailCheck } from '@/utils/index'
const { create } = Form;
const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const AccountRef = forwardRef(({
  isView,
  form,
  editData = [],
  initialValue = {},
  accountinfo = [],
  approve
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAccountinfo,
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [configAcc, setConfigAcc] = useState([]);
  const [configure, setConfigure] = useState([]);
  //const { attachment = null } = initialValues;
  useEffect(() => {
    // let fieldsListed = []
    // accountinfo.map(item => {
    //   fieldsListed.push({
    //     title: item.title,
    //     key: item.key,
    //     verifi: item.verifi,
    //     type: 'input',
    //   })
    // })
    setFieldsValue(initialValue)
  }, [initialValue])
  // 表单
  function getAccountinfo() {
    // const valus = form.validateFieldsAndScroll();
    // return valus;
    let result = false;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        result = values;
      }
    });
    return result;
  }

  return (
    <Row>
      {
        accountinfo.map((item, index) => {
          if (item.verifi === '0' || item.verifi === '1' || item.verifi === '2') {
            return (
              <>
                {item.key === "account" ? <Col
                  span={8}
                >
                  <FormItem style={{ width: '100%', marginBottom: 10 }}
                    label='帐号' {...formLayout} >
                    {
                      isView ?
                        <span>{editData && editData.supplierVo && editData.supplierVo.accountVo
                          && editData.supplierVo.accountVo.account
                          ? editData.supplierVo.accountVo.account : ''}</span> :
                        getFieldDecorator('supplierVo.accountVo.account', {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.accountVo
                            && editData.supplierVo.accountVo.account
                            ? editData.supplierVo.accountVo.account : '',
                          rules: [{ required: true, message: '请输入手机', whitespace: true }],
                        })(
                          <Input
                            disabled={true || item.verifi === '2'}
                            maxLength={20}
                            onChange={onlyNumber}
                          />,
                        )
                    }
                  </FormItem>
                </Col> : null}
                {item.key === "mobile" ? <Col
                  span={8}
                >
                  <FormItem style={{ width: '100%', marginBottom: 10 }}
                    label='手机' {...formLayout} >
                    {
                      isView ?
                        <span>{editData && editData.supplierVo && editData.supplierVo.accountVo
                          && editData.supplierVo.accountVo.mobile
                          ? editData.supplierVo.accountVo.mobile : ''}</span> :
                        getFieldDecorator('supplierVo.accountVo.mobile', {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.accountVo
                            && editData.supplierVo.accountVo.mobile
                            ? editData.supplierVo.accountVo.mobile : '',
                          rules: [{ required: true, message: '请输入手机', whitespace: true }],
                        })(
                          <Input
                            disabled={approve === true || item.verifi === '2'}
                            maxLength={20}
                            onChange={onlyNumber}
                            placeholder={"请输入手机号"}
                          />,
                        )
                    }
                  </FormItem>
                </Col> : null}
                {
                  item.key === "email" ? <Col span={8}>
                    <FormItem
                      {...formLayout}
                      label={"电子邮箱"}
                    >
                      {isView ? <span>{editData && editData.supplierVo && editData.supplierVo.accountVo
                        && editData.supplierVo.accountVo.email
                        ? editData.supplierVo.accountVo.email : ''}</span> :
                        getFieldDecorator("supplierVo.accountVo.email", {
                          initialValue: editData && editData.supplierVo && editData.supplierVo.accountVo
                            && editData.supplierVo.accountVo.email
                            ? editData.supplierVo.accountVo.email : '',
                          rules: [{ validator: onMailCheck, message: '请输入正确格式的邮件地址!', whitespace: true },
                          { required: true, message: '请输入邮件地址!' },]
                        })(
                          <Input
                            disabled={approve === true || item.verifi === '2'}
                            onChange={toUpperCase}
                            maxLength={50}
                            placeholder={"请输入邮件地址"} />
                        )
                      }
                    </FormItem>
                  </Col> : null
                }
              </>
            )
          }
        })
      }
    </Row>
  )
}
)
const CommonForm = create()(AccountRef)

export default CommonForm