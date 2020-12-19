/*
 * @Author: Li Cai
 * @LastEditors  : LiCai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime : 2020-12-19 14:32:54
 * @Description: 批量编辑页面
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React, { useEffect, useState } from 'react';
import { ComboGrid, ComboList, ExtModal } from 'suid';
import { Col, Form, Input, DatePicker, message, Row } from 'antd';
import { reviewTypesProps, reviewReasonsProps, reviewWaysProps, AreaConfig, CountryIdConfig } from '../propsParams';
import { hideFormItem } from '@/utils/utilTool';
import { basicServiceUrl, gatewayUrl, baseUrl } from '@/utils/commonUrl';
import { findReviewTypesByCode } from '../service';
import moment from 'moment';
import { isEmptyObject } from '../../../../utils/utilTool';
import { FormItemStye } from '../styleParam';

const FormItem = Form.Item;
const { MonthPicker } = DatePicker;

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
  const [required, setReqired] = useState(!isEmptyObject(originData));
  console.log(originData);

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useEffect(() => {
    async function fetchData() {
      const res = await findReviewTypesByCode({ quickSearchValue: '监督审核' });
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
      if (values.reviewMonth) {
        values.reviewMonth = moment(values.reviewMonth).format('YYYY-MM-DD').toString();
      }
      props.onOk(values);
    });
  }

  const HideFormItem = hideFormItem(getFieldDecorator);

  function handleSelectProvice(item, index) {
    if (item) {
      setFieldsValue({ cityId: '', cityCode: '', cityName: '', countyId: '', countyCode: '', countyName: '', address: '' });
    }
  }

  function handleSelectCity(item, index) {
    if (item) {
      setFieldsValue({ countyId: '', countyCode: '', countyName: '', address: '' });
    }
  }

  function handleSelectCounty(item, index) {
    if (item) {
      setFieldsValue({ address: '' });
    }
  }

  function handleClear(type) {
    const clear = {
      'city': handleSelectCity,
      'province': handleSelectProvice,
      'county': handleSelectCounty,
    }
    const b = clear[type]({}); // 创建b 属性 并执行属性事件
  }

  return (
    <ExtModal
      width={'120vh'}
      maskClosable={false}
      visible={visible}
      title="批量编辑"
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose
    >
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核类型'} style={FormItemStye}>
              {
                (getFieldDecorator('reviewTypeId', { initialValue: originData.reviewTypeId }),
                getFieldDecorator('reviewTypeCode', { initialValue: originData.reviewTypeCode }),
                getFieldDecorator('reviewTypeName', {
                  initialValue: originData.reviewTypeName,
                  rules: [
                    {
                      required,
                      message: '审核类型不能为空',
                    },
                  ],
                })(
                  <ComboGrid
                    form={form}
                    name="reviewTypeName"
                    {...reviewTypesProps}
                    field={['reviewTypeId', 'reviewTypeCode']}
                    disabled
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核原因'} style={FormItemStye}>
              {
                (getFieldDecorator('reviewReasonId', { initialValue: originData.reviewReasonId }),
                getFieldDecorator('reviewReasonCode', {
                  initialValue: originData.reviewReasonCode,
                }),
                getFieldDecorator('reviewReasonName', {
                  initialValue: originData.reviewReasonName,
                  rules: [
                    {
                      required,
                      message: '审核原因不能为空',
                    },
                  ],
                })(
                  <ComboGrid
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewReasonName'}
                    field={['reviewReasonId', 'reviewReasonCode']}
                    cascadeParams={{
                      findByReviewTypeCode: getFieldValue('reviewTypeCode'),
                    }}
                    store={{
                      params: {
                        findByReviewTypeCode: getFieldValue('reviewTypeCode'),
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${baseUrl}/api/reviewReasonService/findByReviewTypeCode`,
                    }}
                    {...reviewReasonsProps}
                    disabled={getFieldValue('reviewTypeCode') === ''}
                  />,
                ))
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核方式'} style={FormItemStye}>
              {
                (getFieldDecorator('reviewWayId', { initialValue: originData.reviewWayId }),
                getFieldDecorator('reviewWayCode', { initialValue: originData.reviewWayCode }),
                getFieldDecorator('reviewWayName', {
                  initialValue: originData.reviewWayName,
                  rules: [
                    {
                      required,
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
                ))
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'预计审核月度'} style={FormItemStye}>
              {getFieldDecorator('reviewMonth', {
                initialValue: originData.reviewMonth && moment(originData.reviewMonth),
                rules: [
                  {
                    required,
                    message: '预计审核月度不能为空',
                  },
                ],
              })(<MonthPicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <FormItem
              labelCol={{ span: 12 }}
              wrapperCol={{ span: 12 }}
              label={'生产厂地址'}
              style={FormItemStye}
            >
              {
                (getFieldDecorator('countryId', { initialValue: originData.countryId }),
                getFieldDecorator('countryCode', { initialValue: originData.countryCode }),
                getFieldDecorator('countryName', {
                  initialValue: originData.countryName,
                  rules: [
                    {
                      required,
                      message: '国家不能为空',
                    },
                  ],
                })(
                  <ComboList
                    width={width}
                    form={form}
                    name={'countryName'}
                    field={['countryId', 'countryCode']}
                    store={{
                      params: {
                        filters: [
                          { fieldName: 'code', fieldType: 'string', operator: 'EQ', value: 'CN' },
                        ],
                      },
                      type: 'POST',
                      autoLoad: false,
                      url: `${gatewayUrl}${basicServiceUrl}/region/findByPage`,
                    }}
                    placeholder={'国家'}
                    {...CountryIdConfig}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem style={FormItemStye}>
              {
                (getFieldDecorator('provinceId', { initialValue: originData.provinceId }),
                getFieldDecorator('provinceCode', { initialValue: originData.provinceCode }),
                getFieldDecorator('provinceName', {
                  initialValue: originData.provinceName,
                  rules: [
                    {
                      required,
                      message: '省不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
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
                    afterSelect={handleSelectProvice}
                    afterClear={() => handleClear('province')}
                    {...AreaConfig}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem style={FormItemStye}>
              {
                (getFieldDecorator('cityId', { initialValue: originData.cityId }),
                getFieldDecorator('cityCode', { initialValue: originData.cityCode }),
                getFieldDecorator('cityName', {
                  initialValue: originData.cityName,
                  rules: [
                    {
                      required,
                      message: '市不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
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
                    afterSelect={handleSelectCity}
                    afterClear={() => handleClear('city')}
                    {...AreaConfig}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem style={FormItemStye}>
              {
                (getFieldDecorator('countyId', { initialValue: originData.countyId }),
                getFieldDecorator('countyCode', { initialValue: originData.countyCode }),
                getFieldDecorator('countyName', {
                  initialValue: originData.countyName,
                  rules: [
                    {
                      required,
                      message: '区/县不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
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
                    afterSelect={handleSelectCounty}
                    afterClear={() => handleClear('county')}
                    {...AreaConfig}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem style={FormItemStye}>
              {getFieldDecorator('address', {
                initialValue: originData.address,
                rules: [
                  {
                    required,
                    message: '详细地址不能为空',
                  },
                ],
              })(<Input placeholder={'详细地址'} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系人'} style={FormItemStye}>
              {getFieldDecorator('contactUserName', {
                initialValue: originData.contactUserName,
                rules: [
                  {
                    required,
                    message: '供应商联系人不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'供应商联系方式'} style={FormItemStye}>
              {getFieldDecorator('contactUserTel', {
                initialValue: originData.contactUserTel,
                rules: [{ required, message: '供应商联系方式不能为空' }],
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'备注'} style={FormItemStye}>
              {getFieldDecorator('remark', {
                initialValue: originData.remark,
                rules: [{ max: 200, message: '输入长度不能超过200' }],
              })(<Input.TextArea rows={6} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );

}

export default Form.create()(BatchEditModal);
