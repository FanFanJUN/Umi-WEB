/**
 * @Description: 审核人员表格
 * @Author: M!keW
 * @Date: 2020-11-17
 */
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Tree } from 'antd';
import { ExtTable } from 'suid';

const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const AuditorInfoFrom = React.forwardRef(({ form, editData }, ref) => {

  useImperativeHandle(ref, () => ({}));

  const teamTableRef = useRef(null);
  const contentTableRef = useRef(null);
  const [initState, setInitState] = useState(false);
  const [groupLeader, setGroupLeader] = useState(editData && editData.length > 0 ? editData[0].groupLeader : '');
  const [teamData, setTeamData] = useState({
    dataSource: editData,
    selectedRowKeys: editData && editData.length > 0 ? editData[0].id : [],
    selectedRows: editData && editData.length > 0 ? editData[0] : [],
  });
  const [contentData, setContentData] = useState({
    dataSource: editData && editData.length > 0 && editData[0].groupData && editData[0].groupData.length > 0 ? editData[0].groupData : [],
    selectedRowKeys: editData && editData.length > 0 && editData[0].groupData && editData[0].groupData.length > 0 ? editData[0].groupData[0].id : [],
    selectedRows: editData && editData.length > 0 && editData[0].groupData && editData[0].groupData.length > 0 ? editData[0].groupData[0] : [],
  });
  const [treeData, setTreeData] = useState([]);
  const [filterTreeData, setFilterTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState(
    editData && editData.length > 0 && editData[0].groupData && editData[0].groupData.length > 0 && editData[0].groupData[0].checkId && editData[0].groupData[0].checkId.length > 0 ?
      editData[0].groupData[0].checkId : [],
  );
  //初始化获取树的数据
  const getTreeData = () => {
    let res = [{
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
    ];
    setInitState(true);
    setTreeData(res);
  };
  //只展示勾选的树
  const transferData = () => {
    if (treeData && treeData.length > 0) {
      let dataSource = JSON.parse(JSON.stringify(treeData));
      let findResultData = findCheckedData(checkedKeys, dataSource);
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
          if (treeNode.children && treeNode.children.length > 0) {
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

  const handleTeamSelectedRows = (keys, values) => {
    setTeamData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
    if (values && values.length > 0) {
      //设置组长名
      if (values[0].groupLeader) {
        setGroupLeader(values[0].groupLeader);
      } else {
        setGroupLeader();
      }
      //设置右边第一个表格数据
      if (values[0].groupData && values[0].groupData.length > 0) {
        setContentData(v => ({
          ...v,
          dataSource: values[0].groupData,
          selectedRows: [],
          selectedRowKeys: [],
          // selectedRows: values[0].groupData[0],
          // selectedRowKeys: values[0].groupData[0].id,
        }));
      } else {
        setContentData({
          dataSource: [],
          selectedRowKeys: [],
          selectedRows: [],
        });
      }
      //设置右边树数据
      if (values[0].groupData && values[0].groupData.length > 0 && values[0].groupData[0].checkId && values[0].groupData[0].checkId.length > 0) {
        // setCheckedKeys(values[0].groupData[0].checkId);
      } else {
        setCheckedKeys([]);
        setFilterTreeData([]);
      }
    } else {
      setGroupLeader();
      setContentData({
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
      });
      setCheckedKeys([]);
      setFilterTreeData([]);
    }
  };
  const handleContentSelectedRows = (keys, values) => {
    setContentData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
    if (values && values.length > 0 && values[0].checkId && values[0].checkId.length > 0) {
      setCheckedKeys(values[0].checkId);
    } else {
      setCheckedKeys([]);
      setFilterTreeData([]);
    }
  };
  useEffect(() => {
    getTreeData();
  }, []);
  useEffect(() => {
    transferData();
  }, [checkedKeys, initState]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核人员</div>
        <div className={styles.content}>
          <Row>
            <Col span={12}>
              <FormItem label="审核小组组长" {...formLayout}>
                <span>{groupLeader}</span>
              </FormItem>
            </Col>
          </Row>
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ width: '25%' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>组别</span>
              <div style={{ marginTop: '10px', height: '480px' }}>
                <ExtTable
                  rowKey={(v) => v.id}
                  allowCancelSelect={true}
                  showSearch={false}
                  remotePaging
                  checkbox={{ multiSelect: false }}
                  size='small'
                  onSelectRow={handleTeamSelectedRows}
                  selectedRowKeys={teamData.selectedRowKeys}
                  columns={teamColumns}
                  ref={teamTableRef}
                  dataSource={teamData.dataSource}
                />
              </div>
            </div>
            <div style={{ width: '75%', height: '100%', marginLeft: '10px' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>成员及审核内容</span>
              <div style={{ marginTop: '10px', height: '270px' }}>
                <ExtTable
                  rowKey={(v) => v.id}
                  allowCancelSelect={true}
                  showSearch={false}
                  remotePaging
                  checkbox={{ multiSelect: false }}
                  size='small'
                  onSelectRow={handleContentSelectedRows}
                  selectedRowKeys={contentData.selectedRowKeys}
                  columns={contentColumns}
                  ref={contentTableRef}
                  dataSource={contentData.dataSource}
                />
              </div>
              <div style={{ height: '230px' }}>
                <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>成员审核内容管理</span>
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
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditorInfoFrom);
