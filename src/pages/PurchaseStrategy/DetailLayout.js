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
  const { purchaseStrategyDate = [], submitList = [], sendList = [] } = initialValue;
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
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>基本信息</div>
      <div className={styles.content}>
        <Row>
          <Col span={12}>
            <Item  {...formLayout} label='采购策略名称'>
              <span>{initialValue.name}</span>
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购公司' {...formLayout}>
              {
                initialValue.purchaseCompanyName
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组织' {...formLayout}>
              {
                initialValue.purchaseOrganizationName
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='专业组' {...formLayout}>
              {
                initialValue.professionalGroupName
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='采购组' {...formLayout}>
              {
                initialValue.purchaseGroupName
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='采购物料类别' {...formLayout}>
              {
                initialValue.purchaseGoodsClassificationName
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='物料级别' {...formLayout}>
              {
                initialValue.materialLevelName
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='策略周期' {...formLayout}>
              {
                purchaseStrategyDate.map(item => item.format("YYYY-MM-DD")).join('~')
              }
            </Item>
          </Col>
          <Col span={12}>
            <Item label='币种' {...formLayout}>
              {
                initialValue.currencyName
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='是否采购小组确认' {...formLayout}>
              <Group value={initialValue.purchaseGroupConfirm} disabled={type === "detail"} options={confirmRadioOptions} />
            </Item>
          </Col>
          <Col span={12}>
            <Item label='申请人' {...formLayout}>
              {
                initialValue.creatorName
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Item label='联系方式' {...formLayout}>
              {
                initialValue.phone
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Item label='内容简介' {...formLayoutAlone}>
            {
              initialValue.content
            }
          </Item>
        </Row>
        <Row>
          <Item label='关键词' {...formLayoutAlone}>
            {
              initialValue.keyWord
            }
          </Item>
        </Row>
        <Row>
          <Col span={24}>
            <Item label='其他内容' {...formLayoutAlone}>
              {
                initialValue.comment
              }
            </Item>
          </Col>
        </Row>
        <Row>
          <Item label='附件' {...formLayoutAlone}>
            {
              getFieldDecorator('files')(
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
                sendList.map(item => item.userName).join(",")
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
                submitList.map(item => item.userName).join(",")
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