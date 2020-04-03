import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Upload } from 'antd';
import { ComboGrid, ComboList, utils } from 'suid';
import styles from './StrategyForm.less';
import {
  purchaseCompanyProps,
  purchaseGroupProps,
  currencyProps,
  purchaseOrganizationProps,
  purchaseMaterialProps,
  majorGroupProps
} from '@/utils/commonProps';
import { UserSelect } from '@/components'
const { RangePicker } = DatePicker;
const { createFormField, Item, create } = Form;
const { Group } = Radio;
const { TextArea } = Input
const { storage } = utils
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
    label: '是',
    value: true
  }, {
    label: '否',
    value: false
  }
]
const FormRef = forwardRef(({
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator } = form;
  const [createName, setCreateName] = useState("")
  useEffect(() => {
    const { userName } = storage.sessionStorage.get("Authorization")
    setCreateName(userName)
  }, [])
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>基本信息</div>
      <div className={styles.content}>
        <Row>
          <Col span={12}>
            <Item  {...formLayout} label='采购策略名称'>
              {
                getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '采购策略名称不能为空'
                    }
                  ]
                })(<Input placeholder='请填写采购策略名称' />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购公司' {...formLayout}>
              {
                getFieldDecorator('purchaseCompanyCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购公司'
                    }
                  ]
                })(<ComboGrid {...purchaseCompanyProps} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组织' {...formLayout}>
              {
                getFieldDecorator('purchaseOrganizationCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购组织'
                    }
                  ]
                })(<ComboGrid {...purchaseOrganizationProps} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='专业组' {...formLayout}>
              {
                getFieldDecorator('professionalGroupCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择专业组'
                    }
                  ]
                })(<ComboGrid {...majorGroupProps} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组' {...formLayout}>
              {
                getFieldDecorator('purchaseGroupCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购组'
                    }
                  ]
                })(<ComboGrid {...purchaseGroupProps} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购物料类别' {...formLayout}>
              {
                getFieldDecorator('purchaseGoodsClassification', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购物料类别'
                    }
                  ]
                })(<ComboList {...purchaseMaterialProps} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='物料级别' {...formLayout}>
              {
                getFieldDecorator('materialLevelCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择物料级别'
                    }
                  ]
                })(<ComboGrid {...purchaseGroupProps} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='策略周期' {...formLayout}>
              {
                getFieldDecorator('purchaseStrategyDate', {
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: '选择策略周期'
                    }
                  ]
                })(<RangePicker style={{ width: '100%' }} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='币种' {...formLayout}>
              {
                getFieldDecorator('purchaseGroupCode', {
                  rules: [
                    {
                      required: true,
                      message: '请选择币种'
                    }
                  ]
                })(<ComboGrid {...currencyProps} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='是否采购小组确认' {...formLayout}>
              {
                getFieldDecorator("purchaseGroupConfirm", {
                  initialValue: false
                })(
                  <Group options={confirmRadioOptions} />
                )
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='申请人' {...formLayout}>
              {
                getFieldDecorator("creatorName", {
                  initialValue: createName
                })(
                  <Input disabled />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='联系方式' {...formLayout}>
              {
                getFieldDecorator('phone', {
                  rules: [
                    {
                      required: true,
                      message: '请填写联系方式'
                    }
                  ]
                })(
                  <Input placeholder='请填写联系方式' />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='内容简介' {...formLayout}>
              {
                getFieldDecorator('content', {
                  rules: [
                    {
                      required: true,
                      message: '请填写内容简介'
                    }
                  ]
                })(<TextArea autoSize={{ minRows: 3, maxRows: 5 }} placeholder="内容简介..." />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='关键词' {...formLayout}>
              {
                getFieldDecorator('keyWord', {
                  rules: [
                    {
                      required: true,
                      message: '请填写关键词'
                    }
                  ]
                })(<Input placeholder='请填写关键词' />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='其他内容' {...formLayout}>
              {
                getFieldDecorator('comment')(<TextArea placeholder='其他需要单独说明的内容' autoSize={{ minRows: 3, maxRows: 5 }} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='附件' {...formLayout}>
              <Upload>

              </Upload>
            </Item>
          </Col>
        </Row>
        <div className={styles.title}>呈报主送</div>
        <Row>
          <Col span={12}>
            <Item label='呈报' {...formLayout}>
              {
                getFieldDecorator('submit', {
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: "请选择呈报人员"
                    }
                  ]
                })(
                  <UserSelect style={{ width: '100%', zIndex: 10 }} mode='tags' placeholder='选择呈报人员' wrapperStyle={{ width: 800 }} />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='主送' {...formLayout}>
              {
                getFieldDecorator('send')(
                  <UserSelect style={{ width: "100%", zIndex: 10 }} mode="tags" wrapperStyle={{ width: 800 }} placeholder="选择主送人员" />
                )
              }
            </Item>
          </Col>
        </Row>
        <div className={styles.title}>标的物</div>
        
      </div>
    </div>
  )
}
)
const CommonForm = create({
  mapPropsToFields: (props) => {
    const { initialValues = {}, type = 'add' } = props;
    if (type === 'add') {
      return {}
    }
    return {
      name: createFormField({
        value: initialValues.name
      }),
      purchaseCompanyCode: createFormField({
        value: initialValues.purchaseCompanyCode
      })
    }
  }
})(FormRef)

export default CommonForm