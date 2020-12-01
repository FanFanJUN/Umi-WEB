import React, { useEffect, useState } from 'react';
import { ComboList, ExtModal } from 'suid';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import {
  ApplicableStateProps,
  BasicUnitList,
  BUConfig,
  BUConfigNoFrost,
  CompanyConfig,
  OrganizationByCompanyCodeConfig,
} from '../../../commonProps';
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

  const clearSelected = () => {
    props.form.resetFields();
  };

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
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      maskClosable={false}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('buCode', type === 'add' ? '' : data.buCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('buId', type === 'add' ? '' : data.buId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'业务单元'}>
              {
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
                  {...BUConfigNoFrost}
                />)
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('corporationCode', type === 'add' ? '' : data.corporationCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('corporationId', type === 'add' ? '' : data.corporationId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'公司'}>
              {
                getFieldDecorator('corporationName', {
                  initialValue: type === 'add' ? '' : data.corporationName,
                  rules: [
                    {
                      required: true,
                      message: '公司不能为空',
                    },
                  ],
                })(<ComboList
                  // afterSelect={() => setFieldsValue('')}
                  form={form}
                  field={['corporationCode', 'corporationId']}
                  name={'corporationName'}
                  {...CompanyConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('purchaseOrgCode', type === 'add' ? '' : data.purchaseOrgCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('purchaseOrgId', type === 'add' ? '' : data.purchaseOrgId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'采购组织'}>
              {
                getFieldDecorator('purchaseOrgName', {
                  initialValue: type === 'add' ? '' : data.purchaseOrgName,
                  rules: [
                    {
                      required: true,
                      message: '采购组织不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  field={['purchaseOrgCode', 'purchaseOrgId']}
                  name={'purchaseOrgName'}
                  cascadeParams={{
                    Q_EQ_corporationCode: getFieldValue('corporationCode'),
                  }}
                  store={{
                    params: {
                      Q_EQ_corporationCode: getFieldValue('corporationCode'),
                    },
                    type: 'GET',
                    autoLoad: false,
                    url: `${baseUrl}/purchaseOrg/listByPage`,
                  }}
                  {...OrganizationByCompanyCodeConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'供应商评价默认标识'}>
              {
                getFieldDecorator('supplierEvaluation', {
                  valuePropName: 'checked',
                  initialValue: type === 'add' ? false : !!data.supplierEvaluation,
                })(<Checkbox />)
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
                  <Input />,
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
