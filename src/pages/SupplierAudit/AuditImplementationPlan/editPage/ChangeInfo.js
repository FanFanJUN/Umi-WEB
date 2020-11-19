/*
 * @Author: your name
 * @Date: 2020-11-19 19:13:29
 * @LastEditTime: 2020-11-19 19:16:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\ChangeInfo.js
 */
import React, { useEffect } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Input } from 'antd';
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

const ChangeInfo = (props, ref) => {
    
    const { form, originData: data, isView} = props;
    const { getFieldDecorator, setFieldsValue } = form;
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>变更信息</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formLayout} label={'变更附件'}>
                                {
                                    getFieldDecorator('changeFileIdList', {
                                        initialValue: [],
                                    })(
                                        <Upload entityId={data.documnetInfos} type={isView ? 'show' : ''}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="变更原因" {...formLongLayout}>
                                {isView ? <span>{data.changeReason}</span> : getFieldDecorator('changeReason', {
                                        initialValue: [],
                                        rules: [{ required: true, message: '变更原因不能为空',},],
                                    })(
                                        <Input.TextArea rows={6} style={{ width: '100%' }} />
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
export default ChangeInfo;
