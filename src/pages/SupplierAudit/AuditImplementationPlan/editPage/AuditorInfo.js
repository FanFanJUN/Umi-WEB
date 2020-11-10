/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:44:12
 * @LastEditTime: 2020-11-09 15:52:34
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-审核人员
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditorInfo.js
 */

import React, { useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Input } from 'antd';
import { ExtTable } from "suid";
import ShuttleBox from "../../common/ShuttleBox";
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
const AuditorInfo = (props) => {
    const [data, setData] = useState({
        teamData: [],
        contentData: [],
        treeData: [],
        leftTreeData: []
    })
    const teamColumns = [
        { title: '组别', dataIndex: 'reviewGroup', ellipsis: true, width: 60 },
        { title: '排序号', dataIndex: 'rank', ellipsis: true },
    ].map(item => ({ ...item, align: 'center' }));

    const contentColumns = [
        { title: '角色', dataIndex: 'memberRoleName', width: 50 },
        { title: '部门', dataIndex: 'departmentName', width: 120 },
        { title: '员工编号', dataIndex: 'employeeNo', width: 100 },
        { title: '姓名', dataIndex: 'memberName', width: 120 },
        { title: '联系电话', dataIndex: 'memberTel', width: 100 },
        { title: '外部单位', dataIndex: 'outsideCompany', width: 100 },
    ].map(item => ({ ...item, align: 'center' }));

    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核人员</div>
                <div className={styles.content}>
                    <Row>
                        <Col span={8}>
                            <FormItem label="审核小组组长" {...formLayout}>
                                <Input disabled={true} value={"朱颖"} />
                            </FormItem>
                        </Col>
                    </Row>
                    <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                        <div style={{ width: '25%' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>组别</span>
                            <div style={{ marginTop: '10px', height: '480px' }}>
                                <ExtTable
                                    rowKey={(v) => v.id}
                                    showSearch={false}
                                    checkbox={false}
                                    size='small'
                                    columns={teamColumns}
                                    dataSource={data.teamData}
                                />
                            </div>
                        </div>
                        <div style={{ width: '75%', height: '100%', marginLeft: '10px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>成员及审核内容</span>
                            <div style={{ marginTop: '10px', height: '270px' }}>
                                <ExtTable
                                    rowKey={(v) => v.id}
                                    showSearch={false}
                                    checkbox={false}
                                    size='small'
                                    columns={contentColumns}
                                    dataSource={data.contentData}
                                />
                            </div>
                            <div style={{ height: '230px' }}>
                                <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>成员审核内容管理</span>
                                <ShuttleBox
                                    rightTreeData={data.treeData}
                                    leftTreeData={data.leftTreeData}
                                    onChange={(values) => {
                                        console.log(values)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AuditorInfo;