import React, { useRef, useState } from 'react';
import { ComboList, ExtModal, ExtTable } from 'suid';
import { Col, Form, Row } from 'antd';
import { AuditCauseManagementConfig } from '../../../mainData/commomService';
const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const columns = []

const Content = (props) => {
  const tableRef = useRef(null);

  const [data, setData] = useState({

  })

  const {visible, form, type} = props

  const { getFieldDecorator, getFieldValue, setFieldsValue } = props.form;

  const onOk = () => {

  }

  const onCancel = () => {

  }

  const clearSelected = () => {

  }

  const handleSelectedRows = (keys, values) => {

  }

  return (
    <ExtModal
      width={'90vh'}
      maskClosable={false}
      visible={visible}
      title={'审核内容管理'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Form>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayoutLong} label={'审核体系'}>
              {
                getFieldDecorator('fileCategoryName', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '审核体系不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'name'}
                    field={['code', 'id']}
                    {...AuditCauseManagementConfig}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>

    </ExtModal>
  )

}

export default Form.create()(Content);
