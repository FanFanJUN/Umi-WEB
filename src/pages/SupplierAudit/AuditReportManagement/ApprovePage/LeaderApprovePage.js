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
import { saveLeaderDecision } from '../../mainData/commomService';
import { message } from 'antd';

const LeaderApprovePage = () => {

  const { query } = router.useLocation();
  const getRef = useRef(null);
  const handleClose = (res) => {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  };

  // 保存领导意见
  const beforeSubmit = async () => {
    let data = await getRef.current.getAllData();
    let leaderData = await getRef.current.getLeaderModalData();
    if(!data || !leaderData){
      return false
    }
    let endData = Object.assign(data, leaderData);
    return new Promise(function(resolve, reject) {
      saveLeaderDecision(endData).then(res => {
        if (res.success) {
          const data = { businessKey: res.data };
          resolve({
            success: true,
            message: res.message,
            data,
          });
        } else {
          message.error(res.message);
        }
      }).catch(err => reject(err));
    });
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
