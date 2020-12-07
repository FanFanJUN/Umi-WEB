/**
 * @Description: 基础信息表单
 * @Author: M!keW
 * @Date: 2020-11-27
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { ComboTree } from 'suid';
import { Col, Form, Row, Input } from 'antd';
import Upload from '../../../QualitySynergy/compoent/Upload';
import {
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

const BaseInfoForm = React.forwardRef(({ form, userInfo, isView, editData,type }, ref) => {
  useImperativeHandle(ref, () => ({
    getFormValue
  }));
  const { getFieldDecorator } = form;
  const getFormValue=()=>{
    let result = false;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        result = values;
      }
    });
    return result;
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem label="拟制公司" {...formLayout}>
                {<span>{editData.statisticCorporationName}</span>}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="拟制部门" {...formLayout}>
                {isView ? <span>{editData.applyDepartmentName}</span> :
                  (
                    getFieldDecorator('applyDepartmentId', { initialValue: type === 'add' ? '': editData.applyDepartmentId }),
                      getFieldDecorator('applyDepartmentName', {
                        initialValue: type === 'add' ? '': editData.applyDepartmentName,
                        rules: [
                          {
                            required: true,
                            message: '请选择拟制部门',
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
                      )
                  )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="拟制人" {...formLayout}>
                {isView ? <span>{editData.applyName}</span> : getFieldDecorator('applyName', {
                  initialValue: type === 'add' ? userInfo.userName : editData.applyName,
                })(<Input disabled={true}  style={{ width: '100' }}/>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="联系方式" {...formLayout}>
                {isView ? <span>{editData.applyTel}</span> : getFieldDecorator('applyTel', {
                  initialValue: type === 'add' ? userInfo.userMobile : editData.applyTel,
                  rules: [
                    {
                      required: true,
                      // pattern: '^\\d{11}$',
                      message: '请填写联系方式',
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
              <FormItem label="备注" {...formLongLayout}>
                {isView ? <span
                  style={{ width: '100%', border: 'none' }}>{editData.remark}</span> : getFieldDecorator('remark', {
                  initialValue: type === 'add' ? '' : editData.remark,
                  rules: [{ validator: length_200_n, message: '请勿超过200个汉字' }],
                })(
                  <Input.TextArea rows={6} style={{ width: '100%' }}/>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem {...formLongLayout} label={'附件'}>
                {
                  getFieldDecorator('basicInfDocIds', {
                    initialValue: type === 'add' ? null : editData.basicInfDocFiles,
                  })(
                    <Upload entityId={type === 'add' ? null : editData.basicInfDocFiles}
                            type={isView ? 'show' : ''}/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(BaseInfoForm);
