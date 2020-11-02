import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Modal, Row, Input, DatePicker } from 'antd';
import Upload from '../../../QualitySynergy/compoent/Upload';
import {
  AllCompanyConfig,
  AllFindByFiltersConfig,
  ApplyOrganizationProps,
  length_200_n,
} from '../../mainData/commomService';

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

  const { type, form, userInfo, isView, editData } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

  useImperativeHandle(ref, () => ({
    getBaseInfoData: props.form.validateFieldsAndScroll
  }))

  useEffect(() => {
    if (getFieldValue('applyCorporationCode')) {
      props.setApplyCorporationCode(getFieldValue('applyCorporationCode'))
    }
  }, [getFieldValue('applyCorporationCode')])

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
            <Col span={0}>{hideFormItem('applyCorporationCode', type === 'add' ? '' : editData.applyCorporationCode)}</Col>
            <Col span={0}>{hideFormItem('applyCorporationId', type === 'add' ? '' : editData.applyCorporationId)}</Col>
            <Col span={12}>
              <FormItem label="公司" {...formLayout}>
                {isView ? <span>{editData.applyCorporationName}</span> : getFieldDecorator('applyCorporationName', {
                  initialValue: type === 'add' ? '' : editData.applyCorporationName,
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
                    afterSelect={v => props.setCompanyCode(v.code)}
                    form={form}
                    name={'applyCorporationName'}
                    field={['applyCorporationCode', 'applyCorporationId']}
                    {...AllCompanyConfig}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={0}>{hideFormItem('applyDepartmentCode', type === 'add' ? '' : editData.applyDepartmentCode)}</Col>
            <Col span={0}>{hideFormItem('applyDepartmentId', type === 'add' ? '' : editData.applyDepartmentId)}</Col>
            <Col span={12}>
              <FormItem label="申请部门" {...formLayout}>
                {isView ? <span>{editData.applyDepartmentName}</span> : getFieldDecorator('applyDepartmentName', {
                  initialValue: type === 'add' ? '' : editData.applyDepartmentName,
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
                {isView ? <span>{editData.applyName}</span> : getFieldDecorator('applyName', {
                  initialValue: type === 'add' ? userInfo.userName : editData.applyName,
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout}>
                {isView ? <span>{editData.applyTel}</span> : getFieldDecorator('applyTel', {
                  initialValue: type === 'add' ? userInfo.userMobile : editData.applyTel,
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
            <Col span={0}>{hideFormItem('purchaseOrgCode', type === 'add' ? '' : editData.purchaseOrgCode)}</Col>
            <Col span={0}>{hideFormItem('purchaseOrgId', type === 'add' ? '' : editData.purchaseOrgId)}</Col>
            <Col span={12}>
              <FormItem label="采购组织" {...formLayout}>
                {isView ? <span>{editData.purchaseOrgName}</span> : getFieldDecorator('purchaseOrgName', {
                  initialValue: type === 'add' ? '' : editData.purchaseOrgName,
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
                    afterSelect={v => props.setOrganizationCode(v.code)}
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
                {isView ? <span>{editData.reviewRequirementName}</span> : getFieldDecorator('reviewRequirementName', {
                  initialValue: type === 'add' ? '' : editData.reviewRequirementName,
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
                {isView ?  <span style={{ width: '100%', border: 'none' }}>{editData.remark}</span> : getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : editData.remark,
                  rules: [{validator: length_200_n, message: '请勿超过200个汉字'},]
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }}  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formLongLayout} label={'技术资料附件'}>
                {
                  getFieldDecorator('attachRelatedIds', {
                    initialValue: type === 'add' ? null : editData.fileList,
                  })(
                    <Upload entityId={type === 'add' ? null : editData.fileList} type={type === 'detail' ? 'show' : ''}/>,
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
