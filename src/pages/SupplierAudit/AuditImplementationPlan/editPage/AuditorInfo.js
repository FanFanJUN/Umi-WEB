/*
 * @Author: 黄永翠
 * @Date: 2020-11-09 10:44:12
 * @LastEditTime: 2020-11-17 16:44:30
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-审核人员
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\editPage\AuditorInfo.js
 */

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Row, Input, Button, message } from 'antd';
import { ExtTable } from "suid";
import ShuttleBox from "../../common/ShuttleBox";
import EventModal from '../../common/EventModal';
import { getRandom } from '../../../QualitySynergy/commonProps';
import ContentModal from '../../AuditRequirementsManagement/add/component/contentModal';
import { duplicateRemoval, PersonnelTypeArr, RoleArr } from '../../mainData/commomService';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
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

const fieldsConfig = [
  {
    name: '组别',
    code: 'reviewGroup',
  },
  {
    name: '排序号',
    code: 'rank',
  },
];
const AuditorInfo = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    getTableList:() => teamData.dataSource
  }));

  const teamTableRef = useRef(null);
  const contentTableRef = useRef(null);

  const [teamData, setTeamData] = useState({
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [contentData, setContentData] = useState({
    visible: false,
    title: '',
    type: 'add',
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [data, setData] = useState({
    treeData: [],
    leftTreeData: undefined,
    selectRows: [],
    visible: false,
    type: 'add',
    title: '组别新增',
  });

  useEffect(() => {
    setTeamData(v => ({ ...v, dataSource: props.reviewTeamGroupBoList }));
  }, [props.reviewTeamGroupBoList]);

  useEffect(() => {
    if (contentData.dataSource && contentData.dataSource.length !== 0) {
      changeTeamData();
    }
  }, [contentData.dataSource]);

  // 修改成员数据更改组别相关数据
  const changeTeamData = () => {
    let newTeamData = JSON.parse(JSON.stringify(teamData.dataSource));
    newTeamData.map((item, index) => {
      if (item.lineNum === teamData.selectedRowKeys[0]) {
        newTeamData[index].reviewTeamMemberBoList = contentData.dataSource;
      }
    });
    setTeamData(v => ({ ...v, dataSource: newTeamData }));
    teamTableRef.current.remoteDataRefresh();
  };

  const handleOk = (value) => {
    console.log(value, 'values')
    if (data.type === 'add') {
      value.lineNum = getRandom(10);
      value.reviewTeamMemberBoList = [];
      setTeamData(v => ({ ...v, dataSource: [...teamData.dataSource, ...[value]] }));
    } else {
      let newData = teamData.dataSource.slice(); x
      teamData.dataSource.forEach((item, index) => {
        if (item.lineNum === data.selectRows[0].lineNum) {
          value.lineNum = item.lineNum;
          value.reviewTeamMemberBoList = item.reviewTeamMemberBoList;
          newData.splice(index, 1, value);
        }
      });
      setTeamData(v => ({ ...v, dataSource: newData, selectedRows: [], selectedRowKeys: [] }));
    }
    teamTableRef.current.manualSelectedRows();
    teamTableRef.current.remoteDataRefresh();
    setData(v => ({ ...v, visible: false }));
  };

  const contentAdd = (value) => {
    console.log(value);
    if (contentData.type === 'add') {
      if (value.memberRole === 'GROUP_LEADER') {
        if (contentData.dataSource.some(item => item.memberRole === 'GROUP_LEADER')) {
          message.error('每个组只能有一个组长!')
          return
        }
      }
      value.lineNum = getRandom(10);
      value.memberRuleBoList = [];
      setContentData(v => ({ ...v, dataSource: [...contentData.dataSource, ...[value]], visible: false }));
    } else {
      let newDataSource = JSON.parse(JSON.stringify(contentData.dataSource));
      newDataSource.map((item, index) => {
        if (item.lineNum === value.lineNum) {
          newDataSource.splice(index, 1, value);
        }
      });
      setContentData(v => ({ ...v, dataSource: newDataSource, visible: false }));
    }
    contentTableRef.current.manualSelectedRows();
    contentTableRef.current.remoteDataRefresh();
    console.log(contentData, value);
  };

  const handleTeamSelectedRows = (keys, values) => {
    setTeamData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
    if (keys.length !== 0) {
      values[0].reviewTeamMemberBoList = values[0].reviewTeamMemberBoList.map(item => ({
        ...item,
        memberRoleName: RoleArr[item.memberRole],
        memberTypeName: PersonnelTypeArr[item.memberType],
        lineNum: item.lineNum ? item.lineNum : getRandom(10),
      }));
      setContentData(v => ({ ...v, dataSource: values[0].reviewTeamMemberBoList }));
      contentTableRef.current.manualSelectedRows();
      contentTableRef.current.remoteDataRefresh();
    } else {
      setContentData(v => ({ ...v, dataSource: [] }));
      contentTableRef.current.manualSelectedRows();
      contentTableRef.current.remoteDataRefresh();
    }
  };

  const handleContentSelectedRows = (keys, values) => {
    let treeData = values[0]?.memberRuleBoList ? values[0].memberRuleBoList ? JSON.parse(JSON.stringify(values[0].memberRuleBoList)) : [] : [];
    treeData = treeData.map(item => {
      if (!item.key) {
        item.id = item.systemId;
        item.key = item.systemId;
        item.title = item.systemName;
        return item;
      } else {
        return item;
      }
    });
    setData(v => ({ ...v, leftTreeData: undefined, treeData: treeData }));
    setContentData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
  };

  const buttonClick = (type) => {
    switch (type) {
      case 'teamAdd':
        setData(v => ({
          ...v,
          selectRows: [],
          title: '组别新增',
          type: 'add',
          visible: true,
        }));
        break;
      case 'teamEdit':
        if (teamData.selectedRowKeys && teamData.selectedRowKeys.length !== 0) {
          setData(v => ({
            ...v,
            selectRows: teamData.selectedRows,
            title: '组别编辑',
            type: 'edit',
            visible: true,
          }));
        } else {
          message.error('请选择一个组别!');
        }
        break;
      case 'contentAdd':
        if (teamData.selectedRows.length !== 0) {
          setContentData(v => ({
            ...v,
            title: '成员新增',
            type: 'add',
            visible: true,
          }));
        } else {
          message.error('请选择一个组别!');
        }
        break;
      case 'contentEdit':
        if (contentData.selectedRows.length !== 0) {
          setContentData(v => ({
            ...v,
            title: '成员编辑',
            type: 'edit',
            visible: true,
          }));
        } else {
          message.error('请先选择一条数据!');
        }
        break;
    }
  };

  const teamDelete = () => {
    const { selectedRowKeys, selectedRows } = teamData;
    let newData = JSON.parse(JSON.stringify(teamData.dataSource));
    if (selectedRowKeys && selectedRowKeys.length !== 0) {
      if (selectedRows[0].id) {
        let deleteArr = props.deleteArr.slice();
        deleteArr.push({ id: selectedRows[0].id, type: 'GROUP' });
        props.setDeleteArr(deleteArr);
      }
      newData.forEach((value, index) => {
        if (value.lineNum === selectedRowKeys[0]) {
          newData.splice(index, 1);
        }
      });
      setTeamData(v => ({ ...v, dataSource: newData, selectedRows: [], selectedRowKeys: [] }));
      teamTableRef.current.manualSelectedRows();
      teamTableRef.current.remoteDataRefresh();
    } else {
      message.error('请至少选择一条数据');
    }
  };

  // 成员的删除
  const contentDelete = () => {
    if (contentData.selectedRowKeys && contentData.selectedRowKeys.length !== 0) {
      // 成员和组别的层级太深，和后端约定同意放在一个数组中传过去
      if (contentData.selectedRows[0].id) {
        let deleteArr = props.deleteArr.slice();
        deleteArr.push({ id: contentData.selectedRows[0].id, type: 'MEMBER' });
        props.setDeleteArr(deleteArr);
      }
      let newDataSource = JSON.parse(JSON.stringify(contentData.dataSource));
      newDataSource.forEach((item, index) => {
        if (item.lineNum === contentData.selectedRowKeys[0]) {
          newDataSource.splice(index, 1);
        }
      });
      setData(v => ({ ...v, treeData: [], leftTreeData: [] }));
      setContentData(v => ({ ...v, dataSource: newDataSource }));
    } else {
      message.error('请选择一条数据');
    }
  };

  const getTreeData = (value) => {
    let newData = JSON.parse(JSON.stringify(contentData.dataSource));
    newData.map((item, index) => {
      if (item.lineNum === contentData.selectedRowKeys[0]) {
        newData[index].memberRuleBoList = value;
      }
    });
    setContentData(v => ({ ...v, dataSource: newData }));
    contentTableRef.current.remoteDataRefresh();
  };

  // 构造左边树
  const getLeftTreeData = () => {
    if (contentData.selectedRowKeys && contentData.selectedRowKeys.length !== 0) {
      let arr = [...props.treeData];
      if (arr.length > 1) {
        arr = duplicateRemoval(arr, 'key');
      }
      setData(v => ({ ...v, leftTreeData: arr }));
    } else {
      message.error('请选择一名成员');
    }
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>审核人员</div>
        <div className={styles.content} style={{ paddingLeft: "10vw" }}>
          <Row>
            <Col span={8}>
              <FormItem label="审核小组组长" {...formLayout}>
                <Input disabled={true} value={JSON.parse(sessionStorage.getItem('selectedMonthLIne'))[0].leaderName} />
              </FormItem>
            </Col>
          </Row>
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <div style={{ width: '25%' }}>
              <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>组别</span>
              {
                props.type !== 'detail' && <div style={{ marginTop: '10px' }}>
                  <Button type='primary' onClick={() => buttonClick('teamAdd')}>新增</Button>
                  <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('teamEdit')}>编辑</Button>
                  <Button style={{ marginLeft: '5px' }} onClick={teamDelete}>删除</Button>
                </div>
              }
              <div style={{ marginTop: '10px', height: '480px' }}>
                <ExtTable
                  rowKey={(v) => v.lineNum}
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
              {
                props.type !== 'detail' && <div style={{ marginTop: '10px' }}>
                  <Button type='primary' onClick={() => buttonClick('contentAdd')}>新增</Button>
                  <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('contentEdit')}>编辑</Button>
                  <Button style={{ marginLeft: '5px' }} onClick={contentDelete}>删除</Button>
                  <Button style={{ marginLeft: '5px' }} onClick={getLeftTreeData}>审核内容管理</Button>
                </div>
              }
              <div style={{ marginTop: '10px', height: '270px' }}>
                <ExtTable
                  rowKey={(v) => v.lineNum}
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
                <ShuttleBox
                  type={props.type === 'detail' && 'show'}
                  rightTreeData={data.treeData}
                  onChange={getTreeData}
                  leftTreeData={data.leftTreeData}
                />
              </div>
            </div>
          </div>
          <ContentModal
            visible={contentData.visible}
            title={contentData.title}
            type={contentData.type}
            onOk={contentAdd}
            data={contentData.selectedRows[0] ? contentData.selectedRows[0] : {}}
            onCancel={() => setContentData(v => ({ ...v, visible: false }))}
          />
          <EventModal
            onCancel={() => setData((value) => ({ ...value, visible: false }))}
            onOk={handleOk}
            data={data.selectRows[0]}
            fieldsConfig={fieldsConfig}
            propData={{
              visible: data.visible,
              type: data.type,
              title: data.title,
            }}
          />
        </div>
      </div>
    </div >
  )
});

export default Form.create()(AuditorInfo);