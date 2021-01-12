/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-12-03 13:49:23
 * @LastEditTime: 2020-12-03 14:12:31
 * @Description: 流程不同意编辑页
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/FlowList/AnnualAuditPlanInflowNotAgree.js
 */

import React, { useRef } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AnnualAuditPlan from '../AnnualAuditPlan/EdaPage'
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
      <AnnualAuditPlan
        onRef={elementRef}
        isInFlow={1}
        pageState='edit'
      />
    </WorkFlow.Approve>
  )

}

export default AnnualAuditPlanInflowNotAgree;
