import { useRef, useState } from 'react';
import styles from './index.less';
import CommonForm from '../CommonForm';
import { Affix, Button, message, Spin } from 'antd';
import classnames from 'classnames';
import { saveViewModify } from '../../../services/supplier';
import { closeCurrent } from '../../../utils';
export default function () {
  const [loading, toggleLoading] = useState(false);
  const formRef = useRef(null);
  const handleSave = async () => {
    const { getAllParams } = formRef.current;
    const { headerFields, dataSource } = await getAllParams();
    toggleLoading(true)
    const { success, message: msg } = await saveViewModify({
      ...headerFields,
      supplierFinanceViewModifyLines: dataSource
    })
    toggleLoading(false)
    if (success) {
      closeCurrent()
      return
    }
    message.error(msg)
  }
  const handleBack = () => {
    closeCurrent()
  }
  return (
    <div>
      <Spin spinning={loading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>新增采购会计视图变更单</span>
            <div>
              <Button className={styles.btn} onClick={handleBack}>返回</Button>
              <Button className={styles.btn} type='primary' onClick={handleSave}>保存</Button>
            </div>
          </div>
        </Affix>
        <CommonForm wrappedComponentRef={formRef} />
      </Spin>
    </div>
  )
}