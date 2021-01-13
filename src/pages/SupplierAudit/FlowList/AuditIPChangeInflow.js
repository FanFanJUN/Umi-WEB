/*
 * @Author: your name
 * @Date: 2020-11-17 20:35:59
 * @LastEditTime: 2020-11-23 10:14:45
 * @LastEditors: Please set LastEditors
 * @Description: 审核实施计划-流程中
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\FlowList\AuditImplementationPlanInflow.js
 */
import React, { useEffect, useState } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import ChangeDetail from '../AuditImplementationPlan/components/changeDetail';
import { checkToken, closeCurrent } from '../../../utils';
import { Spin } from 'antd';
import MonthAuditChangeDetail from '../MonthAuditPlan/component/changeDetail';

const Index = () => {

  const { query } = router.useLocation();

  const [show, setShow] = useState(false);

  console.log(query, router.useLocation(), 'queery');

  const handleClose = () => {
    closeCurrent();
  };

  useEffect(async () => {
    if (query._s) {
      await checkToken(query, (data) => {
        setShow(data);
      });
    } else {
      setShow(true);
    }
  }, []);

  return (
    <WorkFlow.Approve
      businessId={query.id}
      taskId={query.taskId}
      instanceId={query.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={handleClose}
    >
      <div style={!show ? { height: '100vh' } : { height: 'auto' }}>
        <Spin spinning={!show} style={{ width: '100%', height: '100vh' }}>
          {
            show && <ChangeDetail
              isInFlow={1}
              pageState="detail"
            />
          }
        </Spin>
      </div>
    </WorkFlow.Approve>
  );

};

export default Index;
