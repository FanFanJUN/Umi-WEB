import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, DatePicker } from 'antd';
import Upload from '../../../../compoent/Upload';
import { ComboList, ExtModal } from 'suid';
import moment from 'moment';
import { CorporationListConfig, getRandom } from '../../../../commonProps';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TechnicalDataModal = (props) => {

  const { visible, type, title, form, fatherData } = props;

  const { getFieldDecorator } = props.form;

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (type === 'add') {
          // 构造一个随机数Id
          values.lineNumber = getRandom(10).toString()
        } else {
          values.id = fatherData.id
          values.lineNumber = fatherData.lineNumber
        }
        props.onOk(values);
      }
    });
  };

  const onCancel = () => {
    props.onCancel();
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
          <Input type={'hidden'}/>,
        )
      }
    </FormItem>
  );

  return (
    <ExtModal
      width={'80vh'}
      maskClosable={false}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('fileCategoryCode', type === 'add' ? '' : fatherData.fileCategoryCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('fileCategoryId', type === 'add' ? '' : fatherData.fileCategoryId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'文件类别'}>
              {
                getFieldDecorator('fileCategoryName', {
                  initialValue: type === 'add' ? '' : fatherData.fileCategoryName,
                  rules: [
                    {
                      required: true,
                      message: '文件类别不能为空',
                    },
                  ],
                })(<ComboList
                  form={form}
                  field={['fileCategoryCode', 'fileCategoryId']}
                  name={'fileCategoryName'}
                  {...CorporationListConfig}
                />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'文件版本'}>
              {
                getFieldDecorator('fileVersion', {
                  initialValue: type === 'add' ? '' : fatherData.fileVersion,
                  rules: [
                    {
                      required: true,
                      message: '文件版本不能为空',
                    },
                  ],
                })(<Input/>)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'技术资料附件'}>
              {
                getFieldDecorator('technicalDataFileIdList', {
                  initialValue: type === 'add' ? null : fatherData.technicalDataFileIdList,
                  rules: [
                    {
                      required: true,
                      message: '技术资料附件不能为空',
                    },
                  ],
                })(
                  <Upload entityId={type === 'add' ? null : fatherData.technicalDataFileIdList} />
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'样品需求日期'}>
              {
                getFieldDecorator('sampleRequirementDate', {
                  initialValue: type === 'add' ? (() => {
                    let d = new Date();
                    d.setMonth(d.getMonth() +1);
                    return moment(d)
                  })() : moment(fatherData.sampleRequirementDate),
                  rules: [
                    {
                      required: true,
                      message: '样品需求日期不能为空',
                    },
                  ],
                })(<DatePicker style={{ width: '100%' }}/>)
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

export default Form.create()(TechnicalDataModal);
