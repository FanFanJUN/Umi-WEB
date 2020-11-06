import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import MonthAuditChangeDetail from '../MonthAuditPlan/component/changeDetail'
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
      <MonthAuditChangeDetail
        isInFlow={1}
        pageState="changeDetail"
      />
    </WorkFlow.Approve>
  )

}

export default Index
