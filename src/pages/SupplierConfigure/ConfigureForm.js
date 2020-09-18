import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio,Button  } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import { purchaseCompanyPropsreg,FieldconfigureList } from '@/utils/commonProps'
const { Item, create } = Form;
const { Group } = Radio;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const confirmRadioOptions = [
  {
    label: '新增',
    value: '1'
  }, {
    label: '变更',
    value: '2'
  }, {
    label: '明细',
    value: '3'
  }
]
const HeadFormRef = forwardRef(({
  form,
  type = "",
  Opertype = null,
  initialValue = {},
  handcopy = () => null,
  
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [configure, setConfigure] = useState([]);
  const { attachment = null } = initialValue;
  useEffect(() => {
    //   const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
    //   setFieldsValue({
    //     phone: mobile
    //   })
    //setCreateName(userName)
    // console.log(type)
    // if (type === 'add') {
    //   setFieldsValue({
    //     configProperty: Opertype
    //   })
    // }else if (type === 'copy') {
    //   setFieldsValue({
    //     //configProperty: configProperty
    //   })
    // }
    
    setFieldsValue({
      configProperty: Opertype
    })
  }, [])
  //复制从获取ID
  function handleCopySelect (item) {
    handcopy(item.id)
  }
  return (
    <div >
      <div >
        <div >
          <Row>
            <Col span={10}>
              <Item label='配置代码' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                    rules: [
                      {
                        required: true,
                        message: '请填写配置代码'
                      }
                    ]
                  })(<Input disabled={type === "detail"} placeholder='请填写配置代码' />)
                }
              </Item>
            </Col>
            <Col span={10}>
              <Item label='供应商分类' {...formLayout}>
                {
                  getFieldDecorator('supplierCategoryCode'),
                  getFieldDecorator('supplierCategoryId'),
                  getFieldDecorator('supplierCategoryName', {
                    rules: [
                      {
                        required: true,
                        message: '请选择供应商分类'
                      }
                    ]
                  })(
                    <ComboTree disabled={type === "detail" || type === "editor"}
                      {...purchaseCompanyPropsreg} showSearch={false}
                      name='supplierCategoryName' field={['supplierCategoryCode','supplierCategoryId']} form={form} />
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Item label='配置属性' {...formLayout}>
                {
                  getFieldDecorator("configProperty", {
                    rules: [
                      {
                        required: true,
                        message: '请选择配置属性'
                      }
                    ]
                  })(
                    <Group 
                      disabled={type === "detail" || type === "editor"}
                      options={confirmRadioOptions} />
                  )
                }
              </Item>
            </Col>
            {
              type === 'add'? <Col span={10}>
                <Item label='复制从' {...formLayout}>
                  <ComboList remotePaging disabled={type === "detail"}
                      {...FieldconfigureList} showSearch={false} 
                      form={form} afterSelect={(item) => handleCopySelect(item)} />
                </Item>
               
              </Col> : ''
            }
          </Row>

        </div>
      </div>
    </div>
  )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm