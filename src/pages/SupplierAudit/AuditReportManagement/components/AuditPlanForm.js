/**
 * @Description: 审核计划表单
 * @Author: M!keW
 * @Date: 2020-11-17
 */
import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Checkbox, Col, Form, Row } from 'antd';
import Upload from '../../Upload';

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


const AuditPlanForm = React.forwardRef(({ form, isView, editData, type,reviewPlanStandardBos }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const [selectData, setSelectData] = useState([]);
  useEffect(() => {
    setSelectData(reviewPlanStandardBos);
  }, [reviewPlanStandardBos]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核计划</div>
        <div className={styles.content}>
          <Row>
            <Col span={24}>
              <FormItem label="审核准则" {...formLongLayout}>
                {selectData.map(item => {
                  return <div>{item.standardName}</div>;
                })}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核时间从'}>
                {
                  <span>{editData.reviewDateStart?editData.reviewDateStart.substring(0,10):''}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核时间到'}>
                {
                  <span>{editData.reviewDateEnd?editData.reviewDateEnd.substring(0,10):''}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'详细计划附件'}>
                {
                  <Upload
                    entityId={editData.reviewPlanFiles}
                    type={'show'}
                  />
                }
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditPlanForm);
