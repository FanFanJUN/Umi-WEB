import { useState, useImperativeHandle, forwardRef } from 'react';
import styles from './index.less'
import { ExtModal } from 'suid';
import { Form, Input, Row, Col } from 'antd';
import PropTypes from 'prop-types';

const { Item: FormItem, create } = Form;
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
  label: ShowLabel
}
const ModalForm = forwardRef(({
  fields = [],
  title = '表单',
  onOk = () => null,
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
    const value = await validateFieldsAndScroll()

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
    >
      <Form {...formLayout}>
        <Row>
          {
            fields.map(field => {
              const Item = FormItemTypes[field.type] || Input;
              return (
                <FormItem label={field.label}>
                  {
                    getFieldDecorator(field.name, field.option)(<Item style={{ width: '100%' }} />)
                  }
                </FormItem>
              )
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