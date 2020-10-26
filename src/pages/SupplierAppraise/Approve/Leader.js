import { useRef, useEffect } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import CommonTable from '../CommonTable';
import {  Affix, Tabs, Skeleton } from 'antd';
import { WorkFlow } from 'suid';
import { closeCurrent, checkToken } from '../../../utils';
import { useLocation } from 'dva/router';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
function LeaderApprove() {
  const formRef = useRef(null);
  const { query } = useLocation();
  const [isReady, setIsReady] = useState(false);
  const tableColumns = [
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂代码',
      dataIndex: 'originCode'
    },
    {
      title: '原厂名称',
      dataIndex: 'originName'
    },
    {
      title: '物料分类代码',
      dataIndex: 'materialCategoryCode'
    },
    {
      title: '物料分类名称',
      dataIndex: 'materialCategoryName'
    },
    {
      title: '综合得分',
      dataIndex: 'totalScore'
    },
    {
      title: '等级',
      dataIndex: 'grade'
    },
    {
      title: '处理建议',
      dataIndex: 'dealAdviceName'
    },
    {
      title: '采购小组建议',
      dataIndex: 'purchaseTeamAdvice'
    },
    {
      title: '采购份额调整意见',
      dataIndex: 'shareAdjustOpinion'
    },
    {
      title: '新产品应用意见',
      dataIndex: 'newProductOpinion'
    },
    {
      title: '领导决策',
      dataIndex: 'leaderAdviceName'
    }
  ]
  function renderTabBar(props, DefaultTabBar) {
    return (
      <Affix offsetTop={62}>
        <DefaultTabBar {...props} style={{ background: '#fff' }} />
      </Affix>
    )
  }
  useEffect(() => {
    checkToken(query, setIsReady)
  }, [])
  return (
    <Approve
      businessId={query?.id}
      taskId={query?.taskId}
      instanceId={query?.instanceId}
      flowMapUrl="flow-web/design/showLook"
      submitComplete={closeCurrent}
    >
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>评价结果</span>
            <div className={styles.fec}>
            </div>
          </div>
        </div>
      </Affix>
      <Tabs renderTabBar={renderTabBar} animated={false}>
        <TabPane tab='评价项目' key='base-info'>
          {
            isReady ? <CommonForm wrappedComponentRef={formRef} type='detail' /> : <Skeleton loading={true} />
          }
        </TabPane>
        <TabPane tab='评价结果' key='evaluate-result'>
          {
            isReady ?
              <CommonTable columns={tableColumns} type='leader' /> : <Skeleton loading={true} />
          }
        </TabPane>
      </Tabs>
    </Approve>
  )
}

export default LeaderApprove