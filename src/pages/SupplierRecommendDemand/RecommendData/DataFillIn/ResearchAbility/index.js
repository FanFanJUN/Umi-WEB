/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:53:17
 * @LastEditTime: 2020-09-14 11:46:10
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ResearchAbility/index.js
 * @Description: 研发能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../Common/EditTable';

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
const formLayoutCol = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

const ResearchAbility = (props) => {

    const [data, setData] = useState({
        loading: false,
        type: 'add',
        title: '基本情况',
        userInfo: {}
    });

    const { form } = props;

    const { getFieldDecorator, setFieldsValue } = props.form;

    // 专利/获奖情况
    const columns = [
        {
            "title": "专利号/获奖证书",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "成果说明",
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
            "title": "专利所有者",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "是否涉及提供给长虹的产品",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];

    // 已完成的新产品开发
    const columnsForFinish = [
        {
            "title": "产品名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "产品特点",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "新品销售金额",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "总销售金额",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "币种",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "获奖情况",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "设计定型日期",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];

    // 正在进行和计划进行的设计开发
    const columnsForProcess = [
        {
            "title": "项目名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "项目内容",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "项目人员构成",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "时间安排",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "项目成果",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];
    // 
    const columnsForProSta = [
        {
            "title": "使用标准名称/编号",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "国家/行业标准名称、编号",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "先进指标",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "低于国家/行业标准的指标",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
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
                            <div className={styles.title}>自主技术开发能力情况</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="自主技术开发能力" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '自主技术开发能力不能为空',
                                                    },
                                                ],
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={1}>完全具备</Radio>
                                                    <Radio value={2}>基本具备</Radio>
                                                    <Radio value={2}>不具备</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="说明" {...formLayout}>
                                            {getFieldDecorator('shareDemanNumber', {
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '成立时间不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Input.TextArea></Input.TextArea>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>专利/获奖情况</div>
                            <div className={styles.content}>
                                <div className={styles.mb}>
                                    <Button type='primary' className={styles.btn} onClick={() => { }}>新增</Button>
                                    {/* <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button> */}
                                </div>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columns}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>产品开发情况</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="是否愿意为客户的技术开发提供技术支持" {...formLayout}>
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
                                                    <Radio value={1}>是</Radio>
                                                    <Radio value={2}>否</Radio>
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
                                                <InputNumber
                                                    defaultValue={100}
                                                    min={0}
                                                    max={100}
                                                    formatter={value => `${value}%`}
                                                    parser={value => value.replace('%', '')}
                                                    // onChange={onChange}
                                                    style={{ width: '50%' }}
                                                />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>已完成的新产品开发</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="前一年新产品的销售额占总销售额的比重" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <InputNumber
                                                    defaultValue={100}
                                                    min={0}
                                                    max={100}
                                                    formatter={value => `${value}%`}
                                                    parser={value => value.replace('%', '')}
                                                    style={{ width: '50%' }}
                                                // onChange={onChange}
                                                />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="样品开发周期" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <InputGroup compact>
                                                    <span>最长 <InputNumber style={{ width: '30%' }} defaultValue="0571" />天 </span>
                                                    <span>平均 <InputNumber style={{ width: '30%' }} defaultValue="26888888" />天</span>
                                                    <span>最快 <InputNumber style={{ width: '30%' }} defaultValue="26888888" />天</span>
                                                </InputGroup>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForFinish}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                                <Divider>正在进行和计划进行的设计开发</Divider>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForProcess}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>产品执行标准</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForProcess}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(ResearchAbility);