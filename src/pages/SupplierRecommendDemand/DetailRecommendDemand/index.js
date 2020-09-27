/**
 * 实现功能：新增推荐需求
 * 
 */

import { useRef, useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { router } from 'dva';
import { Button, Affix, Spin, message } from 'antd';
import RecommendForm from '../forms/RecommendForm';
import { saveSupplierRecommendDemand, querySupplierRecommendDemand } from '../../../services/recommend';
import { closeCurrent } from '../../../utils';
export default ({
  offsetTop = 0,
  fixed = true
}) => {
  const [loading, toggleLoading] = useState(false);
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const { id } = query;
  async function handleSave() {
    const vs = await formRef.current.getAllFormatValues()
    toggleLoading(true)
    const { success, message: msg } = await saveSupplierRecommendDemand({ ...vs, id });
    toggleLoading(false)
    if (success) {
      // closeCurrent()
      return
    }
    message.error(msg)
  }
  function back() {
    closeCurrent()
  }
  useEffect(() => {
    async function initalDetailValues() {
      toggleLoading(true)
      const { success, data, message: msg } = await querySupplierRecommendDemand({
        supplierRecommendDemandId: id
      })
      toggleLoading(false)
      if (success) {
        const {
          selfEvlSystem,
          supplierRecommendDemandLines,
          supplierRecommendDemandStatus,
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
    initalDetailValues()
  }, [])
  return (
    <Spin spinning={loading}>
      {
        fixed ?
          <Affix offsetTop={offsetTop}>
            <div className={classnames(styles.fbc, styles.affixHeader)}>
              <span>供应商推荐需求</span>
              <div>
              </div>
            </div>
          </Affix> :
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>供应商推荐需求</span>
            <div>
            </div>
          </div>
      }
      <RecommendForm wrappedComponentRef={formRef} type='detail' />
    </Spin>
  )
}