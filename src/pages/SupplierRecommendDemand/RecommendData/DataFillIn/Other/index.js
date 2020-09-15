/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:13
 * @LastEditTime: 2020-09-14 18:11:05
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/Other/index.js
 * @Description: 其他附加资料
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

const Other = (props) => {
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
                    title="其他附加资料"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>企业照片</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="公司大门" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="生产车间全景" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="原料仓库全景" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="成品仓库全景" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="实验室全景" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>组织机构</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="组织机构" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>股权构成及见证材料</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="工商局加盖公章的验资报告" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '工商局加盖公章的验资报告不能为空',
                                                    },
                                                ],
                                            })(
                                                <UploadFile />)}
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
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(Other);