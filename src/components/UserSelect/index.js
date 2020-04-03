/**
 * @description 左组织机构树，右表人员选择，可选全部人员，原AllUserSelect组件改写
 * @author hezhi
 * @date 2020.4.3
 */
import React, { useState, useEffect, forwardRef } from "react";
import { Col, Row, Tree, Input, Select } from "antd";
import { request } from '@/utils'
import { baseUrl } from '@/utils/commonUrl'
import styles from './index.less';
import { ExtTable } from "suid";
import PropTypes from 'prop-types';
import classnames from 'classnames';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

//人员展示字段
const columns = [
  {
    title: '人员编号',
    dataIndex: 'code'
  },
  {
    title: '名字',
    dataIndex: 'user.userName',
  },
];

const UserSelect = forwardRef(function ({
  onChange=()=>null,
  onRowsChange=()=>null,
  wrapperClass,
  wrapperStyle,
  nodeKey,
  ...props
}, ref) {
  const [treeData, setTreeData] = useState([]);
  const [findResultData, setFindResultData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, triggerLoading] = useState(false);
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [userData, setUserData] = useState([]);
  const [keyList, setKeyList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([])
  const [selectedKeys, setSelectedKeys] = useState([])
  //网络请求树控件数据（协议分类）
  const getTreeData = () => {
    request({
      url: `${baseUrl}/basic/listAllOrgnazation`,
      method: 'get'
    }).then(data => {
      if (data.success) {
        setTreeData(data.data)
      }
    })
  }
  //树节点选择触发
  const onTreeSelect = (selectedKeys, info) => {
    const [id] = selectedKeys;
    triggerLoading(true)
    request({
      url: `${baseUrl}/basic/listAllCanAssignEmployeesByOrganization`,
      method: 'get',
      params: {
        organizationId: id
      }
    }).then(({ data }) => {
      triggerLoading(false)
      setUserData(data)
    }).catch(_ => triggerLoading(false))
  }

  //查找树节点
  const handleSearch = (value) => {
    let copyTree = JSON.parse(JSON.stringify(treeData));
    let findResultData = findNode(value, copyTree);
    setKeyList([])
    getExpandedKeys(findResultData);
    if (value === "") {//没有搜索关键字
      setFindResultData(findResultData)
      setSearchValue(value)
      setAutoExpandParent(false)
      setExpandedKeys([])
      return
    }
    setFindResultData(findResultData)
    setSearchValue(value)
    setAutoExpandParent(true)
    setExpandedKeys(keyList)
  }

  const getExpandedKeys = (data) => {
    for (let item of data) {
      setKeyList([...keyList, item.id])
      if (item.children && item.children.length > 0) {
        getExpandedKeys(item.children)
      }
    }
  };

  //树控件展开时
  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys)
    setAutoExpandParent(false)
  };

  //查找关键字节点
  const findNode = (value, tree) => {
    return tree.map(treeNode => {
      //如果有子节点
      if (treeNode.children && treeNode.children.length > 0) {
        //如果标题匹配
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        } else {//如果标题不匹配，则查看子节点是否有匹配标题
          treeNode.children = findNode(value, treeNode.children);
          if (treeNode.children.length > 0) {
            return treeNode
          }
        }
      } else {//没子节点
        if (treeNode.name.indexOf(value) > -1 || treeNode.code.indexOf(value) > -1) {
          return treeNode
        }
      }
      return null;
    }).filter((treeNode) => treeNode)
  };

  const renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <TreeNode title={item.name} key={item.id}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.id} isLeaf />;
    });
  };
  const rowOnChange = (keys, rows) => {
    setSelectedKeys(keys)
    setSelectedRows(rows)
    onChange(keys)
    onRowsChange(rows)
  }
  return (
    <div>
      <Select
        ref={ref}
        onDropdownVisibleChange={()=>{
          getTreeData()
        }}
        onDeselect={(key)=> {
          const keys = selectedKeys.filter(item=>item!==key)
          const rows = selectedRows.filter(item=>item.code!==key)
          setSelectedKeys(keys)
          onChange(keys)
          onRowsChange(rows)
        }}
        {...props}
        dropdownMatchSelectWidth={false}
        dropdownRender={() => (
          <div className={classnames([wrapperClass, styles.wrapper])} style={wrapperStyle} onMouseDown={e=>e.preventDefault()}>
            <div className={styles.header}>
              <span>组织机构</span>
            </div>
            <Row style={{ background: '#f3f8fc', padding: 5, paddingBottom: 5 }}>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Search
                  key="search"
                  placeholder="输入分类名称查询"
                  onSearch={e => handleSearch(e)}
                  style={{ width: '220px' }}
                  enterButton
                />
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}></Col>
            </Row>
            <Col span={10} style={{ height: 300, overflow: 'auto' }}>
              {treeData.length > 0 ? (
                <DirectoryTree
                  expandAction={"click"}
                  onSelect={onTreeSelect}
                  autoExpandParent={autoExpandParent}
                  expandedKeys={expandedKeys}
                  onExpand={onExpand}
                  draggable>
                  {renderTreeNodes(searchValue === "" ? treeData : findResultData)}
                </DirectoryTree>
              ) : null}
            </Col>
            <Col span={14} style={{ height: 300, overflow: 'auto' }}>
              <ExtTable
                checkbox={true}
                showSearch={false}
                loading={loading}
                selectedRowKeys={selectedKeys}
                onSelectRow={rowOnChange}
                rowKey={(item) => item.code}
                dataSource={userData}
                columns={columns}
              />
            </Col>
          </div>
        )}
      >
      </Select>
    </div>

  )
})
UserSelect.propTypes = {
  //人员选择后回调方法
  onRowsChange: PropTypes.func,
  onChange: PropTypes.func,
}

export default UserSelect

