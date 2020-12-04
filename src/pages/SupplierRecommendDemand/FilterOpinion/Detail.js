/**
 * 实现功能：供应商推荐需求-评审打分明细
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef, useState, useEffect } from 'react';

import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Skeleton, Affix } from 'antd';
import Review from '../Review';
import Filter from '../Filter';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
import { closeCurrent, checkToken } from '../../../utils';
const { TabPane } = Tabs;
const { useLocation } = router;
function FillInInfomationConfirm() {
  const { query } = useLocation();
  const { id = null } = query;
  const [isReady, setIsReady] = useState(false);
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const filterRef = useRef(null);
  function renderTabBar(props, DefaultTabBar) {
    return <Affix offsetTop={51}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
  }
  useEffect(() => {
    checkToken(query, setIsReady);
  }, []);
  return isReady ? (
    <div>
      <Affix>
        <div className={styles.title}>评审小组筛选意见</div>
      </Affix>
      <Tabs animated={false} renderTabBar={renderTabBar}>
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
        <TabPane tab="筛选意见" key="filter" forceRender={true}>
          <Filter ref={filterRef} type='detail' />
        </TabPane>
      </Tabs>
    </div>
  ) : (
      <Skeleton loading={!isReady} active></Skeleton>
    );
}

export default FillInInfomationConfirm;
