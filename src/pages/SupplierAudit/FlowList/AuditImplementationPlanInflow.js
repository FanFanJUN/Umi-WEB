/*
 * @Author: your name
 * @Date: 2020-11-17 20:35:59
 * @LastEditTime: 2020-11-17 20:39:54
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-流程中
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\FlowList\AuditImplementationPlanInflow.js
 */
import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AuditImplementationPlanDetail from '../AuditImplementationPlan/editPage'
import { closeCurrent } from '../../../utils';

const Index = () => {

  const { query } = router.useLocation();

  console.log(query, router.useLocation(),  'queery')

  const handleClose = () => {
    closeCurrent();
  }

  return(
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <AuditImplementationPlanDetail
        isInFlow={1}
        pageState="detail"
      />
    </WorkFlow.Approve>
  )

}

export default Index
