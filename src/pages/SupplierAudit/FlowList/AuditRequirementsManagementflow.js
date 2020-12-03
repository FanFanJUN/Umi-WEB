import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AuditRequirementsManagementEdit from '../AuditRequirementsManagement/add/index'
import { closeCurrent } from '../../../utils';

const Index = () => {
  const AuditRequirementsManagement = useRef({});

  const { query } = router.useLocation();

  const handleClose = () => {
    closeCurrent(AuditRequirementsManagement);
  }

  const handleSave = () => {
    return AuditRequirementsManagement.current.innerFn()

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
        onRef={AuditRequirementsManagement}
        isInFlow={2}
      />
    </WorkFlow.Approve>
  )

}

export default Index
