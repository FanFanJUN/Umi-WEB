/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:43:10
 * @LastEditTime: 2020-11-11 14:12:05
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-审核范围
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditScope.js
 */

import React, { useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Tree } from 'antd';

const AuditScope = (props) => {
    const [treeData, setTreeData] = useState([{
        id: "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412",
        "frozen": false,
        "tenantCode": "10000028",
        "systemId": "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412",
        "systemName": "长虹集团供应商评价体系",
        "systemCode": "TX027",
        "codePath": "|TX027",
        "namePath": "/长虹集团供应商评价体系",
        "parentId": null,
        "relatedId": "9BEA0376-1DAB-11EB-9166-0242C0A84409",
        "relatedLineId": "9BF12F67-1DAB-11EB-9166-0242C0A84409",
        "children": [
            { "id": "78AC0928-F7F5-11EA-9B98-0242C0A84412", "frozen": false, "tenantCode": "10000028", "systemId": "78AC0928-F7F5-11EA-9B98-0242C0A84412", "systemName": "质量表现", "systemCode": "TX02701", "codePath": "|TX027|TX02701", "namePath": "/长虹集团供应商评价体系/质量表现", "parentId": "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412", "relatedId": "9BEA0376-1DAB-11EB-9166-0242C0A84409", "relatedLineId": "9BF12F67-1DAB-11EB-9166-0242C0A84409", "children": null, "ruleList": null, "whetherSelected": true, "key": "78AC0928-F7F5-11EA-9B98-0242C0A84412", "title": "质量表现" },
            { "id": "834D4A36-F7F5-11EA-9B98-0242C0A84412", "frozen": false, "tenantCode": "10000028", "systemId": "834D4A36-F7F5-11EA-9B98-0242C0A84412", "systemName": "技术表现", "systemCode": "TX02702", "codePath": "|TX027|TX02702", "namePath": "/长虹集团供应商评价体系/技术表现", "parentId": "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412", "relatedId": "9BEA0376-1DAB-11EB-9166-0242C0A84409", "relatedLineId": "9BF12F67-1DAB-11EB-9166-0242C0A84409", "children": null, "ruleList": null, "whetherSelected": true, "key": "834D4A36-F7F5-11EA-9B98-0242C0A84412", "title": "技术表现" },
            { "id": "9A010E2A-F7F5-11EA-9B98-0242C0A84412", "frozen": false, "tenantCode": "10000028", "systemId": "9A010E2A-F7F5-11EA-9B98-0242C0A84412", "systemName": "商务表现", "systemCode": "TX02703", "codePath": "|TX027|TX02703", "namePath": "/长虹集团供应商评价体系/商务表现", "parentId": "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412", "relatedId": "9BEA0376-1DAB-11EB-9166-0242C0A84409", "relatedLineId": "9BF12F67-1DAB-11EB-9166-0242C0A84409", "children": null, "ruleList": null, "whetherSelected": true, "key": "9A010E2A-F7F5-11EA-9B98-0242C0A84412", "title": "商务表现" }
        ],
        "ruleList": null,
        "whetherSelected": false,
        key: "AD8B44ED-F7B8-11EA-AE9B-0242C0A84412",
        title: "长虹集团供应商评价体系"
    }])
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核范围</div>
                <div className={styles.content}>
                    <div style={{ margin: "0 0 10vw 10vw" }}>
                        <Tree
                            defaultExpandAll={true}
                            checkable
                            checkedKeys={['AD8B44ED-F7B8-11EA-AE9B-0242C0A84412']}
                            checkable={false}
                            treeData={treeData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditScope;