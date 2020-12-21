import React, { useEffect, useState } from 'react';
import { ComboList, ExtModal, ComboGrid } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import { UserSelect } from '@/components';
import { GetUserTelByUserId, DocumentAuditCauseManagementByReviewTypeConfig } from '../../mainData/commomService';
import {
  reviewOrganizeProps,
  reviewWaysProps,
  CountryIdConfig,
  AreaConfig,
} from '../../AnnualAuditPlan/propsParams';
import { basicServiceUrl, gatewayUrl, baseUrl } from '@/utils/commonUrl';


const FormItem = Form.Item;
const width = 160;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};


const BatchEditModal = (props) => {

  const { visible, form, selectedRows } = props;
  const [required, setRequired] = useState('');
  const [originData, setOriginData] = useState({});

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  useEffect(() => {
    if (selectedRows && selectedRows.length > 0) {
      setOriginData(selectedRows.length === 1 ? selectedRows[0] : {});
      setRequired(selectedRows.length < 2);
    }
  }, [selectedRows])

  const onCancel = () => {
    props.onCancel();
  };

  // 批量
  const onOk = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      props.onCancel();
      props.onOk(values, !required);
    });
  };

  const getMemberTel = (id) => {
    GetUserTelByUserId({
      userId: id,
    }).then(res => {
      if (res.success) {
        setFieldsValue({
          leaderTel: res.data.mobile,
        });
      }
    });
  }

  return (
    <ExtModal
      width={'60vw'}
      centered
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
            <FormItem {...formItemLayoutLong} label={'审核原因'} style={{ marginBottom: '0px' }}>
              {
                (getFieldDecorator('reviewReasonId', { initialValue: originData.reviewReasonId }),
                getFieldDecorator('reviewReasonCode', {
                  initialValue: originData.reviewReasonCode,
                }),
                getFieldDecorator('reviewReasonName', {
                  initialValue: originData.reviewReasonName,
                  rules: [{ required, message: '审核方式不能为空' }],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewReasonName'}
                    field={['reviewReasonCode', 'reviewReasonId']}
                    disabled={originData.sourceType !== 'ADMISSION_RECOMMENDATION'}
                    disabled={selectedRows.some(
                      item => item.sourceType !== 'ADMISSION_RECOMMENDATION',
                    )}
                    store={{
                      params: {
                        findByReviewTypeCode: selectedRows[0].reviewTypeCode,
                      },
                      type: 'GET',
                      autoLoad: false,
                      url: `${baseUrl}/api/reviewReasonService/findByReviewTypeCode`,
                    }}
                    {...DocumentAuditCauseManagementByReviewTypeConfig}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核方式'} style={{ marginBottom: '0px' }}>
              {
                (getFieldDecorator('reviewWayId', { initialValue: originData.reviewWayId }),
                getFieldDecorator('reviewWayCode', { initialValue: originData.reviewWayCode }),
                getFieldDecorator('reviewWayName', {
                  initialValue: originData.reviewWayName,
                  rules: [{ required, message: '审核方式不能为空' }],
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
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayoutLong}
              label={'审核组织形式'}
              style={{ marginBottom: '0px' }}
            >
              {
                (getFieldDecorator('reviewOrganizedWayId', {
                  initialValue: originData.reviewOrganizedWayId,
                }),
                getFieldDecorator('reviewOrganizedWayCode', {
                  initialValue: originData.reviewOrganizedWayCode,
                }),
                getFieldDecorator('reviewOrganizedWayName', {
                  initialValue: originData.reviewOrganizedWayName,
                  rules: [{ required, message: '审核组织形式不能为空' }],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'reviewOrganizedWayName'}
                    field={['reviewOrganizedWayId', 'reviewOrganizedWayCode']}
                    {...reviewOrganizeProps}
                  />,
                ))
              }
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              {...formItemLayoutLong}
              label={'审核小组组长'}
              style={{ marginBottom: '0px' }}
            >
              {
                (getFieldDecorator('leaderId', { initialValue: originData.leaderId }),
                getFieldDecorator('leaderEmployeeNo', {
                  initialValue: originData.leaderEmployeeNo,
                }),
                getFieldDecorator('leaderTel', { initialValue: originData.leaderTel }),
                getFieldDecorator('leaderName', {
                  initialValue: originData.leaderName,
                  rules: [{ required, message: '审核小组组长不能为空' }],
                })(
                  <UserSelect
                    placeholder="选择成员"
                    form={form}
                    mode="tags"
                    name="name"
                    multiple={false}
                    reader={{
                      name: 'userName',
                      field: ['code', 'id'],
                    }}
                    onRowsChange={item => {
                      getMemberTel(item.id);
                      setFieldsValue({
                        leaderName: item.userName,
                        leaderId: item.id,
                        leaderEmployeeNo: item.code,
                      });
                    }}
                  />,
                ))
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'} style={{ marginBottom: '0px' }}>
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
                    allowClear={true}
                    style={{ width: '15%' }}
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
                ))
              }
              {
                (getFieldDecorator('cityId', { initialValue: originData.cityId }),
                getFieldDecorator('cityCode', { initialValue: originData.cityCode }),
                getFieldDecorator('cityName', {
                  initialValue: originData.cityName,
                  rules: [{ required, message: '市不能为空' }],
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
                ))
              }
              {
                (getFieldDecorator('countyId', { initialValue: originData.countyId }),
                getFieldDecorator('countyCode', { initialValue: originData.countyCode }),
                getFieldDecorator('countyName', {
                  initialValue: originData.countyName,
                  rules: [{ required, message: '区/县不能为空' }],
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
                ))
              }
              {getFieldDecorator('address', {
                initialValue: originData.address,
                rules: [{ required, message: '详细地址不能为空' }],
              })(<Input style={{ width: '40%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem
              {...formItemLayoutLong}
              label={'供应商联系人'}
              style={{ marginBottom: '0px' }}
            >
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
            <FormItem
              {...formItemLayoutLong}
              label={'供应商联系方式'}
              style={{ marginBottom: '0px' }}
            >
              {getFieldDecorator('contactUserTel', {
                initialValue: originData.contactUserTel,
                rules: [
                  {
                    required,
                    message: '供应商联系方式不能为空',
                  },
                ],
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'备注'} style={{ marginBottom: '0px' }}>
              {getFieldDecorator('remark', {
                initialValue: originData.remark,
              })(<Input.TextArea rows={6} style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );

};

export default Form.create()(BatchEditModal);
