import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import { purchaseCompanyProps } from '@/utils/commonProps'
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
    value: 'A'
  }, {
    label: '变更',
    value: 'B'
  }, {
    label: '明细',
    value: 'C'
  }
]
const FormRef = forwardRef(({
  form,
  type = "",
  Opertype = null,
  initialValue = {},
  onChangeMaterialLevel = () => null
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [configure, setConfigure] = useState([]);
  const pcc = getFieldValue('purchaseCompanyCode');
  const { attachment = null } = initialValue;
  useEffect(() => {
    //   const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
    //   setFieldsValue({
    //     phone: mobile
    //   })
    //setCreateName(userName)
    setFieldsValue({
        purchaseGroupConfirm: Opertype
      }) 
  }, [])
  return (
    <div >
      <div >
        <div >
          <Row>
            <Col span={12}>
              <Item label='配置代码' {...formLayout}>
                {
                  getFieldDecorator('currencyCode'),
                  getFieldDecorator('currencyName', {
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
              <Item label='供应商分类' {...formLayout}>
                {
                  getFieldDecorator('purchaseGroupCode'),
                  getFieldDecorator('purchaseGroupName', {
                    rules: [
                      {
                        required: true,
                        message: '请选择供应商分类'
                      }
                    ]
                  })(
                    <ComboList disabled={type === "detail" || type === "editor"} style={{ width: 280 }}
                      {...purchaseCompanyProps} showSearch={false}
                      name='purchaseGroupName' field={['purchaseGroupCode']} form={form} />
                  )
                }
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Item label='配置属性' {...formLayout}>
                {
                  getFieldDecorator("materialLevelCode", {
                    rules: [
                      {
                        required: true,
                        message: '请选择配置属性'
                      }
                    ]
                  })(
                    <Group
                      disabled={type === "detail"}
                      options={confirmRadioOptions} />
                  )
                }
              </Item>
            </Col>
            {
              type !== 'editor' ? <Col span={12}>
                <Item label='复制从' {...formLayout}>
                  {
                    getFieldDecorator('currencyCode2'),
                    getFieldDecorator('currencyName2', {

                    })(<ComboList remotePaging disabled={type === "detail"} style={{ width: 280 }}
                      {...purchaseCompanyProps}
                      name='currencyName2' field={['currencyCode2']} form={form} />)
                  }
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
const CommonForm = create()(FormRef)

export default CommonForm