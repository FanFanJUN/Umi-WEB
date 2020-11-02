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
import {saveBatchVo} from '../../../../services/pcnModifyService'
function CreateStrategy() {
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const ModifyinfluenceRef = useRef(null);
  const modifyinfluenceFormRef = useRef(null);
  const [againdata, setAgaindata] = useState({});
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [configure, setConfigure] = useState([]);
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;

  useEffect(() => {

    }, []);
  // 保存
  async function handleSave() {
    let baseinfo,modifyVal,modifyanalysisVal,scienceEnviron;
    const { basefrom } = BaseinfoRef.current;
    const {getmodifyform} = ModifyinfoRef.current;
    const {getmodifyanalyform} = ModifyinfluenceRef.current;
    const {modifyinfo} = modifyinfluenceFormRef.current;
    baseinfo = basefrom();
    if (!baseinfo) {
      message.error('基础信息不能为空！');
      return false;
    }
    modifyVal = getmodifyform()
    if (!modifyVal) {
      message.error('变更信息不能为空！');
      return false;
    }
    modifyanalysisVal = getmodifyanalyform()
    if (!modifyanalysisVal) {
      message.error('变更影响不能为空！');
      return false;
    }
    console.log(modifyanalysisVal)
    scienceEnviron = modifyinfo()
    if (!scienceEnviron) {
      message.error('影响选择不能为空！');
      return false;
    }
    let params = {
      ...baseinfo,
      smPcnDetailVos: modifyVal,
      smPcnAnalysisVos: modifyanalysisVal,
      ...scienceEnviron
    }
    console.log(params)
    triggerLoading(true)
    const {success, message: msg } = await saveBatchVo(params)
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
          <span className={styles.title}>
            新增PCN变更信息
            </span>
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
                wrappedComponentRef={BaseinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更信息</div>
            <div >
            <Modifyinfo
                wrappedComponentRef={ModifyinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>变更影响分析</div>
            <div >
            <Modifyinfluence
                wrappedComponentRef={ModifyinfluenceRef}
                isView={false}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <ModifyinfluenceForm  
                wrappedComponentRef={modifyinfluenceFormRef}
            />
        </div>
      </div>
    </Spin>
  )
}

export default CreateStrategy;