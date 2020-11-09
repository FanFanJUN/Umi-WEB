/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:49:50
 * @LastEditTime: 2020-11-09 10:50:25
 * @LastEditors: Please set LastEditors
 * @Description: I审核实施计划-审核计划
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditPlan.js
 */

import React from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Input } from 'antd';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const AuditPlan = (props) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核计划</div>
                <div className={styles.content}>
                    内容区
                </div>
            </div>
        </div>
    )
}

export default AuditPlan;