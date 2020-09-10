import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input } from 'antd';
import { ExtModal } from 'suid';
const { Item: FormItem } = Form;

const DataForm = forwardRef(({
  type = 'add',
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue
  }))
  const [opts, setOpts] = useState(['']);
  const { getFieldDecorator, setFieldsValue } = form;
  return (
    <Form>
      <FormItem>
        {
          getFieldDecorator('item', {
            rules: [
              {
                required: true,
                message: '请输入调查项目名称'
              }
            ]
          })(<Input />)
        }
      </FormItem>
    </Form>
  )
})

// function ItemOptions ({
//   value= [''],
//   onChange = () => null
// }) {
//   const []
//   return (
//     <div>
//       {
//         value.map()
//       }
//     </div>
//   )
// }

export default Form.create()(DataForm)

