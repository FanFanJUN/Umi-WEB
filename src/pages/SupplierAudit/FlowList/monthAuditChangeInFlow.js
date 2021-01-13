import React, { useEffect, useState } from 'react';
import { WorkFlow } from 'suid';
import { Spin } from 'antd';
import { router } from 'dva';
import MonthAuditChangeDetail from '../MonthAuditPlan/component/changeDetail';
import { checkToken, closeCurrent } from '../../../utils';

const Index = () => {

  const { query } = router.useLocation();

  console.log(query, router.useLocation(), 'queery');

  const [show, setShow] = useState(false);

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
            show && <MonthAuditChangeDetail
              isInFlow={1}
              pageState="changeDetail"
            />
          }
        </Spin>
      </div>
    </WorkFlow.Approve>
  );

};

export default Index;
