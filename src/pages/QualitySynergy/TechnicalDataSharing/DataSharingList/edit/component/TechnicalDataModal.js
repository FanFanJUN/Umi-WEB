import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, DatePicker, Upload, Modal, Icon, Button } from 'antd';
import { ComboList, ExtModal } from 'suid';
import { CorporationListConfig } from '../../../../commonProps';
import { baseUrl } from '../../../../../../utils/commonUrl';
import UploadFile from '../../../../../../components/Upload';
import { ComboAttachment } from '../../../../../../components';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TechnicalDataModal = (props) => {

  const { visible, type, title, form } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [attachment, setAttachment] = useState(null);

  const [data, setData] = useState({
    technicalDataFileId: [],
    fileList: [],
  });

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values);
      }
    });
  };

  console.log(data.technicalDataFileId, 'technicalDataFileId');

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
          <Input type={'hidden'} />,
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
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={0}>
            {hideFormItem('fileCategoryCode', type === 'add' ? '' : data.fileCategoryCode)}
          </Col>
          <Col span={0}>
            {hideFormItem('fileCategoryId', type === 'add' ? '' : data.fileCategoryId)}
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'文件类别'}>
              {
                getFieldDecorator('fileCategoryName', {
                  initialValue: type === 'add' ? '' : data.fileCategoryName,
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
                  initialValue: type === 'add' ? '' : data.fileVersion,
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
                getFieldDecorator('technicalDataFileId', {
                  initialValue: type === 'add' ? '' : data.technicalDataFileId,
                  rules: [
                    {
                      required: true,
                      message: '技术资料附件不能为空',
                    },
                  ],
                })(
                  <ComboAttachment
                    uploadButton={{ disabled: type === 'detail' }}
                    allowDelete={type !== 'detail'}
                    showViewType={type !== 'detail'}

                    customBatchDownloadFileName={true}
                    attachment={attachment}/>,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'样品需求日期'}>
              {
                getFieldDecorator('sampleRequirementDate', {
                  initialValue: type === 'add' ? null : data.sampleRequirementDate,
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
