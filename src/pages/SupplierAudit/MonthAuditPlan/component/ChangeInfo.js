/*
 * @Author: Li Cai
 * @LastEditors: Please set LastEditors
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-21 16:06:40
 * @LastEditTime: 2020-11-25 14:07:02
 * @Description:  基本信息
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/EdaPage/BaseInfo.js
 */
import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
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

const ChangeInfo = forwardRef((props, ref) => {
    useImperativeHandle(ref, () => ({
        getData:() => {
            let changeInfo = {}
            form.validateFieldsAndScroll((err, values) => {
                if(!err) {
                    changeInfo = {...values}
                } else {
                    changeInfo = false
                }
            })
            return changeInfo;
        }
    }));
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
                                    getFieldDecorator('changeFileId', {
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
})
export default Form.create()(ChangeInfo);
