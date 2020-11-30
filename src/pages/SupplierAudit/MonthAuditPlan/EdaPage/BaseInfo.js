/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:40
 * @LastEditTime: 2020-11-30 15:08:20
 * @Description:  基本信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BaseInfo.js
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ComboTree } from 'suid';
import moment from "moment";
import { Col, Form, Row, Input, Select, InputNumber, DatePicker } from 'antd';
import Upload from '../../Upload';
import { AllCompanyConfig, ApplyOrganizationProps } from '../../AnnualAuditPlan/propsParams';
import {  hideFormItem, getDocIdForArray } from '@/utils/utilTool';

const { MonthPicker } = DatePicker;
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

  const { type, form, originData: data, userInfo = {}, isView } = props;

  const { getFieldDecorator, setFieldsValue } = form;

  const HideFormItem = hideFormItem(getFieldDecorator);

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          {type !== 'add' &&
            <Row>
              <Col span={12}>
                <FormItem label="月度审核计划号" {...formLayout}>
                  {isView ? <span>{data.reviewPlanMonthCode}</span> : getFieldDecorator('reviewPlanMonthCode', {
                    initialValue: type === 'add' ? '' : data.reviewPlanMonthCode,
                  })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
            </Row>}
          <Row>
            <Col span={12}>
              {HideFormItem('applyCorporationId', data.applyCorporationId)}
              {HideFormItem('applyCorporationCode', data.applyCorporationCode)}
              <FormItem label="拟制公司" {...formLayout}>
                {isView ? <span>{data.applyCorporationName}</span> : getFieldDecorator('applyCorporationName', {
                  initialValue: type === 'add' ? '' : data.applyCorporationName,
                  rules: [
                    {
                      required: true,
                      message: '拟制公司不能为空',
                    },
                  ],
                })(
                  <ComboList
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
              <FormItem label="拟制部门" {...formLayout}>
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
              {HideFormItem('applyId', type === 'add' ? userInfo.userId : data.applyId)}
              {HideFormItem('applyAccount', type === 'add' ? userInfo.account : data.applyAccount)}
              <FormItem label="拟制人" {...formLayout}>
                {isView ? <span>{data.applyName}</span> : getFieldDecorator('applyName', {
                  initialValue: type === 'add' ? userInfo.userName : data.applyName,
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
            <Col span={12}>
              <FormItem label="月度" {...formLayout}>
                {isView ? <span>{data.applyMonth ? data.applyMonth.slice(0,7) : ""}</span> : getFieldDecorator('applyMonth', {
                  initialValue: type === 'add' ? '' : data.applyMonth,
                  rules: [
                    {
                      required: true,
                      message: '月度不能为空',
                    },
                  ],
                })(
                  <MonthPicker placeholder="选择月度" />
                  // <Select placeholder='选择月' style={{width: '50%'}}>
                  //     <Select.Option value={1}>1月</Select.Option>
                  //     <Select.Option value={2}>2月</Select.Option>
                  //     <Select.Option value={3}>3月</Select.Option>
                  //     <Select.Option value={4}>4月</Select.Option>
                  //     <Select.Option value={5}>5月</Select.Option>
                  //     <Select.Option value={6}>6月</Select.Option>
                  //     <Select.Option value={7}>7月</Select.Option>
                  //     <Select.Option value={8}>8月</Select.Option>
                  //     <Select.Option value={9}>9月</Select.Option>
                  //     <Select.Option value={10}>10月</Select.Option>
                  //     <Select.Option value={11}>11月</Select.Option>
                  //     <Select.Option value={12}>12月</Select.Option>
                  // </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="拟制说明" {...formLongLayout}>
                {isView ? <span>{data.reviewPlanMonthName}</span> : getFieldDecorator('reviewPlanMonthName', {
                  initialValue: type === 'add' ? '' : data.reviewPlanMonthName,
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
                {isView ? <span>{data.remark}</span> : getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : data.remark,
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formLongLayout} label={'附件'}>
                {
                  getFieldDecorator('attachRelatedIds', {
                    initialValue: type === 'add' ? '' : getDocIdForArray(data.fileList),
                  })(
                    <Upload
                      entityId={type === 'add' ? null : data.fileList}
                      type={isView ? 'show' : ''}
                      showColor={isView ? true : false}
                    />
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div >
  );
}
export default BaseInfo;
