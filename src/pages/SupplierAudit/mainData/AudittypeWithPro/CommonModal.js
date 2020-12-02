/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-27 14:22:44
 * @LastEditTime: 2020-10-27 16:47:37
 * @Description: 编辑 新增 modal
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/AudittypeWithPro/commonModal.js
 */

import React, { useState } from 'react';
import { ComboGrid, ComboTree, ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import { getSupplierEvlSysRule, reviewTypes, supplierEvlSystemTree } from './paramProps';
import { isEmptyArray, hideFormItem, filterEmptyFileds } from '@/utils/utilTool';

const FormItem = Form.Item;

const formItemLayoutLong = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const CommonModal = (props) => {

  const { propData: { visible, title, type }, data = {}, form } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;

  const [systemId, setSystemId] = useState('');

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        props.onOk(values);
      }
    });
  };

  const clearSelected = () => {
    props.form.resetFields();
  };

  const HideFormItem = hideFormItem(getFieldDecorator);

  function selectReviewSystem(item, index) {
    if (item) {
      setSystemId(item.id);
    }
  }

  return (
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
          {HideFormItem('reviewTypeId', data.reviewTypeId)}
          {HideFormItem('reviewTypeCode', data.reviewTypeCode)}
          <Col span={24}>
            <FormItem {...formItemLayoutLong} label={'审核类型名称'}>
              {
                getFieldDecorator('reviewTypeName', {
                  initialValue: type === 'add' ? '' : data.reviewTypeName,
                  rules: [
                    {
                      required: true,
                      message: '审核类型不能为空',
                    },
                  ],
                })(
                  <ComboGrid
                    form={form}
                    name='reviewTypeName'
                    {...reviewTypes}
                    field={['reviewTypeId', 'reviewTypeCode']}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            {HideFormItem('reviewSystemId', data.reviewSystemId)}
            {HideFormItem('reviewSystemCode', data.reviewSystemCode)}
            {HideFormItem('reviewSystemParentId', data.reviewSystemParentId)}
            <FormItem {...formItemLayoutLong} label={'评价体系'}>
              {
                getFieldDecorator('reviewSystemName', {
                  initialValue: type === 'add' ? '' : data.reviewSystemName,
                  rules: [
                    {
                      required: true,
                      message: '评价体系不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    form={form}
                    name='reviewSystemName'
                    {...supplierEvlSystemTree}
                    field={['reviewSystemId', 'reviewSystemCode', 'reviewSystemParentId']}
                    afterSelect={selectReviewSystem}
                  />,
                )
              }
            </FormItem>
          </Col>
          <Col span={24}>
            {HideFormItem('reviewIndexCode', data.reviewIndexCode)}
            {HideFormItem('reviewIndexId', data.reviewIndexId)}
            <FormItem {...formItemLayoutLong} label={'评价指标'}>
              {
                getFieldDecorator('reviewIndexName', {
                  initialValue: type === 'add' ? '' : data.reviewIndexName,
                  rules: [
                    {
                      required: true,
                      message: '评价指标不能为空',
                    },
                  ],
                })(
                  <ComboGrid
                    allowClear
                    form={form}
                    name='reviewIndexName'
                    {...getSupplierEvlSysRule()}
                    field={['reviewIndexId', 'reviewIndexCode']}
                    disabled={getFieldValue('reviewSystemId') === ''}
                    cascadeParams={{ systemId: getFieldValue('reviewSystemId') }}
                  />,
                )
              }
            </FormItem>
          </Col>
        </Row>
      </Form>
    </ExtModal>
  );
};

CommonModal.defaultProps = {
  form: {},
  type: 'add',
  data: {},
  visible: false,
  title: '',
  onCancel: () => {
  },
  onOk: () => {
  },
};

export default Form.create()(CommonModal);
