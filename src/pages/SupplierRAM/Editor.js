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
  queryRecommendAccess,
  saveRecommendAccess
} from '../../services/ram';
import { closeCurrent } from '../../utils';
function Editor() {
  const [loading, toggleLoading] = useState(false);
  const [id, setId] = useState(null);
  const commonFormRef = useRef(null);
  const { query } = useLocation();
  const { id: recommendAccessId } = query;
  async function handleSave() {
    const value = await commonFormRef.current.getFormValue();
    toggleLoading(true)
    const { success, message: msg } = await saveRecommendAccess({ ...value, id });
    toggleLoading(false)
    if (success) {
      message.success(msg)
      closeCurrent()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    async function initialCreateRAMData() {
      const { success, data, message: msg } = await queryRecommendAccess({recommendAccessId})
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
            <span className={styles.title}>编辑推荐准入</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
              <Button
                className={styles.btn}
                type='primary'
                onClick={handleSave}
                disabled={loading}
              >保存</Button>
            </div>
          </div>
        </div>
      </Affix>
      <CommonForm
        wrappedComponentRef={commonFormRef}
        type='editor'
      />
    </Spin>
  )
}

export default Editor;