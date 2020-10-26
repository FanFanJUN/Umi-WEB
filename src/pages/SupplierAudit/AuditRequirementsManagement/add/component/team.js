import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ExtModal, ExtTable } from 'suid';
import { Button, message } from 'antd';
import EventModal from '../../../common/EventModal';
import { AuditTypeManagementConfig, PersonnelTypeConfig, RoleConfig } from '../../../mainData/commomService';
import { getRandom } from '../../../../QualitySynergy/commonProps';

const teamColumns = [
  { title: '组别', dataIndex: 'reviewGroup', ellipsis: true, width: 60 },
  { title: '排序号', dataIndex: 'rank', ellipsis: true },
].map(item => ({ ...item, align: 'center' }));

const contentColumns = [
  { title: '角色', dataIndex: 'memberRole', ellipsis: true },
  { title: '部门', dataIndex: 'departmentName', ellipsis: true },
  { title: '员工编号', dataIndex: 'employeeNo', ellipsis: true },
  { title: '姓名', dataIndex: 'memberName', ellipsis: true },
  { title: '联系电话', dataIndex: 'memberTel', ellipsis: true },
  { title: '外部单位', dataIndex: 'outsideCompany', ellipsis: true },
].map(item => ({ ...item, align: 'center' }));

const Team = (props) => {

  const teamTableRef = useRef(null);

  const contentTableRef = useRef(null);

  const { visible } = props;

  const [teamData, setTeamData] = useState({
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [contentData, setContentData] = useState({
    disabled: true,
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [data, setData] = useState({
    buttonType: 'team',
    selectRows: [],
    visible: false,
    type: 'add',
    title: '组别新增',
    fieldsConfig: [
      {
        name: '组别',
        code: 'name',
      },
      {
        name: '排序号',
        code: 'code',
      },
    ],
  });

  const clearSelected = () => {

  };

  const handleOk = (value) => {
    if (data.buttonType === 'team') {
      if (data.type === 'add') {
        value.lineNum = getRandom(10);
        setTeamData(v => ({ ...v, dataSource: [...teamData.dataSource, ...[value]] }));
      } else {
        let newData = teamData.dataSource.slice();
        teamData.dataSource.forEach((item, index) => {
          if (item.lineNum === data.selectRows[0].lineNum) {
            value.lineNum = item.lineNum;
            newData.splice(index, 1, value);
          }
        });
        setTeamData(v => ({ ...v, dataSource: newData }));
        teamTableRef.current.manualSelectedRows();
        teamTableRef.current.remoteDataRefresh();
      }
    } else {

    }
    setData(v => ({ ...v, visible: false }));
  };

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const handleTeamSelectedRows = (keys, values) => {
    setTeamData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
  };

  const handleContentSelectedRows = (keys, values) => {
    setContentData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
  };

  const memberTypeChange = (value) => {
    // newFieldsConfig[2].disabled = value.code !== 'INTERNAL_USERS'
    // newFieldsConfig[3].disabled = value.code !== 'INTERNAL_USERS'
    setData(v => ({...v, fieldsConfig: [
        {
          name: '角色',
          type: 'comboList',
          code: 'memberRoleName',
          config: RoleConfig,
          field: ['memberRole'],
        },
        {
          name: '人员类型',
          type: 'comboList',
          code: 'memberTypeName',
          config: {...PersonnelTypeConfig, afterSelect: memberTypeChange},
          field: ['memberType']
        },
        { name: '部门', code: 'ad', disabled: value.code !== 'INTERNAL_USERS',  rules: [{rules: false}] },
        { name: '员工编号', code: 'sd', disabled: value.code !== 'INTERNAL_USERS', rules: [{rules: false}] },
        { name: '姓名', code: 'fd' },
        { name: '联系电话', code: 'fg' },
        { name: '外部单位', code: 'gh', rules: [{rules: false}] }]}))
  }

  useEffect(() => {
    console.log(data.fieldsConfig)
  }, [data.fieldsConfig])

  const buttonClick = (type) => {
    switch (type) {
      case 'teamAdd':
        setData(v => ({
          ...v,
          selectRows: [],
          buttonType: 'team',
          title: '组别新增',
          type: 'add',
          fieldsConfig: [{ name: '组别', code: 'reviewGroup' }, { name: '排序号', code: 'rank' }],
          visible: true,
        }));
        break;
      case 'teamEdit':
        setData(v => ({
          ...v,
          selectRows: teamData.selectedRows,
          buttonType: 'team',
          title: '组别编辑',
          type: 'edit',
          fieldsConfig: [{ name: '组别', code: 'reviewGroup' }, { name: '排序号', code: 'rank' }],
          visible: true,
        }));
        break;
      case 'contentAdd':
        // if (teamData.selectedRows.length !== 0) {
        setData(v => ({
          ...v,
          selectRows: [],
          buttonType: 'content',
          title: '成员新增',
          type: 'edit',
          fieldsConfig: [
            {
              name: '角色',
              type: 'comboList',
              code: 'memberRoleName',
              config: RoleConfig,
              field: ['memberRole'],
            },
            {
              name: '人员类型',
              type: 'comboList',
              code: 'memberTypeName',
              config: {...PersonnelTypeConfig, afterSelect: memberTypeChange},
              field: ['memberType']
            },
            { name: '部门', code: 'ad', disabled: true,  rules: [{rules: false}] },
            { name: '员工编号', code: 'sd', disabled: true, rules: [{rules: false}] },
            { name: '姓名', code: 'fd' },
            { name: '联系电话', code: 'fg' },
            { name: '外部单位', code: 'gh', rules: [{rules: false}] }],
          visible: true,
        }));
        // } else {
        //   message.error('请选择一个组别!');
        // }
        break;
      case 'contentEdit':
        if (teamData.selectedRows.length !== 0) {
          setData(v => ({
            ...v,
            selectRows: teamData.selectedRows,
            buttonType: 'content',
            title: '成员编辑',
            type: 'edit',
            fieldsConfig: [{ name: '组别', code: 'name' }, { name: '排序号', code: 'code' }],
            visible: true,
          }));
        } else {
          message.error('请选择一个组别!');
        }
        break;
    }
  };

  return (
    <ExtModal
      width={'120vh'}
      maskClosable={false}
      visible={visible}
      title={'审核小组管理'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex' }}>
        <div style={{ width: '25%' }}>
          <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>组别</span>
          <div style={{ marginTop: '10px' }}>
            <Button type='primary' onClick={() => buttonClick('teamAdd')}>新增</Button>
            <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('teamEdit')}>编辑</Button>
            <Button style={{ marginLeft: '5px' }}>删除</Button>
          </div>
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
          <div style={{ marginTop: '10px' }}>
            <Button type='primary' onClick={() => buttonClick('contentAdd')}>新增</Button>
            <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('contentEdit')}>编辑</Button>
            <Button style={{ marginLeft: '5px' }}>删除</Button>
            <Button style={{ marginLeft: '5px' }}>审核内容管理</Button>
          </div>
          <div style={{ marginTop: '10px', height: '270px', border: '1px solid yellow' }}>
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
          <div style={{ height: '230px', border: '1px solid red' }}>
            <span style={{ fontSize: '15px', fontWeight: 'bold', marginLeft: '15px' }}>成员审核内容管理</span>
          </div>
        </div>
      </div>
      <EventModal
        onCancel={() => setData((value) => ({ ...value, visible: false }))}
        onOk={handleOk}
        data={data.selectRows[0]}
        fieldsConfig={data.fieldsConfig}
        propData={{
          visible: data.visible,
          type: data.type,
          title: data.title,
        }}
      />
    </ExtModal>
  );

};

export default Team;
