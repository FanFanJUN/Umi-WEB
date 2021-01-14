/**
 * @Description: 审核简报流程页面
 * @Author: M!keW
 * @Date: 2020-12-04
 */
import React, { useEffect, useRef, useState } from 'react';
import { WorkFlow } from 'suid'
import { router } from 'dva';
import { checkToken, closeCurrent } from '../../../../utils';
import AuditBriefingManagementView from '../editPage';

const ApprovePage = () => {

  const { query } = router.useLocation();
  const [isReady, setIsReady] = useState(false);
  // 获取配置列表项
  useEffect(() => {
    async function init() {
      await checkToken(query, setIsReady);
    }
    init();
  }, []);
  const handleClose = (res) => {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  };

  return(
    <>{isReady ?<WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <AuditBriefingManagementView
        isApprove
        isApproveDetail
      />

    </WorkFlow.Approve>: null}</>
  )

};

export default ApprovePage
