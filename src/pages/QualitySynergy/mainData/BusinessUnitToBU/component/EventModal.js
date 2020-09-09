import React  from 'react';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import {
  BUConfigNoFrost, BUModelConfig,
} from '../../../commonProps';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const EventModal = (props) => {

  const { visible, title, data, type, form } = props;

  const { getFieldDecorator } = props.form;

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
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('bmCode', type === 'add' ? '' : data.bmCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('bmId', type === 'add' ? '' : data.bmId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'业务板块'}>
              {
                getFieldDecorator('bmName', {
                  initialValue: type === 'add' ? '' : data.bmName,
                  rules: [
                    {
                      required: true,
                      message: '公司不能为空',
                    },
                  ],
                })(<ComboList
                  // afterSelect={() => setFieldsValue('')}
                  form={form}
                  field={['bmCode', 'bmId']}
                  name={'bmName'}
                  {...BUModelConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={0}>
            {hideFormItem('buCode', type === 'add' ? '' : data.buCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('buId', type === 'add' ? '' : data.buId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'业务单元'}>
              {
                getFieldDecorator('buName', {
                  initialValue: type === 'add' ? '' : data.buName,
                  rules: [
                    {
                      required: true,
                      message: 'BU不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  name={'buName'}
                  field={['buCode', 'buId']}
                  {...BUConfigNoFrost}
                />)
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
                  <Input />,
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
