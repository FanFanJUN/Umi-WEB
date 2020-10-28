/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime: 2020-10-28 11:15:22
 * @Description: 批量编辑页面
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React from 'react';
import { ComboGrid, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { reviewTypesProps, reviewReasonsProps, reviewWaysProps } from '../propsParams';
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
                  rules: [
                    {
                      required: true,
                      message: '审核类型不能为空',
                    },
                  ],
                })(
                  <ComboGrid
                    form={form}
                    name='reviewTypeName'
                    {...reviewTypesProps}
                    field={['reviewTypeId', 'reviewTypeCode']}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            {HideFormItem('reviewReasonId')}
            {HideFormItem('reviewReasonCode')}
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonName', {
                  rules: [
                    {
                      required: true,
                      message: '审核原因不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewReasonName'}
                    field={['reviewReasonId', 'reviewReasonCode']}
                    {...reviewReasonsProps}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {HideFormItem('reviewWayId')}
            {HideFormItem('reviewWayCode')}
            <FormItem {...formItemLayoutLong} label={'审核方式'}>
              {
                getFieldDecorator('reviewWayName', {
                  rules: [
                    {
                      required: true,
                      message: '审核方式不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewWayName'}
                    field={['reviewWayId', 'reviewWayCode']}
                    {...reviewWaysProps}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'预计审核月度'}>
              {
                getFieldDecorator('reviewMonth', {
                  rules: [
                    {
                      required: true,
                      message: '预计审核月度不能为空',
                    },
                  ],
                })(
                  <InputNumber min={0} style={{ width: '100%' }} />
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
