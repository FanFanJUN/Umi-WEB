/**
 * 实现功能：新增推荐需求
 * 
 */

import { useRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { Spin, message, Skeleton } from 'antd';
import RecommendForm from '../forms/RecommendForm';
import { saveSupplierRecommendDemand, querySupplierRecommendDemand } from '../../../services/recommend';
import { WorkFlow } from 'suid';
import { closeCurrent, checkToken } from '../../../utils';
const { Approve } = WorkFlow;
export default () => {
  const [loading, toggleLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const { id = null, taskId = null, instanceId = null } = query;
  async function beforeSubmit() {
    const vs = await formRef.current.getAllFormatValues()
    toggleLoading(true)
    const { success, message: msg } = await saveSupplierRecommendDemand({ ...vs, id });
    toggleLoading(false)
    return new Promise(resolve => {
      if (success) {
        resolve({
          success,
          message: msg,
          data: {
            businessKey: id
          }
        });
        return
      }
      resolve({
        success,
        message: msg
      })
    })
    // message.error(msg)
  }
  function handleComplete(info) {
    const { success, message: msg } = info;
    if (success) {
      closeCurrent();
      message.success(msg);
      return;
    }
    message.error(msg);
  }
  useEffect(() => {
    async function initalDetailValues() {
      await toggleLoading(true)
      const { success, data, message: msg } = await querySupplierRecommendDemand({
        supplierRecommendDemandId: id
      })
      await toggleLoading(false)
      if (success) {
        const {
          selfEvlSystem,
          supplierRecommendDemandLines,
          supplierRecommendDemandStatusRemark,
          createdDate,
          docNumber,
          tenantCode,
          orgPath,
          ...fields
        } = data;
        formRef.current.setAllFormatValues({ fields, treeData: selfEvlSystem })
        formRef.current.setRecommendCompany(supplierRecommendDemandLines)
      }
    }
    if (isReady) {
      initalDetailValues()
    }
  }, [isReady])

  useEffect(() => {
    checkToken(query, setIsReady);
  }, []);
  return isReady ? (
    <Approve
      beforeSubmit={beforeSubmit}
      submitComplete={handleComplete}
      flowMapUrl="flow-web/design/showLook"
      businessId={id}
      instanceId={instanceId}
      taskId={taskId}
    >
      <Spin spinning={loading}>
        <RecommendForm wrappedComponentRef={formRef} type='editor' />
      </Spin>
    </Approve>
  ) : (
      <Skeleton loading={!isReady} active></Skeleton>
    )
}