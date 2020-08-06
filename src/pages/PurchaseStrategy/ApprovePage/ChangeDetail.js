import React, { useState, useEffect, useRef } from 'react';
import { router } from 'dva';
import { WorkFlow } from 'suid';
import { message, Spin, Form, Affix } from 'antd';
import ChangeForm from '../DetailLayout';
import StrategyTable from '../StrategyTable';
// import { ComboAttachment } from '@/components';
import classnames from 'classnames';
import {
  // changeLineInvalidState,
  // changeEditorAndApprove,
  // strategyTableCreateLine,
  // saveStrategyTableImportData,
  // strategyTableLineRelevanceDocment,
  getPurchaseStrategyChangeVoByFlowId,
} from '@/services/strategy';
import moment from 'moment';
// import { openNewTab, getUUID, closeCurrent } from '@/utils';
import styles from './index.less';
import { checkToken } from '../../../utils';
// const { Approve } = WorkFlow;
// const formLayout = {
//   labelCol: {
//     span: 8,
//   },
//   wrapperCol: {
//     span: 16,
//   },
// };
function ChangeStrategy({ form }) {
  const { getFieldValue } = form;
  const [isReady, setIsReady] = useState(false);
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [reasonAttach, setReasonAttach] = useState('');
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [currentId, setCurrentId] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  // const files = getFieldValue('changeFiles') || [];
  async function initFommFieldsValuesAndTableDataSource() {
    const { id: flowId } = query;
    const { data, success, message: msg } = await getPurchaseStrategyChangeVoByFlowId({ flowId });
    if (success) {
      const {
        id,
        code,
        send,
        state,
        flowId,
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
        modifyHeader,
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
      const { form: childrenForm } = formRef.current;
      // const { setFieldsValue } = childrenForm;
      const { setFieldsValue: modifySetFieldsValue } = form;

      const mixinValues = {
        ...initialValues,
        submitName: submitList.map(item => item.userName),
        submitList: submitList.map(item => item.userAccount),
        sendName: sendList.map(item => item.userName),
        sendList: sendList.map(item => item.userAccount),
        purchaseStrategyDateBegin: moment(purchaseStrategyBegin),
        purchaseStrategyDateEnd: moment(purchaseStrategyEnd)
      };
      const { modifyReason, attachment: reasonAttach } = modifyHeader;

      setReasonAttach(reasonAttach);
      setInitValues({
        attachment,
        ...mixinValues,
      });
      const addIdList = detailList.map(item => ({
        ...item,
        localId: item.id,
      }));
      modifySetFieldsValue({
        reason: modifyReason,
      });
      // setFieldsValue(mixinValues);
      setDataSource(addIdList);
      setCurrentId(id);
      setCurrentCode(code);
      setIsInvalid(invalid ? '（作废）' : '');
      triggerLoading(false);
      return;
    }
    triggerLoading(false);
    message.error(msg);
  }

  useEffect(() => {
    checkToken(query);
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
          <span className={styles.title}>
            变更采购策略：{currentCode} {isInvalid}
          </span>
          <div></div>
        </div>
      </Affix>
      <Spin spinning={loading} tip="处理中...">
        <ChangeForm wrappedComponentRef={formRef} initialValue={initValues} type="detail" />
        <StrategyTable dataSource={dataSource} type="detail" loading={loading} />
      </Spin>
    </div>
  );
}

export default Form.create()(ChangeStrategy);