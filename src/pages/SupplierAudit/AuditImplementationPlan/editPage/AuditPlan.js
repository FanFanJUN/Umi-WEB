/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:49:50
 * @LastEditTime: 2020-11-16 17:10:16
 * @LastEditors: Please set LastEditors
 * @Description: I审核实施计划-审核计划
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditPlan.js
 */

import React, { useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, DatePicker, Checkbox } from 'antd';
import Upload from '../../Upload';
import { getDocIdForArray } from '@/utils/utilTool';

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

const AuditPlan = (props) => {
    const { form, type, isView } = props;
    const [seleted, setSelected] = useState([
        { code: 'A', value: 'SO9001标准' },
        { code: 'B', value: '与产品相关的法律法规、合同' },
        { code: 'C', value: '长虹公司的产品要求（技术协议）、质量环保赔偿协议' },
        { code: 'D', value: '长虹对供应商的有害物质管理、环境行为和职业健康安全管理要求' },
        { code: 'F', value: '长虹对供应商的技术、成本、物流管理要求等' },
    ])
    const { getFieldDecorator, setFieldsValue } = form;
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核计划</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={12}>
                            <FormItem label="拟制公司" {...formLayout}>
                                {
                                    getFieldDecorator("selected", {
                                        initialValue: ["A", "B", "C", "D", "F"],
                                        rules: [{ required: true, message: '至少选择一项',},]
                                    })(
                                        <Checkbox.Group style={{ width: '100%' }} style={{paddingTop: "20px"}}>
                                            {
                                                seleted.map(item => <Row style={{margin: "6px 0"}}>
                                                    <Checkbox value={item.code} key={item.code}>{item.value}</Checkbox>
                                                </Row>)
                                            }
                                        </Checkbox.Group>
                                    )
                                }

                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem {...formLayout} label={'审核时间从'}>
                                {
                                    getFieldDecorator('startTime', {
                                        initialValue: null,
                                        rules: [{ required: true, message: '审核时间不能为空',},]
                                    })(
                                        <DatePicker placeholder="请选择" style={{width: "100%"}} />
                                    )
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem {...formLayout} label={'审核时间到'}>
                                {
                                    getFieldDecorator('endTime', {
                                        initialValue: null,
                                        rules: [{ required: true, message: '审核时间不能为空',},]
                                    })(
                                        <DatePicker placeholder="请选择" style={{width: "100%"}}/>
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem {...formLongLayout} label={'详细计划附件'}>
                                {
                                    getFieldDecorator('detailFiles', {
                                        initialValue: type === 'add' ? '' : getDocIdForArray(data.fileList),
                                        rules: [{ required: true, message: '详细计划附件不能为空',},]
                                    })(
                                        <Upload
                                            entityId={type === 'add' ? null : data.fileList}
                                            type={isView ? 'show' : ''}
                                            showColor={isView ? true : false}
                                        />
                                    )
                                }
                            </FormItem>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default AuditPlan;