import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button } from 'antd';
const Header = forwardRef(({
  left = null,
  right = null,
  extra = "高级查询",
  content = null,
  advanced = false
}, ref) => {
  const [visible, triggerVisible] = useState(false);
  useImperativeHandle(ref, () => ({
    hide : () => triggerVisible(false)
  }))
  return (
    <div className={classnames([styles.wrapper, styles.flexBetweenStart])}>
      <div>{left}</div>
      <div className={styles.flexBetweenStart}>
        {right}
        {
          advanced &&
          <Button icon={visible ? "up" : "down"} onClick={() => triggerVisible(!visible)}>{extra}</Button>
        }
      </div>
      <div className={classnames({
        [styles.modal]: true,
        [styles.show]: visible,
        [styles.hide]: !visible
      })}>
        <div className={styles.content}>
          {content}
        </div>
      </div>
    </div>
  )
})

Header.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  extra: PropTypes.string,
  content: PropTypes.node
}

export default Header;