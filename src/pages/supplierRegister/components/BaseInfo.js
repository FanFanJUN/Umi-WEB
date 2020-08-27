import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree,DynamicForm } from 'suid';
import {orgnazationProps} from '@/utils/commonProps'
import styles from './index.less';
const { Item, create } = Form;
const { storage } = utils
const rule = name => [{ required: true, message: `请输入${name}` }];
const fieldsList = [
    {
      name: 'name',
      displayName: '昵称',
      editor: 'normal',
      unavailable: false,
      value: '',
    },
    {
      name: 'userName',
      displayName: '账号',
      editor: 'select',
      value: '',
      props: orgnazationProps
    },
    {
      name: 'email',
      displayName: '邮箱',
      editor: 'normal',
      value: '',
    },
    {
      name: 'phone',
      displayName: '手机',
      editor: 'normal',
      value: '',
    },
    {
      name: 'password',
      displayName: '密码',
      editor: 'password',
      value: '',
    },
    {
      name: 'confirm',
      displayName: '确认密码',
      editor: 'password',
      value: '',
    },
    {
      name: 'no',
      displayName: '编号',
      editor: 'normal',
      value: '',
    },
    {
      name: 'remark',
      displayName: '备注',
      editor: 'normal',
      value: '',
    },
    {
        name: 'remark',
        displayName: '备注',
        editor: 'normal',
        value: '',
      },
  ];
const FormRef = forwardRef(({
  form,
  type = "add",
  initialValue = {},
  onChangeMaterialLevel = () => null
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [createName, setCreateName] = useState("");
  const pcc = getFieldValue('purchaseCompanyCode');
  const { attachment = null } = initialValue;
  const treeNodeProps = (node) => {
    if (node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  }
  useEffect(() => {
    const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
    setFieldsValue({
      phone: mobile
    })
    setCreateName(userName)
  }, [])
  function onSubmit() {

  }
  const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 },
    },
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
        <DynamicForm
            fieldsList={fieldsList.map(item => ({ ...item, rules: rule(item.displayName) }))}
            columns={3}
            onSubmit={onSubmit}
            submitText="保存"
            formItemLayout={formItemLayout}
        />
        </div>
      </div>
      <div className={styles.bgw}>

        <div className={styles.title}>帐号</div>
        <div className={styles.content}>
        </div>
      </div>
    </div>
  )
}
)
const CommonForm = create()(FormRef)

export default CommonForm