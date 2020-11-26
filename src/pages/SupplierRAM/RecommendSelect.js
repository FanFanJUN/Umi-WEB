import { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';
import { ExtModal } from 'suid';
import { Form } from 'antd';

const { create } = Form;

function LayoutComponent({
  form
}, ref) {
  useImperativeHandle(ref, () => ({
    getAll
  }))
  const [visible, toggleVisible] = useState(false);
  return (
    <ExtModal
      visible={visible}
    >

    </ExtModal>
  )
}

const FormWrapper = forwardRef(LayoutComponent)

export default create()(FormWrapper)