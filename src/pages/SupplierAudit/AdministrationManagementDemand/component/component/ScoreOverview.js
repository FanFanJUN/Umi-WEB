import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { ExtTable } from 'suid';
import ViewScoreByReviewerView from '../component/ViewScoreByReviewerView';
import SelfEvaluation from './SelfEvaluation';
import { GetScoreOverviewApi } from '../../commonApi';
import { getDocIdForArray } from '../../../../../utils/utilTool';
import { getRandom } from '../../../../QualitySynergy/commonProps';
import TargetScoringDetailView from './TargetScoringDetailView';

const ScoreOverview = (props) => {

  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'systemName', width: 200, required: true },
    { title: '指标名称', dataIndex: 'ruleName', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 300 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 300 },
    { title: '标准分', dataIndex: 'highestScore', width: 100, render: (v, data) => data.score ? data.score : v },
    { title: '自评得分', dataIndex: 'selfScore', width: 100 },
    { title: '不适用', dataIndex: 'notApplyScore', width: 100 },
    {
      title: '审核得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => data.ruleId ? <a onClick={() => targetScoringDetail(data)}>{v}</a> : v,
    },
    { title: '百分比', dataIndex: 'percentage', width: 100, render: v => v ? `${v}%` : '0' },
    { title: '评定等级', dataIndex: 'performanceRating', width: 100 },
    { title: '风险等级', dataIndex: 'riskRating', width: 100 },
  ].map(item => ({ ...item, align: 'center' }));

  const [data, setData] = useState({
    dataSource: [],
    // 查看供应商自评
    viewVendorSelfRatingVisible: false,
    // 按评审人查看评分
    viewScoreByReviewerVisible: false,
    // 查看指标详情
    targetScoringDetailVisible: false,
  });

  const [params, setParams] = useState({});

  const [loading, setLoading] = useState(false);

  const viewScoreByReviewer = () => {
    setData(v => ({ ...v, viewScoreByReviewerVisible: true }));
  };

  const viewVendorSelfRating = () => {
    setData(v => ({ ...v, viewVendorSelfRatingVisible: true }));

  };

  // 查看指标评审得分详情
  const targetScoringDetail = (data) => {
    setParams({
      ruleCode: data.ruleCode,
      reviewImplementPlanCode: props.reviewImplementPlanCode,
    });
    setData(v => ({ ...v, targetScoringDetailVisible: true }));
  };

  useEffect(() => {
    getDataSource(props.reviewImplementPlanCode);
  }, []);

  const buildTree = (arr) => {
    console.log(arr);
    arr.map(item => {
      if (item.reviewRuleList) {
        item.children = [];
        let reviewRuleList = JSON.parse(JSON.stringify(item.reviewRuleList));
        reviewRuleList = reviewRuleList.map(item => {
          return ({ ...item, id: getRandom(10) });
        });
        item.children.push(...reviewRuleList);
      } else {
        buildTree(item.children ? item.children : []);
      }
    });
    return arr;
  };

  const getDataSource = (reviewImplementPlanCode) => {
    setLoading(true);
    GetScoreOverviewApi({
      reviewImplementPlanCode,
    }).then(res => {
      if (res.success) {
        let minLine = {
          percentage: 101,
        };
        let arr = res.data ? res.data : [];
        if (arr.length > 0) {
          console.log(res.data, 'xxx')
          arr[0].children = arr[0].children ? arr[0].children : []
          arr[0].children.map(item => {
            minLine = item.percentage < minLine.percentage ? JSON.parse(JSON.stringify(item)) : minLine;
          })
          arr = buildTree(arr);
          if (minLine.systemId) {
            console.log(minLine, 'minLine')
            minLine.reviewScore = arr[0].percentage
            props.setAuditOpinionData(minLine)
          }
        }
        setData(v => ({ ...v, dataSource: arr }));
        setLoading(false);
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

  return (
    <div>
      <Button onClick={viewScoreByReviewer}>按评审人查看评分</Button>
      <Button onClick={viewVendorSelfRating} style={{ marginLeft: '5px', marginBottom: '5px' }}>查看供应商自评</Button>
      <ExtTable
        rowKey={'id'}
        loading={loading}
        bordered={true}
        showSearch={false}
        columns={columns}
        pagination={false}
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
        id={props.id}
        type={'demand'}
        reviewImplementPlanCode={props.reviewImplementPlanCode}
        onCancel={() => setData(v => ({ ...v, viewVendorSelfRatingVisible: false }))}
        visible={data.viewVendorSelfRatingVisible}
      />
      <TargetScoringDetailView
        isView={props.isView}
        params={params}
        onCancel={() => {
          setData(v => ({ ...v, targetScoringDetailVisible: false }));
          getDataSource(props.reviewImplementPlanCode);
        }}
        visible={data.targetScoringDetailVisible}
      />
    </div>
  );
};

export default ScoreOverview;
