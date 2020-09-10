/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 14:29:17
 * @LastEditTime: 2020-09-10 16:50:09
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/index.js
 * @Description: 资料填报 Tabs
 * @Connect: 1981824361@qq.com
 */
import React, { useState, Fragment } from 'react';
import styles from './index.less';
import { Tabs, Checkbox } from 'antd';
import { BaseCondition, SellCondition, ResearchAbility, QualityAbility,
   ManagerAbility, ManufactureAbility, HdssControll, DWC, Other, QuotationAndGPCA, } from './Tabs';

const { TabPane } = Tabs;

function DataFillIn({
  type = 'create',
  id = null
}) {
  const [activityKey, setActivityKey] = useState('baseCondition');
  const baseConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>基本情况</div>
      <Checkbox checked={false} />
    </div>
  )
  const sellConditionTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>销售情况</div>
      <Checkbox checked={false} />
    </div>
  )
  const researchAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>研发能力</div>
      <Checkbox checked={false} />
    </div>
  )
  const qualityAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>质量能力</div>
      <Checkbox checked={false} />
    </div>
  )
  const managerAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>供应链</div>
        <div>管理能力</div>
      </div>
      <Checkbox checked={false} />
    </div>
  )
  const manufactureAbilityTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>制造能力</div>
      <Checkbox checked={false} />
    </div>
  )
  const hdssControllTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>产品有害</div>
        <div>物质管控</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  const DWCTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>合作意愿</div>
      <Checkbox checked={true} />
    </div>
  )
  const CSRTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业</div>
        <div>社会责任</div>
      </div>
      <Checkbox checked={false} />
    </div>
  )
  const EPETab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>企业生产</div>
        <div>环境情况</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  const otherTab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>其他</div>
        <div>附加资料</div>
      </div>
      <Checkbox checked={false} />
    </div>
  )
  const quotationAndGPCATab = (
    <div className={styles.fec}>
      <div className={styles.tabText}>
        <div>报价单及</div>
        <div>成分分析表</div>
      </div>
      <Checkbox checked={true} />
    </div>
  )
  {/* const TabPanes = [
    {key: 'baseCondition', tab: baseConditionTab, app: <BaseCondition params ={{}} /> }
  ] */}

  function handleChange(activeKey) {
    setActivityKey(() => (activeKey));
  }

  return (
    <div>
      <Tabs tabPosition='left' onChange={(activeKey) => handleChange(activeKey)} activityKey={activityKey}>
        {/* 基本情况 */}
        <TabPane key='baseCondition' tab={baseConditionTab}>
          {activityKey === 'baseCondition' ? <BaseCondition params="初始化"/> : <Fragment />}
        </TabPane>

        {/* 销售情况 */}
        <TabPane key='sellCondition' tab={sellConditionTab}>
          {activityKey === 'sellCondition' ? <SellCondition /> : <Fragment />}
        </TabPane>

        {/* 研发能力 */}
        <TabPane key='researchAbility' tab={researchAbilityTab}>
          {activityKey === 'researchAbility' ? <ResearchAbility /> : <Fragment />}
        </TabPane>

        {/* 质量能力 */}
        <TabPane key='qualityAbility' tab={qualityAbilityTab}>
          {activityKey === 'qualityAbility' ? <QualityAbility /> : <Fragment />}
        </TabPane>

        {/* 供应链管理能力 */}
        <TabPane key='managerAbility' tab={managerAbilityTab}>
          {activityKey === 'managerAbility' ? <ManagerAbility /> : <Fragment />}
        </TabPane>

        {/* 制造能力 */}
        <TabPane key='manufactureAbility' tab={manufactureAbilityTab}>
          {activityKey === 'manufactureAbility' ? <ManufactureAbility /> : <Fragment />}
        </TabPane>

        {/* 产品有害物质管控 */}
        <TabPane key='hdssControll' tab={hdssControllTab}>
          {activityKey === 'hdssControll' ? <HdssControll /> : <Fragment />}
        </TabPane>

        {/* 合作意愿 */}
        <TabPane key='DWC' tab={DWCTab}>
          {activityKey === 'DWC' ? <DWC /> : <Fragment />}
        </TabPane>

        {/* 企业社会责任 */}
        <TabPane key='CSR' tab={CSRTab}>

        </TabPane>

        {/* 企业生产环境情况 */}
        <TabPane key='EPE' tab={EPETab}>

        </TabPane>

        {/* 其他附加资料 */}
        <TabPane key='other' tab={otherTab}>
          {activityKey === 'other' ? <Other /> : <Fragment />}
        </TabPane>

        {/* 报价单及成分分析表 */}
        <TabPane key='quotationAndGPCA' tab={quotationAndGPCATab}>
          {activityKey === 'quotationAndGPCA' ? <QuotationAndGPCA /> : <Fragment />}
        </TabPane>
      </Tabs>
    </div>
  )
}
export default DataFillIn;