import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ExtModal, ExtTable } from 'suid';
import { Button, message } from 'antd';
import EventModal from '../../../common/EventModal';
import { getRandom } from '../../../../QualitySynergy/commonProps';
import ContentModal from './contentModal';
import ShuttleBox from '../../../common/ShuttleBox';
import { GetDefaultSystem } from '../../../mainData/commomService';

const teamColumns = [
  { title: '组别', dataIndex: 'reviewGroup', ellipsis: true, width: 60 },
  { title: '排序号', dataIndex: 'rank', ellipsis: true },
].map(item => ({ ...item, align: 'center' }));

const contentColumns = [
  { title: '角色', dataIndex: 'memberRoleName', width: 50 },
  { title: '部门', dataIndex: 'departmentName', width: 120  },
  { title: '员工编号', dataIndex: 'employeeNo', width: 100  },
  { title: '姓名', dataIndex: 'memberName', width: 120  },
  { title: '联系电话', dataIndex: 'memberTel', width: 100  },
  { title: '外部单位', dataIndex: 'outsideCompany', width: 100  },
].map(item => ({ ...item, align: 'center'}));

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
    visible: false,
    title: '',
    type: 'add',
    dataSource: [],
    selectedRowKeys: [],
    selectedRows: [],
  });

  const [data, setData] = useState({
    leftTreeData: [],
    selectRows: [],
    visible: false,
    type: 'add',
    title: '组别新增',
  });

  useEffect(() => {
    if (visible) {
      GetDefaultSystem({
        reviewTypeCode: props.reviewTypeCode
      }).then(res => {
        if (res.success) {
          console.log(res)
        } else {
          message.error('获取默认评价体系失败!')
        }
      })
    }
  }, [visible])

  const clearSelected = () => {

  };

  useEffect(() => {
    if (contentData.dataSource && contentData.dataSource.length !== 0) {
      changeTeamData()
    }
  }, [contentData.dataSource])

  // 修改成员数据更改组别相关数据
  const changeTeamData = () => {
    let newTeamData = JSON.parse(JSON.stringify(teamData.dataSource))
    newTeamData.map((item, index) => {
      if (item.lineNum === teamData.selectedRowKeys[0]) {
        newTeamData[index].reviewTeamMemberBoList = contentData.dataSource
      }
    })
    setTeamData(v => ({...v, dataSource: newTeamData}))
    teamTableRef.current.remoteDataRefresh();
    console.log(teamData.dataSource)
  }

  const handleOk = (value) => {
    if (data.type === 'add') {
      value.lineNum = getRandom(10);
      value.reviewTeamMemberBoList = []
      setTeamData(v => ({ ...v, dataSource: [...teamData.dataSource, ...[value]] }));
    } else {
      let newData = teamData.dataSource.slice();
      teamData.dataSource.forEach((item, index) => {
        if (item.lineNum === data.selectRows[0].lineNum) {
          value.lineNum = item.lineNum;
          value.reviewTeamMemberBoList = item.reviewTeamMemberBoList
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
    if (contentData.type === 'add') {
      value.lineNum = getRandom(10);
      setContentData(v => ({...v, dataSource: [...contentData.dataSource, ...[value]], visible: false}))
    } else {
      let newDataSource = JSON.parse(JSON.stringify(contentData.dataSource))
      newDataSource.map((item, index) => {
        if(item.lineNum === value.lineNum) {
          newDataSource.splice(index, 1, value);
        }
      })
      setContentData(v => ({...v, dataSource: newDataSource, visible: false}))
    }
    contentTableRef.current.manualSelectedRows();
    contentTableRef.current.remoteDataRefresh();
    console.log(contentData, value)
  }

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {
    console.log(teamData.dataSource)
  };

  const handleTeamSelectedRows = (keys, values) => {
    setTeamData(v => ({ ...v, selectedRows: values, selectedRowKeys: keys }));
    if (keys.length !== 0) {
      setContentData(v => ({...v, dataSource: values[0].reviewTeamMemberBoList}))
      contentTableRef.current.manualSelectedRows();
      contentTableRef.current.remoteDataRefresh();
    } else {
      setContentData(v => ({...v, dataSource: []}))
      contentTableRef.current.manualSelectedRows();
      contentTableRef.current.remoteDataRefresh();
    }
  };

  const handleContentSelectedRows = (keys, values) => {
    setData(v => ({...v, leftTreeData: []}))
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
        setData(v => ({
          ...v,
          selectRows: teamData.selectedRows,
          title: '组别编辑',
          type: 'edit',
          visible: true,
        }));
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
    const {selectedRowKeys} = teamData
    let newData = teamData.dataSource.slice()
    if (selectedRowKeys && selectedRowKeys.length !== 0) {
      newData.forEach((value, index) => {
        if (value.lineNum === selectedRowKeys[0].lineNum) {
          newData.splice(index, 1)
        }
      })
      setTeamData(v => ({...v, dataSource: newData}))
    } else {
      message.error('请至少选择一条数据')
    }
  }

  // 成员的删除
  const contentDelete = () => {
    if (contentData.selectedRowKeys && contentData.selectedRowKeys.length !== 0) {
      let newDataSource = JSON.parse(JSON.stringify(contentData.dataSource))
      newDataSource.forEach((item, index) => {
        if (item.lineNum === contentData.selectedRowKeys[0]) {
          newDataSource.splice(index, 1)
        }
      })
      setContentData(v => ({...v, dataSource: newDataSource}))
    } else {
      message.error('请选择一条数据')
    }
  }

  const getTreeData = (value) => {
    let newData = JSON.parse(JSON.stringify(contentData.dataSource))
    newData.map((item, index) => {
      if (item.lineNum === contentData.selectedRowKeys[0]) {
        newData[index].treeData = value
      }
    })
    setContentData(v =>({...v, dataSource: newData}))
    console.log(value)
  }

  // 构造左边树
  const getLeftTreeData = () => {
    setData(v => ({...v, leftTreeData: props.treeData}))
  }

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
            <Button style={{ marginLeft: '5px' }}  onClick={teamDelete}>删除</Button>
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
            <Button style={{ marginLeft: '5px' }} onClick={contentDelete}>删除</Button>
            <Button style={{ marginLeft: '5px' }} onClick={getLeftTreeData}>审核内容管理</Button>
          </div>
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
              onChange={getTreeData}
              leftTreeData={undefined}
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
    </ExtModal>
  );

};

export default Team;
