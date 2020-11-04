/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:40
 * @LastEditTime: 2020-10-30 15:36:23
 * @Description:  基本信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BaseInfo.js
 */
import React, { useEffect, useImperativeHandle } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Input } from 'antd';
import Upload from '../../Upload';
import { hideFormItem, getDocIdForArray } from '@/utils/utilTool';

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

const ChangeInfo = (props) => {

    const { form, originData: data} = props;

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
                                    getFieldDecorator('changeFileId', {
                                        initialValue: '',
                                        // initialValue: getDocIdForArray(data.changeFileId),
                                    })(
                                        <Upload entityId={data.changeFileId} />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label="变更原因" {...formLongLayout}>
                                {
                                    getFieldDecorator('changeReason')(
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
export default Form.create()(ChangeInfo);
