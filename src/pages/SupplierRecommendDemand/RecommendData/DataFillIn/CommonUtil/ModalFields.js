import { useImperativeHandle, forwardRef } from 'react';
import {
  Form,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  InputNumber,
} from 'antd';
import moment from 'moment';
import {
  ExtModal,
  ComboList,
  ComboGrid,
  YearPicker
} from 'suid';
import UploadFile from '../../../../../components/Upload'
const { TextArea } = Input
const fieldTypes = {
  'input': Input,
  'textArea': TextArea,
  'comboList': ComboList,
  'comboGrid': ComboGrid,
  'datePicker': DatePicker,
  'yearPicker': YearPicker,
  'uploadFile': UploadFile,
  'inputNumber': InputNumber,
  'select': Select
}

const { create, Item } = Form;
const formLayout = {
  labelCol: {
    span: 12,
  },
  wrapperCol: {
    span: 12,
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
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  useImperativeHandle(ref, () => ({
    setValue,
    validateFieldsAndScroll
  }))
  function setValue(v) {
    const { guid, ...otherValue } = v
    setFieldsValue(otherValue)
  }
  function getDisabledValue(ds, tv) {
    if (Object.is(null, ds)) {
      return ds
    }
    if (typeof ds === 'function') {
      const v = ds(tv)
      return v
    }
  }
  function getFieldComponent(field) {
    const {
      name = '',
      label = '',
      fieldType = '',
      options = {},
      props = {},
      disabledDate = () => null,
      disabledTarget = name,
      disabledTargetValue = null,
      selectOptions = [
        {
          value: true,
          name: '是'
        },
        {
          value: false,
          name: '否'
        }
      ]
    } = field;
    const fieldsValue = getFieldsValue();
    const tv = fieldsValue[disabledTarget];
    const { disabled = null } = props;
    const formatDisabled = typeof disabled === 'boolean' ? disabled : getDisabledValue(disabled, disabledTargetValue ? disabledTargetValue : tv);
    const FieldItem = fieldTypes[fieldType] || Input;
    const { rules = [], ...other } = options
    const opt = {
      ...other,
      rules: rules.map(item => {
        if (item.validator) {
          return {
            validator: (r, v, c) => item.validator(r, v, c, tv)
          }
        }
        if (!Object.is(undefined, item.required) && typeof item.required === 'function') {
          return {
            ...item,
            required: item.required(tv)
          }
        }
        return item
      })
    };
    switch (fieldType) {
      case 'datePicker' || 'yearPicker':
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, opt)(
                  <FieldItem
                    {...props}
                    disabled={formatDisabled}
                    allowClear
                    disabledDate={(ct) => disabledDate(ct, moment, tv)}
                    style={{ width: '100%' }}
                  />
                )
              }
            </Item>
          </Col>
        )
      case 'comboList' || 'comboGrid':
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                props.field.map(f => getFieldDecorator(f)),
                getFieldDecorator(name, opt)(
                  <FieldItem
                    {...props}
                    disabled={formatDisabled}
                    allowClear
                    form={form}
                    style={{ width: '100%' }}
                  />
                )
              }
            </Item>
          </Col>
        )
      case 'inputNumber':
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, opt)(
                  <FieldItem
                    {...props}
                    precision={2}
                    disabled={formatDisabled}
                    allowClear
                    style={{ width: '100%' }}
                  />
                )
              }
            </Item>
          </Col>
        )
      case 'select':
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, opt)(
                  <FieldItem
                    {...props}
                    allowClear
                    style={{ width: '100%' }}
                    disabled={formatDisabled}
                  >
                    {
                      selectOptions.map((item, key) =>
                        <Select.Option key={`${key}-select-options-${name}`} value={item.value}>{item.name}</Select.Option>
                      )
                    }
                  </FieldItem>
                )
              }
            </Item>
          </Col>
        )
      case 'uploadFile':
        const v = fieldsValue[name];
        return (
          <Col key={`${name}-field-item`} span={12}>
            <Item label={label}>
              {
                getFieldDecorator(name, opt)(
                  <FieldItem
                    entityId={v}
                    {...props}
                    disabled={formatDisabled}
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
                getFieldDecorator(name, opt)(
                  <FieldItem
                    {...props}
                    disabled={formatDisabled}
                    allowClear
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
      width={`90vw`}
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