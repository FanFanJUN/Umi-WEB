import React, { useEffect, useState } from 'react';
import { ComboList, ExtModal } from 'suid';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { BasicUnitList } from '../../../commonProps';
import { baseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EventModal = (props) => {

  const { visible, title, data, type } = props;

  console.log(data, 'dat的数据');

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

  const SelectChange = (value) => {
    setFieldsValue({
      basicUnitCode: value.basicUnitCode,
      basicUnitName: value.basicUnitName,
      basicUnitId: value.id
    });
  };

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {
        getFieldDecorator(name, {
          initialValue: initialValue,
        })(
          <Input type={'hidden'}/>,
        )
      }
    </FormItem>
  );

  const clearSelected = () => {
    props.form.resetFields();
  };

  return (
    <ExtModal
      width={'80vh'}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'基本单位代码'}>
              {
                getFieldDecorator('basicUnitCode', {
                  initialValue: type === 'add' ? '' : data.basicUnitCode,
                  rules: [
                    {
                      required: true,
                      message: '基本单位代码不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('frozen', type === 'add' ? '' : data.frozen)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'基本单位名称'}>
              {
                getFieldDecorator('basicUnitName', {
                  initialValue: type === 'add' ? '' : data.basicUnitName,
                  rules: [
                    {
                      required: true,
                      message: '基本单位名称不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'排序号'}>
              {
                getFieldDecorator('orderNo', {
                  initialValue: type === 'add' ? '' : data.orderNo,
                  rules: [
                    {
                      required: true,
                      message: '排序号不能为空',
                    },
                  ],
                })(
                  <Input/>,
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
