import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AuditRequirementsManagementEdit from '../AuditRequirementsManagement/add/index'
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
      <AuditRequirementsManagementEdit
        isInFlow={2}
      />
    </WorkFlow.Approve>
  )

}

export default Index
