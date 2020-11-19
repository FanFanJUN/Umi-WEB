import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import PlanInfo from '../commons/PlanInfo'
import Distributioninfo from '../commons/Distributioninfo'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent, isEmpty } from '../../../../utils';
import { AdmissionDetails } from '../../../../services/MaterialService'
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

  useEffect(() => {
    Admissiontails()
  }, []);

  async function Admissiontails() {
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
  // 返回
  function handleBack() {
    closeCurrent()
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>物料认定计划明细</span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
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
              isView={true}
            />
          </div>
        </div>
        <div className={styles.bgw}>
          <div className={styles.title}>认定计划信息</div>
          <div >
            <PlanInfo
              editformData={editData}
              wrappedComponentRef={ModifyinfoRef}
              modifytype={modifytype}
              isView={true}
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
              headerInfo={true}
            />
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;