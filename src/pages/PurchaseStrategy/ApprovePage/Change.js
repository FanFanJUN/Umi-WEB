import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { WorkFlow, ExtTable } from 'suid';
import { Button, Modal, message, Spin, Tabs } from 'antd';
import { psBaseUrl } from '@/utils/commonUrl';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  getPurchaseStrategyChangeVoByFlowId
} from '@/services/strategy';
import { closeCurrent } from '@/utils';
import moment from 'moment';
import styles from './index.less';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
function ApprovePage() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const { id: businessId, taskId, instanceId } = query;
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [checkId, setCheckId] = useState('EMPTY');
  const [reason, setReason] = useState('');
  const detailColumn = [
    {
      title: '变更原因',
      dataIndex: 'reason',
      render() {
        return reason
      }
    },
    {
      title: '操作内容',
      dataIndex: 'operation'
    },
    {
      title: '对象',
      dataIndex: 'target'
    },
    {
      title: '变更字段',
      dataIndex: 'changeField'
    },
    {
      title: '更改前',
      dataIndex: 'changeBefore'
    },
    {
      title: '更改后',
      dataIndex: 'changeLater'
    }
  ];
  async function initFommFieldsValuesAndTableDataSource() {
    const { id: flowId } = query;
    const { data, success, message: msg } = await getPurchaseStrategyChangeVoByFlowId({ flowId });
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
      const { id: modifyId, modifyReason } = modifyHeader;
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
      setCheckId(modifyId)
      setReason(modifyReason)
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return
    }
    message.error(msg)
  }
  function handleComplete(info) {
    const { success, messge: msg } = info;
    if(success) {
      message.success(msg)
      closeCurrent()
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
          采购策略变更
          </span>
        <div>
          <Button className={styles.btn} onClick={handleClose}>关闭</Button>
        </div>
      </div>
      <Approve
        businessId={businessId}
        taskId={taskId}
        instanceId={instanceId}
        submitComplete={handleComplete}
      >
        <Tabs>
          <TabPane tab='策略明细' key='detail'>
            <Spin spinning={loading}>
              <StrategyForm
                wrappedComponentRef={formRef}
                initialValue={initValues}
                type='detail'
              />
              <StrategyTable
                dataSource={dataSource}
                headerForm={formRef}
                type="detail"
              />
            </Spin>
          </TabPane>
          <TabPane tab='变更明细' key='changeDetail'>
            <ExtTable
              store={{
                url: `${psBaseUrl}/PurchaseStrategyModifyHistory/listByPage`,
                params: {
                  Q_EQ_changeHistoryId: checkId
                }
              }}
              showSearch={false}
              columns={detailColumn}
            />
          </TabPane>
        </Tabs>
      </Approve>
    </div>
  )
}

export default ApprovePage;