/**
 * @Description: 统计期间
 * @Author: M!keW
 * @Date: 2020-11-27
 */

import React, {  useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row } from 'antd';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};


const PeriodForm = React.forwardRef(({ form, isView, editData,type }, ref) => {
  useImperativeHandle(ref, () => ({

  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>统计期间</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'年度'}>
                {
                  <span>{editData.reviewPlanMonthCode}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'年度期间'}>
                {
                  <span>{editData.reviewPlanMonthLinenum}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'本期'}>
                {
                  <span>{editData.reviewImplementPlanCode}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'下期'}>
                {
                  <span>{editData.reviewImplementPlanLinenum}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'期数'}>
                {
                  <span>{editData.reviewTypeName}</span>
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(PeriodForm);
