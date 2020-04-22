import React, { useState } from 'react';
import { ExtTable } from 'suid';
import { router } from 'dva';
import { psBaseUrl } from '@/utils/commonUrl';
import { Button } from 'antd';
import classnames from 'classnames';
import styles from './index.less';
function ChangeStrategyHistory() {
  // const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();
  const LEFT = (
    <>
      <Button type='primary' className={styles.btn}>审核历史</Button>
      <Button className={styles.btn}>提交审核</Button>
      <Button>删除</Button>
    </>
  )
  const tableProps = {
    store: {
      url: `${psBaseUrl}/purchaseStrategyModifyHeader/listByPage`,
      params: {
        Q_EQ_purchaseStrategyCode: query.code ? query.code : ''
      }
    },
    columns: [
      {
        title: '序号',
        dataIndex: ''
      },
      {
        title: '变更单号',
        dataIndex: ''
      },
      {
        title: '流程状态',
        dataIndex: ''
      },
      {
        title: '变更原因',
        dataIndex: ''
      },
      {
        title: '附件',
        dataIndex: ''
      },
      {
        title: '变更人',
        dataIndex: ''
      },
      {
        title: '变更时间',
        dataIndex: ''
      },
      {
        title: '变更明细',
        dataIndex: ''
      }
    ],
    toolBar: {
      left: LEFT
    }
  }
  function handleClose() {}
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          采购策略变更历史
          </span>
        <div>
          <Button className={styles.btn} onClick={handleClose}>关闭</Button>
        </div>
      </div>
      <ExtTable {...tableProps} />
    </div>
  )
}

export default ChangeStrategyHistory;