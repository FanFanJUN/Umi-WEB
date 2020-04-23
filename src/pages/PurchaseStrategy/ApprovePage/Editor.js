import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { WorkFlow } from 'suid';
import { Button, Modal, message, Spin } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  getPurchaseStrategyVoByFlowId
} from '@/services/strategy';
import { closeCurrent } from '@/utils';
import moment from 'moment';
import styles from './index.less';
const { Approve } = WorkFlow;
function ApproveEditor() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const { id: businessId, taskId, instanceId } = query;
  async function initFommFieldsValuesAndTableDataSource() {
    const { id: flowId } = query;
    const { data, success, message: msg } = await getPurchaseStrategyVoByFlowId({ id: flowId });
    if (success) {
      const {
        id,
        code,
        send,
        state,
        header,
        submit,
        invalid,
        sendList,
        changeVo,
        creatorId,
        detailList,
        submitList,
        attachment,
        changeable,
        tenantCode,
        createdDate,
        lastEditorId,
        approvalState,
        lastEditorName,
        lastEditedDate,
        creatorAccount,
        lastEditorAccount,
        purchaseStrategyEnd,
        purchaseStrategyBegin,
        ...initialValues
      } = data;
      const { setFieldsValue } = formRef.current.form;
      const mixinValues = {
        ...initialValues,
        submitName: submitList.map(item => item.userName),
        submitList: submitList.map(item => item.userAccount),
        sendName: sendList.map(item => item.userName),
        sendList: sendList.map(item => item.userAccount),
        purchaseStrategyDate: [moment(purchaseStrategyBegin), moment(purchaseStrategyEnd)]
      }
      setInitValues({
        attachment
      });
      
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return
    }
    message.error(msg)
  }

  function handleClose() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => closeCurrent(),
      okText: '确定返回',
      cancelText: '取消'
    })
  }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            采购策略审批
          </span>
          <div>
            <Button className={styles.btn} onClick={handleClose}>关闭</Button>
          </div>
        </div>
      <Approve
        businessId={businessId}
        taskId={taskId}
        instanceId={instanceId}
        submitComplete={closeCurrent}
      >
        <Spin spinning={loading}>
          <StrategyForm
            wrappedComponentRef={formRef}
            initialValue={initValues}
            type='editor'
          />
          <StrategyTable
            dataSource={dataSource}
            type="editor"
          />
        </Spin>
      </Approve>
    </div>
  )
}

export default ApproveEditor;