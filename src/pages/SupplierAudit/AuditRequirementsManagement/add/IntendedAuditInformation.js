import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Modal, Row, Input, DatePicker, Button, message } from 'antd';
import { ExtTable } from 'suid';
import AddBeAudited from './component/addBeAudited';
import Content from './component/content';
import Team from './component/team';
import { getRandom } from '../../../QualitySynergy/commonProps';
import { supplierStrategyName } from '../../mainData/commomService';

let IntendedAuditInformation = React.forwardRef((props, ref) => {

  const tableRef = useRef(null);

  const [deleteArr, setDeleteArr] = useState([])

  const [data, setData] = useState({
    reviewTeamGroupBoList: [],
    teamVisible: false,
    contentVisible: false,
    type: 'add',
    editData: {},
    dataSource: [],
    treeData: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增拟审核信息',
  });

  const columns = [
    { title: '行号', dataIndex: 'reviewRequirementLinenum', width: 140, ellipsis: true },
    {
      title: '操作',
      dataIndex: 'id',
      width: 140,
      render: () => <span><a onClick={() => showContent('detail')}>内容</a>  <a onClick={() => showTeam('detail')}>小组</a></span>,
    },
    { title: '审核类型', dataIndex: 'reviewTypeName', width: 140, ellipsis: true },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140 },
    { title: '物料分类', dataIndex: 'materialGroupName', width: 140, ellipsis: true },
    { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 140 },
    { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140 },
    {
      title: '生产厂地址',
      dataIndex: 'countryName',
      width: 140,
      render: (v, data) =>
        <span>{`${data.countryName + data.provinceName + data.cityName + data.countyName + data.address}`}</span>,
    },
    { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140 },
    { title: '供应商联系电话', dataIndex: 'contactUserTel', ellipsis: true, width: 140 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140 },
  ].map(item => ({ ...item, align: 'center' }));

  const { isView, type, editData } = props;

  useImperativeHandle(ref, () => ({
    getDataSource: () => data.dataSource,
    getDeleteArr: () => deleteArr
  }));

  const handleBtn = (type) => {
    switch (type) {
      case 'add':
        setData(v => ({ ...v, visible: true, title: '新增拟审核信息', type: 'add', editData: {} }));
        break;
      case 'edit':
        let editData = JSON.parse(JSON.stringify(data.selectRows[0]));
        editData.supplierStrategyName = supplierStrategyName[editData.supplierStrategyName];
        setData(v => ({ ...v, title: '编辑拟审核信息', type: 'edit', editData: editData, visible: true }));
        break;
      case 'delete':
        let deleteData = JSON.parse(JSON.stringify(data.selectRows[0]))
        if (deleteData.id) {
          let arr = JSON.parse(JSON.stringify(props.deleteLine))
          deleteData.whetherDeleted = true
          arr.push(deleteData)
          props.setDeleteLine(arr)
        }
        let newDataSource = JSON.parse(JSON.stringify(data.dataSource))
        newDataSource.map((item, index) => {
          if (item.lineNum === data.selectedRowKeys[0]) {
            newDataSource.splice(index, 1)
          }
        })
        newDataSource = newDataSource.map((item, index) => ({...item, reviewRequirementLinenum: ((Array(4).join(0) + (index + 1)).slice(-4) + '0')}))
        setData(v => ({...v, dataSource: newDataSource}))
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
        break;
      case 'content':
        return showContent();
      case 'team':
        return showTeam();
    }
  };

  useEffect(() => {
    if (type !== 'add') {
      let newData = JSON.parse(JSON.stringify(editData))
      newData.map(item => {
        item.treeData = buildTreeData(item.fatherList, item.sonList)
        item.lineNum = getRandom(10)
      })
      setData(v => ({...v, dataSource: newData}))
    }
  }, [editData])

  const handleSelectedRows = (value, rows) => {
    console.log(rows)
    setData((v) => ({
      ...v,
      selectedRowKeys: value,
      selectRows: rows,
      treeData: rows.length !== 0 ? rows[0].treeData : [],
    }));
  };

  // 编辑和明细时构造treeData
  const buildTreeData = (fatherList, sonList) => {
    let arr = JSON.parse(JSON.stringify(fatherList))
    arr.map(item => {
      item.id = item.systemId
      item.key = item.systemId
      item.title = item.systemName
      if (!item.children) {
        item.children = []
      }
      sonList.forEach(value => {
        value.id = value.systemId
        value.key = value.systemId
        value.title = value.systemName
        if (value.parentId === item.systemId) {
          item.children.push(value)
        }
      })
    })
    return arr
  }

  // 打开内容界面
  const showContent = () => {
    setData(v => ({ ...v, contentVisible: true, type}));
  };

  // 打开小组界面
  const showTeam = () => {
    let arr = JSON.parse(JSON.stringify(data.selectRows[0].reviewTeamGroupBoList))
    if (type !== 'add') {
      arr = arr.map(item => ({...item, lineNum: getRandom(10)}))
    }
    setData(v => ({ ...v, reviewTeamGroupBoList: arr, teamVisible: true, type}));
  };

  const contentOk = (value) => {
    console.log(value);
    let newData = JSON.parse(JSON.stringify(data.dataSource));
    let arr = [];
    value.map(item => {
      item.children.map(v => {
        arr.push(v);
      });
    });
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].treeData = value;
        newData[index].fatherList = value;
        newData[index].sonList = arr;
      }
    });
    setData(v => ({
      ...v,
      dataSource: newData,
      treeData: value,
      contentVisible: false,
      selectRows: [],
      selectedRowKeys: [],
    }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 拆分体系
  const separationSystem = () => {
  };

  const addBeAuditedOK = (value) => {
    if (data.type === 'add') {
      value.reviewRequirementLinenum = ((Array(4).join(0) + (data.dataSource.length + 1)).slice(-4) + '0');
      value.lineNum = getRandom(10);
      value.supplierStrategyName = value.supplierStrategyCode;
      value.treeData = [];
      value.reviewTeamGroupBoList = [];
      setData(v => ({ ...v, dataSource: [...data.dataSource, ...[value]], visible: false }));
    } else if (data.type === 'edit') {
      value.reviewRequirementLinenum = data.selectRows[0].reviewRequirementLinenum;
      value.lineNum = data.selectRows[0].lineNum;
      value.supplierStrategyName = value.supplierStrategyCode;
      value.treeData = data.selectRows[0].treeData;
      value.reviewTeamGroupBoList = data.selectRows[0].reviewTeamGroupBoList;
      let newData = JSON.parse(JSON.stringify(data.dataSource));
      newData.map((item, index) => {
        if (item.lineNum === data.selectedRowKeys[0]) {
          newData[index] = value;
        }
      });
      setData(v => ({ ...v, dataSource: newData, visible: false }));
      tableRef.current.manualSelectedRows();
      tableRef.current.remoteDataRefresh();
    }
  };

  const teamOk = (value) => {
    let newData = JSON.parse(JSON.stringify(data.dataSource));
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].reviewTeamGroupBoList = value;
      }
    });
    setData(v => ({ ...v, dataSource: newData, teamVisible: false, reviewTeamGroupBoList: []}));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div>
              <Button onClick={() => {
                handleBtn('add');
              }} type='primary'>新增</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {
                handleBtn('edit');
              }} style={{ marginLeft: '5px' }}>编辑</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {
                handleBtn('delete');
              }} style={{ marginLeft: '5px' }}>删除</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {
                handleBtn('content');
              }} style={{ marginLeft: '5px' }}>审核内容管理</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {
                handleBtn('team');
              }} style={{ marginLeft: '5px' }}>审核小组管理</Button>
            </div>
          }
          <ExtTable
            style={{ marginTop: '10px' }}
            rowKey={(v) => v.lineNum}
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={data.dataSource}
          />
        </div>
      </div>
      <AddBeAudited
        editData={data.editData}
        companyCode={props.companyCode}
        organizationCode={props.organizationCode}
        onOk={addBeAuditedOK}
        visible={data.visible}
        title={data.title}
        type={data.type}
        allAuditType={props.allAuditType}
        onCancel={() => setData(v => ({ ...v, visible: false }))}
      />
      <Content
        applyCorporationCode={props.applyCorporationCode}
        treeData={data.treeData}
        onOk={contentOk}
        type={data.type}
        onCancel={() => setData(v => ({ ...v, contentVisible: false }))}
        visible={data.contentVisible}
      />
      <Team
        deleteArr={deleteArr}
        setDeleteArr={setDeleteArr}
        type={data.type}
        reviewTeamGroupBoList={data.reviewTeamGroupBoList}
        onOk={teamOk}
        treeData={data.treeData}
        reviewTypeCode={data.selectRows[0]?.reviewTypeCode}
        onCancel={() => setData(v => ({ ...v, teamVisible: false, reviewTeamGroupBoList: []}))}
        visible={data.teamVisible}
      />
    </div>
  );
});
export default Form.create()(IntendedAuditInformation);
