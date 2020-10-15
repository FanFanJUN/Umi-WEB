/**
 * 实现功能： 供应商评价项目-人工评价
 * @author hezhi
 * @date 2020-10-15
 */
import { useRef } from 'react';
import styles from './index.less';
import { Affix, Button, Tabs } from 'antd';
import CommonForm from '../CommonForm';
const { TabPane } = Tabs;

function Evaluate() {
  const formRef = useRef(null);
  function handleSubmit() { }
  function renderTabBar(props, DefaultTabBar) {
    return (
      <Affix offsetTop={56}>
        <DefaultTabBar {...props} style={{ background: '#fff' }} />
      </Affix>
    )
  }
  return (
    <div>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>人工评价</span>
            <div className={styles.fec}>
              <Button className={styles.btn}>返回</Button>
              <Button className={styles.btn}>保存</Button>
              <Button className={styles.btn} type='primary' onClick={handleSubmit}>提交</Button>
            </div>
          </div>
        </div>
      </Affix>
      <Tabs renderTabBar={renderTabBar}>
        <TabPane tab='基本信息' key='base'>
          <CommonForm wrappedComponentRef={formRef} type='detail'/>
        </TabPane>
        <TabPane tab='评价指标' key='target'></TabPane>
      </Tabs>
    </div>
  )
}
export default Evaluate;