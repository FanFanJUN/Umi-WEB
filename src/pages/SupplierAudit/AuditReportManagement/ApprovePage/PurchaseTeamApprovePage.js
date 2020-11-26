/**
 * @Description: 采购小组审批
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useRef } from 'react';
import { WorkFlow } from 'suid';
import { message } from 'antd';
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';

const PurchaseTeamApprovePage = () => {

  const { query } = router.useLocation();
  const getRef = useRef(null);
  const handleClose = () => {
    closeCurrent();
  };

  // 保存小组意见
  const beforeSubmit = () => {
   getRef.current.saveModalData();
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
          purchaseApprove
          wrappedComponentRef={getRef}
        />
      </div>
    </WorkFlow.Approve>
  );

};

export default PurchaseTeamApprovePage;
