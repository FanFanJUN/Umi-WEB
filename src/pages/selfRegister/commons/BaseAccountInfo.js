import React, { forwardRef, useImperativeHandle, useEffect, useState,useRef } from 'react';
import {Form, Input, message, Row, Tabs} from 'antd';
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
    // const valus = form.validateFieldsAndScroll();
    // return valus;
    let result = false;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        result = values;
      }
    });
    return result;
  }
  function tabClickHandler(params) {
    setdefaultActiveKey(params)
  }
  return (
    <div style={{display: hidden ? "none" : "block"}}>
        <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)}>
            <TabPane forceRender tab="组织用户" key="1">
              <OrganizationPage
                 wrappedComponentRef={OrganRef}
              />
            </TabPane>
            <TabPane forceRender tab="个人用户" key="2">
              <PersonalPage 
                 wrappedComponentRef={PersonRef}
              />
            </TabPane>
          </Tabs>
    </div>
  )
}
)
const CommonForm = create()(BaseAccountRef)

export default CommonForm