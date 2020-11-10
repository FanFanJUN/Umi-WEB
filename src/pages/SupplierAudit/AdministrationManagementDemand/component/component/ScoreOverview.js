import React, { useState } from 'react';
import { Button } from 'antd';
import { ExtTable } from 'suid';

const ScoreOverview = (props) => {

  const columns = [
    { title: '', dataIndex: 'id', width: 1, render: v => {}},
    { title: '类别', dataIndex: 'title', width: 200, required: true, },
    { title: '指标名称', dataIndex: 'newAmount', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'cumulative', ellipsis: true, width: 400 },
    { title: '评分标准', dataIndex: 'cure', ellipsis: true, width: 400 },
    { title: '标准分', dataIndex: 'died', width: 100,},
    { title: '自评得分', dataIndex: 'orgName', width: 100,},
    { title: '不适用', dataIndex: 'orgName', width: 100,},
    { title: '审核得分', dataIndex: 'orgName', width: 100,},
    { title: '百分比', dataIndex: 'orgName', width: 100,},
    { title: '评定等级', dataIndex: 'orgName', width: 100,},
    { title: '风险等级', dataIndex: 'orgName', width: 100,},
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    dataSource: []
  })

  return (
    <>
      <Button>按评审人查看评分</Button>
      <Button style={{marginLeft: '5px'}}>查看供应商自评</Button>
      <ExtTable
        bordered={true}
        style={{marginTop: '5px'}}
        showSearch={false}
        columns={columns}
        dataSource={data.dataSource}
        defaultExpandAllRows={true}
        lineNumber={false}
      />
    </>
  )
}

export default ScoreOverview
