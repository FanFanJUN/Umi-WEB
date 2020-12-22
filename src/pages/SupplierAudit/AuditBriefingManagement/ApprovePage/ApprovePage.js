/**
 * @Description: 审核简报流程页面
 * @Author: M!keW
 * @Date: 2020-12-04
 */
import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditBriefingManagementView from '../editPage';

const ApprovePage = () => {

  const { query } = router.useLocation();

  const handleClose = (res) => {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  };

  return(
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <AuditBriefingManagementView
        isApprove
        isApproveDetail
      />

    </WorkFlow.Approve>
  )

};

export default ApprovePage
