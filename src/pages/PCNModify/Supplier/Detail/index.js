import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../commons/BaseInfo'
import Modifyinfo from '../commons/Modifyinfo'
import Modifyinfluence from '../commons/Modifyinfluence'
import ModifyinfluenceForm from '../commons/ModifyinfluenceForm'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent ,isEmpty} from '../../../../utils';
import {findPCNSupplierId} from '../../../../services/pcnModifyService'
function CreateStrategy() {
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const ModifyinfluenceRef = useRef(null);
  const modifyinfluenceFormRef = useRef(null);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();

  useEffect(() => {
    infoPCNdetails()
  }, []);
  
  // 明细
  async function infoPCNdetails() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await findPCNSupplierId({pcnTitleId:id});
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
          <span className={styles.title}>
            PCN变更信息明细
            </span>
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
                isEdit={true}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更信息</div>
            <div >
            <Modifyinfo
                editformData={editData.smPcnDetailVos}
                wrappedComponentRef={ModifyinfoRef}
                isView={true}
                headerInfo={true}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更影响分析</div>
            <div >
            <Modifyinfluence
                editformData={editData.smPcnAnalysisVos}
                wrappedComponentRef={ModifyinfluenceRef}
                isView={true}
                isEdit={true}
                alone={query.alone}
                headerInfo={true}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <ModifyinfluenceForm
                editformData={editData} 
                isView={true} 
                wrappedComponentRef={modifyinfluenceFormRef}
            />
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;