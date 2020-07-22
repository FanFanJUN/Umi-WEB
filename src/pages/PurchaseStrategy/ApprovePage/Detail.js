import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { /*Button, Modal*/ message, Spin, Affix } from 'antd';
import StrategyForm from '../DetailLayout';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import { getPurchaseStrategyVoByFlowId } from '@/services/strategy';
import moment from 'moment';
import styles from './index.less';
import { checkToken } from '../../../utils';
function DetailStrategy() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [loading, triggerLoading] = useState(true);
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
        purchaseStrategyDateBegin: moment(purchaseStrategyBegin),
        purchaseStrategyDateEnd: moment(purchaseStrategyEnd)
      };
      setInitValues({
        attachment,
        ...mixinValues,
      });

      // setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return;
    }
    message.error(msg);
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
    <Spin spinning={loading}>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>采购策略明细</span>
          <div>{/* <Button className={styles.btn} onClick={handleBack}>返回</Button> */}</div>
        </div>
      </Affix>
      <StrategyForm wrappedComponentRef={formRef} initialValue={initValues} type="detail" />
      <StrategyTable dataSource={dataSource} type="detail" />
    </Spin>
  );
}

export default DetailStrategy;
