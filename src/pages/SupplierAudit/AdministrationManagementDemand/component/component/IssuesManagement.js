import React, { useState } from 'react';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import EventModal from '../../../common/EventModal';

const IssuesManagement = (props) => {

  const columns = [
    { title: '', dataIndex: 'id', width: 1, render: v => {}},
    { title: '指标', dataIndex: 'title', width: 200, required: true, },
    { title: '部门/过程', dataIndex: 'newAmount', ellipsis: true, width: 100 },
    { title: '问题描述', dataIndex: 'cumulative', ellipsis: true, width: 400 },
    { title: '严重程度', dataIndex: 'cure', ellipsis: true, width: 400 },
    { title: '要求整改完成日期', dataIndex: 'died', width: 100,},
    { title: '提出人', dataIndex: 'orgName', width: 100,},
    { title: '原因分析', dataIndex: 'orgName', width: 100,},
    { title: '纠正预防措施及见证附件', dataIndex: 'orgName', width: 100,},
    { title: '完成时间', dataIndex: 'orgName', width: 100,},
    { title: '验证类型', dataIndex: 'orgName', width: 100,},
    { title: '验证结果', dataIndex: 'orgName', width: 100,},
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    type: 'add',
    title: '验证管理',
    visible: false,
    dataSource: [],
    selectRows: [],
    selectKeys: []
  })

  const fieldsConfig = [
    {
      name: '验证类型',
      code: 'reviewGroup',
    },
    {
      name: '验证结果',
      code: 'rank',
    },
  ];

  const onSelectRow = (keys, rows) => {
    setData(v => ({...v, selectKeys: keys, selectRows: rows}))
  }

  const handleOk = value => {
    console.log(value)
  }

  const handleClick = () => {
    setData(v => ({...v, visible: true}))
  }

  return (
    <>
      <Button>发送问题</Button>
      <Button style={{marginLeft: '5px'}} onClick={handleClick}>验证管理</Button>
      <ExtTable
        bordered={true}
        style={{ marginTop: '5px' }}
        showSearch={false}
        columns={columns}
        onSelectRow={onSelectRow}
        dataSource={data.dataSource}
        defaultExpandAllRows={true}
        lineNumber={false}
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
    </>
  )
}

export default IssuesManagement
