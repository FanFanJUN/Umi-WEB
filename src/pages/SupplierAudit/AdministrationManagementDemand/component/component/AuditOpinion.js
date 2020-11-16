import React, { useState } from 'react';
import { Col, Form, Input, Row } from 'antd';
import { ComboList, ComboTree } from 'suid';
import { AllCompanyConfig, ApplyOrganizationProps } from '../../../mainData/commomService';
import Upload from '../../../../QualitySynergy/compoent/Upload';
const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const formLongLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};
const AuditOpinion = (props) => {

  const { type, form, editData } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
  })

  const onSelectRow = (keys, rows) => {
    setData(v => ({...v, selectKeys: keys, selectRows: rows}))
  }

  const handleOk = value => {
    console.log(value)
  }

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {getFieldDecorator(name, {
        initialValue: initialValue,
      })(<Input type={'hidden'} />)}
    </FormItem>
  );

  return (
    <>
      <Row>
        <Col span={12}>
          <FormItem label="审核综合评审得分" {...formLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '审核综合评审得分不能为空',
                  },
                ],
              })(
                <Input disabled={true}/>
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="评定等级" {...formLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '评定等级不能为空',
                  },
                ],
              })(
                <Input disabled={true}/>
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="风险等级" {...formLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '风险等级不能为空',
                  },
                ],
              })(
                <Input disabled={true}/>
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="是否通过" {...formLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '是否通过不能为空',
                  },
                ],
              })(
                <Input disabled={true}/>
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="结论" {...formLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '结论不能为空',
                  },
                ],
              })(
                <Input disabled={true}/>
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="备注" {...formLongLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
              })(
                <Input.TextArea rows={5} />
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="附件" {...formLongLayout}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '附件不能为空',
                  },
                ],
              })(
                <Upload entityId={editData.fileList ? editData.fileList : null}/>,
              )
            }
          </FormItem>
        </Col>
      </Row>
    </>
  )
}
export default Form.create()(AuditOpinion);
