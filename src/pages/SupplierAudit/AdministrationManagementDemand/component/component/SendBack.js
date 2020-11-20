import React, { useState } from 'react';
import { ExtModal } from 'suid';
import { Row, Input, message, Col, Form } from 'antd';
import { SendBackApi } from '../../commonApi';

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const FormItem = Form.Item;

const SendBack = (props) => {

  const { visible } = props;

  const { getFieldDecorator } = props.form;

  const handleOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = Object.assign(props.params, values);
        SendBackApi(params).then(res => {
          if (res.success) {
            message.success(res.message);
            onCancel();
            props.refresTable()
          } else {
            message.error(res.message);
          }
        }).catch(err => {
          message.error(err.messages);
        });
      }
    });
  };

  const onCancel = () => {
    props.onCancel();
  };

  const clearSelected = () => {
    props.form.resetFields();
  };

  return (
    <ExtModal
      width={'90vh'}
      maskClosable={false}
      visible={visible}
      title={'退回'}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'意见'}>
            {
              getFieldDecorator('suggestion', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '意见不能为空',
                  },
                ],
              })(
                <Input.TextArea row={6} style={{ width: '100$' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
    </ExtModal>
  );

};

export default Form.create()(SendBack);
