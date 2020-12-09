/**
 * @Description: 审核意见modal
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Col, Form, Input, Radio, Row } from 'antd';
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
const OpinionModalForLeader = forwardRef(({ editData, form, title }, ref) => {
  useImperativeHandle(ref, () => ({
    handleModalVisible,
    getFormValue,
  }));
  const [visible, setVisible] = useState(false);
  const [cleanFile, setCleanFile] = useState(false);
  const [needOpinion, setNeedOpinion] = useState(false);
  useEffect(() => {
    setNeedOpinion(!editData.whetherFollowAuditConclusion);
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
      whetherLeaderDecisionPass: editData.whetherFollowAuditConclusion,
      leaderDecisionOpinion: null,
      leaderDecisionDocIds: [],
    });
    setNeedOpinion(!editData.whetherFollowAuditConclusion);
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
        <FormItem label="是否通过" {...formLayout}>
          {getFieldDecorator('whetherLeaderDecisionPass', {
            initialValue:  editData.whetherFollowAuditConclusion ,
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
          {getFieldDecorator('leaderDecisionOpinion', {
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
            getFieldDecorator('leaderDecisionDocIds', {
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

export default Form.create()(OpinionModalForLeader);
