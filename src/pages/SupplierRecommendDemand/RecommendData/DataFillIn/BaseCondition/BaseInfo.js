/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 10:16:41
 * @LastEditTime: 2020-09-11 17:46:05
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/BaseInfo.js
 * @Description:  基本概况
 * @Connect: 1981824361@qq.com
 */
import React, { useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import styles from '../../DataFillIn/index.less';
import { ComboList, ExtModal } from 'suid';
import { Col, Form, Button, Row, Input, DatePicker, InputNumber, Affix, PageHeader } from 'antd';
// import { BUConfig } from '../../../commonProps';
import moment from 'moment/moment';
import classnames from 'classnames';

const FormItem = Form.Item;
const InputGroup = Input.Group;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const formLayoutCol = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};


const BaseInfo = (props, ref) => {

  const { type, form, data, userInfo } = props;

  const { getFieldDecorator, setFieldsValue } = props.form;

  useImperativeHandle(ref, () => ({
    form,
  }))

  const hideFormItem = (name, initialValue) => (
    <FormItem>
      {getFieldDecorator(name, {
        initialValue: initialValue,
      })(<Input type={'hidden'} />)}
    </FormItem>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <Form>
            <Row>
              <Col span={12}>
                <FormItem label="供应商名称" {...formLayout}>
                  {getFieldDecorator('source', {
                    initialValue: type === 'add' ? 'SRM' : data.source,
                  })(<Input disabled={true} placeholder="请输入来源" style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="成立时间" {...formLayout}>
                  {getFieldDecorator('shareDemanNumber', {
                    rules: [
                      {
                        required: true,
                        message: '成立时间不能为空',
                      },
                    ],
                  })(
                    <DatePicker style={{ width: '100%' }} />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Col span={0}>{hideFormItem('buCode', type === 'add' ? '' : data.buCode)}</Col>
            <Col span={0}>{hideFormItem('buId', type === 'add' ? '' : data.buId)}</Col>
            <Row>
              <Col span={12}>
                <FormItem {...formLayout} label={'企业性质'}>
                  {getFieldDecorator('buName', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '企业性质不能为空',
                      },
                    ],
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
              <Col span={0}>
                {hideFormItem('applyPeopleId', type === 'add' ? userInfo.userId : data.applyPeopleId)}
              </Col>
              <Col span={0}>
                {hideFormItem(
                  'applyPeopleAccount',
                  type === 'add' ? userInfo.userMobile : data.applyPeopleAccount,
                )}
              </Col>
              <Col span={12}>
                <FormItem label="注册资金" {...formLayout}>
                  {getFieldDecorator('applyPeopleName', {
                    initialValue: type === 'add' ? userInfo.userName : data.applyPeopleName,
                    rules: [
                      {
                        required: true,
                        message: '注册资金不能为空',
                      },
                    ],
                  })(<Input disabled />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="供应商注册地址" {...formLayoutCol}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                    rules: [
                      {
                        required: true,
                        message: '供应商注册地址不能为空',
                      },
                    ],
                  })(<InputGroup compact>
                    <Input style={{ width: '20%' }} defaultValue="中华人民共和国" disabled />
                    <Input style={{ width: '30%' }} defaultValue="四川省" disabled />
                    <Input style={{ width: '10%' }} defaultValue="内江市" disabled />
                    <Input style={{ width: '40%' }} defaultValue="xxxxxxxxx" disabled />
                  </InputGroup>)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="网址" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<Input addonBefore="Http://" disabled={true} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="电话号码" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  })(
                    <InputGroup compact>
                      <Input style={{ width: '20%' }} defaultValue="0571" disabled />
                      <Input style={{ width: '80%' }} defaultValue="26888888" disabled />
                    </InputGroup>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="邮政编码" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                    rules: [
                      {
                        required: true,
                        message: '邮政编码不能为空',
                      },
                    ],
                  })(<Input disabled placeholder='请输入邮政编码' />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="企业邮箱" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhoneww', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                    rules: [
                      {
                        required: true,
                        message: '企业邮箱不能为空',
                      },
                    ],
                  })(
                    <Input placeholder='请输入企业邮箱' />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="法定代表人" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                    rules: [
                      {
                        required: true,
                        message: '法定代表人不能为空',
                      },
                    ],
                  })(<Input placeholder='请输入法定代表人' />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="销售公司名称" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                    rules: [
                      {
                        required: true,
                        message: '销售公司名称不能为空',
                      },
                    ],
                  })(
                    <Input placeholder='请输入销售公司名称' />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="实际产能" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                    rules: [
                      {
                        required: true,
                        message: '实际产能不能为空',
                      },
                    ],
                  })(<InputNumber placeholder='请输入实际产能' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="设计产能" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                    rules: [
                      {
                        required: true,
                        message: '设计产能不能为空',
                      },
                    ],
                  })(
                    <InputNumber placeholder='请输入设计产能' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="公司总人数" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber placeholder='请输入公司总人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="本科以上学历" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  })(
                    <InputNumber placeholder='请输入本科以上学历人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="大专" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber placeholder='请输入大专人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="中专及以下" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  })(
                    <InputNumber placeholder='请输入中专及以下人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="管理人员" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber placeholder='请输入管理人员人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="销售人员" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  })(
                    <InputNumber placeholder='请输入销售人员人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="质量控制" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber placeholder='请输入质量控制人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="技术人员" {...formLayout}>
                  {getFieldDecorator('applyPeoplePhone', {
                    initialValue: type === 'add' ? userInfo.userMobile : data.applyPeoplePhone,
                  })(
                    <InputNumber placeholder='请输入技术人员人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="客服人员" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber placeholder='请输入客服人员人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="其他" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="现有产能利用率" {...formLayout}>
                  {getFieldDecorator('applyDate', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                  })(<Input placeholder='请输入客服人员人数' style={{ width: '100%' }} addonAfter='%' />)}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Form.create()(forwardRef(BaseInfo));
