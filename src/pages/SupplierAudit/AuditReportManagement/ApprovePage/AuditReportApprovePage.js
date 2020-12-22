/**
 * @Description: 审核报告流程页面
 * @Author: M!keW
 * @Date: 2020-11-25
 */
import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';

const AuditReportApprovePage = () => {

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
      <AuditReportManagementView
        isApprove
        isApproveDetail
      />

    </WorkFlow.Approve>
  )

};

export default AuditReportApprovePage
