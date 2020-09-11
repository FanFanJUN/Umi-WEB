/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:26
 * @LastEditTime: 2020-09-11 09:48:40
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/DWC/index.js
 * @Description: 合作意愿 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Divider, Col, Input, DatePicker } from 'antd';
import styles from '../../DataFillIn/index.less';


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

const DWC = (props) => {
    const [data, setData] = useState({
        loading: false,
        type: 'add',
        userInfo: {}
    });

    const { form } = props;

    const { getFieldDecorator, setFieldsValue } = props.form;

    return (
        <div>
            <Spin spinning={data.loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="合作意愿"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>合作意愿</div>
                            <div className={styles.content}>
                                <Divider>协议</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="签订质量协议" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="签订技术协议" {...formLayout}>
                                            {getFieldDecorator('shareDemanNumber', {
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '成立时间不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="签订供货协议" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="签订VMI协议" {...formLayout}>
                                            {getFieldDecorator('shareDemanNumber', {
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '成立时间不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="签订CSR协议" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="反商业贿赂协议" {...formLayout}>
                                            {getFieldDecorator('shareDemanNumber', {
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '成立时间不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>{isAgreeorNot[0]}</Radio>
                                                    <Radio value={2}>{isAgreeorNot[1]}</Radio>
                                                </Radio.Group>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>付款条件</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="付款条件" {...formLayoutCol}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>月结90天6个月银行承兑(人民币)</Radio>
                                                    <Radio value={2}>月结60天现汇(外币结算)</Radio>
                                                    <Radio value={2}>其他: <Input/></Radio>
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