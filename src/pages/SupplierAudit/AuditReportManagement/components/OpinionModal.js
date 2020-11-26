/**
 * @Description: 审核意见modal
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Col, Form, Input, Radio, Row, Spin } from 'antd';
import { ExtModal } from 'suid';
import Upload from '../../../QualitySynergy/compoent/Upload';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};
const OpinionModal = forwardRef(({ isLeader, editData, form, title }, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
    getFormValue,
  }));
  const [visible, setVisible] = useState(false);
  const [cleanFile, setCleanFile] = useState(false);
  const [needOpinion, setNeedOpinion] = useState(false);
  useEffect(() => {
    setNeedOpinion(!editData.remark);
  }, [editData]);
  useEffect(() => {
    setRequired();
  }, [needOpinion]);
  const handleModalVisible = (flag) => {
    setVisible(!!flag);
  };

  const getFormValue = () => {
    let result = false;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        result = values;
      }
    });
    return result;
  };

  const onChange = (e) => {
    if (e.target.value) {
      setNeedOpinion(false);
    } else {
      setNeedOpinion(true);
    }
  };
  const setRequired = () => {
    form.validateFields(['opinion'], { force: true });
  };

  const onCancel = () => {
    form.setFieldsValue({
      remark: isLeader ? editData.remark : true,
      opinion: null,
      docIds: [],
    });
    if (isLeader) {
      setNeedOpinion(!editData.remark);
    }
    setCleanFile(true);
    setVisible(false);
  };
  const onOk = () => {
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        setVisible(false);
      }
    });
  };

  const { getFieldDecorator } = form;

  return <ExtModal
    width={600}
    centered
    maskClosable={false}
    visible={visible}
    title={title}
    onCancel={onCancel}
    onOk={onOk}
  >
    <Row>
      <Col span={24}>
        <FormItem label="是否按审核意见执行" {...formLayout}>
          {getFieldDecorator('remark', {
            initialValue: isLeader ? editData.remark : true,
            rules: [
              {
                required: true,
                message: '请选择',
              },
            ],
          })(
            <Radio.Group onChange={onChange}>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <FormItem label="意见" {...formLayout}>
          {getFieldDecorator('opinion', {
            initialValue: '',
            rules: [
              {
                required: needOpinion,
                message: '请填写意见',
              },
            ],
          })(
            <Input/>,
          )}
        </FormItem>
      </Col>
    </Row>
    <Row>
      <Col span={24}>
        <FormItem {...formLayout} label={'附件'}>
          {
            getFieldDecorator('docIds', {
              initialValue: [],
            })(
              <Upload cleanFile={cleanFile}/>,
            )
          }
        </FormItem>
      </Col>
    </Row>
  </ExtModal>;

});

export default Form.create()(OpinionModal);
