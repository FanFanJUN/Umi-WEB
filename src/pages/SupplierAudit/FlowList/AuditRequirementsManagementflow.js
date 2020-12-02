import React from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AuditRequirementsManagementEdit from '../AuditRequirementsManagement/add/index'
import { closeCurrent } from '../../../utils';

const Index = () => {
  let AuditRequirementsManagement = null

  const { query } = router.useLocation();

  console.log(query, router.useLocation(),  'queery')

  const handleClose = () => {
    closeCurrent();
  }

  const handleSave = () => {
    return AuditRequirementsManagement.handleSave()
  }

  return(
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      beforeSubmit={handleSave}
      submitComplete={handleClose}
    >
      <AuditRequirementsManagementEdit
        onRef={ref => AuditRequirementsManagement = ref}
        isInFlow={2}
      />
    </WorkFlow.Approve>
  )

}

export default Index
