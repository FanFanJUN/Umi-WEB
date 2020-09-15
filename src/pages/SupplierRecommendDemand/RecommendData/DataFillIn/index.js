/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-14 15:40:23
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/index.js
 * @Description: 资料填报 Tabs
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import styles from './index.less';
import { Tabs, Checkbox, BackTop, Tooltip } from 'antd';
import {
  BaseCondition, SellCondition, ResearchAbility, QualityAbility,
  ManagerAbility, ManufactureAbility, HdssControll, DWC, Other, QuotationAndGPCA,
} from './Tabs';
import { router } from 'dva';

const { TabPane } = Tabs;

function DataFillIn({
  type = 'create',
  id = null,
  // 更新所有表单填写状态函数
  updateGlobalStatus,
  // 所有表单填报状态
  status = {}
}) {
  const [activityKey, setActivityKey] = useState('baseCondition');
  const baseConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>基本情况</div>
      <Checkbox checked={status.baseInfo} />
    </div>
  )
  const sellConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>销售情况</div>
      <Checkbox checked={status.salesSituation} />
    </div>
  )
  const researchAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>研发能力</div>
      <Checkbox checked={status.rdCapability} />
    </div>
  )
  const qualityAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>质量能力</div>
      <Checkbox checked={status.qualityCapability} />
    </div>
  )
  const managerAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>供应链</div>
        <div>管理能力</div>
      </div>
      <Checkbox checked={status.supplyChainCapability} />
    </div>
  )
  const manufactureAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>制造能力</div>
      <Checkbox checked={status.manufacturingCapacity} />
    </div>
  )
  const hdssControllTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>产品有害</div>
        <div>物质管控</div>
      </div>
      <Checkbox checked={status.productHazards} />
    </div>
  )
  const DWCTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>合作意愿</div>
      <Checkbox checked={status.willingnessToCooperate} />
    </div>
  )
  const CSRTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业</div>
        <div>社会责任</div>
      </div>
      <Checkbox checked={status.socialResponsibility} />
    </div>
  )
  const EPETab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业生产</div>
        <div>环境情况</div>
      </div>
      <Checkbox checked={status.productionEnvironment} />
    </div>
  )
  const otherTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>其他</div>
        <div>附加资料</div>
      </div>
      <Checkbox checked={status.otherInformation} />
    </div>
  )
  const quotationAndGPCATab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>报价单及</div>
        <div>成分分析表</div>
      </div>
      <Checkbox checked={status.quotationCostAnalysis} />
    </div>
  )

  function handleChange(activeKey) {
    // setActivityKey(() => (activeKey));
  }

  return (
    <div>
      <Tooltip title="返回顶部保存信息">
        <BackTop visibilityHeight={400} />
      </Tooltip>
      <Tabs tabPosition='left' onChange={(activeKey) => handleChange(activeKey)}>
        {/* 基本情况 */}
        <TabPane key='baseCondition' tab={baseConditionTab}>
          <BaseCondition updateGlobalStatus={updateGlobalStatus} baseParam={{ id, type }} />
        </TabPane>

        {/* 销售情况 */}
        <TabPane key='sellCondition' tab={sellConditionTab}>
          <SellCondition updateGlobalStatus={updateGlobalStatus} baseParam={{ id, type }} />
        </TabPane>

        {/* 研发能力 */}
        <TabPane key='researchAbility' tab={researchAbilityTab}>
          <ResearchAbility updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 质量能力 */}
        <TabPane key='qualityAbility' tab={qualityAbilityTab}>
          <QualityAbility updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 供应链管理能力 */}
        <TabPane key='managerAbility' tab={managerAbilityTab}>
          <ManagerAbility updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 制造能力 */}
        <TabPane key='manufactureAbility' tab={manufactureAbilityTab}>
          <ManufactureAbility updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 产品有害物质管控 */}
        <TabPane key='hdssControll' tab={hdssControllTab}>
          <HdssControll updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 合作意愿 */}
        <TabPane key='DWC' tab={DWCTab}>
          <DWC updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 企业社会责任 */}
        <TabPane key='CSR' tab={CSRTab}>

        </TabPane>

        {/* 企业生产环境情况 */}
        <TabPane key='EPE' tab={EPETab}>

        </TabPane>

        {/* 其他附加资料 */}
        <TabPane key='other' tab={otherTab}>
          <Other updateGlobalStatus={updateGlobalStatus} />
        </TabPane>

        {/* 报价单及成分分析表 */}
        <TabPane key='quotationAndGPCA' tab={quotationAndGPCATab}>
          <QuotationAndGPCA />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default DataFillIn;