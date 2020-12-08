/**
 * @Description: 评审得分
 * @Author: M!keW
 * @Date: 2020-11-17
 */

import React, { useEffect, useImperativeHandle, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Form } from 'antd';
import { ExtTable } from 'suid';
import { getRandom } from '../../../QualitySynergy/commonProps';
import TargetScoringDetailView from '../../AdministrationManagementDemand/component/component/TargetScoringDetailView';

const AuditScoreForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const [dataSource, setDataSource] = useState([]);
  const [params, setParams] = useState({});
  const [targetScoringDetailVisible, setTargetScoringDetailVisible] = useState(false);
  useEffect(() => {
    transferData();
  }, [editData]);
  const transferData = () => {
    if (editData && editData.length > 0) {
      let tree = JSON.parse(JSON.stringify(editData));
      getTreeData(tree);
    }
  };

  const getTreeData = (tree) => {
    tree.forEach(item => {
      if (!(item.children && item.children.length > 0) && item.reviewRuleList) {
        let reviewRuleList = JSON.parse(JSON.stringify(item.reviewRuleList));
        reviewRuleList = reviewRuleList.map(item => ({ ...item, id: getRandom(10) }));
        item.children = [];
        item.children.push(...reviewRuleList);
      }
      if (item.children && item.children.length > 0) {
        getTreeData(item.children);
      }
    });
    setDataSource(tree);
  };
  // 查看指标评审得分详情
  const targetScoringDetail = (data) => {
    setParams({
      ruleCode: data.ruleCode,
      reviewImplementPlanCode: data.reviewImplementPlanCode,
    });
    setTargetScoringDetailVisible(true)
  };
  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'systemName', width: 200},
    { title: '指标名称', dataIndex: 'ruleName', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 120 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 160 },
    { title: '标准分', dataIndex: 'highestScore', width: 90, render: (v, data) => data.score ? data.score : v },
    { title: '不适用', dataIndex: 'notApplyScore', width: 90 },
    {
      title: '审核得分',
      dataIndex: 'reviewScore',
      width: 100,
      render: (v, data) => data.ruleId ? <a onClick={() => targetScoringDetail(data)}>{v}</a> : v,
    },
    { title: '百分比', dataIndex: 'percentage', width: 90 },
    { title: '评定等级', dataIndex: 'performanceRating', width: 100 },
    { title: '风险等级', dataIndex: 'riskRating', width: 100 },
  ].map(item => ({ ...item, align: 'center' }));
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>评审得分</div>
        <div className={styles.content}>
          <ExtTable
            bordered={true}
            rowKey={(v) => v.id}
            showSearch={false}
            height={'500px'}
            defaultExpandAllRows={true}
            lineNumber={false}
            columns={columns}
            dataSource={dataSource}
          />
          <TargetScoringDetailView
            isView={true}
            params={params}
            onCancel={() => {
              setTargetScoringDetailVisible(false);
            }}
            visible={targetScoringDetailVisible}
          />
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditScoreForm);
