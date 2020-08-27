import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import { purchaseCompanyProps,FieldconfigureList } from '@/utils/commonProps'
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
    getAllParams,
    form
    
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue,validateFieldsAndScroll } = form;
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
  const getAllParams = async () => {
    const fields = await validateFieldsAndScroll();
    const { files } = fields;
    console.log(fields)
  }
  return (
    <div >
      <div >
        <div >
          <Row>
            <Col span={12}>
              <Item label='配置代码' {...formLayout}>
                {
                  getFieldDecorator('configCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择配置代码'
                      }
                    ]
                  })(<Input disabled={type === "detail" || type === "editor"} placeholder='请填写采购策略名称' style={{ width: 280 }} />)
                }
              </Item>
            </Col>
            <Col span={12}>
              <Item label='配置代码2222' {...formLayout}>
                {
                  getFieldDecorator('configCodeed', {
                    rules: [
                      {
                        required: true,
                        message: '请选择配置代码'
                      }
                    ]
                  })(<Input disabled={type === "detail" || type === "editor"} placeholder='请填写采购策略名称' style={{ width: 280 }} />)
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
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
              type !== 'editor'? <Col span={12}>
                <Item label='复制从' {...formLayout}>
                  <ComboList remotePaging disabled={type === "detail"} style={{ width: 280 }}
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