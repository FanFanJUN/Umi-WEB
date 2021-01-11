import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { router } from 'dva';
import { message, Tabs, Spin, Affix } from 'antd';
import ImportBaseInfo from '../commons/ImportBaseInfo'
import ImportData from '../commons/ImportData'
import { closeCurrent, checkToken } from '../../../utils/index';
import { RecommendationList, saveBatchVo } from '../../../services/SupplierBatchExtend'
import styles from '../index.less';
function SupplierApproveInfo() {
  const BaseinfoRef = useRef(null);
  const DatainfoRef = useRef(null);
  const { query } = router.useLocation();
  const { id, taskId, instanceId } = query;
  const [loading, triggerLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    async function init() {
      await checkToken(query, setIsReady);
      initsupplierDetai();
    }
    init()
  }, []);
  // 无账号详情
  async function initsupplierDetai() {
    triggerLoading(true)
    const { data, success, message: msg } = await RecommendationList({ id: query.id })
    if (success) {
      triggerLoading(false)
      setDataSource(data)
    } else {
      message.error(msg);
      triggerLoading(false)
    }
  }
  // 保存
  const handleSave = async (approved) => {
    const { getImportBaseInfo } = BaseinfoRef.current; // 基本信息
    const { getImportDate } = DatainfoRef.current; // 供应商
    let ImportBaseInfo = getImportBaseInfo();
    let ImportDate = getImportDate();
    if (!ImportBaseInfo) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    let params = { ...dataSource, ...ImportBaseInfo, ...ImportDate }
    console.log(params)
    const { success, message: msg } = await saveBatchVo(params)
    triggerLoading(false)
    return new Promise((resolve, reject) => {
      if (success) {
        resolve({
          success,
          message: msg
        })
        message.success(msg)
        return;
      }
      reject(false)
      message.error(msg)
    })
  }

  function handleSubmitComplete(res) {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  }
  return (
    <>
      {isReady ? (<WorkFlow.Approve
        businessId={id}
        taskId={taskId}
        instanceId={instanceId}
        flowMapUrl="flow-web/design/showLook"
        submitComplete={handleSubmitComplete}
        beforeSubmit={handleSave}
      >
        <Spin spinning={loading} tip='处理中...'>
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>基本信息</div>
              <div >
                <ImportBaseInfo
                  wrappedComponentRef={BaseinfoRef}
                  dataSource={dataSource}
                />
              </div>
            </div>
            <div className={styles.bgw}>
              <div className={styles.title}>扩展采购会计视图</div>
              <div >
                <ImportData
                  editData={dataSource.supplierFinanceViews}
                  wrappedComponentRef={DatainfoRef}
                  isEdit={true}
                />
              </div>
            </div>
          </div>
        </Spin>
      </WorkFlow.Approve>) : null}
    </>

  )
}

export default SupplierApproveInfo
