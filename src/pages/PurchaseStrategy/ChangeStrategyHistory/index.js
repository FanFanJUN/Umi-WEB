import React, { useState } from 'react';
import { ExtTable } from 'suid';
import { router } from 'dva';
import { psBaseUrl } from '@/utils/commonUrl';
import { Button } from 'antd';
function ChangeStrategyHistory() {
  // const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();
  const LEFT = (
    <>
      <Button type='primary'>审核历史</Button>
    </>
  )
  const tableProps = {
    store: {
      url: `${psBaseUrl}/purchaseStrategyModifyHeader/listByPage`,
      params: {
        Q_EQ_id: query.id ? query.id : ''
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
    toolbar: {
      left: LEFT
    }
  }
  return (
    <div>
      <ExtTable {...tableProps}/>
    </div>
  )
}

export default ChangeStrategyHistory;