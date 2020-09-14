/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 10:16:41
 * @LastEditTime: 2020-09-14 11:41:32
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

  const { form, baseInfo: data, type } = props;

  const { getFieldDecorator, setFieldsValue } = props.form;

  useImperativeHandle(ref, () => ({
    form,
  }));

  const hideFormItem = (name, initialValue) => (
    <div style={{ display: 'none' }}>
      <FormItem>
        {getFieldDecorator(name, {
          initialValue: initialValue,
        })(<Input type={'hidden'} />)}
      </FormItem>
    </div>
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
                  {getFieldDecorator('supplierName', {
                    initialValue: data && data.supplierName,
                  })(<Input disabled style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="成立时间" {...formLayout}>
                  {getFieldDecorator('setUpTime', {
                    initialValue: type === 'add' ? '' : data.setUpTime,
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
            {/* <Col span={0}>{hideFormItem('buCode', type === 'add' ? '' : data.buCode)}</Col>
            <Col span={0}>{hideFormItem('buId', type === 'add' ? '' : data.buId)}</Col> */}
            <Row>
              <Col span={12}>
                <FormItem {...formLayout} label={'企业性质'}>
                  {getFieldDecorator('enterpriceProperty', {
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
              <Col span={12}>
                <FormItem label="注册资金" {...formLayout}>
                  {getFieldDecorator('registeredFund', {
                    initialValue: data && data.applyPeopleName,
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
                  {getFieldDecorator('compatAddress', {
                    initialValue: type === 'add' ? moment(new Date(), 'YYYY-MM-DD') : data.applyDate,
                    rules: [
                      {
                        required: true,
                        message: '供应商注册地址不能为空',
                      },
                    ],
                  })(<InputGroup compact>
                    <Input style={{ width: '20%' }} defaultValue={data.countryName} disabled />
                    <Input style={{ width: '30%' }} defaultValue={data.provinceName} disabled />
                    <Input style={{ width: '10%' }} defaultValue={data.cityName} disabled />
                    <Input style={{ width: '40%' }} defaultValue={data.detailedAddress} disabled />
                  </InputGroup>)}
                </FormItem>
              </Col>
              {hideFormItem('countryCode', data.countryCode)}
              {hideFormItem('provinceCode', data.provinceCode)}
              {hideFormItem('cityCode', data.cityCode)}
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="网址" {...formLayout}>
                  {getFieldDecorator('webSite', {
                    initialValue: data.webSite,
                  })(<Input addonBefore="Http://" disabled={true} style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="电话号码" {...formLayout}>
                  {getFieldDecorator('phoneNumber', {
                    initialValue: data.phoneNumber,
                  })(
                    <Input disabled />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="邮政编码" {...formLayout}>
                  {getFieldDecorator('postalCode', {
                    initialValue: data.postalCode,
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
                  {getFieldDecorator('email', {
                    initialValue: type === 'add' ? '' : data.email,
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
                  {getFieldDecorator('legalRepresentative', {
                    initialValue: type === 'add' ? '' : data.legalRepresentative,
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
                  {getFieldDecorator('salesCompanyName', {
                    initialValue: type === 'add' ? '' : data.salesCompanyName,
                    rules: [
                      {
                        required: true,
                        message: '销售公司名称不能为空',
                      },
                    ],
                  })(
                    <Input placeholder='可以与企业、销售分公司、代理商同名' disabled={true}/>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="设计产能" {...formLayout}>
                  {getFieldDecorator('designCapability', {
                    initialValue: type === 'add' ? '' : data.designCapability,
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
              <Col span={12}>
                <FormItem label="实际产能" {...formLayout}>
                  {getFieldDecorator('actualCapacity', {
                    initialValue: type === 'add' ? '' : data.actualCapacity,
                    rules: [
                      {
                        required: true,
                        message: '实际产能不能为空',
                      },
                    ],
                  })(<InputNumber placeholder='请输入实际产能' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="公司总人数" {...formLayout}>
                  {getFieldDecorator('headCount', {
                    initialValue: type === 'add' ? '' : data.headCount,
                  })(<InputNumber placeholder='请输入公司总人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="本科以上学历" {...formLayout}>
                  {getFieldDecorator('bachelorDegree', {
                    initialValue: type === 'add' ? '' : data.bachelorDegree,
                  })(
                    <InputNumber placeholder='请输入本科以上学历人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="大专" {...formLayout}>
                  {getFieldDecorator('juniorCollege', {
                    initialValue: type === 'add' ? '' : data.juniorCollege,
                  })(<InputNumber placeholder='请输入大专人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="中专及以下" {...formLayout}>
                  {getFieldDecorator('technicalSecondary', {
                    initialValue: type === 'add' ? '' : data.technicalSecondary,
                  })(
                    <InputNumber placeholder='请输入中专及以下人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="管理人员" {...formLayout}>
                  {getFieldDecorator('manager', {
                    initialValue: type === 'add' ? '' : data.manager,
                  })(<InputNumber placeholder='请输入管理人员人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="销售人员" {...formLayout}>
                  {getFieldDecorator('salesman', {
                    initialValue: type === 'add' ? '' : data.salesman,
                  })(
                    <InputNumber placeholder='请输入销售人员人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="质量控制" {...formLayout}>
                  {getFieldDecorator('qualityControl', {
                    initialValue: type === 'add' ? '' : data.qualityControl,
                  })(<InputNumber placeholder='请输入质量控制人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="技术人员" {...formLayout}>
                  {getFieldDecorator('technicist', {
                    initialValue: type === 'add' ? '' : data.technicist,
                  })(
                    <InputNumber placeholder='请输入技术人员人数' style={{ width: '100%' }} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="客服人员" {...formLayout}>
                  {getFieldDecorator('supportStaff', {
                    initialValue: type === 'add' ? '' : data.supportStaff,
                  })(<InputNumber placeholder='请输入客服人员人数' style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="其他" {...formLayout}>
                  {getFieldDecorator('otherStaff', {
                    initialValue: type === 'add' ? '' : data.otherStaff,
                  })(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem label="现有产能利用率" {...formLayout}>
                  {getFieldDecorator('actualCapacityFactor', {
                    initialValue: data.actualCapacityFactor,
                  })(<Input placeholder='请输入现有产能利用率' style={{ width: '100%' }} addonAfter='%'  disabled/>)}
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
