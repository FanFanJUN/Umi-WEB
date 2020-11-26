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
let keys = [];

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
  const [checkedKeys, setCheckedKeys] = useState([]);
  const teamTableRef = useRef(null);
  const contentTableRef = useRef(null);
  const [groupLeader, setGroupLeader] = useState(null);
  const [teamData, setTeamData] = useState({
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });
  const [contentData, setContentData] = useState({
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    getInitData();
  }, [editData]);

  const getInitData = () => {
    if (editData && editData.length > 0) {
      setGroupLeader(editData[0].groupLeader);
      setTeamData(v => ({ ...v, dataSource: editData, selectedRows: editData[0], selectedRowKeys: editData[0].id }));
      if (editData[0].reviewTeamMemberBoList && editData[0].reviewTeamMemberBoList.length > 0) {
        setContentData(v => ({
          ...v,
          dataSource: editData[0].reviewTeamMemberBoList,
          selectedRows: editData[0].reviewTeamMemberBoList[0],
          selectedRowKeys: editData[0].reviewTeamMemberBoList[0].id,
        }));
        if (editData[0].reviewTeamMemberBoList[0].memberRuleBoList && editData[0].reviewTeamMemberBoList[0].memberRuleBoList.length > 0) {
          setTreeData(editData[0].reviewTeamMemberBoList[0].memberRuleBoList);
          getCheckedKeys(editData[0].reviewTeamMemberBoList[0].memberRuleBoList);
        }
      }
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
      if (values[0].reviewTeamMemberBoList && values[0].reviewTeamMemberBoList.length > 0) {
        setContentData(v => ({
          ...v,
          dataSource: values[0].reviewTeamMemberBoList,
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
      if (values[0].reviewTeamMemberBoList && values[0].reviewTeamMemberBoList.length > 0 && values[0].reviewTeamMemberBoList[0].memberRuleBoList && values[0].reviewTeamMemberBoList[0].memberRuleBoList.length > 0) {
        // setCheckedKeys(values[0].groupData[0].checkId);
      } else {
        setTreeData([]);
      }
    } else {
      setGroupLeader();
      setContentData({
        dataSource: [],
        selectedRowKeys: [],
        selectedRows: [],
      });
      setTreeData([]);
    }
  };
  const handleContentSelectedRows = (keys, values) => {
    setContentData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
    if (values && values.length > 0 && values[0].memberRuleBoList && values[0].memberRuleBoList.length > 0) {
      setTreeData(values[0].memberRuleBoList);
    } else {
      setTreeData([]);
    }
  };

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
