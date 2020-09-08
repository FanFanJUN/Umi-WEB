import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, DatePicker, Upload, Modal, Icon, Button } from 'antd';
import { ComboList, ExtModal } from 'suid';
import { CorporationListConfig } from '../../../../commonProps';
import { baseUrl } from '../../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const TechnicalDataModal = (props) => {

  const {visible, type, title, form} = props

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
    fileList: []
  })

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values);
      }
    });
  }

  const onCancel = () => {
    props.onCancel()
  }

  const clearSelected = () => {
    props.form.resetFields();
  };

  //获取请求头
  const getHeaders = () => {
    let auth;
    try {
      auth = JSON.parse(localStorage.getItem('Authorization'));
    } catch (e) {
    }
    return {
      'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
    }
  }

  const handleChange = (value) => {
    console.log(value)
  }


  return(
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
            <FormItem {...formItemLayoutLong} label={'文件类别'}>
              {
                getFieldDecorator('fileType', {
                initialValue: type === 'add' ? '' : data.fileType,
                rules: [
              {
                required: true,
                message: '文件类别不能为空',
              },
                ],
              })(<ComboList
                form={form}
                field={['corporationCode', 'corporationId']}
                name={'fileType'}
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
                })(<Input />)
              }
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'技术资料附件'}>
              {
                getFieldDecorator('technicalDataFileId', {
                  initialValue: type === 'add' ? '123456' : data.technicalDataFileId,
                  rules: [
                    {
                      required: true,
                      message: '技术资料附件不能为空',
                    },
                  ],
                })(
                  <Upload
                    name="fileUpload"
                    showUploadList={false}
                    fileList={data.fileList}
                    action={baseUrl + "/supplierRegister/uploadNoAuth"}
                    headers={getHeaders()}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                  >
                    {type !== 'detail' && <Button type='dashed'><Icon type="plus" />选择文件</Button>}
                  </Upload>
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
                })(<DatePicker style={{width: '100%'}} />)
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  )
}

export default Form.create()(TechnicalDataModal)
