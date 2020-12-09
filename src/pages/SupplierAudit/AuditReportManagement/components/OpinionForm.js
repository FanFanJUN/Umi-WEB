/**
 * @Description:  小组意见表单显示
 * @Author: M!keW
 * @Date: 2020-12-08
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Input, Radio, Row } from 'antd';
import Upload from '../../../QualitySynergy/compoent/Upload';
import { ExtModal } from 'suid';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const OpinionForm = React.forwardRef(({ form, userInfo, leaderApprove, teamData, leaderData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>采购小组意见</div>
          <div className={styles.content}>
            <Row>
              <Col span={24}>
                <FormItem label="是否按审核意见执行" {...formLayout}>
                  <span>{teamData.whetherFollowAuditConclusion ? '是' : '否'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="意见" {...formLayout}>
                  <span>{teamData.purchasingTeamOpinion}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formLayout} label={'附件'}>

                  <Upload entityId={teamData.purchasingTeamOpinionFiles}
                          type={'show'}/>,
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {!leaderApprove && <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>领导小组意见</div>
          <div className={styles.content}>
            <Row>
              <Col span={24}>
                <FormItem label="是否通过" {...formLayout}>
                  <span>{teamData.whetherLeaderDecisionPass ? '是' : '否'}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="意见" {...formLayout}>
                  <span>{teamData.leaderDecisionOpinion}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formLayout} label={'附件'}>
                  <Upload entityId={leaderData.leaderDecisionFiles}
                          type={'show'}/>,
                </FormItem>
              </Col>
            </Row>
          </div>
        </div>
      </div>}
    </div>
  );
});
export default Form.create()(OpinionForm);

