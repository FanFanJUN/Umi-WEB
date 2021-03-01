/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:34:49
 * @LastEditTime: 2020-09-22 10:33:30
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/index.js
 * @Description: 销售情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import SalesProfit from './SalesProfit';
import Customer from './Customer';
import MarketCompetitive from './MarketCompetitive';
import { findSalesSituationById, saveSupplierSalesSituation } from '../../../../../services/dataFillInApi';
import { router } from 'dva';
import { filterEmptyFileds } from '../CommonUtil/utils';

const SellCondition = ({ form, updateGlobalStatus }) => {
  const [data, setData] = useState({});
  // 销售收入及利润
  const [supplierSalesProceeds, setsupplierSalesProceeds] = useState([]);
  const [supplierCertificates, setSupplierCertificates] = useState([]);
  // 长虹集团
  const [changhongSaleInfos, setChanghongSaleInfos] = useState([]);
  // 其他主要客户情况
  const [mainCustomers, setMainCustomers] = useState([]);
  // 出口情况
  const [exportSituations, setExportSituations] = useState([]);
  // 主要客户近半年内的订单或合同及证明材料
  const [supplierOrderInfos, setSupplierOrderInfos] = useState([]);
  // 未来三年发展规划
  const [threeYearPlans, setThreeYearPlans] = useState([]);
  // 主要竞争对手排名
  const [supplierMajorCompetitors, setSupplierMajorCompetitors] = useState([]);
  // 市场地位
  const [marketPositions, setMarketPositions] = useState([])
  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();
  const { getFieldsValue } = form;
  useEffect(() => {
    const fetchData = async () => {
      await setLoading(true);
      const { success, data, message: msg } = await findSalesSituationById({ supplierRecommendDemandId: id });
      await setLoading(false);
      if (success) {
        const {
          supplierCertificates = [],
          supplierSalesProceeds,
          changhongSaleInfos,
          mainCustomers,
          supplierOrderInfos,
          supplierMajorCompetitors,
          threeYearPlans,
          exportSituations,
          marketPositions,
          ...formFields
        } = data
        await setData({ ...formFields });
        await form.setFieldsValue({ ...formFields })
        await setsupplierSalesProceeds(supplierSalesProceeds.map(item => ({ ...item, guid: item.id })));
        await setSupplierCertificates(supplierCertificates.map(item => ({ ...item, guid: item.id })));
        await setThreeYearPlans(threeYearPlans.map(item => ({ ...item, guid: item.id })))
        await setExportSituations(exportSituations.map(item => ({ ...item, guid: item.id })))
        await setSupplierMajorCompetitors(supplierMajorCompetitors.map(item => ({ ...item, guid: item.id })));
        await setMarketPositions(marketPositions.map(item => ({ ...item, guid: item.id })));
        await setSupplierOrderInfos(supplierOrderInfos.map(item => ({ ...item, guid: item.id })))
        await setChanghongSaleInfos(changhongSaleInfos.map(item => ({ ...item, guid: item.id })))
        await setMainCustomers(mainCustomers.map(item => ({ ...item, guid: item.id })))
        return
      }
      message.error(msg);
    };
    fetchData();
  }, []);

  async function handleSave() {
    const value = await form.validateFieldsAndScroll()
    const saveParams = {
      ...value,
      supplierCertificates: supplierCertificates,
      supplierContacts: data.supplierContacts,
      managementSystems: data.managementSystems,
      changhongSaleInfos: changhongSaleInfos || [],
      mainCustomers: mainCustomers || [],
      supplierOrderInfos: supplierOrderInfos || [],
      threeYearPlans: threeYearPlans || [],
      recommendDemandId: id,
      exportSituations: exportSituations,
      marketPositions: marketPositions,
      id: data.id,
      supplierMajorCompetitors: supplierMajorCompetitors || [],
      supplierSalesProceeds
    };
    const params = filterEmptyFileds(saveParams);
    await setLoading(true)
    const { success, message: msg } = await saveSupplierSalesSituation(params)
    await setLoading(false)
    if (success) {
      message.success('保存销售情况成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }
  async function handleHoldData() {
    const value = getFieldsValue()
    const saveParams = {
      ...value,
      supplierCertificates: supplierCertificates,
      supplierContacts: data.supplierContacts,
      managementSystems: data.managementSystems,
      changhongSaleInfos: changhongSaleInfos || [],
      mainCustomers: mainCustomers || [],
      supplierOrderInfos: supplierOrderInfos || [],
      threeYearPlans: threeYearPlans || [],
      recommendDemandId: id,
      exportSituations: exportSituations,
      marketPositions: marketPositions,
      id: data.id,
      supplierMajorCompetitors: supplierMajorCompetitors || [],
      supplierSalesProceeds
    };
    const params = filterEmptyFileds(saveParams);
    await setLoading(true)
    const { success, message: msg } = await saveSupplierSalesSituation(params, {
      tempSave: true
    })
    await setLoading(false)
    if (success) {
      message.success('销售情况暂存成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }

  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="销售情况"
          extra={type === 'add' ? [
            <Button
              key="save"
              type="primary"
              style={{ marginRight: '12px' }}
              onClick={handleSave}
              disabled={loading}
            >保存</Button>,
            <Button
              key="hold"
              style={{ marginRight: '12px' }}
              onClick={handleHoldData}
              disabled={loading}
            >暂存</Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>销售收入及利润 <span className={styles.hint}>（请提供近3年数据，没有填0）</span></div>
              <div className={styles.content}>
                <SalesProfit
                  type={type}
                  data={supplierSalesProceeds}
                  setTableData={setsupplierSalesProceeds}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>客户</div>
              <div className={styles.content}>
                <Customer
                  type={type}
                  form={form}
                  data={data}
                  changhongSaleInfos={changhongSaleInfos}
                  setChanghongSaleInfos={setChanghongSaleInfos}
                  mainCustomers={mainCustomers}
                  setMainCustomers={setMainCustomers}
                  exportSituations={exportSituations}
                  setExportSituations={setExportSituations}
                  supplierOrderInfos={supplierOrderInfos}
                  setSupplierOrderInfos={setSupplierOrderInfos}
                  threeYearPlans={threeYearPlans}
                  setThreeYearPlans={setThreeYearPlans}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>市场地位及竞争状况<span className={styles.hint}>(请提供上一年度数据)</span></div>
              <div className={styles.content}>
                <MarketCompetitive
                  type={type}
                  supplierMajorCompetitors={supplierMajorCompetitors}
                  setSupplierMajorCompetitors={setSupplierMajorCompetitors}
                  marketPositions={marketPositions}
                  setMarketPositions={setMarketPositions}
                  form={form}
                />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(SellCondition);