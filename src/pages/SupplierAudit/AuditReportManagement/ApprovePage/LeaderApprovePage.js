/**
 * @Description: 领导审批页面
 * @Author: M!keW
 * @Date: 2020-11-26
 */

import React, { useRef } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';

const LeaderApprovePage = () => {

  const { query } = router.useLocation();
  const getRef = useRef(null);
  const handleClose = () => {
    closeCurrent();
  };

  // 保存领导意见
  const beforeSubmit = async () => {
    let data = await getRef.current.getAllData();
    let leaderData = await getRef.current.getLeaderModalData();
    if(!data || !leaderData){
      return false
    }
    data.leaderData=leaderData;
    console.log(data)
  };

  return (
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
      beforeSubmit={beforeSubmit}
    >
      <div>
        <span onClick={beforeSubmit}>点一下</span>
        <AuditReportManagementView
          isApprove
          leaderApprove
          wrappedComponentRef={getRef}
        />
      </div>
    </WorkFlow.Approve>
  );

};

export default LeaderApprovePage;
