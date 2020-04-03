/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { ComboGrid, ComboList, ComboTree } from 'suid';
import styles from './index.less';

const Combos = {
  grid: ComboGrid,
  list: ComboList,
  tree: ComboTree,
  searchTable: ComboGrid,
  select: ComboList,
  selectTree: ComboTree,
}

function AdvancedForm({
  formItems = [],
  onOk = () => null,
  form: {
    getFieldDecorator,
    resetFields,
    validateFields
  }
}) {
  function handleSubmit() {
    validateFields((err, val) => {
      if (!err) {
        onOk(val)
      }
    })
  }
  function handleReset() {
    resetFields()
  }
  return (
    <div>
      <Row>
        {
          formItems.map((item, index) => {
            const Item = Combos[item.type] || Input
            return (
              <Col
                key={`${item.key}-${index}`}
                span={8}
                className={styles.col}
              >
                <span>{item.title} ： </span>
                {
                  getFieldDecorator(item.key)(
                    <Item
                      {...item.props}
                      className={styles.colItem}
                    />
                  )
                }
              </Col>
            )
          })
        }
      </Row>
      <div className={styles.btnWrapper}>
        <Button onClick={handleReset} className={styles.btns}>重置</Button>
        <Button type="primary" onClick={handleSubmit} className={styles.btns}>搜索</Button>
      </div>
    </div>
  )
}
export default Form.create()(AdvancedForm);