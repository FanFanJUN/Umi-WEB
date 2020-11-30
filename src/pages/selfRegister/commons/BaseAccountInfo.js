import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Input, message, Row, Tabs } from 'antd';
import { onlyNumber, toUpperCase, onMailCheck } from '@/utils/index'
import OrganizationPage from './OrganizationPage'
import PersonalPage from './PersonalPage'
const { create } = Form;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
const BaseAccountRef = forwardRef(({
  hidden,
  form,
  accounts = {},
  assignment
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAccountinfo,
    form
  }));
  const OrganRef = useRef(null);
  const PersonRef = useRef(null);
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [defaultActiveKey, setdefaultActiveKey] = useState([1]);
  //const { attachment = null } = initialValues;
  useEffect(() => {

  }, [])
  // 表单
  function getAccountinfo() {
    if (defaultActiveKey[0] === '1' || defaultActiveKey[0] === 1) {
      const { getOrganizinfo } = OrganRef.current; //组织用户
      let organData = getOrganizinfo()
      if (!organData) {
        message.error('请先完成表单填写！');
        return false;
      } else {
        return organData
      }
    } else if (defaultActiveKey[0] === '2') {
      const { getpersoninfo } = PersonRef.current; //个人用户
      let personaData = getpersoninfo()
      if (!personaData) {
        message.error('请先完成表单填写！');
        return false;
      } else {
        return personaData
      }
    }

  }
  function tabClickHandler(params) {
    setdefaultActiveKey(params)
  }
  return (
    <div style={{ display: hidden ? "none" : "block", textAlign: 'center' }}>
      {
        assignment === 0 ?
          <div>
            <p style={{ paddingTop: '50px', fontSize: '20px' }}>个人成为供应商</p>
            <PersonalPage
              accounts={accounts}
              wrappedComponentRef={PersonRef}
            />
          </div> : null

      }
      {
        assignment === 1 ?
          <div>
            <p style={{ paddingTop: '50px', fontSize: '20px' }}>组织成为供应商</p>
            <OrganizationPage
              accounts={accounts}
              wrappedComponentRef={OrganRef}
            />
          </div> : null
      }
    </div>
  )
}
)
const CommonForm = create()(BaseAccountRef)

export default CommonForm
