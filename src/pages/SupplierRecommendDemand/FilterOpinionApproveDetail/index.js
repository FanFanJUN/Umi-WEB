/**
 * 实现功能：供应商推荐需求-审批明细
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Skeleton } from 'antd';
import { WorkFlow } from 'suid';
// import Review from '../Review';
import Filter from '../Filter';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
import { closeCurrent, checkToken } from '../../../utils';
// import { saveReviewMarkData } from '../../../services/recommend';
const { TabPane } = Tabs;
const { useLocation } = router;
const { Approve } = WorkFlow;
function FillInInfomationConfirm() {
  const { query } = useLocation();
  const { id = null, taskId = null, instanceId = null } = query;
  const [isReady, setIsReady] = useState(false);
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const filterRef = useRef(null);
  const reviewRef = useRef(null)
  function handleComplete(info) {
    const { success, message: msg } = info;
    if (success) {
      closeCurrent();
      message.success(msg);
      return;
    }
    message.error(msg);
  }
  // async function beforeSubmit() {
  //   const params = reviewRef.current.getAllParams();
  //   const { success, message: msg } = await saveReviewMarkData(params);
  //   return new Promise((resolve) => {
  //     resolve({
  //       success,
  //       message: msg,
  //       data: {
  //         businessKey: id
  //       }
  //     })
  //   })
  // }
  useEffect(() => {
    checkToken(query, setIsReady);
  }, []);
  return isReady ? (
    <Approve
      submitComplete={handleComplete}
      // beforeSubmit={beforeSubmit}
      flowMapUrl="flow-web/design/showLook"
      businessId={id}
      instanceId={instanceId}
      taskId={taskId}
    >
      <div>
        <div className={styles.title}>推荐需求明细</div>
        <Tabs animated={false}>
          <TabPane tab="推荐需求单" key="recommend-demand">
            <DetailRecommendDemand fixed={false} />
          </TabPane>
          <TabPane tab="供应商推荐信息" key="supplier-recommend-demand">
            <SupplierRecommendFillInData status={status} updateGlobalStatus={updateGlobalStatus} />
          </TabPane>
          <TabPane tab="供应商自评表" key="supplier-self-assessment">
            <SelfAssessment type="detail" />
          </TabPane>
          <TabPane tab="筛选意见" key="filter" forceRender={true}>
            <Filter ref={filterRef} type="detail" />
          </TabPane>
        </Tabs>
      </div>
    </Approve>
  ) : (
      <Skeleton loading={!isReady} active></Skeleton>
    );
}

export default FillInInfomationConfirm;
