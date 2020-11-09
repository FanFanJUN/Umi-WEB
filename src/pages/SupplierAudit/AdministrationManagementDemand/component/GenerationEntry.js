import React, { useRef, useState } from 'react';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import styles from './index.less';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import BU from '../../../QualitySynergy/mainData/BU';
import { ApplyOrganizationProps } from '../../mainData/commomService';

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

  const { type, editData, visible, form } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
  });

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const clearSelected = () => {

  };

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
        <Col span={12}>
          <FormItem {...formLongLayout} label={'实际打分人员'}>
            {
              getFieldDecorator('attachRelatedIds', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    message: '实际打分人员不能为空',
                  },
                ],
              })(
                <ComboTree
                  allowClear={true}
                  style={{ width: '100%' }}
                  form={form}
                  name={'applyDepartmentName'}
                  {...ApplyOrganizationProps}
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
