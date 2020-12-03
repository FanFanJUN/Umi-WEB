import React, { createRef, useState, useRef, useEffect, useCallback } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import AdmitPlanInfo from '../commons/AdmitPlanInfo'
import Distributioninfo from '../commons/Distributioninfo'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent, isEmpty } from '../../../../utils';
import { AdmissionDetails, ManualSaveVo } from '../../../../services/MaterialService'
function CreateStrategy() {
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const DistributionRef = useRef(null);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [modifytype, setModifytype] = useState('');
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;

  // 获取配置列表项
  useEffect(() => {
    infoMaterieldetails()
  }, [infoMaterieldetails]);

  const infoMaterieldetails = useCallback(
    async function hanldModify() {
      triggerLoading(true);
      let id = query.id;
      const { data, success, message: msg } = await AdmissionDetails({ planId: id });
      if (success) {
        setEditData(data)
        triggerLoading(false);
        return
      }
      triggerLoading(false);
      message.error(msg)
    }
  )
  // 保存
  async function handleSave() {
    let baseinfo, planinfo, distributioninfo;
    const { basefrom } = BaseinfoRef.current;
    const { planfrom } = ModifyinfoRef.current;
    const { displanfrom } = DistributionRef.current;
    baseinfo = basefrom();
    if (!baseinfo) {
      message.error('基础信息不能为空！');
      return false;
    }
    planinfo = planfrom()
    if (!planinfo) {
      message.error('认定计划信息不能为空！');
      return false;
    }
    distributioninfo = displanfrom()
    if (!distributioninfo) {
      message.error('分配计划详情不能为空！');
      return false;
    }
    let params = {
      ...baseinfo,
      ...planinfo,
      detailsVos: distributioninfo,
    }
    let editparams = { ...editData, ...params }
    console.log(editparams)
    triggerLoading(true)
    const { success, message: msg } = await ManualSaveVo(editparams)
    if (success) {
      triggerLoading(false)
      closeCurrent()
    } else {
      triggerLoading(false)
      message.error(msg);
    }
  }
  // 返回
  function handleBack() {
    closeCurrent()
  }
  function handleCancel() {
    setvisible(false)
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>物料认定计划编辑</span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>基本信息</div>
          <div >
            <BaseInfo
              editformData={editData}
              wrappedComponentRef={BaseinfoRef}
              cancel={query.cancel}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>认定计划信息</div>
          <div >
            <AdmitPlanInfo
              wrappedComponentRef={ModifyinfoRef}
              modifytype={modifytype}
              editformData={editData}
              manual={true}
              cancel={query.cancel}
              admitype={query.admitype}
              isEdit={true}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>分配计划详情</div>
          <div >
            <Distributioninfo
              editformData={editData.detailsVos}
              wrappedComponentRef={DistributionRef}
              isEdit={true}
              isView={false}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;