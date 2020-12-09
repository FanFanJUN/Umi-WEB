/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-11 15:22:44
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/index.js
 * @Description: 
 * @Connect: 1981824361@qq.com
 */
import styles from './index.less'
import { Tabs, Button, Affix, Checkbox, Modal, message } from 'antd';
import classnames from 'classnames';
import { useLocation } from 'dva/router';
import DataFillIn from './DataFillIn';
import Explain from './Explain';
import SelfAssessment from './SelfAssessment';
import { useGlobalStatus } from '../../../utils/hooks';
import { closeCurrent } from '../../../utils';
import { supplierSubmitToSystem } from '../../../services/recommend';
const { TabPane } = Tabs;
function RecommendData() {
  const { query } = useLocation();
  const { id } = query;
  const [status, updateGlobalStatus] = useGlobalStatus(id);
  const selfTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>供应商自评</div>
      <Checkbox checked={status.selfEvaluation} />
    </div>
  );
  const dataFillTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>资料填报</div>
      <Checkbox checked={status.informationFilling} />
    </div>
  )
  function handleSubmit() {
    Modal.confirm({
      title: '提交填报信息',
      content: '是否立即提交当前填报的信息',
      okText: '提交',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await supplierSubmitToSystem({ supplierRecommendDemandId: id })
        if (success) {
          message.success(msg)
          closeCurrent()
          return
        }
        message.error(msg)
      }
    })
  }
  return (
    <div>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>推荐资料填报明细</span>
          <div>
            <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
          </div>
        </div>
      </Affix>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => {
          return <Affix offsetTop={56}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
        }}
        defaultActiveKey='explain'
        animated={false}
      >
        <TabPane key='explain' tab='填表说明'>
          <Explain />
        </TabPane>
        <TabPane key='selfAssessment' tab={selfTab}>
          <SelfAssessment updateGlobalStatus={updateGlobalStatus} type='detail' />
        </TabPane>
        <TabPane key='dataFillIn' tab={dataFillTab}>
          <DataFillIn updateGlobalStatus={updateGlobalStatus} status={status} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default RecommendData;