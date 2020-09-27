/**
 * 实现功能：供应商推荐需求-评审打分
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef } from 'react';

import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Affix } from 'antd';
import { WorkFlow } from 'suid';
import Review from '../Review';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
import { saveReviewMarkData } from '../../../services/recommend';
import { closeCurrent } from '../../../utils';
const { TabPane } = Tabs;
const { useLocation } = router;

function renderTabBar(props, DefaultTabBar) {
  return <Affix offsetTop={51}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
}

const { Approve } = WorkFlow;

function ReviewMark() {
  const { query } = useLocation();
  const { id = null } = query;
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const reviewRef = useRef(null);
  async function beforeSubmit() {
    const { getAllParams } = reviewRef.current
    const params = await getAllParams();
    const { success, message: msg } = await saveReviewMarkData(params)
    return new Promise(resolve => {
      resolve({
        success,
        message: msg,
        data: {
          businessKey: id
        }
      })
    })
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
  return (
    <Approve
      beforeSubmit={beforeSubmit}
      submitComplete={handleComplete}
    >
      <div>
        <Affix>
          <div className={styles.title}>评审打分</div>
        </Affix>
        <Tabs renderTabBar={renderTabBar} animated={false} >
          <TabPane tab='推荐需求单' key='recommend-demand'>
            <DetailRecommendDemand offsetTop={95} />
          </TabPane>
          <TabPane tab='供应商推荐信息' key='supplier-recommend-demand'>
            <SupplierRecommendFillInData status={status} updateGlobalStatus={updateGlobalStatus} />
          </TabPane>
          <TabPane tab='供应商自评表' key='supplier-self-assessment'>
            <SelfAssessment type='detail' />
          </TabPane>
          <TabPane tab='评审' key='mark'>
            <Review wrappedComponentRef={reviewRef} />
          </TabPane>
        </Tabs>
      </div>
    </Approve>
  )
}

export default ReviewMark;