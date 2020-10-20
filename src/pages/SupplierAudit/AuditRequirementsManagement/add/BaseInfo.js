import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Modal, Row, Input, DatePicker } from 'antd';
import Upload from '../../../QualitySynergy/compoent/Upload';
import { AllCompanyConfig, AllFindByFiltersConfig, ApplyOrganizationProps } from '../../mainData/commomService';

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

  useImperativeHandle(ref, () => ({
    getBaseInfoData: props.form.validateFieldsAndScroll
  }))

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
                {isView ? <span>{''}</span> : getFieldDecorator('1', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '公司不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'name'}
                    field={['code', 'id']}
                    {...AllCompanyConfig}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请部门" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('2', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '业务单元不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'name'}
                    field={['code', 'id']}
                    {...ApplyOrganizationProps}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请人" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('3', {
                  initialValue: type === 'add' ? userInfo.userName : '',
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('4', {
                  initialValue: type === 'add' ? userInfo.userMobile : '',
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
                {isView ? <span>{''}</span> : getFieldDecorator('5', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '采购组织不能为空',
                    },
                  ],
                })(
                  <ComboList
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'name'}
                    field={['code', 'id']}
                    {...AllFindByFiltersConfig}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="申请说明" {...formLongLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('6', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '申请说明不能为空',
                    },
                  ],
                })(
                  <Input placeholder="请输入申请说明" style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="备注" {...formLongLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('7', {
                  initialValue: type === 'add' ? '' : '',
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
                  getFieldDecorator('8', {
                    initialValue: type === 'add' ? null :null,
                  })(
                    <Upload entityId={type === 'add' ? null : null} type={type === 'add' ? '' : 'show'}/>,
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
