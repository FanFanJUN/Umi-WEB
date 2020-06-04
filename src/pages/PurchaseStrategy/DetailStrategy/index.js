import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { /*Button, Modal*/ message, Spin } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  findStrategyDetailById
} from '@/services/strategy';
import moment from 'moment';
import styles from './index.less';
function DetailStrategy() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  async function initFommFieldsValuesAndTableDataSource() {
    const { data, success, message: msg } = await findStrategyDetailById(query);
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
        submitList: submitList.map(item => ({ ...item, code: item.userAccount })),
        sendList: sendList.map(item => ({ ...item, code: item.userAccount })),
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

  // function handleBack() {
  //   Modal.confirm({
  //     title: '返回提示',
  //     content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
  //     onOk: () => console.log('ok'),
  //     okText: '确定返回',
  //     cancelText: '取消'
  //   })
  // }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <Spin spinning={loading}>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          采购策略明细
        </span>
        <div>
          {/* <Button className={styles.btn} onClick={handleBack}>返回</Button> */}
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
        initialValue={initValues}
        type='detail'
      />
      <StrategyTable
        dataSource={dataSource}
        type="detail"
      />
    </Spin>
  )
}

export default DetailStrategy;