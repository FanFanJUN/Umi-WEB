/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:43:10
 * @LastEditTime : 2020-12-22 11:25:11
 * @LastEditors  : LiCai
 * @Description: 审核实施计划-审核范围
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AuditImplementationPlan/editPage/AuditScope.js
 */

import React, { useEffect, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Tree } from 'antd';

const AuditScope = (props) => {
    let { treeData } = props;
    const [newTree, setNewTree] = useState([]);
    const [rightCheckedKeys, setRightCheckedKeys] = useState([]);
    //找到子节点
    const findSon = (data, arr) => {
        arr.forEach((item) => {
            item.systemId = item.systemId ? item.systemId : item.id;
            item.systemCode = item.systemCode ? item.systemCode : item.code;
            item.systemName = item.systemName ? item.systemName : item.name;
            item.key = item.systemId;
            item.title = item.systemName;
            if (item.parentId === data.systemId) {
                data.children = data.children ? data.children : [];
                data.children.push(item);
            }
        });
    };

    // 构造树-递归
    const recursion = (arr, type = undefined) => {
        let newArr = JSON.parse(JSON.stringify(arr));
        newArr.forEach(item => {
            item.systemId = item.systemId ? item.systemId : item.id;
            item.systemCode = item.systemCode ? item.systemCode : item.code;
            item.systemName = item.systemName ? item.systemName : item.name;
            item.key = item.systemId;
            item.title = item.systemName;
            if (item.children && item.children.length !== 0) {
                item.children = [];
            }
            findSon(item, newArr);
        });
        let data = [];
        newArr.forEach(item => {
            if (!item.parentId) {
                data.push(item);
            }
        });
        return data;
    };

    useEffect(() => {
        if(treeData && treeData.length > 0) {
            let newTree = recursion(treeData);
            setNewTree(newTree);
        }
        let checkedKeys = treeData ? treeData.map(item => item.id) : [];
        setRightCheckedKeys(checkedKeys);
    }, [treeData])

    return (
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>审核范围</div>
          <div className={styles.content}>
            <div style={{ margin: '0 0 3vw 10vw' }}>
              {newTree.length > 0 && (
                <Tree
                  defaultExpandAll={true}
                  checkable
                  disabled
                  checkedKeys={rightCheckedKeys}
                  treeData={newTree}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
}

export default AuditScope;