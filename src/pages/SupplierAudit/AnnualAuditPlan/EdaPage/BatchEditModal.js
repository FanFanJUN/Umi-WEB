/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime: 2020-11-27 09:38:27
 * @Description: 批量编辑页面
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React, { useEffect } from 'react';
import { ComboGrid, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, InputNumber, message, Row } from 'antd';
import { reviewTypesProps, reviewReasonsProps, reviewWaysProps, AreaConfig, CountryIdConfig } from '../propsParams';
import { phoneOrTel } from "@/utils";
import { hideFormItem } from '@/utils/utilTool';
import { basicServiceUrl, gatewayUrl } from '@/utils/commonUrl';
import { findReviewTypesByCode } from '../service';

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

  const { visible, title, form, type, originData = {} } = props;

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useEffect(() => {
    async function fetchData() {
      const res = await findReviewTypesByCode({ quickSearchValue: 'Supervision_review' });
      if (res.success) {
        const obj = res.data.rows;
        if (obj.length === 0) return;
        setFieldsValue({ reviewTypeId: obj[0].id, reviewTypeCode: obj[0].code, reviewTypeName: obj[0].name });
      } else {
        message.error('获取审核类型失败');
      }
    }
    fetchData();
  }, []);

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
            <FormItem {...formItemLayoutLong} label={'审核类型'}>
              {
                getFieldDecorator('reviewTypeId', { initialValue: originData.reviewTypeId }),
                getFieldDecorator('reviewTypeCode', { initialValue: originData.reviewTypeCode }),
                getFieldDecorator('reviewTypeName', {
                  initialValue: originData.reviewTypeName,
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
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonId', { initialValue: originData.reviewReasonId }),
                getFieldDecorator('reviewReasonCode', { initialValue: originData.reviewReasonCode }),
                getFieldDecorator('reviewReasonName', {
                  initialValue: originData.reviewReasonName,
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
            <FormItem {...formItemLayoutLong} label={'审核方式'}>
              {
                getFieldDecorator('reviewWayId', { initialValue: originData.reviewWayId }),
                getFieldDecorator('reviewWayCode', { initialValue: originData.reviewWayCode }),
                getFieldDecorator('reviewWayName', {
                  initialValue: originData.reviewWayName,
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
                  initialValue: originData.reviewMonth,
                  rules: [
                    {
                      required: true,
                      message: '预计审核月度不能为空',
                    },
                  ],
                })(
                  <InputNumber min={1} max={12} style={{ width: '100%' }} />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryId', { initialValue: originData.countryId }),
                getFieldDecorator('countryCode', { initialValue: originData.countryCode }),
                getFieldDecorator('countryName', {
                  initialValue: originData.countryName,
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
                    field={['countryId', 'countryCode']}
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
                getFieldDecorator('provinceId', { initialValue: originData.provinceId }),
                getFieldDecorator('provinceCode', { initialValue: originData.provinceCode }),
                getFieldDecorator('provinceName', {
                  initialValue: originData.provinceName,
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
                getFieldDecorator('cityId', { initialValue: originData.cityId }),
                getFieldDecorator('cityCode', { initialValue: originData.cityCode }),
                getFieldDecorator('cityName', {
                  initialValue: originData.cityName,
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
                getFieldDecorator('countyId', { initialValue: originData.countyId }),
                getFieldDecorator('countyCode', { initialValue: originData.countyCode }),
                getFieldDecorator('countyName', {
                  initialValue: originData.countyName,
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
                    field={['countyId', 'countyCode']}
                    cascadeParams={{
                      nodeId: getFieldValue('cityId'),
                    }}
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
                  initialValue: originData.address,
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
                  initialValue: originData.contactUserName,
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
                  initialValue: originData.contactUserTel,
                  rules: [
                    { required: true, message: '供应商联系方式不能为空', },
                    { validator: phoneOrTel, message: '请输入手机或者座机号' }
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
                  initialValue: originData.remark,
                  rules: [{ max: 200, message: '输入长度不能超过200' },],
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
