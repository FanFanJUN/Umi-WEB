import React, { useRef, useState } from 'react';
import { Button, Tabs } from 'antd';
import { ComboList, ComboTree, ExtModal, ExtTable } from 'suid';
import ScoreOverview from './component/ScoreOverview';
import IssuesManagement from './component/IssuesManagement';
import AuditOpinion from './component/AuditOpinion';

const { TabPane } = Tabs;

const VerificationResults = (props) => {

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
    console.log(value);
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
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="评分概览" key="1">
          <ScoreOverview/>
        </TabPane>
        <TabPane tab="问题管理" key="2">
          <IssuesManagement/>
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
