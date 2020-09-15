/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-11 15:22:44
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/index.js
 * @Description: 
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState } from 'react';
import styles from './index.less'
import { Tabs, Button, Affix, Checkbox } from 'antd';
import classnames from 'classnames';
import { useLocation } from 'dva/router';
import DataFillIn from './DataFillIn';
import Explain from './Explain';
import SelfAssessment from './SelfAssessment';
import { queryDataFillStatus } from '../../../services/recommend';
const { TabPane } = Tabs;
function RecommendData() {
  const { query } = useLocation();
  const { id } = query;
  const [status, changeStatus] = useState({
    // 自评
    selfEvaluation: false,
    // 资料填报
    informationFilling: false,
    // 基本情况
    baseInfo: false,
    // 销售情况
    salesSituation: false,
    // 研发能力
    rdCapability: false,
    // 质量能力
    qualityCapability: false,
    // 供应链管理能力
    supplyChainCapability: false,
    // 制造能力
    manufacturingCapacity: false,
    // 产品有害物
    productHazards: false,
    // 合作意愿
    willingnessToCooperate: false,
    // 企业社会责任
    socialResponsibility: false,
    // 企业生产环境
    productionEnvironment: false,
    // 其他附加资料
    otherInformation: false,
    // 报价单及成本分析表
    quotationCostAnalysis: false,
  });
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
  async function updateGlobalStatus() {
    const { data, success } = await queryDataFillStatus({ supplierRecommendDemandId: id })
    if (success) {
      const {
        id,
        recommendDemandId,
        tenantCode,
        display,
        ...statuses
      } = data;
      changeStatus(statuses)
    }
  }
  useEffect(() => {
    updateGlobalStatus()
  }, [])
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
      }} defaultActiveKey='selfAssessment'>
        <TabPane key='explain' tab='填表说明'>
          <Explain />
        </TabPane>
        <TabPane key='selfAssessment' tab={selfTab}>
          <SelfAssessment updateGlobalStatus={updateGlobalStatus} />
        </TabPane>
        <TabPane key='dataFillIn' tab={dataFillTab}>
          <DataFillIn updateGlobalStatus={updateGlobalStatus} status={status} />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default RecommendData;