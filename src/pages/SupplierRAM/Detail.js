import {
  useEffect,
  useRef,
  useState
} from 'react';
import { message, Affix, Button, Spin } from 'antd';
import CommonForm from './CommonForm';
import styles from './index.less';
import { useLocation } from 'dva/router';
import {
  queryRecommendAccess
} from '../../services/ram';
import { closeCurrent } from '../../utils';
function Editor() {
  const [loading, toggleLoading] = useState(false);
  const [id, setId] = useState(null);
  const commonFormRef = useRef(null);
  const { query } = useLocation();
  const { id: recommendAccessId } = query;
  useEffect(() => {
    async function initialCreateRAMData() {
      toggleLoading(true)
      const { success, data, message: msg } = await queryRecommendAccess({recommendAccessId})
      toggleLoading(false)
      if (success) {
        const { id } = data;
        setId(id)
        commonFormRef.current.setFormValue(data)
        return
      }
      message.error(msg)
    }
    initialCreateRAMData()
  }, [])
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>推荐准入明细</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
            </div>
          </div>
        </div>
      </Affix>
      <CommonForm
        wrappedComponentRef={commonFormRef}
        type='detail'
      />
    </Spin>
  )
}

export default Editor;