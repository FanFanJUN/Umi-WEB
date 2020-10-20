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
            <Col span={0}>{hideFormItem('applyCorporationCode', type === 'add' ? '' : data.applyCorporationCode)}</Col>
            <Col span={0}>{hideFormItem('applyCorporationId', type === 'add' ? '' : data.applyCorporationId)}</Col>
            <Col span={12}>
              <FormItem label="公司" {...formLayout}>
                {isView ? <span>{data.applyCorporationName}</span> : getFieldDecorator('applyCorporationName', {
                  initialValue: type === 'add' ? '' : data.applyCorporationName,
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
                    name={'applyCorporationName'}
                    field={['applyCorporationCode', 'applyCorporationId']}
                    {...AllCompanyConfig}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={0}>{hideFormItem('applyDepartmentCode', type === 'add' ? '' : data.applyDepartmentCode)}</Col>
            <Col span={0}>{hideFormItem('applyDepartmentId', type === 'add' ? '' : data.applyDepartmentId)}</Col>
            <Col span={12}>
              <FormItem label="申请部门" {...formLayout}>
                {isView ? <span>{data.applyDepartmentName}</span> : getFieldDecorator('applyDepartmentName', {
                  initialValue: type === 'add' ? '' : data.applyDepartmentName,
                  rules: [
                    {
                      required: true,
                      message: '申请部门不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name={'applyDepartmentName'}
                    field={['applyDepartmentCode', 'applyDepartmentId']}
                    {...ApplyOrganizationProps}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="申请人" {...formLayout}>
                {isView ? <span>{data.applyName}</span> : getFieldDecorator('applyName', {
                  initialValue: type === 'add' ? userInfo.userName : data.applyName,
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout}>
                {isView ? <span>{data.applyTel}</span> : getFieldDecorator('applyTel', {
                  initialValue: type === 'add' ? userInfo.userMobile : data.applyTel,
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
            <Col span={0}>{hideFormItem('purchaseOrgCode', type === 'add' ? '' : data.purchaseOrgCode)}</Col>
            <Col span={0}>{hideFormItem('purchaseOrgId', type === 'add' ? '' : data.purchaseOrgId)}</Col>
            <Col span={12}>
              <FormItem label="采购组织" {...formLayout}>
                {isView ? <span>{data.purchaseOrgName}</span> : getFieldDecorator('purchaseOrgName', {
                  initialValue: type === 'add' ? '' : data.purchaseOrgName,
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
                    name={'purchaseOrgName'}
                    field={['purchaseOrgCode', 'purchaseOrgId']}
                    {...AllFindByFiltersConfig}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="申请说明" {...formLongLayout}>
                {isView ? <span>{data.reviewRequirementName}</span> : getFieldDecorator('reviewRequirementName', {
                  initialValue: type === 'add' ? '' : data.reviewRequirementName,
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
                {isView ?  <Input.TextArea rows={6} style={{ width: '100%' }} value={data.remark} /> : getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : data.remark,
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
                  getFieldDecorator('attachRelatedId', {
                    initialValue: type === 'add' ? null : data.attachRelatedId,
                  })(
                    <Upload entityId={type === 'add' ? null : data.attachRelatedId} type={type === 'add' ? '' : 'show'}/>,
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
