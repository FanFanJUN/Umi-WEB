/*
 * @Author: Li Cai
 * @LastEditors  : LiCai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-12-03 13:49:23
 * @LastEditTime : 2021-01-13 11:23:55
 * @Description: 流程不同意编辑页
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/FlowList/AnnualAuditPlanInflowNotAgree.js
 */

import React, { useEffect, useRef, useState } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import AnnualAuditPlan from '../AnnualAuditPlan/EdaPage'
import { checkToken, closeCurrent } from '../../../utils';
import { Spin } from 'antd';

const AnnualAuditPlanInflowNotAgree = () => {

  const elementRef = useRef({});
  const { query } = router.useLocation();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await checkToken(query, setIsReady);
    }
    query?._s && init();
  }, []);

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
      {isReady ? (
        <AnnualAuditPlan onRef={elementRef} isInFlow={1} pageState="edit" />
      ) : (
        <div style={{ width: '100%', height: '100vh', textAlign: 'center' }}>
          <Spin spinning={isReady}>加载中</Spin>
        </div>
      )}
    </WorkFlow.Approve>
  );

}

export default AnnualAuditPlanInflowNotAgree;
