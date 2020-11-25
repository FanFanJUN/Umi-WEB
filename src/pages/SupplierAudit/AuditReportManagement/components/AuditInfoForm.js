/**
 * @Description: 拟审核信息
 * @Author: M!keW
 * @Date: 2020-11-17
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

const formLongLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

const AuditInfoForm = React.forwardRef(({ form, isView, editData,type }, ref) => {
  useImperativeHandle(ref, () => ({

  }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'月度审核计划号'}>
                {
                  <span>{editData.reviewPlanMonthCode}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'月度审核计划行号'}>
                {
                  <span>{editData.reviewPlanMonthLinenum}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核实施计划号'}>
                {
                  <span>{editData.reviewImplementPlanCode}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核实施计划行号'}>
                {
                  <span>{editData.reviewImplementPlanLinenum}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核类型'}>
                {
                  <span>{editData.reviewTypeName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核原因'}>
                {
                  <span>{editData.reviewReasonName}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核方式'}>
                {
                  <span>{editData.reviewWayName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核组织方式'}>
                {
                  <span>{editData.reviewOrganizedWayName}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'需求公司'}>
                {
                  <span>{editData.applyCorporationName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'采购组织'}>
                {
                  <span>{editData.purchaseTeamName}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商'}>
                {
                  <span>{editData.supplierName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'代理商'}>
                {
                  <span>{editData.agentName}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'物料分类'}>
                {
                  <span>{editData.materialGroupName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'物料级别'}>
                {
                  <span>{editData.materialGradeName}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem  {...formLongLayout} label={'生产厂地址'}>
                {
                  <span>{editData.countryName + editData.provinceName + editData.cityName + editData.countyName + editData.address}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系人'}>
                {
                  <span>{editData.contactUserName}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系方式'}>
                {
                  <span>{editData.contactUserTel}</span>
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditInfoForm);
