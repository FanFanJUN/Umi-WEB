import { useRef } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import { Button, Affix, Modal, message } from 'antd';
import { saveAppraiseProject } from '../../../services/appraise';
import { closeCurrent } from '../../../utils';
function Create() {
  const formRef = useRef(null);
  async function handleSave() {
    const { getAllValues } = formRef.current;
    const params = await getAllValues();
    Modal.confirm({
      title: '保存评价项目',
      content: '是否保存当前评价项目',
      onOk: async () => {
        const { success, message: msg } = await saveAppraiseProject(params);
        if (success) {
          message.success(msg)
          closeCurrent()
          return
        }
        message.error(msg)
      },
      okText: '保存',
      cancelText: '取消'
    })
  }
  return (
    <div>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>新增评价项目</span>
            <div className={styles.fec}>
              <Button className={styles.btn}>返回</Button>
              <Button className={styles.btn} type='primary' onClick={handleSave}>保存</Button>
            </div>
          </div>
        </div>
      </Affix>
      <CommonForm wrappedComponentRef={formRef} />
    </div>
  )
}

export default Create