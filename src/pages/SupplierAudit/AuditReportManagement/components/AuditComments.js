/**
 * @Description: 综合评审意见
 * @Author: M!keW
 * @Date: 2020-11-18
 */
import React, { useEffect, useImperativeHandle } from 'react';
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


const AuditComments = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>综合评审意见</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核综合评审得分'}>
                {
                  <span>{editData.reviewScore}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'评定等级'}>
                {
                  <span>{editData.performanceRating}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'风险等级'}>
                {
                  <span>{editData.riskRating}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'结论'}>
                {
                  <span>{editData.conclusion}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'是否通过'}>
                {
                  <span>{editData.whetherPass === null ? '' : (editData.whetherPass ? '是' : '否')}</span>
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditComments);
