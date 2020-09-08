/**
 * 实现功能：新增推荐需求
 * 
 */

import { useRef } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { Button, Affix } from 'antd';
import RecommendForm from '../forms/RecommendForm';
import { saveSupplierRecommendDemand } from '../../../services/recommend';
export default () => {
  const formRef = useRef(null);
  async function handleSave() {
    const vs = await formRef.current.getAllFormatValues()
    const { success, message: msg } = await saveSupplierRecommendDemand(vs);
    console.log(success)
  }
  return (
    <div>
      <Affix>
        <div className={classnames(styles.fbc, styles.affixHeader)}>
          <span>供应商推荐需求</span>
          <div>
            <Button onClick={handleSave} className={styles.btn}>返回</Button>
            <Button onClick={handleSave} className={styles.btn}>保存</Button>
          </div>
        </div>
      </Affix>
      <RecommendForm wrappedComponentRef={formRef} />
    </div>
  )
}