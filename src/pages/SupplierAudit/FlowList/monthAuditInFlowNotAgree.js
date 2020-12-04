/*
 * @Author: hyc
 * @Date: 2020-12-04 15:37:56
 * @LastEditTime: 2020-12-04 15:54:29
 * @LastEditors: Please set LastEditors
 * @Description: 月度流程中-不同意编辑
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\FlowList\monthAuditInFlowNotAgree.js
 */
import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import MonthAuditPlanDetail from '../MonthAuditPlan/EdaPage';
import { closeCurrent } from '../../../utils';

const AnnualAuditPlanInflowNotAgree = () => {

  const elementRef = useRef({});
  const { query } = router.useLocation();

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
      <MonthAuditPlanDetail
        onRef={elementRef}
        isInFlow={1}
      />
    </WorkFlow.Approve>
  )

}

export default AnnualAuditPlanInflowNotAgree;
