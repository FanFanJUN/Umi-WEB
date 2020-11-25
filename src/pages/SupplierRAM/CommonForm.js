import { forwardRef, useImperativeHandle } from 'react';
import { Form } from 'antd';
import styles from './index.less';

const { create } = Form;

function CommonForm({
  form
}, ref) {
  useImperativeHandle(ref, () => ({
    hide
  }))
  function hide() {

  }
  const { getFieldDecorator } = form;
  return (
    <div>
      <div className={styles.commonTitle}>基本信息</div>
    </div>
  )
}

const ForwardRef = forwardRef(CommonForm)

export default create()(ForwardRef)