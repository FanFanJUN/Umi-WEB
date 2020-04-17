import React, { createRef } from 'react';
import { connect } from 'dva';
import { Button, Modal } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import styles from './index.less';
function StrategyDetail({ state }) {
  const formRef = createRef()
  function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll((err, val) => {
      console.log(err, val)
    })
  }
  function handleCreateLine(val) {

  }
  function handleRemoveLines(rows) {

  }
  function handleEditorLine(line) {

  }
  function handleBack() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => console.log('ok'),
      okText: '确定返回',
      cancelText: '取消'
    })
  }
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          查看采购策略
        </span>
        <div>
          <Button className={styles.btn} onClick={handleBack}>返回</Button>
          <Button className={styles.btn} onClick={handleSave}>保存</Button>
          <Button type='primary' className={styles.btn}>保存并提交审核</Button>
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
        type='detail'
      />
      <StrategyTable onCreateLine={handleCreateLine} onRemove={handleRemoveLines} onEditor={handleEditorLine} dataSource={[]} />
    </div>
  )
}

export default connect(({ strategyDetail }) => ({ state: strategyDetail }))(StrategyDetail);