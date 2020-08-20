import { useEffect, useState } from 'react';
import styles from './index.less';
import CommonDetail, { ChangeInfo } from '../CommonDetail';
import { Affix, Button, message, Spin, Tabs } from 'antd';
import { WorkFlow } from 'suid';
import classnames from 'classnames';
import { queryViewModifyDetail } from '../../../services/supplier';
import { router } from 'dva';
import { closeCurrent } from '../../../utils';
const { TabPane } = Tabs;
const { Approve } = WorkFlow;
export default function () {
  const { query } = router.useLocation();
  const { id, taskId, instanceId } = query;
  const [loading, toggleLoading] = useState(false);
  const [headerFields, setHeaderFields] = useState({});
  const [lineDataSource, setLineDataSource] = useState([]);
  const [changeDataSource, setChangeDataSource] = useState([]);
  const handleBack = () => {
    closeCurrent()
  }
  function handleSubmitComplete(res) {
    const { success } = res;
    if (success) {
      closeCurrent();
    }
  }
  useEffect(() => {
    async function initialDetailValues() {
      toggleLoading(true)
      const { success, data, message: msg } = await queryViewModifyDetail({
        supplierFinanceViewModifyId: id
      })
      toggleLoading(false)
      if (success) {
        const {
          id,
          supplierFinanceViewModifyLines,
          tenantCode,
          docNumber,
          workCaption,
          flowStatus,
          flowStatusRemark,
          supplierFinanceViewModifyHistories,
          businessCode,
          name,
          priority,
          ...headerFields
        } = data;
        setHeaderFields(headerFields);
        setLineDataSource(supplierFinanceViewModifyLines)
        setChangeDataSource(supplierFinanceViewModifyHistories)
        return
      }
      message.error(msg)
    }
    initialDetailValues()
  }, [])
  return (
    <div>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>采购会计视图变更单审批</span>
          <div>
          </div>
        </div>
      </Affix>
      <Spin spinning={loading}>
        <Approve
          businessId={id}
          taskId={taskId}
          instanceId={instanceId}
          flowMapUrl="flow-web/design/showLook"
          submitComplete={handleSubmitComplete}
        >
          <Tabs>
            <TabPane tab='变更列表' key='changeList'>
              <ChangeInfo lineDataSource={changeDataSource} headerFields={headerFields} />
            </TabPane>
            <TabPane tab='基本信息' key='baseDetail'>
              <CommonDetail lineDataSource={lineDataSource} headerFields={headerFields} />
            </TabPane>
          </Tabs>
        </Approve>
      </Spin>
    </div>
  )
}