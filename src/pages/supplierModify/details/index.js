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

  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  // 变更列表详情
  async function initsupplierDetai() {
    triggerLoading(true);
    const { data, success, message: msg } = await findByRequestIdForModify({ id: query.id });
    if (success) {
      setInitialValue(data.supplierApplyVo)
      setEditData(data.supplierApplyVo)
      triggerLoading(false);
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
        <Tabs>
            <TabPane forceRender tab="变更列表" key="1">
              <ModifyHistoryDetail
                editData={editData}
                lineDataSource={lineDataSource}
                />
            </TabPane>
            <TabPane forceRender tab="基本信息" key="2">
                <ModifInfo />
            </TabPane>
          </Tabs>
      </div>
    </Spin>
  )
}

export default CreateStrategy;