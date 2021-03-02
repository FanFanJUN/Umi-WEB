import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix, Tabs } from 'antd';
import { router } from 'dva';
import Carrytask from '../commons/Carrytask'
import Missionplan from '../commons/Missionplan'
import classnames from 'classnames';
import styles from '../index.less';
import { closeCurrent, isEmpty } from '../../../../utils';
import { TaskImplementDetailsVo, CarrytaskSaveVo } from '../../../../services/MaterialService'
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
    implementdetails()
  }, []);
  // 详情
  async function implementdetails() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await TaskImplementDetailsVo({ implementId: id });
    if (success) {
      setEditData(data)
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
  }
  // 保存
  async function handleSave() {
    let taskinfo;
    const { carryform } = getCarrytaskRef.current;
    taskinfo = carryform();
    if (!taskinfo) {
      message.error('任务实际执行结果不能为空！');
      return false;
    }
    let SamIdentifyPlanImplementationDetailsVo = {
      implementationId: query.id,
      ...taskinfo
    }
    console.log(JSON.stringify(SamIdentifyPlanImplementationDetailsVo))
    //console.log(params)
    triggerLoading(true)
    const { success, message: msg } = await CarrytaskSaveVo(SamIdentifyPlanImplementationDetailsVo)
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
  function tabClickHandler(params) {
    //setdefaultActiveKey(params)
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.pcntitle}>实物认定任务执行</span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button type='primary' className={styles.btn} onClick={handleSave}>保存并提交</Button>
          </div>
        </div>

      </Affix>

      <div>
        <Tabs className="tabstext" onTabClick={(params) => tabClickHandler(params)} style={{ background: '#fff' }}>
          <TabPane forceRender tab="执行任务" key="1">
            <Carrytask
              editData={editData}
              wrappedComponentRef={getCarrytaskRef}
            />
          </TabPane>
          <TabPane forceRender tab="实物认定计划" key="2">
            <Missionplan
              wrappedComponentRef={getMissionplanRef}
            />
          </TabPane>
        </Tabs>
      </div>
    </Spin>
  )
}

export default CreateStrategy;