/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime: 2020-10-27 17:53:06
 * @Description: 批量编辑页面
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React, { useEffect } from 'react';
import { ComboGrid, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { CorporationListConfig } from '../../../QualitySynergy/commonProps';
import {
  AllCompanyConfig,
  AuditCauseManagementConfig, AuditTypeManagementAll,
  NormalSupplierConfig,
  SelectionStrategyConfig,
} from '../../mainData/commomService';
import { reviewTypes } from '../propsParams';
import { hideFormItem } from '@/utils/utilTool';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}


const BatchEditModal = (props) => {

  const { visible, title, form, type, fatherData = {} } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onCancel = () => {
    props.onCancel()
  }

  const onOk = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      props.onOk(values);
    });
  }

  const HideFormItem = hideFormItem(getFieldDecorator);

  return (
    <ExtModal
      width={'100vh'}
      maskClosable={false}
      visible={visible}
      title='批量编辑'
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form>
        <Row>
          <Col span={12}>
            {HideFormItem('reviewTypeId')}
            {HideFormItem('reviewTypeCode')}
            <FormItem {...formItemLayoutLong} label={'审核类型'}>
              {
                getFieldDecorator('reviewTypeName', {
                  // rules: [
                  //   {
                  //     required: true,
                  //     message: '审核类型不能为空',
                  //   },
                  // ],
                })(
                  <ComboGrid
                    form={form}
                    name='reviewTypeName'
                    {...reviewTypes}
                    field={['reviewTypeId', 'reviewTypeCode']}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonId', type === 'add' ? '' : fatherData.reviewReasonId)}
          </Col>
          <Col span={0}>
            {hideFormItem('reviewReasonCode', type === 'add' ? '' : fatherData.reviewReasonCode)}
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonName')(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewReasonName'}
                    field={['reviewReasonCode', 'reviewReasonId']}
                    {...AuditCauseManagementConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'预计审核月度'}>
              {
                getFieldDecorator('supplierStrategyName')(
                  <InputNumber min={0} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={0}>
            {hideFormItem('countryId', type === 'add' ? '' : fatherData.countryId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countryCode', type === 'add' ? '' : fatherData.countryCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('provinceId', type === 'add' ? '' : fatherData.provinceId)}
          </Col>
          <Col span={0}>
            {hideFormItem('provinceCode', type === 'add' ? '' : fatherData.provinceCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityId', type === 'add' ? '' : fatherData.cityId)}
          </Col>
          <Col span={0}>
            {hideFormItem('cityCode', type === 'add' ? '' : fatherData.cityCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyId', type === 'add' ? '' : fatherData.countyId)}
          </Col>
          <Col span={0}>
            {hideFormItem('countyCode', type === 'add' ? '' : fatherData.countyCode)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '国家不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }} placeholder={'国家'} />
                )
              }
              {
                getFieldDecorator('provinceName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '省不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }} />
                )
              }
              {
                getFieldDecorator('cityName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '市不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }} />
                )
              }
              {
                getFieldDecorator('countyName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '区/县不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '15%' }} />
                )
              }
              {
                getFieldDecorator('address', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '详细地址不能为空',
                    },
                  ],
                })(
                  <Input style={{ width: '40%' }} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系人'}>
              {
                getFieldDecorator('contactUserName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系人不能为空',
                    },
                  ],
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系方式'}>
              {
                getFieldDecorator('contactUserTel', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '供应商联系方式不能为空',
                    },
                  ],
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'备注'}>
              {
                getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : '',
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  )

}

export default Form.create()(BatchEditModal);
