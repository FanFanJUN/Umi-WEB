import React, { useRef, useState } from 'react';
import { Button, message, Tabs } from 'antd';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import ScoreOverview from './component/ScoreOverview';
import IssuesManagement from './component/IssuesManagement';
import AuditOpinion from './component/AuditOpinion';
import { VerificationAuditOpinionApi } from '../../AuditRequirementsManagement/commonApi';

const { TabPane } = Tabs;

const VerificationResults = (props) => {

  const { type, editData, visible, reviewImplementPlanCode } = props;

  const [data, setData] = useState({
    activeKey: '1',
    // 问题管理表格数据
    issuesArr: [],
  });

  const onCancel = () => {
    props.onCancel();
  };

  const onOk = () => {

  };

  const clearSelected = () => {

  };

  const issuesChange = (value) => {
    setData(v => ({ ...v, issuesArr: value }));
  };

  const onTabClick = (value) => {
    // if (value === '3') {
    //   VerificationAuditOpinionApi({
    //     reviewImplementPlanCode,
    //   }).then(res => {
    //     if (res.success) {
    //       setData(v => ({ ...v, activeKey: value.toString() }));
    //     } else {
    //       message.error(res.message)
    //     }
    //   }).catch(err => {
    //     message.error(err.message)
    //   })
    // } else {
      setData(v => ({ ...v, activeKey: value.toString() }));
    // }
  };

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
      <Tabs defaultActiveKey={'1'} activeKey={data.activeKey} onTabClick={onTabClick}>
        <TabPane tab="评分概览" key="1">
          <ScoreOverview
            reviewImplementPlanCode={props.reviewImplementPlanCode}
          />
        </TabPane>
        <TabPane tab="问题管理" key="2">
          <IssuesManagement
            id={props.id}
            reviewImplementPlanCode={props.reviewImplementPlanCode}
            onChange={issuesChange}
            type={'demand'}
          />
        </TabPane>
        <TabPane tab="审核意见" key="3">
          <AuditOpinion
            editData={{}}
          />
        </TabPane>
      </Tabs>
    </ExtModal>
  );

};

export default VerificationResults;
