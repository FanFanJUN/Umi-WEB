import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import PCNPlanInfo from '../commons/PCNPlanInfo'
import Distributioninfo from '../commons/Distributioninfo'
import classnames from 'classnames';
import styles from '../index.less';
import { utils } from 'suid';
import { closeCurrent, isEmpty } from '../../../../utils';
import { ManualSaveVo } from '../../../../services/MaterialService'
const { storage } = utils;
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
  const PCNManualdata = storage.sessionStorage.get("PCNManualdata");
  // 获取配置列表项
  useEffect(() => {

  }, []);

  // 保存
  async function handleSave() {
    let baseinfo, planinfo, distributioninfo, admitype;
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
      documentType: 2
    }
    triggerLoading(true)
    const { success, message: msg } = await ManualSaveVo(params)
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
          <span className={styles.title}>物料认定计划新增</span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button type='primary' className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        <div className={styles.bgw}>
          <div className={styles.title}>基本信息</div>
          <div >
            <BaseInfo
              wrappedComponentRef={BaseinfoRef}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>认定计划信息</div>
          <div >
            <PCNPlanInfo
              wrappedComponentRef={ModifyinfoRef}
              modifytype={modifytype}
              manual={true}
              admitype={query.admitype}
              editformData={PCNManualdata}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>分配计划详情</div>
          <div >
            <Distributioninfo
              wrappedComponentRef={DistributionRef}
              isAdd={true}
              isView={false}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;