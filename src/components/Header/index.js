import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styles from './index.less';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Icon } from 'antd';
const Header = forwardRef(
  (
    {
      left = null,
      right = null,
      extra = '高级查询',
      content = null,
      advanced = false,
      hiddenClose = false,
      advancedProps = {},
    },
    ref,
  ) => {
    const [visible, triggerVisible] = useState(false);
    const hide = () => triggerVisible(false);
    useImperativeHandle(ref, () => ({
      hide,
    }));
    return (
      <div style={{
        position: "relative"
      }}>
        <div className={classnames([styles.wrapper, styles.flexBetweenStart])}>
          <div className={styles.headerLeftWrapper}>
            {left}
          </div>
          <div className={styles.flexBetweenStart}>
            {right}
            {advanced && (
              <Button
                icon={visible ? 'up' : 'down'}
                onClick={() => triggerVisible(!visible)}
                {...advancedProps}
              >
                {extra}
              </Button>
            )}
          </div>
        </div>
        <div
          className={classnames({
            [styles.modal]: true,
            [styles.show]: visible,
            [styles.hide]: !visible,
          })}
        >
          {!hiddenClose && <Icon type="close" className={styles.close} onClick={hide} />}
          <div className={styles.content}>{content}</div>
        </div>
      </div>
    );
  },
);

Header.propTypes = {
  left: PropTypes.node,
  right: PropTypes.node,
  extra: PropTypes.string,
  content: PropTypes.node,
};

export default Header;
