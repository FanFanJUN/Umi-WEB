/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:26
 * @LastEditTime: 2020-09-18 15:44:53
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/DWC/index.js
 * @Description: 合作意愿 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Divider, Col, Input, DatePicker, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';


const FormItem = Form.Item;
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

const isAgreeorNot = ['同意', '不同意'];

const DWC = ({ form, updateGlobalStatus }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  const { query: { id, type = 'add' } } = router.useLocation();

  const { getFieldDecorator, resetFields, getFieldValue } = form;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await requestGetApi({ supplierRecommendDemandId: '676800B6-F19D-11EA-9F88-0242C0A8442E', tabKey: 'DWCTab' });
      if (res.success) {
        res.data && setData(res.data);
      } else {
        message.error(res.message);
      }
      setLoading(false);
    };
    if (type !== 'add') {
      fetchData();
    }
  }, []);

  function handleSave() {
    form.validateFieldsAndScroll((error, value) => {
      console.log(value);
      if (error) return;
      const saveParams = {
        ...value,
        recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
        tabKey: 'DWCTab',
      };
      requestPostApi(filterEmptyFileds(saveParams)).then((res) => {
        if (res && res.success) {
          message.success(res.message);
          updateGlobalStatus();
        } else {
          message.error(res.message);
        }
      })
    })
  }

  function handleChange(e) {
    // console.log(getFieldValue('otherPayCondition'));
    // if (e && e.target.value !== 'RMB' && getFieldValue('otherPayCondition')) {
    //     console.log(getFieldValue('otherPayCondition'));
    //     resetFields(['otherPayCondition']);
    // }
  }

  return (
    <div>
      <Spin spinning={loading}>
        <PageHeader
          ghost={false}
          style={{
            padding: '0px'
          }}
          title="合作意愿"
          extra={type === 'add' ? [
            <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
              保存
                        </Button>,
          ] : null}
        >
          <div className={styles.wrapper}>
            <div className={styles.bgw}>
              <div className={styles.title}>合作意愿</div>
              <div className={styles.content}>
                <Divider>协议</Divider>
                <Row>
                  <Col span={12}>
                    <FormItem label="签订质量协议" {...formLayout}>
                      {getFieldDecorator('signQualityAgreement', {
                        initialValue: type === 'add' ? true : data.signQualityAgreement,
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="签订技术协议" {...formLayout}>
                      {getFieldDecorator('signTechnologyAgreement', {
                        initialValue: type === 'add' ? true : data.signTechnologyAgreement,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '成立时间不能为空',
                        //     },
                        // ],
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="签订供货协议" {...formLayout}>
                      {getFieldDecorator('signSupplyAgreement', {
                        initialValue: type === 'add' ? true : data.signSupplyAgreement,
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="签订VMI协议" {...formLayout}>
                      {getFieldDecorator('signVmiAgreement', {
                        initialValue: type === 'add' ? true : data.signVmiAgreement,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '成立时间不能为空',
                        //     },
                        // ],
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="签订CSR协议" {...formLayout}>
                      {getFieldDecorator('signCsrAgreement', {
                        initialValue: type === 'add' ? true : data.signCsrAgreement,
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem label="反商业贿赂协议" {...formLayout}>
                      {getFieldDecorator('antiCommercialBribery', {
                        initialValue: type === 'add' ? true : data.antiCommercialBribery,
                        // rules: [
                        //     {
                        //         required: true,
                        //         message: '成立时间不能为空',
                        //     },
                        // ],
                      })(
                        <Radio.Group>
                          <Radio value={true}>{isAgreeorNot[0]}</Radio>
                          <Radio value={false}>{isAgreeorNot[1]}</Radio>
                        </Radio.Group>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Divider>付款条件</Divider>
                <Row>
                  <Col span={24}>
                    <FormItem label="付款条件" {...formLayoutCol}>
                      {getFieldDecorator('payConditionEnum', {
                        initialValue: type === 'add' ? 'RMB' : data.payConditionEnum,
                      })(
                        <Radio.Group onChange={handleChange}>
                          <Radio value={'RMB'}>月结90天6个月银行承兑(人民币)</Radio>
                          <Radio value={'FOREIGN_CURRENCY'}>月结60天现汇(外币结算)</Radio>
                          <Radio value={'OTHER'}>
                            {getFieldDecorator('otherPayCondition', {
                              initialValue: type === 'add' ? '' : data.otherPayCondition,
                            })(
                              <span>其他: <Input /></span>
                            )}
                          </Radio>
                        </Radio.Group>)}
                    </FormItem>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </PageHeader>
      </Spin>
    </div>
  )
};

export default Form.create()(DWC);