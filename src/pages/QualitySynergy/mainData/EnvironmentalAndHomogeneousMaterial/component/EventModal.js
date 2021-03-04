import React from 'react';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import { findAllByPageNotFrozenHomogeneousMaterialType, findPageEnvironmentalProtectionData, limitMaterialList } from '../../../commonProps';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EventModal = (props) => {

  const { visible, title, data, type } = props;

  const { getFieldDecorator, setFieldsValue, validateFieldsAndScroll, resetFields } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values);
      }
    });
  };

  const clearSelected = () => {
    resetFields();
  };

  const { labelConfig } = props;

  const placeholderAutocomplete = (name, isChoice) => {
    return `${isChoice ? '请选择' : '请输入'}${name}`
  }

  const RequiredRules = (message) => {
    return {
      required: true,
      message
    }
  }

  const { environmentalProtectionCode, environmentalProtectionName, homogeneousMaterialTypeCode, homogeneousMaterialTypeName, limitMaterialCode, limitMaterialName, orderNo } = labelConfig;

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      maskClosable={false}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={environmentalProtectionCode.name}>
              {
                getFieldDecorator(environmentalProtectionCode.code, {
                  initialValue: type === 'add' ? '' : data[environmentalProtectionCode.code],
                  rules: [
                    {
                      ...RequiredRules(placeholderAutocomplete(environmentalProtectionCode.name, true))
                    },
                  ],
                })(
                  <ComboList form={props.form}
                    {...findPageEnvironmentalProtectionData}
                    name='materialName'
                    field={['materialId', 'materialCode', 'casNo']}
                    afterSelect={(item) => {
                      setFieldsValue({ [environmentalProtectionCode.code]: item[environmentalProtectionCode.code] })
                    }}
                    placeholder={placeholderAutocomplete(environmentalProtectionCode.name, true)}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={environmentalProtectionName.name}>
              {
                getFieldDecorator(environmentalProtectionName.code, {
                  initialValue: type === 'add' ? '' : data[environmentalProtectionName.code],
                })(
                  <Input placeholder={placeholderAutocomplete(environmentalProtectionName.name)} />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={homogeneousMaterialTypeCode.name}>
              {
                getFieldDecorator(homogeneousMaterialTypeCode.code, {
                  initialValue: type === 'add' ? '' : data[homogeneousMaterialTypeCode.code],
                  rules: [
                    {
                      ...RequiredRules(placeholderAutocomplete(homogeneousMaterialTypeCode.name, true))
                    },
                  ],
                })(
                  <ComboList form={props.form}
                    {...findAllByPageNotFrozenHomogeneousMaterialType}
                    name='materialName'
                    field={['materialId', 'materialCode', 'casNo']}
                    afterSelect={(item) => {
                      setFieldsValue({ [homogeneousMaterialTypeCode.code]: item[homogeneousMaterialTypeCode.code] })
                    }}
                    placeholder={placeholderAutocomplete(homogeneousMaterialTypeCode.name, true)}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={homogeneousMaterialTypeName.name}>
              {
                getFieldDecorator(homogeneousMaterialTypeName.code, {
                  initialValue: type === 'add' ? '' : data[homogeneousMaterialTypeName.code],
                })(
                  <Input placeholder={placeholderAutocomplete(homogeneousMaterialTypeName.name)} />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={limitMaterialCode.name}>
              {
                getFieldDecorator(limitMaterialCode.code, {
                  initialValue: type === 'add' ? '' : data[limitMaterialCode.code],
                  rules: [
                    {
                      ...RequiredRules(placeholderAutocomplete(limitMaterialCode.name, true))
                    },
                  ],
                })(
                  <ComboList form={props.form}
                    {...limitMaterialList}
                    name='materialName'
                    field={['materialId', 'materialCode', 'casNo']}
                    afterSelect={(item) => {
                      setFieldsValue({ [limitMaterialCode.code]: item.limitMaterialCode })
                    }}
                    placeholder={placeholderAutocomplete(limitMaterialCode.name, true)}
                  />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={limitMaterialName.name}>
              {
                getFieldDecorator(limitMaterialName.code, {
                  initialValue: type === 'add' ? '' : data[limitMaterialName.code],
                })(
                  <Input placeholder={placeholderAutocomplete(limitMaterialName.name)} />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={orderNo.name}>
              {
                getFieldDecorator(orderNo.code, {
                  initialValue: type === 'add' ? '' : data[orderNo.code],
                  rules: [
                    {
                      ...RequiredRules(placeholderAutocomplete(orderNo.name))
                    },
                    { pattern: RegExp(/^[1-9]\d*$/, "g"), message: '只能是数字' },
                  ],
                })(
                  <Input placeholder={placeholderAutocomplete(orderNo.name)} />,
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
