import { useRef, useEffect, useState } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import { Affix, Button, message, Spin } from 'antd';
import { WorkFlow } from 'suid';
import classnames from 'classnames';
import { saveViewModify, queryViewModifyDetail } from '../../../services/supplier';
import { router } from 'dva';
import { closeCurrent } from '../../../utils';
const { Approve } = WorkFlow;
export default function () {
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const { id, taskId, instanceId } = query;
  const [loading, toggleLoading] = useState(false);
  const handleSave = async () => {
    const { getAllParams } = formRef.current;
    const { headerFields, dataSource } = await getAllParams();
    return new Promise((resolve, reject) => {
      toggleLoading(true)
      const { success, message: msg } = await saveViewModify({
        ...headerFields,
        id,
        supplierFinanceViewModifyLines: dataSource
      })
      toggleLoading(false)
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
  const handleBack = () => {
    closeCurrent()
  }
  function handleSubmitComplete(res) {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
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
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>供应商采购会计视图变更编辑</span>
          <div>
          </div>
        </div>
      </Affix>
      <Spin spinning={loading}>
        <Approve
          businessId={id}
          taskId={taskId}
          instanceId={instanceId}
          flowMapUrl="flow-web/design/showLook"
          submitComplete={handleSubmitComplete}
          beforeSubmit={handleSave}
        >
          <CommonForm wrappedComponentRef={formRef} type='editor' />
        </Approve>
      </Spin>
    </div>
  )
}