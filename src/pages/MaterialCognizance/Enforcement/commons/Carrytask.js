import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import TaskInfo from '../commons/TaskInfo'
import Brasstacks from '../commons/Brasstacks'
import Taskhistory from '../commons/Taskhistory'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent ,isEmpty} from '../../../../utils';
import {findPCNSupplierId,saveBatchVo} from '../../../../services/pcnModifyService'
function CreateStrategy() {
  const BaseinfoRef = useRef(null);
  const ModifyinfoRef = useRef(null);
  const TaskhistoryRef = useRef(null);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [modifytype, setModifytype] = useState('');
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;

    // 获取配置列表项
  useEffect(() => {
    infoPCNdetails()
  }, []);
  // 详情
  async function infoPCNdetails() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await findPCNSupplierId({pcnTitleId:id});
    if (success) {
      setEditData(data)
      setModifytype(data.smPcnChangeTypeCode)
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg) 
  }
  // 保存
  async function handleSave() {
    // let baseinfo,modifyVal,modifyanalysisVal,scienceEnviron;
    // const { basefrom } = BaseinfoRef.current;
    // const {getmodifyform} = ModifyinfoRef.current;
    // const {getmodifyanalyform} = ModifyinfluenceRef.current;
    // const {modifyinfo} = modifyinfluenceFormRef.current;
    // baseinfo = basefrom();
    // if (!baseinfo) {
    //   message.error('基础信息不能为空！');
    //   return false;
    // }
    // modifyVal = getmodifyform()
    // if (!modifyVal) {
    //   message.error('变更信息不能为空！');
    //   return false;
    // }
    // modifyanalysisVal = getmodifyanalyform()
    // if (!modifyanalysisVal) {
    //   message.error('变更影响不能为空！');
    //   return false;
    // }
    // scienceEnviron = modifyinfo()
    // if (!scienceEnviron) {
    //   message.error('影响选择不能为空！');
    //   return false;
    // }
    // let params = {
    //   ...baseinfo,
    //   smPcnDetailVos: modifyVal,
    //   smPcnAnalysisVos: modifyanalysisVal,
    //   ...scienceEnviron
    // }
    // let editparams = {...editData, ...params}
    // console.log(editparams)
    // triggerLoading(true)
    // const {success, message: msg } = await saveBatchVo(editparams)
    // if (success) {
    //     triggerLoading(false)
    //     closeCurrent()
    // } else {
    //     triggerLoading(false)
    //     message.error(msg);
    // }
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
      <div className={styles.wrapper}>
        <div className={styles.bgw}>
            <div className={styles.title}>信息任务</div>
            <div >
            <TaskInfo
                editformData={editData}
                wrappedComponentRef={BaseinfoRef}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>任务实际执行</div>
            <div >
            <Brasstacks
                editformData={editData.smPcnDetailVos}
                wrappedComponentRef={ModifyinfoRef}
                modifytype={modifytype}
            />
            </div>
        </div>
        <div className={styles.bgw}>
            <div className={styles.title}>任务执行历史</div>
            <div >
            <Taskhistory
                editformData={editData.smPcnAnalysisVos}
                wrappedComponentRef={TaskhistoryRef}
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