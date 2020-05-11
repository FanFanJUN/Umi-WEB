import React, { useState, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Popover, Input, Button, DatePicker, Modal } from 'antd';
import moment from 'moment';
import classnames from 'classnames';
import styles from './index.less';
const { TextArea } = Input;
const { MonthPicker } = DatePicker;
const ENUM = {
  'unknow': {
    value: 0,
    text: '未选择定价频次'
  },
  'Annually': {
    value: 1,
    text: '年度'
  },
  'SemiAnnually': {
    value: 2,
    text: '半年'
  },
  'Quarterly': {
    value: 4,
    text: '季度'
  },
  'Monthly': {
    value: 12,
    text: '月度'
  },
  'TenDays': {
    value: 12,
    text: '按旬'
  },
  'Order': {
    value: 0,
    text: '按单'
  },
  'Demand': {
    value: 0,
    text: '按需'
  }
}
const ComboDatePicker = forwardRef(({
  frequency = 'unknow',
  disabled = false,
  onChange = () => null,
  placeholder = "请选择时间",
  value=[]
}, ref) => {
  useImperativeHandle(ref, () => ({ cleanValues }))
  const wrapperRef = useRef(null)
  const [valueText, setValueText] = useState("");
  const [visible, triggerVisible] = useState(false);
  const num = ENUM[frequency].value;
  const times = Array.from({ length: num }).map((_, k) => (
    <div className={classnames([styles.flexBetweenCenter, styles.title])} key={`data-picker-${k}-${frequency}`}>
      <div className={styles.number}>{k + 1}</div>
      <div className={styles.time}>
        <MonthPicker onChange={(date, dateString) => handleItemsChange(date, dateString, k)} />
      </div>
    </div>
  ))
  const content = (
    <div className={styles.contentWrapper}>
      <div className={classnames([
        styles.flexBetweenCenter,
        styles.contentHeader
      ])}>
        <div style={{ fontWeight: 'bold' }}>定价频次：{ENUM[frequency].text}</div>
        <div>
          <Button onClick={() => triggerVisible(false)}>关闭面板</Button>
        </div>
      </div>
      <div className={classnames([styles.flexBetweenCenter, styles.title])}>
        <div className={styles.number}>序号</div>
        <div className={styles.time}>定价时间</div>
      </div>
      <div style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
        {times}
      </div>
    </div>
  )
  useEffect(() => {
    if (disabled) {
      cleanValues()
    }
  }, [disabled])
  useEffect(() => {
    const t = value.filter(_ => _).map(item => moment(item).format('YYYY-MM')).join('；')
    setValueText(t)
  }, [value])
  function cleanValues() {
    onChange([])
  }
  function handleItemsChange(date, _, key) {
    const vv = [...value];
    if(!!date) {
      vv[key] = date.format('YYYY-MM-DD HH:mm:ss')
      onChange(vv)
    }
  }
  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
    >
      <Popover
        trigger='click'
        visible={false}
        placement="bottomRight"
        autoAdjustOverflow={false}
        onVisibleChange={(visi) => {
          disabled && triggerVisible(false)
          !disabled && triggerVisible(visi)
        }}
      >
        <TextArea value={valueText} autoSize={{ minRows: 3, maxRows: 3 }} readOnly disabled={disabled} placeholder={placeholder} />
      </Popover>
      <Modal
        visible={visible}
        onCancel={() => triggerVisible(false)}
        footer={null}
      >
        {content}
      </Modal>
    </div>
  )
})

export default ComboDatePicker;