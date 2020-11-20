/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:34:49
 * @LastEditTime: 2020-09-22 10:33:30
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/index.js
 * @Description: 销售情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import SalesProfit from './SalesProfit';
import Customer from './Customer';
import MarketCompetitive from './MarketCompetitive';
import { findSalesSituationById, saveSupplierSalesSituation } from '../../../../../services/dataFillInApi';
import { router } from 'dva';
import { filterEmptyFileds } from '../CommonUtil/utils';

const SellCondition = ({ form, updateGlobalStatus }) => {
  const customerRef = useRef(null);
  const [data, setData] = useState({});
  const [supplierSalesProceeds, setsupplierSalesProceeds] = useState([]); // 销售收入及利润
  const [changhongSaleInfos, setchanghongSaleInfos] = useState([]);
  const [mainCustomers, setmainCustomers] = useState([]);
  // const [exportSituations, setexportSituations] = useState([]);
  const [supplierOrderInfos, setsupplierOrderInfos] = useState([]);
  const [threeYearPlans, setthreeYearPlans] = useState([]);
  const [supplierMajorCompetitors, setsupplierMajorCompetitors] = useState();

  const [loading, setLoading] = useState(false);

  const { query: { id, type = 'add' } } = router.useLocation();

  useEffect(() => {
    const fetchData = async () => {
      await setLoading(true);
      const { success, data, message: msg } = await findSalesSituationById({ supplierRecommendDemandId: id });
      await setLoading(false);
      if (success) {
        const {
          supplierCertificates,
          supplierSalesProceeds,
          changhongSaleInfos,
          mainCustomers,
          supplierOrderInfos,
          supplierMajorCompetitors,
          threeYearPlans
        } = data
        await setData({ ...data });
        await form.setFieldsValue({ ...data })
        await setsupplierSalesProceeds(supplierSalesProceeds.map(item => ({ ...item, guid: item.id })));
        await setthreeYearPlans(threeYearPlans.map(item => ({ ...item, guid: item.id })))
        await setsupplierMajorCompetitors(supplierMajorCompetitors.map(item => ({ ...item, guid: item.id })));
        await setsupplierOrderInfos(supplierOrderInfos.map(item => ({ ...item, guid: item.id })))
        await setchanghongSaleInfos(changhongSaleInfos.map(item => ({ ...item, guid: item.id })))
        await setmainCustomers(mainCustomers.map(item => ({ ...item, guid: item.id })))
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
      supplierCertificates: data.supplierCertificates,
      supplierContacts: data.supplierContacts,
      managementSystems: data.managementSystems,
      changhongSaleInfos: changhongSaleInfos || [],
      mainCustomers: mainCustomers || [],
      supplierOrderInfos: supplierOrderInfos || [],
      threeYearPlans: threeYearPlans || [],
      recommendDemandId: id,
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

  function setTableData(newData, type) {
    switch (type) {
      case 'changhongSaleInfos':
        setchanghongSaleInfos(newData);
        break;
      case 'mainCustomers':
        setmainCustomers(newData);
        break;
      case 'supplierOrderInfos':
        setsupplierOrderInfos(newData);
        break;
      case 'threeYearPlans':
        setthreeYearPlans(newData);
        break;
      case 'supplierMajorCompetitors':
        setsupplierMajorCompetitors(newData);
        break;
      case 'supplierSalesProceeds':
        setsupplierSalesProceeds(newData);
        break;
      default:
        break;
    }
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
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>销售收入及利润 <span className={styles.hint}>（至少提供近三年）</span></div>
              <div className={styles.content}>
                <SalesProfit
                  type={type}
                  data={supplierSalesProceeds}
                  form={form}
                  setTableData={setTableData}
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
                  data={data}
                  form={form}
                  setTableData={setTableData}
                  wrappedComponentRef={customerRef}
                />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>市场地位及竞争状况</div>
              <div className={styles.content}>
                <MarketCompetitive
                  type={type}
                  data={data}
                  form={form}
                  setTableData={setTableData}
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