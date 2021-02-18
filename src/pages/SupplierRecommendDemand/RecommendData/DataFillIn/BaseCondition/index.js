/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 15:52:52
 * @LastEditTime: 2020-09-22 09:22:06
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/index.js
 * @Description: 基本情况 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import BaseInfo from './BaseInfo';
import AuthPrincipal from './AuthPrincipal';
import GenQualification from './GenQualification';
import MproCertification from './MproCertification';
import { router } from 'dva';
import { findrBaseInfoById, saveBaseInfo } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import moment from 'moment';

const BaseCondition = ({ form, updateGlobalStatus }) => {

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [proData, setProData] = useState([]);
  const [otherData, setOtherData] = useState([]);
  const [manageData, setManageData] = useState([]);
  const { query: { id, type = 'add' } } = router.useLocation();
  (proData, otherData)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { success, data, message: msg } = await findrBaseInfoById({ supplierRecommendDemandId: id });
      if (success) {
        // const { productCertifications, otherCertifications, ...other } = data
        await setData({ ...data });
        await form.setFieldsValue({
          ...data,
          setUpTime: !!data?.setUpTime ? moment(data.setUpTime) : undefined
        })
        await setProData(data.productCertifications)
        await setOtherData(data.otherCertifications)
        await setManageData(data.managementSystems)
      } else {
        message.error(msg);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  async function handleSave() {
    const value = await form.validateFieldsAndScroll();
    const {
      manager = 0, // 管理人员
      salesman = 0, // 销售人员
      qualityControl = 0, // 质量控制
      technicist = 0, // 技术人员
      supportStaff = 0, // 客服人员
      otherStaff = 0, // 其他人员
      headCount = 0, // 总人数
    } = value;
    const count = manager + salesman + qualityControl + technicist + supportStaff + otherStaff;
    if (count > headCount) {
      message.error(`各部门人数总和超过公司总人数${headCount}人，请检查。`)
      return
    }
    const saveParams = {
      ...value,
      supplierCertificates: data.supplierCertificates,
      supplierContacts: data.supplierContacts,
      managementSystems: manageData,
      recommendDemandId: id,
      id: data.id,
      actualCapacityFactor: (value.designCapability / value.actualCapacity).toFixed(2), // 现有产能利用率 设计产能/实际产能
      productCertifications: proData || [],
      otherCertifications: otherData || [],
    };
    const params = filterEmptyFileds(saveParams);
    setLoading(true)
    const { success, message: msg } = await saveBaseInfo(params);
    setLoading(false)
    if (success) {
      message.success('保存基本情况成功');
      updateGlobalStatus();
      return
    }
    message.error(msg);
  }

  function setTableData(newData, type) {
    switch (type) {
      case 'pro':
        setProData(newData)
        break;
      case 'other':
        setOtherData(newData)
        break;
      case 'manage':
        setManageData(newData)
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
          title="基本情况"
          extra={type === 'add' ? [
            <Button
              key="save"
              type="primary"
              style={{ marginRight: '12px' }}
              onClick={handleSave}
              disabled={loading}
            >保存</Button>
          ] : null}
        >
          <BaseInfo
            form={form}
            baseInfo={data}
            type={type}
          />
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>授权委托人</div>
              <div className={styles.content}>
                <AuthPrincipal tableData={data.supplierContacts} />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>通用资质</div>
              <div className={styles.content}>
                <GenQualification tableData={data.supplierCertificates} />
              </div>
            </div>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>管理体系及产品认证</div>
              <div className={styles.content}>
                <MproCertification data={data} type={type} setTableData={setTableData} />
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(BaseCondition);