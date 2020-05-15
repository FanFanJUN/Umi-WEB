/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { ComboSelect, MixinSelect } from '@/components';
import {
  ComboGrid,
  ComboList,
  ComboTree
} from 'suid'
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
  form = {}
}) {
  const {
    getFieldDecorator,
    resetFields,
    validateFields
  } = form;
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
            if (!!item.type) {
              return (
                <Col
                  key={`${item.key}-${index}`}
                  span={8}
                >
                  <FormItem style={{ width: '100%' }} label={item.title} {...formLayout}>
                    {
                      getFieldDecorator(`${item.key}`),
                      getFieldDecorator(`${item.key}_name`)(
                        <Item
                          form={form}
                          {...item.props}
                          name={`${item.key}_name`}
                          field={[item.key]}
                        />
                      )
                    }
                  </FormItem>
                </Col>
              )
            }
            return (
              <Col
                key={`${item.key}-${index}`}
                span={8}
              >
                <FormItem style={{ width: '100%' }} label={item.title} {...formLayout}>
                  {
                    getFieldDecorator(`${item.key}`)(
                      <Item
                        form={form}
                        {...item.props}
                        name={`${item.key}`}
                        field={[item.key]}
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