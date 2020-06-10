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
  const wrapperRef = useRef(null);
  const defaultValues = value.map(item=>{
    return moment(item);
  })
  const [valueText, setValueText] = useState("");
  const [visible, triggerVisible] = useState(false);
  const num = ENUM[frequency].value;
  const times = Array.from({ length: num }).map((_, k) => (
    <div className={classnames([styles.flexBetweenCenter, styles.title])} key={`data-picker-${k}-${frequency}`}>
      <div className={styles.number}>{k + 1}</div>
      <div className={styles.time}>
        <MonthPicker onChange={(date, dateString) => handleItemsChange(date, dateString, k)} value={defaultValues[k]}/>
      </div>
    </div>
  ))
  const handleAutoAllocationTimes = () => {
    const ntm = moment().month();
    const nty = moment().year();
    const ntd = moment().day();
    const ys = [1];
    const hy = [1, 6];
    const qs = [1,4,7,9];
    const ms = [1,2,3,4,5,6,7,8,9,10,11,12];
    const ss = {
      1: ys,
      2: hy,
      4: qs,
      12: ms
    }
    const nss = ss[num];
    const sqs = nss.map(item=>{
      const y = (ntm + item) > 12 ? nty + 1 : nty;
      const m = (ntm + item) % 12 === 0 ? 12 : (ntm + item) % 12;
      const ftims = {
        year : y,
        month: m >= 10 ?  m : `0${m}` ,
        day: ntd >= 10 ?  ntd : `0${ntd}`
      }
      const tm = `${ftims.year}-${ftims.month}-${ftims.day} 00:00:00`;
      return tm
    })
    console.log(sqs)
    onChange(sqs)
  }
  const content = (
    <div className={styles.contentWrapper}>
      <div className={classnames([
        styles.flexBetweenCenter,
        styles.contentHeader
      ])}>
        <div style={{ fontWeight: 'bold' }}>定价频次：{ENUM[frequency].text}</div>
        <div>
          <Button onClick={handleAutoAllocationTimes}>自动分配</Button>
          <Button style={{ margin: '0 6px' }} onClick={cleanValues}>重置</Button>
          <Button onClick={() => triggerVisible(false)}>确定</Button>
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