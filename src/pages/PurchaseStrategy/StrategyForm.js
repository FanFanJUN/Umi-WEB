import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import styles from './StrategyForm.less';
import {
  purchaseCompanyProps,
  purchaseGroupProps,
  currencyProps,
  purchaseOrganizationProps,
  majorGroupProps,
  materialLevel,
  proPlanMaterialTypeProps
} from '@/utils/commonProps';
import { UserSelect, ComboAttachment } from '@/components'
const { RangePicker } = DatePicker;
const { Item, create } = Form;
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
const formLayoutAlone = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
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
  form,
  type = "add",
  initialValue = {},
  onChangeMaterialLevel = () => null
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [createName, setCreateName] = useState("");
  const pcc = getFieldValue('purchaseCompanyCode');
  const { attachment = null } = initialValue;
  const treeNodeProps = (node) => {
    if (node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  }
  useEffect(() => {
    const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
    setFieldsValue({
      phone: mobile
    })
    setCreateName(userName)
  }, [])
  useEffect(() => {

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
                })(<Input disabled={type === "detail"} placeholder='请填写采购策略名称' />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购公司' {...formLayout}>
              {
                getFieldDecorator('purchaseCompanyCode'),
                getFieldDecorator('purchaseCompanyName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购公司'
                    }
                  ]
                })(<ComboList disabled={type === "detail"} {...purchaseCompanyProps} name='purchaseCompanyName' field={['purchaseCompanyCode']} form={form} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组织' {...formLayout}>
              {
                getFieldDecorator('purchaseOrganizationCode'),
                getFieldDecorator('purchaseOrganizationName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购组织'
                    }
                  ]
                })(
                  <ComboList
                    key={`combo-list-${pcc}`}
                    remotePaging
                    disabled={type === "detail" || !pcc}
                    {...purchaseOrganizationProps}
                    store={{
                      ...purchaseOrganizationProps.store,
                      params: {
                        Q_EQ_corporationCode: pcc
                      }
                    }}
                    name='purchaseOrganizationName'
                    field={['purchaseOrganizationCode']}
                    form={form}
                  />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='专业组' {...formLayout}>
              {
                getFieldDecorator("professionalGroupCode"),
                getFieldDecorator('professionalGroupName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择专业组'
                    }
                  ]
                })(<ComboList disabled={type === "detail"} {...majorGroupProps} form={form} name='professionalGroupName' field={['professionalGroupCode']} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组' {...formLayout}>
              {
                getFieldDecorator('purchaseGroupCode'),
                getFieldDecorator('purchaseGroupName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购组'
                    }
                  ]
                })(<ComboList remotePaging disabled={type === "detail"} {...purchaseGroupProps} name='purchaseGroupName' field={['purchaseGroupCode']} form={form} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购物料类别' {...formLayout}>
              {
                getFieldDecorator('purchaseGoodsClassificationCode'),
                getFieldDecorator('purchaseGoodsClassificationName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择采购物料类别'
                    }
                  ]
                })(<ComboTree treeNodeProps={treeNodeProps} disabled={type === "detail"} {...proPlanMaterialTypeProps} name='purchaseGoodsClassificationName' field={['purchaseGoodsClassificationCode']} form={form} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='物料级别' {...formLayout}>
              {
                getFieldDecorator('materialLevelCode'),
                getFieldDecorator('materialLevelName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择物料级别'
                    }
                  ]
                })(<ComboList disabled={type === "detail"} {...materialLevel} form={form} name='materialLevelName' field={['materialLevelCode']} afterSelect={onChangeMaterialLevel} />)
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
                })(<RangePicker disabled={type === "detail"} style={{ width: '100%' }} />)
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='币种' {...formLayout}>
              {
                getFieldDecorator('currencyCode'),
                getFieldDecorator('currencyName', {
                  rules: [
                    {
                      required: true,
                      message: '请选择币种'
                    }
                  ]
                })(<ComboList remotePaging disabled={type === "detail"} {...currencyProps} name='currencyName' field={['currencyCode']} form={form} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='是否采购小组确认' {...formLayout}>
              {
                getFieldDecorator("purchaseGroupConfirm", {
                  rules: [
                    {
                      type: 'boolean',
                      required: true,
                      message: '请选择确认状态'
                    }
                  ]
                })(
                  <Group disabled={type === "detail"} options={confirmRadioOptions} />
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
                  <Input readOnly />
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
                  <Input disabled={type === "detail"} placeholder='请填写联系方式' />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Item label='内容简介' {...formLayoutAlone}>
            {
              getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请填写内容简介'
                  }
                ]
              })(<TextArea maxLength={800} disabled={type === "detail"} autoSize={{ minRows: 3, maxRows: 5 }} placeholder="内容简介..." />)
            }
          </Item>
        </Row>
        <Row>
          <Item label='关键词' {...formLayoutAlone}>
            {
              getFieldDecorator('keyWord', {
                rules: [
                  {
                    required: true,
                    message: '请填写关键词'
                  }
                ]
              })(<Input maxLength={120} disabled={type === "detail"} placeholder='请填写关键词' />)
            }
          </Item>
        </Row>
        <Row>
          <Col span={24}>
            <Item label='其他内容' {...formLayoutAlone}>
              {
                getFieldDecorator('comment')(<TextArea maxLength={800} placeholder='其他需要单独说明的内容' autoSize={{ minRows: 3, maxRows: 5 }} disabled={type === 'detail'} />)
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Item label='附件' {...formLayoutAlone}>
            {
              getFieldDecorator('attachment')(
                <ComboAttachment
                  allowPreview={false}
                  allowDelete={type !== 'detail'}
                  showViewType={type !== 'detail'}
                  uploadButton={{
                    disabled: type === 'detail'
                  }}
                  maxUploadNum={1}
                  multiple={false}
                  attachment={attachment}
                  customBatchDownloadFileName={true}
                />
              )
            }
          </Item>
        </Row>
      </div>
      <div className={styles.title}>呈报主送</div>
      <div className={styles.content}>
        <Row>
          <Col span={18}>
            <Item
              label='主送'
              labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 20
              }}
            >
              {
                getFieldDecorator('sendList', {
                  rules: [
                    {
                      type: 'array',
                      required: true,
                      message: "请选择主送人员"
                    }
                  ]
                })(
                  <UserSelect disabled={type === "detail"} style={{ width: "100%", zIndex: 10 }} wrapperStyle={{ width: 800 }} placeholder="选择主送人员" name='sendList' reader={{ name: 'userName', field: ['code'] }} form={form} />
                )
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Item
              label='呈报'
              labelCol={{
                span: 4
              }}
              wrapperCol={{
                span: 20
              }}
            >
              {
                getFieldDecorator('submitList')(
                  <UserSelect disabled={type === "detail"} style={{ width: "100%", zIndex: 10 }} mode="tags" wrapperStyle={{ width: 800 }} placeholder="选择主送人员" name='submitList' reader={{ name: 'userName', field: ['code'] }} form={form} />
                )
              }
            </Item>
          </Col>
        </Row>
      </div>
    </div>
  )
}
)
const CommonForm = create()(FormRef)

export default CommonForm