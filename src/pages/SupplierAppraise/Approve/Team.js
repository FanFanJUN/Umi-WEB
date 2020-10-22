import { useRef } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import CommonTable from '../CommonTable';
import { Button, Affix, Tabs } from 'antd';
import { closeCurrent } from '../../../utils';
const { TabPane } = Tabs;
function TeamApprove() {
  const formRef = useRef(null);
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
    }
  ]
  function renderTabBar(props, DefaultTabBar) {
    return (
      <Affix offsetTop={62}>
        <DefaultTabBar {...props} style={{ background: '#fff' }} />
      </Affix>
    )
  }
  return (
    <div>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>评价结果</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
            </div>
          </div>
        </div>
      </Affix>
      <Tabs renderTabBar={renderTabBar} animated={false}>
        <TabPane tab='评价项目' key='base-info'>
          <CommonForm wrappedComponentRef={formRef} type='detail' />
        </TabPane>
        <TabPane tab='采购小组确认' key='evaluate-result'>
          <CommonTable columns={tableColumns} type='team' />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default TeamApprove