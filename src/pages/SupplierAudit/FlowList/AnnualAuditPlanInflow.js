/*
 * @Author: hyc
 * @Date: 2020-11-17 20:35:59
 * @LastEditTime : 2021-01-12 14:40:32
 * @LastEditors  : LiCai
 * @Description: 年度审核实施计划-流程中
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/FlowList/AnnualAuditPlanInflow.js
 */
import React, { useEffect, useState } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AnnualAuditPlan from '../AnnualAuditPlan/EdaPage'
import { checkToken, closeCurrent } from '../../../utils';

const Index = () => {

  const { query } = router.useLocation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkToken(query, setIsReady);
  }, [])

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
