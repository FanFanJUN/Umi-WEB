/**
 * 实现功能：供应商推荐需求-评审打分
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState, useEffect } from 'react';

import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs } from 'antd';
import { WorkFlow } from 'suid';
import Review from '../Review';
import Filter from '../Filter';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
import { saveFilterOpinion } from '../../../services/recommend';
import { closeCurrent, checkToken } from '../../../utils';
const { TabPane } = Tabs;
const { useLocation } = router;
const { Approve } = WorkFlow;
function FillInInfomationConfirm() {
  const { query } = useLocation();
  const { id = null } = query;
  const [isReady, setIsReady] = useState(false);
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const filterRef = useRef(null);
  async function beforeSubmit() {
    const params = filterRef.current.getAllParams();
    const { success, message: msg } = await saveFilterOpinion(params);
    return new Promise((resolve, reject) => {
      if (!params) {
        resolve({
          success: false,
          message: '请在编辑页面完善供应商分析',
        });
      }
      if (success) {
        resolve({
          success,
          message: msg,
          data: {
            businessKey: id,
          },
        });
        return;
      }
      resolve({
        success,
        message: msg,
      });
    });
  }
  function handleComplete(info) {
    const { success, message: msg } = info;
    if (success) {
      closeCurrent();
      message.success(msg);
      return;
    }
    message.error(msg);
  }
  useEffect(() => {
    checkToken(query, setIsReady);
  }, []);
  return isReady ? (
    <Approve
      beforeSubmit={beforeSubmit}
      submitComplete={handleComplete}
      flowMapUrl="flow-web/design/showLook"
    >
      <div>
        <div className={styles.title}>评审小组筛选意见</div>
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
          <TabPane tab="评审打分" key="mark">
            <Review type="detail" />
          </TabPane>
          <TabPane tab="筛选意见" key="filter">
            <Filter ref={filterRef} />
          </TabPane>
        </Tabs>
      </div>
    </Approve>
  ) : (
    <Skeleton loading={!isReady} active></Skeleton>
  );
}

export default FillInInfomationConfirm;
