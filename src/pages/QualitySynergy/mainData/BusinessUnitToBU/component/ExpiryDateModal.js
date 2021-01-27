import React from 'react';
import { ExtModal } from 'suid';
import { Col, Form, Input, Row, DatePicker } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const ExpiryDateModal = (props) => {

  const { visible, data, form } = props;

  const { getFieldDecorator } = form;

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
      title={'有效截止日期'}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('id', data.id)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'有效截止日期'}>
              {
                getFieldDecorator('effectiveEndDate', {
                  initialValue: data.effectiveEndDate ? moment(data.effectiveEndDate) : null
                })(
                  <DatePicker
                    format="YYYY-MM-DD"
                    style={{ width: '100%' }}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

ExpiryDateModal.defaultProps = {
  form: {},
  data: {},
  visible: false,
  onCancel: () => {
  },
  onOk: () => {
  },
};

export default Form.create()(ExpiryDateModal);