import { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import { Affix, Button, message, Spin } from 'antd';
import classnames from 'classnames';
import { saveViewModify, queryViewModifyDetail } from '../../../services/supplier';
import { router } from 'dva';
import { closeCurrent } from '../../../utils';
export default function () {
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const { id } = query;
  const [loading, toggleLoading] = useState(false);
  const handleSave = async () => {
    const { getAllParams } = formRef.current;
    const { headerFields, dataSource } = await getAllParams();
    toggleLoading(true)
    const { success, message: msg } = await saveViewModify({
      ...headerFields,
      id,
      supplierFinanceViewModifyLines: dataSource
    })
    toggleLoading(false)
    if (success) {
      closeCurrent()
      return
    }
    message.error(msg)
  }
  const handleBack = () => {
    closeCurrent()
  }
  useEffect(() => {
    async function initialDetailValues() {
      toggleLoading(true)
      const { success, data, message: msg } = await queryViewModifyDetail({
        supplierFinanceViewModifyId: id
      })
      toggleLoading(false)
      if (success) {
        const {
          id,
          name,
          orgId,
          priority,
          docNumber,
          flowStatus,
          tenantCode,
          workCaption,
          businessCode,
          flowStatusRemark,
          supplierFinanceViewModifyLines,
          supplierFinanceViewModifyHistories,
          ...headerFields
        } = data;
        const { setLineDataSource, setHeaderFields } = formRef.current;
        setHeaderFields(headerFields);
        setLineDataSource(supplierFinanceViewModifyLines)
        return
      }
      message.error(msg)
    }
    initialDetailValues()
  }, [])
  return (
    <div>
      <Spin spinning={loading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>编辑采购会计视图变更单</span>
            <div>
              <Button className={styles.btn} onClick={handleBack}>返回</Button>
              <Button className={styles.btn} type='primary' onClick={handleSave}>保存</Button>
            </div>
          </div>
        </Affix>
        <CommonForm wrappedComponentRef={formRef} type='editor' />
      </Spin>
    </div>
  )
}