/**
 * @Description: 审核报告流程页面
 * @Author: M!keW
 * @Date: 2020-11-25
 */
import React, { useRef } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';
import { saveAuditReport } from '../../mainData/commomService';
import { message } from 'antd';

const AuditReportApproveEditPage = () => {

  const { query } = router.useLocation();

  const getRef = useRef(null);

  const handleClose = () => {
    closeCurrent();
  };

  // 新增
  const beforeSubmit = async () => {
    let data = await getRef.current.getAllData();
    if(!data){
      return false
    }
    return new Promise(function(resolve, reject) {
      saveAuditReport(data.editData).then(res => {
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
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
      beforeSubmit={beforeSubmit}
    >
      <AuditReportManagementView
        isApproveEdit
        isApprove
        wrappedComponentRef={getRef}
      />

    </WorkFlow.Approve>
  );

};

export default AuditReportApproveEditPage;
