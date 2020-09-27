
import styles from './index.less';
import DetailRecommendDemand from '../DetailRecommendDemand';
import SupplierRecommendFillInData from '../RecommendData/DataFillIn';
import SelfAssessment from '../RecommendData/SelfAssessment';
import { Tabs, Affix } from 'antd';
import { WorkFlow } from 'suid';
import TeamConfirm from './TeamConfirm';
import { router } from 'dva';
import { useGlobalStatus } from '../../../utils/hooks';
const { TabPane } = Tabs;
const { useLocation } = router;
const { Approve } = WorkFlow;

function renderTabBar(props, DefaultTabBar) {
  return <Affix offsetTop={51}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
}

function FillInInfomationConfirm() {
  const { query } = useLocation();
  const { id = null } = query;
  const [status, updateGlobalStatus] = useGlobalStatus(id)
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
      submitComplete={handleComplete}
      flowMapUrl='flow-web/design/showLook'
    >
      <div>
        <Affix>
          <div className={styles.title}>评审小组确定</div>
        </Affix>
        <Tabs renderTabBar={renderTabBar} animated={false}>
          <TabPane tab='评审小组确定' key='team-confirm'>
            <TeamConfirm />
          </TabPane>
          <TabPane tab='推荐需求单' key='recommend-demand'>
            <DetailRecommendDemand offsetTop={95} />
          </TabPane>
          <TabPane tab='供应商推荐信息' key='supplier-recommend-demand'>
            <SupplierRecommendFillInData status={status} updateGlobalStatus={updateGlobalStatus}/>
          </TabPane>
          <TabPane tab='供应商自评表' key='supplier-self-assessment'>
            <SelfAssessment type='detail' />
          </TabPane>
        </Tabs>
      </div>
    </Approve>
  )
}

export default FillInInfomationConfirm;