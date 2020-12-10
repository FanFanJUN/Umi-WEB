import React, { PureComponent } from "react";
import withRouter from "umi/withRouter";
import { Button, Form, Icon, Input, Select } from "antd";
import md5 from "md5";
import { connect } from "dva";
import { formatMessage } from 'umi-plugin-react/locale'
import { title } from '../../../package.json'
import styles from "./index.less";
import { utils } from 'suid';
const { Item } = Form;
const { Option } = Select;



@withRouter
@connect(({ global, loading }) => ({ global, loading }))
@Form.create()
class LoginForm extends PureComponent {

  handlerSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, user) => {
      if (!err) {
        const { dispatch, } = this.props;
        user.password = md5(user.password);
        dispatch({
          type: "global/login",
          payload: {
            ...user,
            reqId: '161de21c-1b3a-46a4-b6e8-3c7605164f8e',
            appId: '1234'
          }
        });
      }
    });
  };

  componentDidMount() {
    this.userInput.focus();
  }

  handlerLocaleChange = (locale) => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLocale",
      payload: {
        locale
      }
    })
  };

  render() {
    const { loading, form, global } = this.props;
    const { getFieldDecorator } = form;
    const { showTenant, locale } = global;
    return (
      <div className={styles["login-form"]}>
        <div className={"login-form"}>
          <div className="login-logo">
            <div className="login-name">{title}-用户登录</div>
          </div>
          <Form style={{ maxWidth: "300px" }}>
            {
              showTenant && <Item>
                {
                  getFieldDecorator("tenantCode", {
                    rules: [{ required: false, message: formatMessage({ id: "login.tenant.required", defaultMessage: "请输入租户账号" }) }]
                  })(
                    <Input
                      autoFocus="autoFocus"
                      size="large"
                      prefix={<Icon type="safety" style={{ color: "rgba(0,0,0,.25)" }} />}
                      placeholder="租户账号"
                    />
                  )
                }
              </Item>
            }
            <Item>
              {
                getFieldDecorator("account", {
                  rules: [{ required: true, message: formatMessage({ id: "login.account.required", defaultMessage: "请输入用户名" }) }]
                })(
                  <Input
                    ref={(inst) => {
                      this.userInput = inst;
                    }}
                    size="large"
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder={formatMessage({ id: "login.account", defaultMessage: "用户名" })}
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator("password", {
                  rules: [{ required: true, message: "请输入密码!" }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    size="large"
                    type="password"
                    placeholder="密码"
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator("verifyCode")(
                  <Input
                    prefix={<Icon type='bug' style={{ color: 'ragba(0,0,0,.25)' }} />}
                    size="large"
                    placeholder="验证码"
                  />
                )
              }
            </Item>
            <Item>
              {
                getFieldDecorator("locale", {
                  initialValue: locale,
                  rules: [{ required: true }]
                })(
                  <Select size="large" onChange={this.handlerLocaleChange}>
                    <Option value='zh-CN'>简体中文</Option>
                    <Option value='en-US'>English</Option>
                  </Select>
                )
              }
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="login-form-button"
                onClick={this.handlerSubmit}
                style={{ width: "100%" }}
                loading={loading.global}
              >
                登录
              </Button>
            </Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
