/**
 * 实现功能：供应商推荐需求-评审打分明细
 * @author hezhi
 * @date 2020-09-23
 */
import { useRef } from 'react';

import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Skeleton, Affix, Button } from 'antd';
import MarkDetail from '../Review/MarkDetail';
import Filter from '../Filter';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
import { closeCurrent } from '../../../utils';
const { TabPane } = Tabs;
const { useLocation } = router;
function FillInInfomationConfirm() {
  const { query } = useLocation();
  const { id = null } = query;
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const filterRef = useRef(null);
  function renderTabBar(props, DefaultTabBar) {
    return <Affix offsetTop={51}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
  }
  return (
    <div>
      <Affix>
        <div className={styles.fbc} style={{ padding: '0 12px', background: '#fff' }}>
          <div className={styles.title}>推荐需求明细</div>
          <Button onClick={closeCurrent}>返回</Button>
        </div>
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
          <MarkDetail type="detail" />
        </TabPane>
        <TabPane tab="筛选意见" key="filter" forceRender={true}>
          <Filter ref={filterRef} type='detail' />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default FillInInfomationConfirm;
