import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { WorkFlow } from 'suid';
import { Button, Modal, message, Spin, Skeleton, Affix } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import { getPurchaseStrategyVoByFlowId } from '@/services/strategy';
import { closeCurrent } from '@/utils';
import moment from 'moment';
import styles from './index.less';
import { checkToken } from '../../../utils';
const { Approve } = WorkFlow;
function ApprovePage() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [isReady, setIsReady] = useState(false);
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
        sendList = [],
        changeVo,
        creatorId,
        detailList,
        submitList = [],
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
        submitList: submitList.map(item => ({ ...item, code: item.userAccount })),
        sendList: sendList.map(item => ({ ...item, code: item.userAccount })),
        purchaseStrategyDateBegin: moment(purchaseStrategyBegin),
        purchaseStrategyDateEnd: moment(purchaseStrategyEnd)
      };
      setInitValues({
        attachment,
      });
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return;
    }
    message.error(msg);
  }
  function handleSubmitComplete(res) {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  }
  function handleClose() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => closeCurrent(),
      okText: '确定返回',
      cancelText: '取消',
    });
  }
  useEffect(() => {
    checkToken(query, setIsReady);
  }, []);
  useEffect(() => {
    if (isReady) {
      initFommFieldsValuesAndTableDataSource();
    }
  }, [isReady])
  return (
    <div>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>采购策略审批</span>
          <div>
            <Button className={styles.btn} onClick={handleClose}>
              关闭
          </Button>
          </div>
        </div>
      </Affix>
      {isReady ? <Approve
        businessId={businessId}
        taskId={taskId}
        instanceId={instanceId}
        flowMapUrl="flow-web/design/showLook"
        submitComplete={handleSubmitComplete}
      >
        <Spin spinning={loading}>
          <StrategyForm wrappedComponentRef={formRef} initialValue={initValues} type="detail" />
          <StrategyTable dataSource={dataSource} type="detail" />
        </Spin>
      </Approve> : <Skeleton loading={!isReady} active></Skeleton>}
    </div>
  );
}

export default ApprovePage;
