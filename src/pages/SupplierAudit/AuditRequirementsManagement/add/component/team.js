import React, { useRef, useState } from 'react';
import { ExtModal, ExtTable } from 'suid';
import { Button } from 'antd';

const teamColumns = [
  { title: '组别', dataIndex: 'fileVersion', ellipsis: true, width: 60 },
  { title: '排序号', dataIndex: 'drawFlag', ellipsis: true},
]

const contentColumns = [
  { title: '角色', dataIndex: 'fileVersion', ellipsis: true, },
  { title: '部门', dataIndex: 'drawFlag', ellipsis: true},
  { title: '员工编号', dataIndex: '1', ellipsis: true},
  { title: '姓名', dataIndex: '2', ellipsis: true},
  { title: '联系电话', dataIndex: '3', ellipsis: true},
  { title: '外部单位', dataIndex: '4', ellipsis: true},
]

const Team = (props) => {

  const teamTableRef = useRef(null);

  const contentTableRef = useRef(null);

  const {visible} = props

  const [teamData, setTeamData] = useState({
    dataSource: [],
    selectedRowKeys: []
  })

  const [contentData, setContentData] = useState({
    dataSource: [],
    selectedRowKeys: []
  })

  const clearSelected = () => {

  }

  const onCancel = () => {
    props.onCancel()
  }

  const onOk = () => {

  }

  const handleTeamSelectedRows = (keys, values) => {

  }

  const handleContentSelectedRows = (keys, values) => {

  }

  return(
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
      <div style={{width: '100%', height: '100%', display: 'flex'}}>
        <div style={{width: '25%'}}>
          <span style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px'}}>组别</span>
          <div style={{marginTop: '10px'}}>
            <Button type='primary'>新增</Button>
            <Button style={{marginLeft: '5px'}}>编辑</Button>
            <Button style={{marginLeft: '5px'}}>删除</Button>
          </div>
          <div style={{marginTop: '10px', height: '500px', border: '1px solid blue'}}>
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
        <div style={{width: '75%', height: '100%', marginLeft: '10px'}}>
          <span style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px'}}>成员及审核内容</span>
          <div style={{marginTop: '10px'}}>
            <Button type='primary'>新增</Button>
            <Button style={{marginLeft: '5px'}}>编辑</Button>
            <Button style={{marginLeft: '5px'}}>删除</Button>
            <Button style={{marginLeft: '5px'}}>审核内容管理</Button>
          </div>
          <div style={{marginTop: '10px', height: '270px', border: '1px solid yellow'}}>
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
          <div style={{height: '230px', border: '1px solid red'}}>
            <span style={{fontSize: '15px', fontWeight: 'bold', marginLeft: '15px'}}>成员审核内容管理</span>
          </div>
        </div>
      </div>
    </ExtModal>
  )

}

export default Team
