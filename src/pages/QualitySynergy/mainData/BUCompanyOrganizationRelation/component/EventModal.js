import React, { useEffect, useState } from 'react';
import { ComboList, ExtModal } from 'suid';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { BasicUnitList, BUConfig, CompanyConfig, OrganizationByCompanyCodeConfig } from '../../../commonProps';
import { baseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EventModal = (props) => {

  const { visible, title, data, type, form } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values);
      }
    });
  };

  const SelectChange = (value) => {
    setFieldsValue({
      basicUnitCode: value.basicUnitCode,
      basicUnitName: value.basicUnitName,
      basicUnitId: value.id,
    });
  };

  const clearSelected = () => {
    props.form.resetFields();
  };

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'BU'}>
              {
                getFieldDecorator('buCode'),
                getFieldDecorator('buId'),
                getFieldDecorator('buName', {
                initialValue: type === 'add' ? '' : data.buName,
                rules: [
              {
                required: true,
                message: 'BU不能为空',
              },
                ],
              })(<ComboList
                form={form}
                name={'buName'}
                field={['buCode', 'buId']}
                {...BUConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'公司'}>
              {
                getFieldDecorator('corporationCode'),
                getFieldDecorator('corporationId'),
                getFieldDecorator('corporationName', {
                  initialValue: type === 'add' ? '' : data.corporationName,
                  rules: [
                    {
                      required: true,
                      message: '公司不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  field={['corporationCode', 'corporationId']}
                  name={'corporationName'}
                  {...CompanyConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'采购组织'}>
              {
                getFieldDecorator('purchaseOrgName', {
                  initialValue: type === 'add' ? '' : data.corporationName,
                  rules: [
                    {
                      required: true,
                      message: '采购组织不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  name={'purchaseOrgName'}
                  store={{
                    params: {
                      companyCode: getFieldValue('corporationCode')
                    },
                    type: 'GET',
                    autoLoad: false,
                    url: `${baseUrl}/buCompanyPurchasingOrganization/findPurchaseOrganizationByCompanyCode`,
                  }}
                  {...OrganizationByCompanyCodeConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'排序号'}>
              {
                getFieldDecorator('orderNo', {
                  initialValue: type === 'add' ? '' : data.orderNo,
                  rules: [
                    {
                      required: true,
                      message: '排序号不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

EventModal.defaultProps = {
  form: {},
  type: 'add',
  data: {},
  visible: false,
  title: '',
  onCancel: () => {
  },
  onOk: () => {
  },
};

export default Form.create()(EventModal);
