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

const AuditScoreForm = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const [dataSource, setDataSource] = useState([]);
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
  const columns = [
    {
      title: '', dataIndex: 'id', width: 1, render: v => {
      },
    },
    { title: '类别', dataIndex: 'systemName', width: 200, required: true },
    { title: '指标名称', dataIndex: 'ruleName', ellipsis: true, width: 100 },
    { title: '指标定义', dataIndex: 'definition', ellipsis: true, width: 400 },
    { title: '评分标准', dataIndex: 'scoringStandard', ellipsis: true, width: 400 },
    { title: '标准分', dataIndex: 'highestScore', width: 100 },
    { title: '不适用', dataIndex: 'notApplyScore', width: 100 },
    {
      title: '审核得分',
      dataIndex: ' reviewScore',
      width: 100,
      render: (text) => <a onClick={() => console.log('这是超链接')}>{text}</a>,
    },
    { title: '百分比', dataIndex: 'percentage', width: 100 },
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
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditScoreForm);
