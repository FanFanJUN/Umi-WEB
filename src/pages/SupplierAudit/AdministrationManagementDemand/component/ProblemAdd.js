import React, { useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import styles from './index.less';
import { Button, Col, DatePicker, Form, Input, InputNumber, Row } from 'antd';
import BU from '../../../QualitySynergy/mainData/BU';
import {
  ApplyOrganizationProps, AuditTypeManagementConfig, PersonnelTypeConfig,
  SelectionStrategyConfig,
  UserByDepartmentNameConfig,
} from '../../mainData/commomService';
import { OrderSeverityConfig } from '../../AuditRequirementsManagement/commonApi';
import moment from 'moment/moment';
import { getRandom } from '../../../QualitySynergy/commonProps';

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

const ProblemAdd = (props) => {

  const { type, form, userInfo, isView, title, editData } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
  });

  const { visible } = props;

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (type === 'add') {
          values.lineNum = getRandom(10)
          values.whetherDeleted = false
          values.demandCompletionTime = moment(values.demandCompletionTime).format('YYYY-MM-DD')
        } else {
          values.demandCompletionTime =  values.demandCompletionTime._d ? moment(values.demandCompletionTime).format('YYYY-MM-DD') : values.demandCompletionTime
          values = Object.assign(editData, values)
          console.log(Object.assign(editData, values))
        }
        props.onOk(values);
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
          <Input type={'hidden'}/>,
        )
      }
    </FormItem>
  );

  return (
    <ExtModal
      width={'100vh'}
      maskClosable={false}
      visible={visible}
      title={title}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'部门/过程'}>
            {
              getFieldDecorator('department', {
                initialValue: type === 'add' ? '' : editData.department,
                rules: [
                  {
                    required: true,
                    message: '部门/过程不能为空',
                  },
                ],
              })(
                <Input placeholder="请输入部门/过程" style={{ width: '100' }}/>,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem {...formLayout} label={'问题描述'}>
            {
              getFieldDecorator('problemDescribe', {
                initialValue: type === 'add' ? '' : editData.problemDescribe,
                rules: [
                  {
                    required: true,
                    message: '问题描述不能为空',
                  },
                ],
              })(
                <Input.TextArea rows={4} placeholder="请输入问题描述" style={{ width: '100%' }}/>,
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Col span={0}>
        {hideFormItem('severity', type === 'add' ? '' : editData.severity)}
      </Col>
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'严重程度'}>
            {
              getFieldDecorator('severityName', {
                initialValue: type === 'add' ? '' : editData.severityName,
                rules: [
                  {
                    required: true,
                    message: '严重程度不能为空',
                  },
                ],
              })(
                <ComboList
                  style={{ width: '100%' }}
                  form={form}
                  field={['severity']}
                  name={'severityName'}
                  {...OrderSeverityConfig}
                />
              )
            }
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'要求整改完成日期'}>
            {
              getFieldDecorator('demandCompletionTime', {
                initialValue: type === 'add' ? null : moment(editData.demandCompletionTime),
                rules: [
                  {
                    required: true,
                    message: '要求整改完成日期不能为空',
                  },
                ],
              })(
                <DatePicker />
              )
            }
          </FormItem>
        </Col>
      </Row>
    </ExtModal>
  );

};

export default Form.create()(ProblemAdd);
