import React from 'react';
import { Col, DatePicker, Form, Modal, Select } from 'antd';

const FormItem = Form.Item

const TacticAssign = (props) => {

  const formItemLayoutLong = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
  };

  const {visible} = props

  const handleOk = () => {

  }

  const handleCancel = () => {
    props.onCancel()
  }

  const {getFieldDecorator} = props.form;

  return(
    <Modal
      title='指派战略采购'
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div style={{height: '50px'}}>
        <Form>
          <Col span={24}>
            <FormItem
              {...formItemLayoutLong}
              label="战略采购"
            >
              {
                getFieldDecorator("strategicPurchasing", {
                  initialValue: '1',
                })(
                  <Select style={{width: '100%'}}>
                    <Select.Option value='1'>test</Select.Option>
                    <Select.Option value='2'>2</Select.Option>
                    <Select.Option value='3'>3</Select.Option>
                  </Select>
                )
              }
            </FormItem>
          </Col>
        </Form>
      </div>
    </Modal>
  )
}
TacticAssign.defaultPorps ={
  onCancel: () => {},
  visible: false
}

export default Form.create()(TacticAssign);
