import React, { useRef, useState } from 'react';
import { Button, Tabs } from 'antd';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';

const { TabPane } = Tabs;

const dataSource = [
  {
    title: '四川省',
    id: '0-0',
    newAmount: 0,
    cumulative: 539,
    cure: 520,
    died: 3,
    children: [
      {
        title: '成都市',
        id: '0-0-0',
        newAmount: 0,
        cumulative: 144,
        cure: 126,
        died: 3,
        children: null,
      },
      {
        title: '绵阳市',
        id: '0-0-1',
        newAmount: 0,
        cumulative: 22,
        cure: 22,
        died: 0,
        children: [
          {
            title: '高新区',
            id: '0-0-1-0',
            newAmount: 0,
            cumulative: 12,
            cure: 12,
            died: 0,
            children: null,
          },
          {
            title: '江油市',
            id: '0-0-1-2',
            newAmount: 0,
            cumulative: 10,
            cure: 10,
            died: 0,
            children: null,
          },
        ],
      },
      {
        title: '德阳市',
        id: '0-0-2',
        newAmount: 0,
        cumulative: 18,
        cure: 18,
        died: 0,
        children: null,
      },
    ],
  },
  {
    title: '北京市',
    id: '0-1',
    newAmount: 9,
    cumulative: 455,
    cure: 368,
    died: 8,
    children: [
      {
        title: '朝阳区',
        id: '0-1-0-0',
        newAmount: 0,
        cumulative: 72,
        cure: 0,
        died: 0,
        children: null,
      },
      {
        title: '海淀区',
        id: '0-1-0-1',
        newAmount: 0,
        cumulative: 63,
        cure: 0,
        died: 0,
        children: null,
      },
      {
        title: '西城区',
        id: '0-1-0-2',
        newAmount: 0,
        cumulative: 53,
        cure: 0,
        died: 0,
        children: null,
      },
    ],
  },
  {
    title: '杭州市',
    id: '0-2',
    newAmount: 1,
    cumulative: 183,
    cure: 181,
    died: 0,
    children: null,
  },
];

const VerificationResults = (props) => {

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

  const { type, editData, visible } = props;

  const [data, setData] = useState({});

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const clearSelected = () => {

  };

  const callback = (value) => {
    console.log(value)
  }

  return (
    <ExtModal
      width={'180vh'}
      maskClosable={false}
      visible={visible}
      title={'审核结果确认'}
      onCancel={onCancel}
      onOk={onOk}
      destroyOnClose={true}
      afterClose={clearSelected}
    >
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="评分概览" key="1">
          <Button>按评审人查看评分</Button>
          <Button>查看供应商自评</Button>
          <ExtTable
            bordered={true}
            style={{marginTop: '5px'}}
            showSearch={false}
            columns={columns}
            dataSource={dataSource}
            defaultExpandAllRows={true}
            lineNumber={false}
          />
        </TabPane>
        <TabPane tab="问题管理" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="审核意见" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </ExtModal>
  );

};

export default VerificationResults;
