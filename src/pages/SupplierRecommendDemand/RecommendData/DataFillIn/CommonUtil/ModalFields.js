import { useImperativeHandle, forwardRef } from 'react';
import { Form, Col, Row, Input, DatePicker } from 'antd';
import moment from 'moment';
import { ExtModal, ComboList, ComboGrid } from 'suid';
const fieldTypes = {
  'input': Input,
  'comboList': ComboList,
  'comboGrid': ComboGrid,
  'datePicker': DatePicker
}

const { create, Item } = Form;
const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  }
};
function ModalFields({
  type = 'create',
  form,
  fields = [],
  ...modalProps
}, ref) {
  const {
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue
  } = form;
  useImperativeHandle(ref, () => ({
    setFieldsValue
  }))
  function getFieldComponent(field) {
    const {
      name = '',
      label = '',
      fieldType = '',
      option = {},
      props = {},
      disabledDate = () => null,
      disabledTarget = name
    } = field;
    const fieldsValue = getFieldsValue();
    const tv = fieldsValue[disabledTarget];
    const FieldItem = fieldTypes[fieldType] || Input;
    switch (fieldType) {
      case 'datePicker' || 'yearPicker':
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, option)(
                  <FieldItem
                    {...props}
                    disabledDate={(ct) => disabledDate(ct, moment, tv)}
                    style={{ width: '100%' }}
                  />
                )
              }
            </Item>
          </Col>
        )
      default:
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, option)(
                  <FieldItem
                    {...props}
                    style={{ width: '100%' }}
                  />
                )
              }
            </Item>
          </Col>
        )
    }
  }
  const typeName = type === 'create' ? '新增数据' : '编辑数据';
  return (
    <ExtModal
      destroyOnClose
      title={typeName}
      maskClosable={false}
      width={`80vw`}
      centered
      bodyStyle={{
        height: '60vh',
        overflowY: 'scroll'
      }}
      {...modalProps}
    >
      <Form {...formLayout}>
        <Row>
          {
            fields.map(field => {
              const FormItem = getFieldComponent(field);
              return FormItem
            })
          }
        </Row>
      </Form>
    </ExtModal>
  )
}

const ModalFieldForward = forwardRef(ModalFields)

export default create()(ModalFieldForward);