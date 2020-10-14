import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Modal, Row, Input, DatePicker } from 'antd';
import Upload from '../../../QualitySynergy/compoent/Upload';

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

let BaseInfo = React.forwardRef((props, ref) => {
  const { isView } = props;

  const { type, form, data, userInfo } = props;

  const { getFieldDecorator, setFieldsValue } = props.form;

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {getFieldDecorator(name, {
        initialValue: initialValue,
      })(<Input type={'hidden'} />)}
    </FormItem>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem label="公司" {...formLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? '' : data.source,
                  rules: [
                    {
                      required: true,
                      message: '业务单元不能为空',
                    },
                  ],
                })(
                  <Input placeholder="请输入公司" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请部门" {...formLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? '' : data.source,
                  rules: [
                    {
                      required: true,
                      message: '业务单元不能为空',
                    },
                  ],
                })(
                  <Input placeholder="请输入公司" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请人" {...formLayout}>
                {isView ? <span>{data.applyPeopleName}</span> : getFieldDecorator('applyPeopleName', {
                  initialValue: type === 'add' ? userInfo.userName : data.applyPeopleName,
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout}>
                {isView ? <span>{data.applyPeoplePhone}</span> : getFieldDecorator('applyPeoplePhone', {
                  initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  rules: [
                    {
                      required: true,
                      message: '申请人联系方式不能为空',
                    },
                  ],
                })(
                  <Input
                    disabled={type === 'detail'}
                    placeholder="请输入申请人联系方式"
                    style={{ width: '100%' }}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="采购组织" {...formLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? '' : data.source,
                  rules: [
                    {
                      required: true,
                      message: '业务单元不能为空',
                    },
                  ],
                })(
                  <Input placeholder="请输入公司" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="申请说明" {...formLongLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? '' : data.source,
                  rules: [
                    {
                      required: true,
                      message: '业务单元不能为空',
                    },
                  ],
                })(
                  <Input placeholder="请输入公司" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="备注" {...formLongLayout}>
                {isView ? <span>{data.source}</span> : getFieldDecorator('source', {
                  initialValue: type === 'add' ? '' : data.source,
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formLongLayout} label={'技术资料附件'}>
                {
                  getFieldDecorator('technicalDataFileIdList', {
                    initialValue: type === 'add' ? null : data.technicalDataFileIdList,
                  })(
                    <Upload entityId={type === 'add' ? null : data.technicalDataFileIdList}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
})
export default Form.create()(BaseInfo);
