/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:16
 * @LastEditTime: 2020-09-11 13:54:21
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ManufactureAbility/index.js
 * @Description: 制造能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState } from 'react';
import { Form, Button, Spin, PageHeader, Row, Col } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../Common/EditTable';
import UploadFile from '../Common/UploadFile';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const ManufactureAbility = (props) => {

    const [data, setData] = useState({
        loading: false,
        type: 'add',
        title: '基本情况',
        userInfo: {}
    });

    const { form } = props;

    const { getFieldDecorator, setFieldsValue } = props.form;

    // 生产能力
    const columnsForProCapacity = [
        {
            "title": "名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "规格型号",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "计量单位",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "月最大产量",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "现在月产量",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "上年度销售总额",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];

    // 现有生产情况
    const columnsForProSitu = [
        {
            "title": "产品",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "月生产能力",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "计量单位",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "占总产量％",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "产品交付周期(天）",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "产品直通率",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "旺季月份",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
    ];

    // 关键生产设备
    const columnsForEqu = [
        {
            "title": "工厂名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "生产设备、在线检测设备名称",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "规格型号",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "生产厂家",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "产地",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "购买时间",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "数量",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "用于何工序及生产哪类配件",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "单班产量",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "目前状态",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
    ];

    // 产品制造工艺流程简介
    const columnsForOther = [
        {
            "title": "产品",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "流程及材料说明",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
    ];

    // 关键工艺及关键工艺设备情况
    const columnsForKeyProcess = [
        {
            "title": "产品",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "关键工序/工艺名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "工艺、技术要求",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "设备精度、工艺水平",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "备注",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
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
                    title="制造能力"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>生产能力</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForProCapacity}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>现有生产情况</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForProSitu}
                                    rowKey='name1'
                                // setNewData={setNewData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>关键生产设备</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="设备清单" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<UploadFile />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForEqu}
                                    rowKey='name1'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>产品制造工艺流程简介</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForOther}
                                    rowKey='name1'
                                // setNewData={setNewData}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>关键工艺及关键工艺设备情况</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForKeyProcess}
                                    rowKey='name1'
                                    isEditTable
                                // setNewData={setNewData}
                                />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(ManufactureAbility);