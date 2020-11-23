import React, { useEffect, useState } from 'react';
import { Col, Form, Input, message, Row } from 'antd';
import { ComboList, ComboTree } from 'suid';
import { AllCompanyConfig, ApplyOrganizationProps } from '../../../mainData/commomService';
import Upload from '../../../../QualitySynergy/compoent/Upload';
import { GetVerificationAuditOpinionDataApi, whetherArr } from '../../commonApi';
import { getDocIdForArray } from '../../../../../utils/utilTool';

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

  const { editData, reviewImplementPlanCode } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({});

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {getFieldDecorator(name, {
        initialValue: initialValue,
      })(<Input type={'hidden'} />)}
    </FormItem>
  );

  useEffect(() => {
    GetVerificationAuditOpinionDataApi({
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        const response = res.data[0] ? res.data[0] : {};
        setData(response);
        console.log(res.data);
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  }, []);

  return (
    <>
      <Row>
        <Col span={12}>
          <FormItem label="审核综合评审得分" {...formLayout}>
            {
              getFieldDecorator('reviewScore', {
                initialValue: editData.reviewScore,
                rules: [
                  {
                    required: true,
                    message: '审核综合评审得分不能为空',
                  },
                ],
              })(
                <Input disabled={true} />,
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="评定等级" {...formLayout}>
            {
              getFieldDecorator('performanceRating', {
                initialValue: editData.performanceRating,
                rules: [
                  {
                    required: true,
                    message: '评定等级不能为空',
                  },
                ],
              })(
                <Input disabled={true} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="风险等级" {...formLayout}>
            {
              getFieldDecorator('riskRating', {
                initialValue: editData.riskRating,
              })(
                <Input disabled={true} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem label="是否通过" {...formLayout}>
            {
              getFieldDecorator('whetherPass', {
                initialValue: '',
              })(
                <Input disabled={true} />,
              )
            }
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem label="结论" {...formLayout}>
            {
              getFieldDecorator('whetherPass', {
                initialValue: whetherArr[data.whetherPass],
              })(
                <Input disabled={true} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="备注" {...formLongLayout}>
            {
              getFieldDecorator('remark', {
                initialValue: data.remark,
              })(
                <Input.TextArea rows={5} />,
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
                <Upload entityId={editData.fileList ? getDocIdForArray(data.fileList) : null} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
    </>
  );
};
export default Form.create()(AuditOpinion);
