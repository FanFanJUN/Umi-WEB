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

const ProblemAdd = (props) => {

  const columns = [
    { title: '部门/过程', dataIndex: 'reviewRequirementCode', width: 150 },
    { title: '问题描述', dataIndex: 'reviewRequirementName', ellipsis: true, width: 300 },
    { title: '严重程度', dataIndex: 'applyCorporationName', ellipsis: true, width: 180 },
    { title: '要求整改完成日期', dataIndex: 'applyDepartmentName', ellipsis: true, width: 200 },
  ].map(item => ({ ...item, align: 'center' }));

  const tableRef = useRef(null);

  const { type, form, userInfo, isView, title, editData } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  const [data, setData] = useState({
    dataSource: [{
      lineNum: 1,
      orgName: 'true',
    }],
    visible: false,
    selectedRowKeys: [],
    selectedRowRows: [],
  });

  const { visible } = props;

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
              getFieldDecorator('attachRelatedIds', {
                initialValue: type === 'add' ? '' : editData.fileList,
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
              getFieldDecorator('attachRelatedIds', {
                initialValue: type === 'add' ? '' : editData.fileList,
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
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'严重程度'}>
            {
              getFieldDecorator('applyDepartmentName', {
                initialValue: type === 'add' ? '' : editData.fileList,
                rules: [
                  {
                    required: true,
                    message: '严重程度不能为空',
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
      <Row>
        <Col span={12}>
          <FormItem {...formLongLayout} label={'要求整改完成日期'}>
            {
              getFieldDecorator('applyDepartmentCode', {
                initialValue: type === 'add' ? '' : editData.fileList,
                rules: [
                  {
                    required: true,
                    message: '要求整改完成日期不能为空',
                  },
                ],
              })(
                <ComboTree
                  allowClear={true}
                  style={{ width: '100%' }}
                  form={form}
                  name={'applyDepartmentCode'}
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

export default Form.create()(ProblemAdd);
