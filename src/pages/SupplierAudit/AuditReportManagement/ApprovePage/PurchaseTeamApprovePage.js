/**
 * @Description: 采购小组审批
 * @Author: M!keW
 * @Date: 2020-11-25
 */

import React, { useRef } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import { closeCurrent } from '../../../../utils';
import AuditReportManagementView from '../editPage';
import {  savePurchasingTeamOpinion } from '../../mainData/commomService';
import { message } from 'antd';

const PurchaseTeamApprovePage = () => {

  const { query } = router.useLocation();
  const getRef = useRef(null);
  const handleClose = () => {
    closeCurrent();
  };

  // 保存小组意见
  const beforeSubmit = async () => {
    let data = await getRef.current.getAllData();
    let teamData = await getRef.current.getModalData();
    if(!data || !teamData){
      return false
    }
    let endData = Object.assign(data, teamData);
    return new Promise(function(resolve, reject) {
      savePurchasingTeamOpinion(endData).then(res => {
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
      <div>
        <AuditReportManagementView
          isApprove
          purchaseApprove
          wrappedComponentRef={getRef}
        />
      </div>
    </WorkFlow.Approve>
  );

};

export default PurchaseTeamApprovePage;
