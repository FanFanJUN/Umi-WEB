import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input } from 'antd';
import { ComboList, ExtModal } from 'suid';
import { BUConfig, CompanyConfig, OrganizationByCompanyCodeConfig } from '../../../../commonProps';
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
  })

  const onOk = () => {
    props.onOk()
  }

  const onCancel = () => {
    props.onCancel()
  }

  const clearSelected = () => {
    props.form.resetFields();
  };

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
                name={'corporationName'}
                {...CompanyConfig}
                />)
              }
            </FormItem>
          </Col>

        </Row>
      </Form>
    </ExtModal>
  )
}

export default Form.create()(TechnicalDataModal)
