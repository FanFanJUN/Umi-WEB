/**
 * @Description: 新增Modal框
 * @Author: M!keW
 * @Date: 2020-11-23
 */
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Col, Form, Row, message, Input } from 'antd';
import { ExtModal } from 'suid';
import { openNewTab } from '@/utils';


const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AddSupplierInfoModal = forwardRef(({ onOk = () => null, editData, form, isView }, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
  }));
  const [visible, setVisible] = useState(false);
  const handleModalVisible = (flag) => {
    setVisible(!!flag);
  };

  const handleSubmit = () => {
    if (isView) {
      setVisible(false);
    } else {
      form.validateFieldsAndScroll(async (err, value) => {
        if (!err) {
          onOk({ ...editData, ...value });
        } else {
          message.error('请将表单填写完成');
        }
      });
    }
  };
  const { getFieldDecorator } = form;

  return <ExtModal
    width={600}
    centered
    maskClosable={false}
    visible={visible}
    title="供应商审核不足及改善"
    onCancel={() => setVisible(false)}
    onOk={handleSubmit}
    destroyOnClose
  >
    <Row>
      <Col span={22}>
        <FormItem label="改善事项描述" {...formLayout}>
          {isView ? <span
            style={{
              width: '100%',
              border: 'none',
            }}>{editData ? editData.improvementDescription : ''}</span> : getFieldDecorator('improvementDescription', {
            initialValue: editData ? editData.improvementDescription : '',
            rules: [{ required: true, message: '请填写改善事项描述' }],
          })(
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: '100%' }} maxLength={200}/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem label="原因分析" {...formLayout}>
          {isView ? <span
            style={{
              width: '100%',
              border: 'none',
            }}>{editData ? editData.causeAnalysis : ''}</span> : getFieldDecorator('causeAnalysis', {
            initialValue: editData ? editData.causeAnalysis : '',
            rules: [{ required: true, message: '请填写原因分析' }],
          })(
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: '100%' }} maxLength={1000}/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem label="改进措施及要求" {...formLayout}>
          {isView ? <span
            style={{
              width: '100%',
              border: 'none',
            }}>{editData ? editData.improveMeasureRequire : ''}</span> : getFieldDecorator('improveMeasureRequire', {
            initialValue: editData ? editData.improveMeasureRequire : '',
            rules: [{ required: true, message: '请填写改进措施及要求' }],
          })(
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: '100%' }} maxLength={200}/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem label="责任人" {...formLayout}>
          {isView ? <span
            style={{
              width: '100%',
              border: 'none',
            }}>{editData ? editData.thoseResponsible : ''}</span> : getFieldDecorator('thoseResponsible', {
            initialValue: editData ? editData.thoseResponsible : '',
            rules: [{ required: true, message: '请填写责任人' }],
          })(
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: '100%' }} maxLength={200}/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={22}>
        <FormItem label="检查" {...formLayout}>
          {isView ? <span
            style={{
              width: '100%',
              border: 'none',
            }}>{editData ? editData.check : ''}</span> : getFieldDecorator('check', {
            initialValue: editData ? editData.check : '',
            rules: [{ required: true, message: '请填写检查' }],
          })(
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} style={{ width: '100%' }} maxLength={1000}/>,
          )}
        </FormItem>
      </Col>
    </Row>
  </ExtModal>;

});

export default Form.create()(AddSupplierInfoModal);
