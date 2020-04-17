/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { ComboGrid, ComboList, ComboTree, ComboSelect, MixinSelect } from '@/components';
import styles from './index.less';
const FormItem = Form.Item;
const Combos = {
  grid: ComboGrid,
  list: ComboList,
  tree: ComboTree,
  searchTable: ComboGrid,
  multiple: ComboSelect,
  select: MixinSelect,
  selectTree: ComboTree,
}

const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
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
            const Item = Combos[item.type] || Input;
            return (
              <Col
                key={`${item.key}-${index}`}
                span={8}
              >
                <FormItem style={{ width: '100%' }} label={item.title} {...formLayout}>
                  {
                    getFieldDecorator(item.key)(
                      <Item
                        {...item.props}
                      />
                    )
                  }
                </FormItem>
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