import React, { useEffect, useState } from 'react';
import { ComboList, ExtModal } from 'suid';
import { Checkbox, Col, Form, Input, Row } from 'antd';
import { BasicUnitList } from '../../../commonProps';
import { baseUrl } from '../../../../../utils/commonUrl';

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
      maskClosable={false}
      onOk={onOk}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'限用物质代码'}>
              {
                getFieldDecorator('limitMaterialCode', {
                  initialValue: type === 'add' ? '' : data.limitMaterialCode,
                  rules: [
                    {
                      required: true,
                      message: '限用物质代码不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'限用物质名称'}>
              {
                getFieldDecorator('limitMaterialName', {
                  initialValue: type === 'add' ? '' : data.limitMaterialName,
                  rules: [
                    {
                      required: true,
                      message: '限用物质名称不能为空',
                    },
                  ],
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'CAS.NO'}>
              {
                getFieldDecorator('casNo', {
                  initialValue: type === 'add' ? '' : data.casNo,
                })(
                  <Input/>,
                )
              }
            </FormItem>
          </Col>
          {/*<Col span={0}>*/}
          {/*  {hideFormItem('basicUnitName', type === 'add' ? '' : data.basicUnitName)}*/}
          {/*</Col>*/}
          {/*<Col span={0}>*/}
          {/*  {hideFormItem('basicUnitId', type === 'add' ? '' : data.basicUnitId)}*/}
          {/*</Col>*/}
          {/*<Col span={24}>*/}
          {/*  <FormItem {...formItemLayoutLong} label={'基本单位'}>*/}
          {/*    {*/}
          {/*      getFieldDecorator('basicUnitCode', {*/}
          {/*        initialValue: type === 'add' ? '' : data.basicUnitCode,*/}
          {/*        rules: [*/}
          {/*          {*/}
          {/*            required: true,*/}
          {/*            message: '基本单位不能为空',*/}
          {/*          },*/}
          {/*        ],*/}
          {/*      })(*/}
          {/*        <ComboList*/}
          {/*          afterSelect={SelectChange}*/}
          {/*          {...BasicUnitList}*/}
          {/*        />,*/}
          {/*      )*/}
          {/*    }*/}
          {/*  </FormItem>*/}
          {/*</Col>*/}
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'是否测试记录表中检查项'}>
              {
                getFieldDecorator('recordCheckList', {
                  initialValue: type === 'add' ? false : data.recordCheckList,
                  valuePropName: 'checked',
                })(
                  <Checkbox/>,
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
