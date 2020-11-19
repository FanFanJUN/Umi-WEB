import { useState, useImperativeHandle, forwardRef } from 'react';
import {
  ExtModal,
  ComboTree,
  ComboList
} from 'suid';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Select
} from 'antd';
import PropTypes from 'prop-types';

const { Option } = Select;
const { Item: FormItem, create } = Form;
const { MonthPicker } = DatePicker;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}

const ShowLabel = ({ value, ...props }) => <div {...props}>{value}</div>

const FormItemTypes = {
  label: ShowLabel,
  datePicker: DatePicker,
  monthPicker: MonthPicker,
  number: InputNumber,
  select: Select,
  comboList: ComboList,
  comboTree: ComboTree
}
const ModalForm = forwardRef(({
  fields = [],
  title = '表单',
  onOk = () => null,
  confirmLoading = false,
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    show,
    hide,
    setFormValues,
    getFormValues
  }))
  const [visible, toggleVisible] = useState(false);
  const {
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll
  } = form;
  async function show() {
    await toggleVisible(true)
  }
  async function hide() {
    await toggleVisible(false)
  }

  function setFormValues(fds) {
    setFieldsValue(fds)
  }
  async function getFormValues() {
    const value = await validateFieldsAndScroll();
    return value
  }
  async function handleOk() {
    const values = await validateFieldsAndScroll()
    onOk(values)
  }
  return (
    <ExtModal
      title={title}
      visible={visible}
      destroyOnClose
      okText='保存'
      cancelText='取消'
      onOk={handleOk}
      onCancel={hide}
      width={'80vw'}
      confirmLoading={confirmLoading}
    >
      <Form {...formLayout}>
        <Row gutter={[12, 0]}>
          {
            fields.map((field, keyIndex) => {
              const { type, name, option, label, labelOptions = [], props = {}, readers = [] } = field;
              const Item = FormItemTypes[type] || Input;
              switch (type) {
                case 'select':
                  return (
                    <Col
                      key={`${name}-${keyIndex}`}
                      span={12}
                    >
                      <FormItem label={label}>
                        {
                          getFieldDecorator(name, option)(<Item style={{ width: '100%' }}>
                            {
                              labelOptions.map((lbo, indexKey) => (
                                <Option
                                  key={`${name}-${indexKey}`}
                                  value={lbo.value}
                                >
                                  {lbo.text}
                                </Option>
                              ))
                            }
                          </Item>)
                        }
                      </FormItem>
                    </Col>
                  )
                default:
                  return (
                    <Col
                      key={`${name}-${keyIndex}`}
                      span={12}
                    >
                      <FormItem label={label}>
                        {
                          readers.map(field => getFieldDecorator(field.name)),
                          getFieldDecorator(name, option)(<Item style={{ width: '100%' }} {...props} form={form} />)
                        }
                      </FormItem>
                    </Col>
                  )
              }
            })
          }
        </Row>
      </Form>
    </ExtModal>
  )
})

ModalForm.propTypes = {
  fields: PropTypes.array,
  title: PropTypes.string
}

export default create()(ModalForm)