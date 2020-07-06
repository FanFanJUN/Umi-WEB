import React, { createRef, useState, useEffect, useRef } from 'react';
import { router } from 'dva';
import { WorkFlow, ExtTable } from 'suid';
import { Button, Modal, message, Spin, Tabs, Skeleton } from 'antd';
import { psBaseUrl } from '@/utils/commonUrl';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import { getPurchaseStrategyChangeVoByFlowId } from '@/services/strategy';
import { Upload } from '../../../components';
import { closeCurrent } from '@/utils';
import moment from 'moment';
import styles from './index.less';
import { checkToken } from '../../../utils';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
function ApprovePage() {
  const formRef = createRef();
  const tableRef = useRef(null);
  const { query } = router.useLocation();
  const { id: businessId, taskId, instanceId } = query;
  const [dataSource, setDataSource] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [checkId, setCheckId] = useState('EMPTY');
  const [reason, setReason] = useState('');
  const [headerAttachment, setAttachment] = useState('');
  const store = {
    url: `${psBaseUrl}/PurchaseStrategyModifyHistory/listByPage`,
    params: {
      Q_EQ_changeHistoryId: checkId,
    },
  };
  const detailColumn = [
    {
      title: '操作内容',
      dataIndex: 'operation',
    },
    {
      title: '对象',
      dataIndex: 'target',
    },
    {
      title: '变更字段',
      dataIndex: 'changeField',
    },
    {
      title: '更改前',
      dataIndex: 'changeBefore',
    },
    {
      title: '更改后',
      dataIndex: 'changeLater',
    },
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
        changeVo,
        creatorId,
        detailList,
        attachment,
        submitList = [],
        sendList = [],
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
      const { id: modifyId, modifyReason, attachment: attachmentHeader } = modifyHeader;
      const { setFieldsValue } = formRef.current.form;
      const mixinValues = {
        ...initialValues,
        submitList: submitList.map(item => ({ ...item, code: item.userAccount })),
        sendList: sendList.map(item => ({ ...item, code: item.userAccount })),
        purchaseStrategyDate: [moment(purchaseStrategyBegin), moment(purchaseStrategyEnd)],
      };
      setInitValues({
        attachment,
      });
      setCheckId(modifyId);
      setReason(modifyReason);
      setAttachment(attachmentHeader);
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      tableRef.current.remoteDataRefresh();
      return;
    }
    message.error(msg);
  }
  function handleComplete(info) {
    const { success, messge: msg } = info;
    if (success) {
      message.success(msg);
      closeCurrent();
      return;
    }
    message.error(msg);
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
    checkToken(query, setIsReady)
  }, []);
  useEffect(() => {
    if (isReady) {
      initFommFieldsValuesAndTableDataSource();
    }
  }, [isReady])
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>采购策略变更</span>
        <div>
          <Button className={styles.btn} onClick={handleClose}>
            关闭
          </Button>
        </div>
      </div>
      {
        isReady ? <Approve
          businessId={businessId}
          taskId={taskId}
          instanceId={instanceId}
          submitComplete={handleComplete}
          flowMapUrl="flow-web/design/showLook"
        >
          <Tabs>
            <TabPane tab="变更明细" key="changeDetail" forceRender>
              <div>
                <div className={styles.lineTitle}>变更信息</div>
                <div
                  style={{
                    padding: '0 24px',
                    marginBottom: 12,
                  }}
                >
                  <div>变更原因：{reason}</div>
                  <div>
                    {!!headerAttachment ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          padding: '0 12px',
                        }}
                      >
                        <span>附件：</span>
                        <Upload entityId={headerAttachment} type="show" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div>
                <div className={styles.lineTitle}>变更明细</div>
                <div
                  style={{
                    padding: '0 24px',
                    marginBottom: 12,
                  }}
                >
                  <ExtTable
                    store={store}
                    allowCancelSelect
                    showSearch={false}
                    columns={detailColumn}
                    ref={tableRef}
                    remotePaging
                  />
                </div>
              </div>
            </TabPane>
            <TabPane tab="策略明细" key="detail" forceRender>
              <Spin spinning={loading}>
                <StrategyForm wrappedComponentRef={formRef} initialValue={initValues} type="detail" />
                <StrategyTable dataSource={dataSource} headerForm={formRef} type="detail" />
              </Spin>
            </TabPane>
          </Tabs>
        </Approve> : <Skeleton loading={!isReady} active></Skeleton>
      }
    </div>
  );
}

export default ApprovePage;
