/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime: 2020-10-28 15:12:42
 * @Description: 批量编辑页面
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React from 'react';
import { ComboGrid, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { reviewTypesProps, reviewReasonsProps, reviewWaysProps, AreaConfig, CountryIdConfig } from '../propsParams';
import { hideFormItem } from '@/utils/utilTool';
import { basicServiceUrl, gatewayUrl } from '@/utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

const width = 160;

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
                  <ComboGrid
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
                  <ComboGrid
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
          {HideFormItem('countryId')}
          {HideFormItem('countyCode')}
          {HideFormItem('provinceId')}
          {HideFormItem('provinceCode')}
          {HideFormItem('cityId')}
          {HideFormItem('cityCode')}
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryName', {
                  rules: [
                    {
                      required: true,
                      message: '国家/省/市/区县/详细地址不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    width={width}
                    form={form}
                    name={'countryName'}
                    field={['countryId', 'countyCode']}
                    store={{
                      params: {
                        filters: [{ fieldName: 'code', fieldType: 'string', operator: 'EQ', value: 'CN' }],
                      },
                      type: 'POST',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/findByPage`,
                    }}
                    placeholder={'国家'}
                    {...CountryIdConfig}
                  />,
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    width={width}
                    form={form}
                    name={'provinceName'}
                    field={['provinceId', 'provinceCode']}
                    cascadeParams={{
                      countryId: getFieldValue('countryId'),
                    }}
                    store={{
                      params: {
                        countryId: getFieldValue('countryId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getProvinceByCountry`,
                    }}
                    placeholder={'省'}
                    {...AreaConfig}
                  />,
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    width={width}
                    form={form}
                    name={'cityName'}
                    field={['cityId', 'cityCode']}
                    cascadeParams={{
                      provinceId: getFieldValue('provinceId'),
                    }}
                    store={{
                      params: {
                        provinceId: getFieldValue('provinceId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getCityByProvince`,
                    }}
                    placeholder={'市'}
                    {...AreaConfig}
                  />,
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
                  <ComboList
                    allowClear={true}
                    style={{ width: '15%' }}
                    width={width}
                    form={form}
                    name={'countyName'}
                    field={['countyId']}
                    store={{
                      params: {
                        includeSelf: false,
                        nodeId: getFieldValue('cityId'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/getChildrenNodes`,
                    }}
                    placeholder={'区/县'}
                    {...AreaConfig}
                  />,
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
                  <Input style={{ width: '40%' }} placeholder={'请输入详细地址'} />,
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
