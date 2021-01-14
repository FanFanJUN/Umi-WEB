import React, { useEffect, useState } from 'react';
import { WorkFlow } from 'suid';
import { router } from 'dva';
import MonthAuditPlanDetail from '../MonthAuditPlan/EdaPage';
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
            show && <MonthAuditPlanDetail
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
