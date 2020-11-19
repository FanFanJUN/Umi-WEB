import React, { useEffect, useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import styles from './index.less';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import BU from '../../../QualitySynergy/mainData/BU';
import { ApplyOrganizationProps, EvaluationSystemConfig } from '../../mainData/commomService';
import { ActualGraderConfig } from '../../AuditRequirementsManagement/commonApi';
import { getRandom } from '../../../QualitySynergy/commonProps';
import moment from 'moment/moment';

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

const GenerationEntry = (props) => {

  const { visible, form, reviewImplementPlanCode } = props;

  const { getFieldDecorator } = props.form;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values.id);
      }
    });
  };

  const clearSelected = () => {

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
      width={'100vh'}
      maskClosable={false}
      visible={visible}
      title={'选择实际打分人员'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Row>
        <Col span={0}>
          {hideFormItem('id', '')}
        </Col>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'实际打分人员'}>
            {
              getFieldDecorator('leaderName', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '实际打分人员不能为空',
                  },
                ],
              })(
                <ComboList
                  allowClear={true}
                  style={{ width: '100%' }}
                  form={form}
                  defaultExpandAll={false}
                  name={'leaderName'}
                  field={['id']}
                  cascadeParams={{
                    reviewImplementPlanCode,
                  }}
                  {...ActualGraderConfig}
                />,
              )
            }
          </FormItem>
        </Col>
      </Row>
    </ExtModal>
  );

};

export default Form.create()(GenerationEntry);
