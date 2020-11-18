/**
 * @Description:  审核范围表单
 * @Author: M!keW
 * @Date: 2020-11-17
 */

/**
 * @Description: 拟审核信息
 * @Author: M!keW
 * @Date: 2020-11-17
 */

import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form, Tree } from 'antd';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;

const AuditScopeForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  useEffect(() => {
    transferData();
  }, []);

  const [treeData, setTreeData] = useState([
    {
      title: 'parent 0',
      id: '0-0',
      children: [
        { title: 'leaf 0-0', id: '0-0-0', isLeaf: true },
        { title: 'leaf 0-1', id: '0-0-1', isLeaf: true },
      ],
    },
    {
      title: 'parent 1',
      id: '0-1',
      children: [
        { title: 'leaf 1-0', id: '0-1-0', isLeaf: true },
        { title: 'leaf 1-1', id: '0-1-1', isLeaf: true },
      ],
    },
  ]);
  const [filterTreeData, setFilterTreeData] = useState([]);

  //只展示勾选的树
  const transferData = () => {
    if (treeData && treeData.length > 0) {
      let dataSource = JSON.parse(JSON.stringify(treeData));
      let findResultData = findCheckedData(editData, dataSource);
      setFilterTreeData(findResultData);
    }
  };

  //查找关键字节点
  const findCheckedData = (checkedKeys, tree) => {
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children && treeNode.children.length > 0) {
        if (checkedKeys.indexOf(treeNode.id) > -1) {
          return treeNode;
        } else {
          treeNode.children = findCheckedData(checkedKeys, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode;
          }
        }
      } else {//没子节点
        if (checkedKeys.indexOf(treeNode.id) > -1) {
          return treeNode;
        }
      }
      return null;
    }).filter((treeNode, i, self) => treeNode);
  };

  const renderTreeNodes = (data) => {
    if (data.length > 0) {
      return data.map((item) => {
        if (item.children && item.children.length > 0) {
          return (
            <TreeNode
              disableCheckbox={true}
              title={item.title} key={item.id}>
              {renderTreeNodes(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode
          disableCheckbox={true}
          title={item.title}
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
          {treeData&&treeData.length>0&&< DirectoryTree
            defaultExpandAll
            checkedKeys={editData}
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
