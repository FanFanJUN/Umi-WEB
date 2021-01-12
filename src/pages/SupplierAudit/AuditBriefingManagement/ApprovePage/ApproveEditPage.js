/**
 * @Description: 审核报告流程页面
 * @Author: M!keW
 * @Date: 2020-12-04
 */
import React, { useEffect, useRef, useState } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import { checkToken, closeCurrent } from '../../../../utils';
import AuditBriefingManagementView from '../editPage';
import { saveAuditBriefing } from '../../mainData/commomService';
import AuditReportManagementView from '../../AuditReportManagement/editPage';

const ApproveEditPage = () => {

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

  // 新增
  const beforeSubmit = async () => {
    let data = await getRef.current.getAllData();
    if(!data){
      return false
    }
    return new Promise(function(resolve, reject) {
      saveAuditBriefing(data).then(res => {
        if (res.success) {
          const data = { businessKey: res.data };
          resolve({
            success: true,
            message: res.message,
            data,
          });
        } else {
          message.error(res.message);
        }
      }).catch(err => reject(err));
    });
  };


  return (
    <>{isReady ? <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
      beforeSubmit={beforeSubmit}
    >
      <AuditBriefingManagementView
        isApproveEdit
        isApprove
        wrappedComponentRef={getRef}
      />

    </WorkFlow.Approve>: null}</>
  );

};

export default ApproveEditPage;
