import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Affix } from 'antd';
import TeamConfirm from './TeamConfirm';
const { TabPane } = Tabs;

function renderTabBar(props, DefaultTabBar) {
  return <Affix offsetTop={51}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
}

function FillInInfomationConfirm() {
  return (
    <div>
      <Affix>
        <div className={styles.title}>填报信息确认</div>
      </Affix>
      <Tabs renderTabBar={renderTabBar} animated={false}>
        <TabPane tab='评审小组确定' key='team-confirm'>
          <TeamConfirm />
        </TabPane>
        <TabPane tab='推荐需求单' key='recommend-demand'>
          <DetailRecommendDemand offsetTop={95} />
        </TabPane>
        <TabPane tab='供应商推荐信息' key='supplier-recommend-demand'>
          <SupplierRecommendFillInData />
        </TabPane>
        <TabPane tab='供应商自评表' key='supplier-self-assessment'>
          <SelfAssessment type='detail' />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default FillInInfomationConfirm;