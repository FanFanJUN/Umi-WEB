/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:37:22
 * @LastEditTime: 2020-11-19 09:21:26
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-拟审核信息
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditInfo.js
 */
import React, { useState, useEffect } from 'react';
import { Col, Form, Row, Input, Pagination  } from 'antd';
import { ExtTable, utils } from "suid";
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';

const { storage } = utils;
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
    const { isView, type, originData={} } = props;
    const [tabList, setTableList] = useState([]);
    const [formData, setFormData] = useState({});
    const columns = [
        { title: '审核实施计划行号', dataIndex: 'reviewImplementPlanLinenum', width: 140, align: "center" },
        { title: '需求公司', dataIndex: 'applyCorporationName', width: 140, align: "center" },
        { title: '采购组织', dataIndex: 'purchaseTeamName', align: "center", width: 140 },
        { title: '物料分类', dataIndex: 'materialGroupName', align: "center", width: 140 },
        { title: '物料级别', dataIndex: 'materialGradeName', align: "center", width: 140 },
        { title: '审核类型', dataIndex: 'reviewTypeName', align: "center", width: 140 },
        { title: '审核原因', dataIndex: 'reviewReasonName', align: "center", width: 140 },
        { title: '审核组织方式', dataIndex: 'reviewOrganizedWayName', align: "center", width: 140 },
    ];

    useEffect(()=>{
        if(type === "add") {
            let selectedLine = JSON.parse(sessionStorage.getItem('selectedMonthLIne'));
            setTableList(selectedLine);
            setFormData(selectedLine[0]);
        } else {
            setTableList(originData.reviewImplementPlanLineBos ? originData.reviewImplementPlanLineBos : []);
            setFormData(originData);
        }
        
    }, [type, originData])
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>拟审核信息</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'月度审核计划号'}>
                                {
                                    isView ? <span>{formData.reviewPlanMonthCode}</span> : <Input disabled={true} value={formData.reviewPlanMonthCode} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'审核方式'}>
                                {
                                    isView ? <span>{formData.reviewWayName}</span> : <Input disabled={true} value={formData.reviewWayName} />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商'}>
                                {
                                    isView ? <span>{formData.supplierName}</span> : <Input disabled={true} value={formData.supplierName} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'代理商'}>
                                {
                                    isView ? <span>{formData.agentName}</span> : <Input disabled={true} value={formData.agentName} />
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem  {...formItemLayoutLong} label={'生产厂地址'}>
                                {
                                    isView ? <span>{formData.countryName + formData.provinceName + formData.cityName + formData.countyName + formData.address}</span> : <div>
                                        <Input disabled={true} value={formData.countryName} style={{ width: "10%" }} />
                                        <Input disabled={true} value={formData.provinceName} style={{ width: "10%", margin: "0 3px" }} />
                                        <Input disabled={true} value={formData.cityName} style={{ width: "10%" }} />
                                        <Input disabled={true} value={formData.countyName} style={{ width: "10%", margin: "0 3px" }} />
                                        <Input disabled={true} value={formData.address} style={{ width: "50%" }} />
                                    </div>
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商联系人'}>
                                {
                                    isView ? <span>{formData.contactUserName}</span> : <Input disabled={true} value={formData.contactUserName} />
                                }
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem  {...formLayout} label={'供应商联系方式'}>
                                {
                                    isView ? <span>{formData.contactUserTel}</span> : <Input disabled={true} value={formData.contactUserTel} />
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
                            pagination={<Pagination defaultCurrent={1} total={tabList.length} />}
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
