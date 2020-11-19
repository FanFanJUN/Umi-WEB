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


const AuditPlanForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const [selectData, setSelectData] = useState([
    { code: 'A', value: 'SO9001标准' },
    { code: 'B', value: '与产品相关的法律法规、合同' },
    { code: 'C', value: '长虹公司的产品要求（技术协议）、质量环保赔偿协议' },
    { code: 'D', value: '长虹对供应商的有害物质管理、环境行为和职业健康安全管理要求' },
    { code: 'F', value: '长虹对供应商的技术、成本、物流管理要求等' },
  ]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核计划</div>
        <div className={styles.content}>
          <Row>
            <Col span={24}>
              <FormItem label="审核准则" {...formLongLayout}>
                {selectData.map(item => {
                  return <div>{item.value}</div>;
                })}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核时间从'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem  {...formLayout} label={'审核时间到'}>
                {
                  <span>{'1'}</span>
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formLayout} label={'详细计划附件'}>
                {
                  <Upload
                    entityId={editData.fileList}
                    type={'show'}
                    showColor={true}
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
