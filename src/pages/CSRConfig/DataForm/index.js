import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input, Radio, Select, Button, Icon, InputNumber } from 'antd';
import styles from './index.less';
const { Item: FormItem } = Form;
const formLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  }
};
const DataForm = forwardRef(({
  form
}, ref) => {
  useImperativeHandle(ref, () => ({
    setFieldsValue,
    getAllFieldsValue,
    setAllFieldsValue
  }))
  const [opts, setOpts] = useState(['']);
  const {
    getFieldDecorator,
    setFieldsValue,
    validateFieldsAndScroll,
    getFieldsValue,
  } = form;
  const {
    attachmentConfig,
    remarkConfig
  } = getFieldsValue()
  const emptyOpts = opts.every(item => !!item);
  function handleAddOption() {
    const newOpts = [...opts, '']
    setOpts(newOpts)
  }
  function handleRemoveOption(key) {
    const newOpts = opts.filter((_, k) => key !== k);
    setOpts(newOpts)
  }
  function setAllFieldsValue(fields) {
    const { selectConfigList, tenantCode, id, display, ...other } = fields;
    setFieldsValue(other);
    setOpts(!!selectConfigList ? selectConfigList : [''])
  }
  async function getAllFieldsValue() {
    const fields = await validateFieldsAndScroll();
    const {
      item,
      remarkConfig,
      attachmentConfig,
      csrConfigEnum,
      rank,
      attachmentRequiredField = null,
      remarkRequiredField = null
    } = fields;
    return {
      item,
      remarkConfig,
      attachmentConfig,
      csrConfigEnum,
      rank,
      selectConfigList: opts,
      attachmentRequiredField,
      remarkRequiredField
    }
  }
  function handleOptionChange(key, value) {
    const newOpts = opts.map((item, k) => {
      if (key === k) {
        return value
      }
      return item
    })
    setOpts(newOpts)
  }
  return (
    <Form>
      <FormItem label='调查项目' {...formLayout}>
        {
          getFieldDecorator('item', {
            rules: [
              {
                required: true,
                message: '请输入调查项目名称'
              }
            ]
          })(<Input placeholder='调查项目名称' />)
        }
      </FormItem>
      <FormItem label='类型' {...formLayout}>
        {
          getFieldDecorator('csrConfigEnum', {
            rules: [
              {
                required: true,
                message: '请选择调查项目类型'
              }
            ]
          })(
            <Select placeholder='选择调查项目类型'>
              <Select.Option value={'CSR'}>企业社会责任</Select.Option>
              <Select.Option value={'PRODUCTION_ENVIRONMENT'}>企业生产环境</Select.Option>
            </Select>
          )
        }
      </FormItem>
      <FormItem label='排序号' {...formLayout}>
        {
          getFieldDecorator('rank')(<InputNumber placeholder='请设置排序号' style={{ width: 200 }} />)
        }
      </FormItem>
      {
        opts?.map((_, key) => <FormItem {...formLayout} key={`option-item-${key}`} label={`选项${key + 1}`}>
          {
            getFieldDecorator(`option-${key}`, {
              rules: [
                {
                  required: true,
                  message: `选项${key + 1}不能为空`
                }
              ],
              initialValue: opts[key]
            })(
              <Input
                addonAfter={opts.length === 1 ? null : <Icon onClick={() => handleRemoveOption(key)}
                  className={styles.close}
                  type='close'
                />}
                onChange={(e) => {
                  handleOptionChange(key, e.target.value)
                }}
                placeholder='填写选项描述'
              />
            )
          }
        </FormItem>)
      }
      <FormItem label=' ' colon={false} {...formLayout}>
        <Button type='primary' onClick={handleAddOption}>新增选项</Button>
      </FormItem>
      <FormItem label='备注' {...formLayout}>
        {
          getFieldDecorator('remarkConfig', {
            rules: [
              {
                required: true,
                message: '选择是否包含备注'
              }
            ]
          })(
            <Radio.Group>
              <Radio value={true}>有</Radio>
              <Radio value={false}>无</Radio>
            </Radio.Group>
          )
        }
      </FormItem>
      {
        remarkConfig ?
          <FormItem label='备注必填选项' {...formLayout}>
            {
              getFieldDecorator('remarkRequiredField', {
                rules: [
                  {
                    required: true,
                    message: '请选择调查项目类型'
                  }
                ]
              })(
                <Select placeholder='选择备注必填选项'
                  disabled={!emptyOpts}
                >
                  <Select.Option value='无'>无</Select.Option>
                  {
                    opts.map(item => (
                      <Select.Option value={item}>{item}</Select.Option>
                    ))
                  }
                  <Select.Option value='全部'>全部</Select.Option>
                </Select>
              )
            }
          </FormItem> : null
      }
      <FormItem label='附件' {...formLayout}>
        {
          getFieldDecorator('attachmentConfig', {
            rules: [
              {
                required: true,
                message: '选择是否包含附件'
              }
            ]
          })(
            <Radio.Group>
              <Radio value={true}>有</Radio>
              <Radio value={false}>无</Radio>
            </Radio.Group>
          )
        }
      </FormItem>
      {
        attachmentConfig ?
          <FormItem label='附件必填选项' {...formLayout}>
            {
              getFieldDecorator('attachmentRequiredField', {
                rules: [
                  {
                    required: true,
                    message: '附件必填选项'
                  }
                ]
              })(
                <Select placeholder='选择附件必填选项'
                  disabled={!emptyOpts}
                >
                  <Select.Option value='无'>无</Select.Option>
                  {
                    opts.map(item => (
                      <Select.Option value={item}>{item}</Select.Option>
                    ))
                  }
                  <Select.Option value='全部'>全部</Select.Option>
                </Select>
              )
            }
          </FormItem> : null
      }
    </Form>
  )
})
export default Form.create()(DataForm)