/**
 * @Description: 采购小组审批
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';

const PurchaseTeamApprovePage = () => {

  const { query } = router.useLocation();

  const handleClose = () => {
    closeCurrent();
  };

  return(
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <AuditReportManagementView
        isApprove
        purchaseApprove
      />

    </WorkFlow.Approve>
  )

};

export default PurchaseTeamApprovePage
