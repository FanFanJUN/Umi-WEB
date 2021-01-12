/*
 * @Author: hyc
 * @Date: 2020-12-04 15:37:56
 * @LastEditTime : 2021-01-12 14:39:04
 * @LastEditors  : LiCai
 * @Description: 审核实施计划-流程中-不同意编辑
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/FlowList/AuditImplPNotAgreeInflow.js
 */
import React, { useEffect, useRef, useState } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AuditImplementationPlanDetail from '../AuditImplementationPlan/editPage'
import { checkToken, closeCurrent } from '../../../utils';

const AnnualAuditPlanInflowNotAgree = () => {

  const elementRef = useRef({});
  const { query } = router.useLocation();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkToken(query, setIsReady)
  }, [])

  const handleClose = () => {
    closeCurrent(elementRef);
  }

  const handleSave = () => {
    return elementRef.current.editDataInflow();
  }

  return (
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      beforeSubmit={handleSave}
      submitComplete={handleClose}
    >
      <AuditImplementationPlanDetail
        onRef={elementRef}
        isInFlow={1}
      />
    </WorkFlow.Approve>
  )

}

export default AnnualAuditPlanInflowNotAgree;
