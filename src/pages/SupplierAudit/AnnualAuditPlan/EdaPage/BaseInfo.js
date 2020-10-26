/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:40
 * @LastEditTime: 2020-10-22 09:54:40
 * @Description:  基本信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BaseInfo.js
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Modal, Row, Input, DatePicker, InputNumber } from 'antd';
import Upload from '../../Upload';
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

const BaseInfo = (props) => {

  const { type, form, data, userInfo, isView } = props;

  const { getFieldDecorator, setFieldsValue } = form;

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
              <FormItem label="拟制公司" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('1', {
                  initialValue: type === 'add' ? '' : '',
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
                    name={'name'}
                    field={['code', 'id']}
                    {...AllCompanyConfig}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="拟制部门" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('2', {
                  initialValue: type === 'add' ? '' : '',
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
                    name={'name'}
                    field={['code', 'id']}
                    {...ApplyOrganizationProps}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="拟制人" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('3', {
                  initialValue: type === 'add' ? userInfo.userName : '',
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
              <FormItem label="年度" {...formLayout}>
                {isView ? <span>{''}</span> : getFieldDecorator('5', {
                  initialValue: type === 'add' ? '' : '',
                  rules: [
                    {
                      required: true,
                      message: '年度不能为空',
                    },
                  ],
                })(
                  <InputNumber style={{ width: '100%' }} min={0} />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem label="拟制说明" {...formLongLayout}>
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
              <FormItem {...formLongLayout} label={'附件'}>
                {
                  getFieldDecorator('8', {
                    initialValue: type === 'add' ? null : null,
                  })(
                    <Upload entityId={type === 'add' ? null : null} type={type === 'add' ? '' : 'show'} />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
export default BaseInfo;
