/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-09 14:38:31
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/index.js
 * @Description: 
 * @Connect: 1981824361@qq.com
 */
import styles from './index.less'
import { Tabs, Button, Affix } from 'antd';
import classnames from 'classnames';
import { useLocation } from 'dva/router';
import DataFillIn from './DataFillIn';
import Explain from './Explain';
import SelfAssessment from './SelfAssessment';
const { TabPane } = Tabs;

function RecommendData() {
  const { query } = useLocation();
  return (
    <div>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>推荐资料填报</span>
          <div>
            <Button className={styles.btn}>返回</Button>
            <Button className={styles.btn}>提交</Button>
          </div>
        </div>
      </Affix>
      <Tabs renderTabBar={(props, DefaultTabBar) => {
        return <Affix offsetTop={56}><DefaultTabBar {...props} style={{ background: '#fff', padding: '0 24px' }} /></Affix>
      }} activeKey={'dataFillIn'}>
        <TabPane key='explain' tab='填表说明'>
          <Explain />
        </TabPane>
        <TabPane key='selfAssessment' tab='供应商自评'>
          <SelfAssessment />
        </TabPane>
        <TabPane key='dataFillIn' tab='资料填报'>
          <DataFillIn />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default RecommendData;