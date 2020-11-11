import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix,Tabs } from 'antd';
import { router } from 'dva';
import Carrytask from '../commons/Carrytask'
import Missionplan from '../commons/Missionplan'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent ,isEmpty} from '../../../../utils';
import {findPCNSupplierId,saveBatchVo} from '../../../../services/pcnModifyService'
const TabPane = Tabs.TabPane;
function CreateStrategy() {
  const getCarrytaskRef = useRef(null);
  const getMissionplanRef = useRef(null);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [modifytype, setModifytype] = useState('');
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;

    // 获取配置列表项
  useEffect(() => {
    //infoPCNdetails()
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
  function tabClickHandler(params) {
    //setdefaultActiveKey(params)
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>实物认定任务执行</span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)} style={{ background: '#fff' }}>
            <TabPane forceRender tab="执行任务" key="1">
                <Carrytask
                    editData={editData}
                    wrappedComponentRef={getCarrytaskRef}
                />
            </TabPane>
            <TabPane forceRender tab="实物认定计划" key="2">
                <Missionplan
                    editData={editData} 
                    wrappedComponentRef={getMissionplanRef}
                />
            </TabPane>
        </Tabs>
      </div>
    </Spin>
  )
}

export default CreateStrategy;