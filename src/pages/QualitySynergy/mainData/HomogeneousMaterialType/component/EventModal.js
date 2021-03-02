import React from 'react';
import { ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EventModal = (props) => {

  const { visible, title, data, type } = props;

  const { getFieldDecorator, setFieldsValue } = props.form;

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

  const formDataLabelName = {
    homogeneousMaterialTypeCode: '均质材料分类代码',
    homogeneousMaterialTypeName: '均质材料分类名称',
  }

  const placeholderAutocomplete = (name) => {
    return '请输入' + name
  }

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      maskClosable={false}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={formDataLabelName.homogeneousMaterialTypeCode}>
              {
                getFieldDecorator('homogeneousMaterialTypeCode', {
                  initialValue: type === 'add' ? '' : data.homogeneousMaterialTypeCode,
                  rules: [
                    {
                      required: true,
                      message: `${formDataLabelName.homogeneousMaterialTypeCode}不能为空`,
                      whitespace: true
                    },
                    {
                      max: 4,
                      message: '超出最大长度',
                    }
                  ],
                })(
                  <Input placeholder={placeholderAutocomplete(formDataLabelName.homogeneousMaterialTypeCode)} />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={formDataLabelName.homogeneousMaterialTypeName}>
              {
                getFieldDecorator('homogeneousMaterialTypeName', {
                  initialValue: type === 'add' ? '' : data.homogeneousMaterialTypeName,
                  rules: [
                    {
                      required: true,
                      message: `${formDataLabelName.homogeneousMaterialTypeName}不能为空`,
                      whitespace: true
                    },
                    {
                      max: 20,
                      message: '超出最大长度',
                    }
                  ],
                })(
                  <Input placeholder={placeholderAutocomplete(formDataLabelName.homogeneousMaterialTypeName)} />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

EventModal.defaultProps = {
  form: {},
  type: 'add',
  data: {},
  visible: false,
  title: '',
  onCancel: () => {
  },
  onOk: () => {
  },
};

export default Form.create()(EventModal);
