/*
 * @Author: 黄永翠
 * @LastEditors  : LiCai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:40
 * @LastEditTime : 2020-12-21 14:03:55
 * @Description:  审核实施计划-基本信息
 */
import React from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ComboTree } from 'suid';
import { Col, Form, Row, Input } from 'antd';
import Upload from '../../Upload';
import { ApplyOrganizationProps } from '../../AnnualAuditPlan/propsParams';
import { AllCompanyConfig } from '../../mainData/commomService';
import { hideFormItem, getDocIdForArray } from '@/utils/utilTool';
import { getMobile, getUserAccount, getUserId, getUserName } from '@/utils';

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

const BaseInfo = (props) => {

  const { type, form, originData: data, isView, applyCorporationData } = props;

  const { getFieldDecorator, setFieldsValue } = form;

  const HideFormItem = hideFormItem(getFieldDecorator);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              {HideFormItem('applyCorporationId', type === 'add' ? applyCorporationData.applyCorporationId : data.applyCorporationId)}
              {HideFormItem('applyCorporationCode', type === 'add' ? applyCorporationData.applyCorporationCode : data.applyCorporationCode)}
              <FormItem label="拟制公司" {...formLayout} style={{ marginBottom: '0px' }}>
                {isView ? <span>{data.applyCorporationName}</span> : getFieldDecorator('applyCorporationName', {
                  initialValue: type === 'add' ? applyCorporationData.applyCorporationName : data.applyCorporationName,
                  rules: [
                    {
                      required: true,
                      message: '拟制公司不能为空',
                    },
                  ],
                })(
                  <ComboList
                    disabled={true}
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name='applyCorporationName'
                    field={['applyCorporationCode', 'applyCorporationId']}
                    {...AllCompanyConfig}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              {HideFormItem('applyDepartmentId', data.applyDepartmentId)}
              {HideFormItem('applyDepartmentCode', data.applyDepartmentCode)}
              <FormItem label="拟制部门" {...formLayout} style={{ marginBottom: '0px' }}>
                {isView ? <span>{data.applyDepartmentName}</span> : getFieldDecorator('applyDepartmentName', {
                  initialValue: type === 'add' ? '' : data.applyDepartmentName,
                  rules: [
                    {
                      required: true,
                      message: '拟制部门不能为空',
                    },
                  ],
                })(
                  <ComboTree
                    allowClear={true}
                    style={{ width: '100%' }}
                    form={form}
                    name='applyDepartmentName'
                    field={['applyDepartmentCode', 'applyDepartmentId']}
                    {...ApplyOrganizationProps}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              {HideFormItem('applyId', type === 'add' ? getUserId() : data.applyId)}
              {HideFormItem('applyAccount', type === 'add' ? getUserAccount() : data.applyAccount)}
              <FormItem label="拟制人" {...formLayout} style={{ marginBottom: '0px' }}>
                {isView ? <span>{data.applyName}</span> : getFieldDecorator('applyName', {
                  initialValue: type === 'add' ? getUserName() : data.applyName,
                  rules: [
                    {
                      required: true,
                      message: '拟制人不能为空',
                    },
                  ],
                })(<Input disabled={true} placeholder="请输入申请人" style={{ width: '100' }} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout} style={{ marginBottom: '0px' }}>
                {isView ? <span>{data.applyTel}</span> : getFieldDecorator('applyTel', {
                  initialValue: type === 'add' ? getMobile() : data.applyTel,
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
            <Col span={24}>
              <FormItem label="备注" {...formLongLayout} style={{ marginBottom: '0px' }}>
                {isView ? <span>{data.remark}</span> : getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : data.remark,
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formLongLayout} label={'附件'} style={{ marginBottom: '0px' }}>
                {
                  getFieldDecorator('attachRelatedId', {
                    initialValue: type === 'add' ? [] : getDocIdForArray(data.attachRelateds),
                  })(
                    <Upload
                      entityId={type === 'add' ? null : data.attachRelateds}
                      type={isView ? 'show' : ''}
                      showColor={isView ? true : false}
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default BaseInfo;
