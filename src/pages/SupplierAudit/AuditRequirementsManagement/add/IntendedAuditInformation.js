import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Modal, Row, Input, DatePicker, Button, message } from 'antd';
import { ExtTable } from 'suid';
import AddBeAudited from './component/addBeAudited';
import Content from './component/content';
import Team from './component/team';
import { getRandom } from '../../../QualitySynergy/commonProps';

let IntendedAuditInformation = React.forwardRef((props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    teamVisible: false,
    contentVisible: false,
    type: 'add',
    dataSource: [
      // {
      //   lineNum: 123,
      //   id: 123,
      //   fileCategoryName: 1,
      //   reviewTypeName: 2,
      //   reviewReasonName: 2,
      //   materialGroupName: 4,
      //   supplierName: 5,
      //   agentName: 6,
      //   countryName: 7,
      //   contactUserName: 8,
      //   contactUserTel: 10,
      //   remark:9
      // }
    ],
    treeData: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增拟审核信息'
  })

  const columns = [
    { title: '操作', dataIndex: 'id', width: 140, render: () => <span><a onClick={showContent}>内容</a>  <a onClick={showTeam}>小组</a></span> },
    { title: '审核类型', dataIndex: 'reviewTypeName', width: 140, ellipsis: true, },
    { title: '审核原因', dataIndex: 'reviewReasonName', ellipsis: true, width: 140},
    { title: '物料分类', dataIndex: 'materialGroupName', width: 140, ellipsis: true, },
    { title: '供应商', dataIndex: 'supplierName', ellipsis: true, width: 140},
    { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140},
    { title: '生产厂地址', dataIndex: 'countryName', width: 140, render: (v, data) => <span>{`${data.countryName + data.provinceName + data.cityName + data.countyName + data.address}`}</span>},
    { title: '供应商联系人', dataIndex: 'contactUserName', ellipsis: true, width: 140},
    { title: '供应商联系电话', dataIndex: 'contactUserTel', ellipsis: true, width: 140},
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140},
  ].map(item => ({...item, align: 'center'}))

  const { isView } = props;

  const handleBtn = (type) => {
    switch (type) {
      case 'add':
        if (props.companyCode && props.organizationCode) {
          setData(v => ({...v, visible: true, title: '新增拟审核信息', type: 'add'}))
        } else {
          message.error('请先选择公司和采购组织!')
        }
        break;
      case 'content':
        return showContent()
      case 'team':
        return showTeam()
    }
  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({...v, selectedRowKeys: value, selectRows: rows, treeData: rows[0].treeData}))
  }

  // 打开内容界面
  const showContent = () => {
    setData(v => ({...v, contentVisible: true}))

  }

  // 打开小组界面
  const showTeam = () => {
    setData(v => ({...v, teamVisible: true}))
  }

  const contentOk = (value) => {
    let newData = JSON.parse(JSON.stringify(data.dataSource))
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].treeData = value
      }
    })
    setData(v => ({...v, dataSource: newData, treeData: value, contentVisible: false}))
    tableRef.current.remoteDataRefresh();
  }

  const addBeAuditedOK = (value) => {
    if (data.type === 'add') {
      value.lineNum =  getRandom(10)
      value.treeData = []
      setData(v => ({...v, dataSource: [...data.dataSource, ...[value]], visible: false}))
    }
  }

  const teamOk = (value) => {
    let newData = JSON.parse(JSON.stringify(data.dataSource))
    newData.map((item, index) => {
      if (item.lineNum === data.selectedRowKeys[0]) {
        newData[index].reviewTeamGroupBoList = value
      }
    })
    setData(v => ({...v, dataSource: newData}))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div>
              <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {handleBtn('delete')}} style={{marginLeft: '5px'}}>删除</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('content')}} style={{marginLeft: '5px'}}>审核内容管理</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {handleBtn('team')}} style={{marginLeft: '5px'}}>审核小组管理</Button>
            </div>
          }
          <ExtTable
            style={{marginTop: '10px'}}
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
        companyCode={props.companyCode}
        organizationCode={props.organizationCode}
        onOk={addBeAuditedOK}
        visible={data.visible}
        title={data.title}
        type={data.type}
        allAuditType={props.allAuditType}
        onCancel={() => setData(v => ({...v, visible: false}))}
      />
      <Content
        applyCorporationCode={props.applyCorporationCode}
        treeData={data.treeData}
        onOk={contentOk}
        type={data.type}
        onCancel={() => setData(v => ({...v, contentVisible: false}))}
        visible={data.contentVisible}
      />
      <Team
        type={data.type}
        onOk={teamOk}
        treeData={data.treeData}
        reviewTypeCode={data.selectRows[0]?.reviewTypeCode}
        onCancel={() => setData(v => ({...v, teamVisible: false}))}
        visible={data.teamVisible}
      />
    </div>
  );
})
export default Form.create()(IntendedAuditInformation);
