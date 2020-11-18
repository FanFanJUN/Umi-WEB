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
        <div className={styles.title}>审核范围</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'月度审核计划号'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'月度审核计划行号'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核实施计划号'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核实施计划行号'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核类型'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核原因'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核方式'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核组织方式'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'需求公司'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'采购组织'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'代理商'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'物料分类'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'物料级别'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <FormItem  {...formLongLayout} label={'生产厂地址'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系人'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'供应商联系方式'}>
                {
                  <span>{'1'}</span>
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
