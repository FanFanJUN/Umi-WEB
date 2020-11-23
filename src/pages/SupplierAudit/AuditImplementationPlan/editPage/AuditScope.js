/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:43:10
 * @LastEditTime: 2020-11-23 11:19:30
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-审核范围
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditScope.js
 */

import React, { useEffect, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Tree } from 'antd';

const AuditScope = (props) => {
    let { treeData } = props;
    const [rightCheckedKeys, setRightCheckedKeys] = useState([]);
    useEffect(()=>{
        let checkedKeys = treeData ? treeData.map(item => item.id) : [];
        setRightCheckedKeys(checkedKeys);
    }, [treeData])
    // console.log()
    return (
        <div className={styles.wrapper}>
            <div className={styles.bgw}>
                <div className={styles.title}>审核范围</div>
                <div className={styles.content}>
                    <div style={{ margin: "0 0 3vw 10vw" }}>
                        <Tree
                            defaultExpandAll={true}
                            checkable
                            disabled
                            checkedKeys={rightCheckedKeys}
                            treeData={treeData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuditScope;