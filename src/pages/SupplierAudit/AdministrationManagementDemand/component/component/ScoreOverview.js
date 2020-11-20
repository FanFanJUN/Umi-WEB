import React, { useState } from 'react';
import { Button } from 'antd';
import { ExtTable } from 'suid';
import ViewScoreByReviewerView from '../component/ViewScoreByReviewerView';
import SelfEvaluation from './SelfEvaluation';

const ScoreOverview = (props) => {

  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'title', width: 200, required: true },
    { title: '指标名称', dataIndex: 'newAmount', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'cumulative', ellipsis: true, width: 400 },
    { title: '评分标准', dataIndex: 'cure', ellipsis: true, width: 400 },
    { title: '标准分', dataIndex: 'died', width: 100 },
    { title: '自评得分', dataIndex: '1', width: 100 },
    { title: '不适用', dataIndex: '2', width: 100 },
    { title: '审核得分', dataIndex: '3', width: 100 },
    { title: '百分比', dataIndex: 'org4Name', width: 100 },
    { title: '评定等级', dataIndex: '5', width: 100 },
    { title: '风险等级', dataIndex: '6', width: 100 },
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    dataSource: [],
    viewVendorSelfRatingVisible: false,
    viewScoreByReviewerVisible: false,
  });

  const viewScoreByReviewer = () => {
    setData(v => ({ ...v, viewScoreByReviewerVisible: true }));
  };

  const viewVendorSelfRating = () => {
    setData(v => ({ ...v, viewVendorSelfRatingVisible: true }));

  };

  return (
    <div>
      <Button onClick={viewScoreByReviewer}>按评审人查看评分</Button>
      <Button onClick={viewVendorSelfRating} style={{ marginLeft: '5px' }}>查看供应商自评</Button>
      <ExtTable
        bordered={true}
        style={{ marginTop: '5px' }}
        showSearch={false}
        columns={columns}
        dataSource={data.dataSource}
        defaultExpandAllRows={true}
        lineNumber={false}
      />
      <ViewScoreByReviewerView
        onCancel={() => setData(v => ({ ...v, viewScoreByReviewerVisible: false }))}
        reviewImplementPlanCode={props.reviewImplementPlanCode}
        visible={data.viewScoreByReviewerVisible}
      />
      <SelfEvaluation
        isView={props.isView}
        type={'demand'}
        reviewImplementPlanCode={props.reviewImplementPlanCode}
        onCancel={() => setData(v => ({ ...v, viewVendorSelfRatingVisible: false }))}
        visible={data.viewVendorSelfRatingVisible}
      />
    </div>
  );
};

export default ScoreOverview;
