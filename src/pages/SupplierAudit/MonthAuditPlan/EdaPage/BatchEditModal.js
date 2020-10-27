/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-23 17:00:19
 * @LastEditTime: 2020-10-23 17:46:46
 * @Description: 批量编辑页面
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BatchEditModal.js
 */
import React, { useEffect } from 'react';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { CorporationListConfig } from '../../../QualitySynergy/commonProps';
import {
  AllCompanyConfig,
  AuditCauseManagementConfig, AuditTypeManagementAll,
  NormalSupplierConfig,
  SelectionStrategyConfig,
} from '../../mainData/commomService';

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

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'} />,
        )
      }
    </FormItem>
  );

  return (
    <ExtModal
      width={'120vh'}
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
            <FormItem {...formItemLayoutLong} label={'审核原因'}>
              {
                getFieldDecorator('reviewReasonId'),
                getFieldDecorator('reviewReasonCode')(
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
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核方式'}>
              {
                 getFieldDecorator('reviewTypeId'),
                 getFieldDecorator('reviewTypeCode'),
                getFieldDecorator('reviewTypeName')(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
        <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核组织形式'}>
              {
                getFieldDecorator('reviewReasonId'),
                getFieldDecorator('reviewReasonCode')(
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
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核小组组长'}>
              {
                 getFieldDecorator('reviewTypeId'),
                 getFieldDecorator('reviewTypeCode'),
                getFieldDecorator('reviewTypeName')(
                  <Input />
                )
              }
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayout} label={'生产厂地址'}>
              {
                getFieldDecorator('countryId'),
                getFieldDecorator('countryCode'),
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
                getFieldDecorator('provinceId'),
                getFieldDecorator('provinceCode'),
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
                getFieldDecorator('cityId'),
                getFieldDecorator('cityCode'),
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
                getFieldDecorator('countyId'),
                getFieldDecorator('countyCode'),
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
