import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix,Tabs } from 'antd';
import { router } from 'dva';
import classnames from 'classnames';
import {
  findSupplierconfigureId,
  TemporarySupplierRegister,
  SupplierconfigureDetail,
  saveSupplierRegister,
  SaveSupplierconfigureService
} from '@/services/supplierRegister';
import {
  findByRequestIdForModify,
  findSupplierModifyHistroyList
} from '@/services/SupplierModifyService'
import ModifyHistoryDetail from '../commons/ModifyHistoryDetail'
import ModifInfo from './ModifyInfo'
import styles from '../index.less';
import { closeCurrent } from '../../../utils';
const TabPane = Tabs.TabPane;
function CreateStrategy() {


  const [modifydata, setModifydata] = useState([]);
  const [accountinfo, setaccountinfo] = useState([]);
  const [businesshide, setbusinesshide] = useState([]);
  const [initialValue, setInitialValue] = useState({});

  const [editData, setEditData] = useState([]);
  const [lineDataSource, setlineDataSource] = useState({});
  const [loading, triggerLoading] = useState(false);
  const [wholeData, setwholeData] = useState([]);
  const [configuredata, setconfigurelist] = useState([]);
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  // 变更列表详情
  async function initsupplierDetai() {
    triggerLoading(true);
    const { data, success, message: msg } = await findByRequestIdForModify({ id: query.id });
    if (success) {
        let suppliertype = data.supplierApplyVo.supplierInfoVo.supplierVo.supplierCategory.id
        setInitialValue(data.supplierApplyVo.supplierInfoVo)
        setEditData(data.supplierApplyVo.supplierInfoVo)
        //setReasonchange(data.supplierApplyVo)
        setwholeData(data.supplierApplyVo)
      triggerLoading(false);
      initConfigurationTable(suppliertype)
    }else {
      triggerLoading(false);
      message.error(msg)
    }
    
  }
  // 类型配置表
  async function initConfigurationTable(typeId) {
    triggerLoading(true);
    let params = {catgroyid:typeId,property:1};
    const { data, success, message: msg } = await SaveSupplierconfigureService(params);
      if (success) {
        let datalist  = data.configBodyVos;
        triggerLoading(false);
        setconfigurelist(datalist)
      }else {
        triggerLoading(false);
        message.error(msg)
      }
  }
  // 获取配置列表项
  useEffect(() => {
    initsupplierDetai(); // 供应商详情
  }, []);
  // 返回
  function handleBack() {
    closeCurrent()
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            供应商变更明细
            </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        <Tabs className={styles.tabcolor}>
            <TabPane forceRender tab="变更列表" key="1">
              <ModifyHistoryDetail
                editData={wholeData}
                lineDataSource={lineDataSource}
                />
            </TabPane>
            <TabPane forceRender tab="基本信息" key="2">
                <ModifInfo 
                  wholeData={wholeData}
                  configuredata={configuredata}
                />
            </TabPane>
          </Tabs>
      </div>
    </Spin>
  )
}

export default CreateStrategy;