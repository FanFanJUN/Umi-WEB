import { useState, useImperativeHandle, forwardRef } from 'react';
import { ExtModal } from 'suid';
import { Form, Input } from 'antd';
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

const FormItemTypes = {

}

const ModalForm = forwardRef(({
  fields = [],
  title = '表单',
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    show,
    hide,
    setFormValues
  }))
  const [visible, toggleVisible] = useState(false);
  const { getFieldDecorator, setFieldsValue } = form;
  async function show() {
    await toggleVisible(true)
  }
  function hide() {
    await toggleVisible(false)
  }

  function setFormValues(fds) {
    setFieldsValue(fds)
  }
  return (
    <ExtModal
      title={title}
      visible={visible}
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