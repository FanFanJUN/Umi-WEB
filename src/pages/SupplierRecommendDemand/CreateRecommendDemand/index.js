/**
 * 实现功能：新增推荐需求
 * 
 */

import { useRef, useState } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Affix, Spin, message } from 'antd';
import RecommendForm from '../forms/RecommendForm';
import { saveSupplierRecommendDemand } from '../../../services/recommend';
import { closeCurrent } from '../../../utils';
export default () => {
  const [loading, toggleLoading] = useState(false);
  const formRef = useRef(null);
  async function handleSave() {
    const vs = await formRef.current.getAllFormatValues()
    toggleLoading(true)
    const { success, message: msg } = await saveSupplierRecommendDemand(vs);
    toggleLoading(false)
    if(success) {
      closeCurrent()
      return
    }
    message.error(msg)
  }
  function back() {
    closeCurrent()
  }
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>供应商推荐需求</span>
          <div>
            <Button onClick={back} className={styles.btn}>返回</Button>
            <Button onClick={handleSave} className={styles.btn}>保存</Button>
          </div>
        </div>
      </Affix>
      <RecommendForm wrappedComponentRef={formRef} />
    </Spin>
  )
}