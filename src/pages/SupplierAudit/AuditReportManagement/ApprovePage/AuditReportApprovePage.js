/**
 * @Description: 审核报告流程页面
 * @Author: M!keW
 * @Date: 2020-11-25
 */
import React, { useRef, useEffect, useState } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import { checkToken, closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';

const AuditReportApprovePage = () => {

  const { query } = router.useLocation();
  const [isReady, setIsReady] = useState(false);
// 获取配置列表项
  useEffect(() => {
    async function init() {
      await checkToken(query, setIsReady);
    }

    init();
  }, []);
  const getRef = useRef(null);
  const handleClose = (res) => {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  };

  return (
    <>{isReady ? <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <AuditReportManagementView
        isApprove
        isApproveDetail
      />

    </WorkFlow.Approve>: null}</>
  );

};

export default AuditReportApprovePage;
