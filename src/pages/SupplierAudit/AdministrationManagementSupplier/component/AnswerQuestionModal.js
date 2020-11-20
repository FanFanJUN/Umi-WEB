import React  from 'react';
import { ExtModal } from 'suid';
import { Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment/moment';
import Upload from '../../../QualitySynergy/compoent/Upload';

const FormItem = Form.Item;

const formLongLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const formLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const AnswerQuestionModal = (props) => {

  const { editData } = props;

  const { getFieldDecorator } = props.form;

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.completionTime = moment(values.completionTime).format('YYYY-MM-DD')
        values = Object.assign(props.editData, values)
        props.onOk(values)
      }
    });
  };

  return (
    <ExtModal
      width={'100vh'}
      maskClosable={false}
      visible={visible}
      title={'回答问题'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
    >
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'问题描述'}>
            {
              getFieldDecorator('problemDescribe', {
                initialValue: !editData.problemDescribe ? '' : editData.problemDescribe,
              })(
                <Input disabled={true} style={{ width: '100' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'问题分析'}>
            {
              getFieldDecorator('reason', {
                initialValue: !editData.reason ? '' : editData.reason,
                rules: [
                  {
                    required: true,
                    message: '问题分析不能为空',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="请输入问题分析" style={{ width: '100%' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'预防措施'}>
            {
              getFieldDecorator('preventiveMeasures', {
                initialValue: !editData.preventiveMeasures ? '' : editData.preventiveMeasures,
                rules: [
                  {
                    required: true,
                    message: '预防措施不能为空',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="请输入预防措施" style={{ width: '100%' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'纠正措施'}>
            {
              getFieldDecorator('measures', {
                initialValue: !editData.measures ? '' : editData.measures,
                rules: [
                  {
                    required: true,
                    message: '纠正措施不能为空',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="请输入纠正措施" style={{ width: '100%' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'见证材料'}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: !editData.attachRelatedIds ? [] : editData.attachRelatedIds,
                rules: [
                  {
                    required: true,
                    message: '见证材料不能为空',
                  },
                ],
              })(
                <Upload entityId={editData.attachRelatedIds ? null : editData.attachRelatedIds} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'完成时间'}>
            {
              getFieldDecorator('completionTime', {
                initialValue: !editData.completionTime ? null : moment(editData.completionTime),
                rules: [
                  {
                    required: true,
                    message: '完成时间不能为空',
                  },
                ],
              })(
                <DatePicker style={{ width: '100%' }} />,
              )
            }
          </FormItem>
        </Col>
      </Row>
    </ExtModal>
  );

};

export default Form.create()(AnswerQuestionModal);
