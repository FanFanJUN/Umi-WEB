/**
 * @Description: 审核意见modal
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Input, Row, Spin } from 'antd';
import { ExtModal } from 'suid';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const OpinionModal = forwardRef(({ form, title }, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
    getFormValue,
  }));
  const [visible, setVisible] = useState(false);

  const handleModalVisible = (flag) => {
    setVisible(!!flag);
  };

  const getFormValue = () => {
    form.validateFieldsAndScroll((err, values) => {
      return values;
    });
  };

  const onCancel = () => {
    form.resetFields();
  };
  const onOk = () => {
    setVisible(false);
  };

  const { getFieldDecorator } = form;

  return <ExtModal
    width={1000}
    centered
    maskClosable={false}
    visible={visible}
    title={title}
    onCancel={onCancel}
    onOk={onOk}
  >
    <Row>
      <Col span={24}>
        <FormItem label="备注" {...formLayout}>
          {getFieldDecorator('remark', {})(
            <Input/>,
          )}
        </FormItem>
      </Col>
    </Row>
  </ExtModal>;

});

export default Form.create()(OpinionModal);
