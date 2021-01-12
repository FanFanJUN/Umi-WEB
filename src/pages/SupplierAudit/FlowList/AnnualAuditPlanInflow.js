/*
 * @Author: hyc
 * @Date: 2020-11-17 20:35:59
 * @LastEditTime: 2020-11-24 15:20:37
 * @LastEditors: Please set LastEditors
 * @Description: 年度审核实施计划-流程中
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\FlowList\AuditImplementationPlanInflow.js
 */
import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AnnualAuditPlan from '../AnnualAuditPlan/EdaPage'
import { closeCurrent } from '../../../utils';

const Index = () => {

  const { query } = router.useLocation();
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
      <AnnualAuditPlan
        isInFlow={1}
        pageState="detail"
      />
    </WorkFlow.Approve>
  )

}

export default Index
