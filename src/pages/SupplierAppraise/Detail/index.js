import { useRef } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import { Button, Affix } from 'antd';
import { closeCurrent } from '../../../utils';
function Detail() {
  const formRef = useRef(null);
  return (
    <div>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>评价项目详情</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
            </div>
          </div>
        </div>
      </Affix>
      <CommonForm wrappedComponentRef={formRef} type='detail' />
    </div>
  )
}

export default Detail