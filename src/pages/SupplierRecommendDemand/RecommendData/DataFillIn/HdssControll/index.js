/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:22
 * @LastEditTime: 2020-09-14 18:11:27
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/HdssControll/index.js
 * @Description: 产品有害物质管控 tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../CommonUtil/UploadFile';


const InputGroup = Input.Group;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const HdssControll = (props) => {
    const [data, setData] = useState({
        loading: false,
        type: 'add',
        title: '基本情况',
        userInfo: {}
    });

    const { form } = props;

    const { getFieldDecorator, setFieldsValue } = props.form;

    const columns = [
        {
            "title": "设备名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "设备型号",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "时间",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "检测项目（元素）",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "备注",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];
    return (
        <div>
            <Spin spinning={data.loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="研发能力"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>产品有害物质管控</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="有无自有环保检测设备" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>有</Radio>
                                                    <Radio value={2}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columns}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                                <Divider>RoHS</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="RoHS管控标准" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>有</Radio>
                                                    <Radio value={2}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="前一年新产品的个数占总产品个数的比重" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>RoHS1.0</Radio>
                                                    <Radio value={2}>RoHS2.0</Radio>
                                                    <Radio value={1}>RoHS1.0+无卤</Radio>
                                                    <Radio value={2}>RoHS2.0+无卤</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="RoHS检测报告" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>REACH</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="化学品注册、评估、许可和限制" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>有</Radio>
                                                    <Radio value={2}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="备注" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea></Input.TextArea>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="附件材料" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<UploadFile/>)}
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

export default Form.create()(HdssControll);