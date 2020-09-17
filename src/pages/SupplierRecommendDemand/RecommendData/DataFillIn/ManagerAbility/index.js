/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:19
 * @LastEditTime: 2020-09-17 17:29:55
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ManagerAbility/index.js
 * @Description: 供应链管理能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Row, Col, Divider, Radio, Input, InputNumber, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import UploadFile from '../CommonUtil/UploadFile';
import EditableFormTable from '../CommonUtil/EditTable';
import { requestPostApi, requestGetApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';
import { router } from 'dva';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const ManagerAbility = ({form}) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    const { getFieldDecorator, getFieldValue } = form;

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'managerAbilityTab' });
            if (res.success) {
                res.data && setData(res.data);
                // set(data.environmentalTestingEquipments);
            } else {
                message.error(res.message);
            }
            setLoading(false);
        };
        if (type !== 'add') {
            fetchData();
        }
    }, []);

    const columnsForCarTransport = [
        {
            "title": "运输方式",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "运输距离（公里）",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "运输时间（小时）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "发运频率（次/周）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "正常情况交货期（天）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "紧急情况交货期（天）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
    ];
    // 关键原材料及供应商名单
    const columnsForKeyMat = [
        {
            "title": "产品",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "原材料名称及规格型号/牌号",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "用途",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "品牌及供应商名称（自制可写“自制”）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "材料采购周期（天）",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "年采购金额",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "币种",
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

    function handleSave() {
        if (getFieldValue('haveEnvironmentalTestingEquipment')) {
            // if (isEmptyArray(tableTata)) {
            //     message.info('列表至少填写一条设备信息！');
            //     return;
            // }
        }
        form.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                tabKey: 'managerAbilityTab',
                rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
                recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
                // environmentalTestingEquipments: tableTata || [],
            };
            requestPostApi(filterEmptyFileds(saveParams)).then((res) => {
                if (res && res.success) {
                    message.success('保存数据成功');
                } else {
                    message.error(res.message);
                }
            })
        })
    }

    function setNewData(newData) {
        // setTableTata(newData);
    }

    return (
        <div>
            <Spin spinning={data.loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="基本概况"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>成本控制</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="每年制定查成本降低目标并对执行情况进行评价" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="成本控制计划书" {...formLayout}>
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
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="具有专门的成本核算流程，核算表格" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="成本核算表单" {...formLayout}>
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
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>交货管控</div>
                            <div className={styles.content}>
                                <Divider>紧急交货</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否愿意承接紧急订单" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>库存能力</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否根据要求维持一定库存(含质量安全库存)" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={8}>
                                        <FormItem label="库房地点" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="面积（平方米）" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<InputNumber/>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="可存储量（个）" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<InputNumber/>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>备货流程、系统</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="建有备货流程、系统" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="附件资料" {...formLayout}>
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
                                <Divider>交货流程、系统</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="建有交货流程、系统" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="证明材料" {...formLayout}>
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
                                <Divider>紧急交货的流程、系统</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="紧急交货的流程、系统" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="证明材料" {...formLayout}>
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
                                <Divider>客户满意度、客户投诉处理流程、系统</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="客户满意度、客户投诉处理流程、系统" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="证明材料" {...formLayout}>
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
                                <Divider>物料存储</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="生产过程中物料的暂存、仓储中物料、成品的存放区域是否与其供货能力相适应" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否按照先进先出进行管理" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>延误处理</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="保证在交货延误时能够尽早通知用户的良好预警措施" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="具体措施说明" {...formLayout}>
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
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>物流</div>
                            <div className={styles.content}>
                                <Divider>汽运</Divider>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForCarTransport}
                                    rowKey='name1'
                                // isEditTable
                                // setNewData={setNewData}
                                />
                                <Divider>空运</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否存在空运" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="正常情况交货期(小时)" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<InputNumber />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="紧急情况交货期(小时)" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<InputNumber />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>发运</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="在发运数量上是否能够灵活处理" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>危化品处理</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否选择具有危险化学品合法运输资质的承运方" {...formLayout}>
                                            {getFieldDecorator('source', {
                                                initialValue: '',
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group value={'1'}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={2}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="证明材料" {...formLayout}>
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
                            </div>
                        </div>
                    </div>
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>供应商管控</div>
                            <div className={styles.content}>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForKeyMat}
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

export default Form.create()(ManagerAbility);