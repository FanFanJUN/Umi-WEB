import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import MonthAuditPlanDetail from '../MonthAuditPlan/EdaPage'
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
      <MonthAuditPlanDetail
        isInFlow={1}
        pageState="detail"
      />
    </WorkFlow.Approve>
  )

}

export default Index
