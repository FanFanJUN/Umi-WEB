/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:37:22
 * @LastEditTime: 2020-11-16 20:38:08
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-拟审核信息
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditInfo.js
 */
import React, { useState } from 'react';
import { Col, Form, Row, Input, Pagination  } from 'antd';
import { ExtTable } from "suid";
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const formItemLayoutLong = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
};

const AuditInfo = (props) => {
    const { isView, originData } = props;
    const [tabList, setTableList] = useState([{id: 1, reviewPlanMonthCode: "00010"}]);
    const columns = [
        { title: '月度审核计划行号', dataIndex: 'reviewPlanMonthCode', width: 140, align: "center" },
        { title: '需求公司', dataIndex: 'applyCorporationName', width: 140, align: "center" },
        { title: '采购组织', dataIndex: 'purchaseOrgName', align: "center", width: 140 },
        { title: '物料分类', dataIndex: 'materialGroupName', align: "center", width: 140 },
        { title: '物料级别', dataIndex: 'materialLevelName', align: "center", width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', align: "center", width: 140 },
        { title: '审核原因', dataIndex: 'reviewWayName', align: "center", width: 140 },
        { title: '审核组织方式', dataIndex: 'reviewOrgName', align: "center", width: 140 },
    ];
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>拟审核信息</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'月度审核计划号'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'APM-2020-0000001'} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'审核方式'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'现场审核'} />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'APM-2020-0000001'} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'代理商'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'现场审核'} />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem  {...formItemLayoutLong} label={'生产厂地址'}>
                                {
                                    isView ? <span>{'1'}</span> : <div>
                                        <Input disabled={true} value={'中国'} style={{ width: "10%" }} />
                                        <Input disabled={true} value={'四川省'} style={{ width: "10%", margin: "0 3px" }} />
                                        <Input disabled={true} value={'绵阳市'} style={{ width: "10%" }} />
                                        <Input disabled={true} value={'高新区'} style={{ width: "10%", margin: "0 3px" }} />
                                        <Input disabled={true} value={'火炬西街南段17号'} style={{ width: "50%" }} />
                                    </div>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商联系人'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'李军'} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商联系方式'}>
                                {
                                    isView ? <span>{'1'}</span> : <Input disabled={true} value={'13190875643'} />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div style={{paddingLeft: "8vw"}}>
                        <p style={{color: "rgba(0, 0, 0, 0.85)", fontSize: "14px", fontWeight: "bold"}}>行信息</p>
                        <ExtTable
                            rowKey='id'
                            showSearch={false}
                            remotePaging={false}
                            checkbox={false}
                            lineNumber={false}
                            bordered={true}
                            pagination={<Pagination defaultCurrent={1} total={50} />}
                            onChange={(page, pageSize)=>{
                                console.log(page, pageSize)
                            }}
                            size='small'
                            columns={columns}
                            dataSource={tabList}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditInfo;
