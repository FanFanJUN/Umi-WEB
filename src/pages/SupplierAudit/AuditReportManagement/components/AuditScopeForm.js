/**
 * @Description:  审核范围表单
 * @Author: M!keW
 * @Date: 2020-11-17
 */

import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Tree } from 'antd';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
let keys = [];

const AuditScopeForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  useEffect(() => {
    getTreeData();
  }, [editData]);
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  //初始化获取树的数据
  const getTreeData = () => {
    setTreeData(editData);
    if (editData && editData.length > 0) {
      let tree = JSON.parse(JSON.stringify(editData));
      getCheckedKeys(tree);
    }
  };
  const getCheckedKeys = (tree) => {
    tree.forEach(item => {
      keys.push(item.id);
      if (item.children && item.children.length > 0) {
        getCheckedKeys(item.children);
      }
    });
    keys = Array.from(new Set(keys));
    setCheckedKeys(keys);
  };
  const renderTreeNodes = (data) => {
    if (data.length > 0) {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disableCheckbox={true}
              title={item.systemName} key={item.id}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode
          disableCheckbox={true}
          title={item.systemName}
          key={item.id} isLeaf/>;
      });
    } else {
      return;
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核范围</div>
        <div className={styles.content}>
          {treeData && treeData.length > 0 && < DirectoryTree
            defaultExpandAll
            checkedKeys={checkedKeys}
            checkable
          >
            {renderTreeNodes(treeData)}
          </DirectoryTree>}
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditScopeForm);
