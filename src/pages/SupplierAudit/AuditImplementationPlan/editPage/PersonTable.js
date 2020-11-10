/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:46:10
 * @LastEditTime: 2020-11-09 15:33:04
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-协同人员
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\PersonTable.js
 */

import React, { useState } from 'react';
import { Pagination } from "antd";
import { ExtTable } from "suid";
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';

const PersonTable = (props) => {
    const [dataSource, setDataSource] = useState([{ id: 1, departmentName: '研发' }]);
    const columns = [
        { title: '部门', dataIndex: 'departmentName', width: 160 },
        { title: '员工编号', dataIndex: 'employeeNo', width: 100 },
        { title: '姓名', dataIndex: 'memberName', width: 120 },
        { title: '联系电话', dataIndex: 'memberTel', width: 100 },
    ]

    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>协同人员</div>
                <div className={styles.content}>
                    <ExtTable
                        rowKey={(v) => v.id}
                        allowCancelSelect={true}
                        showSearch={false}
                        checkbox={false}
                        size='small'
                        pagination={<Pagination defaultCurrent={1} total={50} />}
                        onChange={(page, pageSize) => {
                            console.log(page, pageSize)
                        }}
                        columns={columns}
                        dataSource={dataSource}
                    />
                </div>
            </div>
        </div>
    )
}

export default PersonTable;