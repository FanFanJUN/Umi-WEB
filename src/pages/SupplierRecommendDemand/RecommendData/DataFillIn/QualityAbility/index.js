/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:10
 * @LastEditTime: 2020-09-18 14:25:32
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/QualityAbility/index.js
 * @Description: 质量能力
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Row, Col, Divider, Radio, Input, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../CommonUtil/UploadFile';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds } from '../CommonUtil/utils';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};

const QualityAbility = ({ form }) => {

    const [data, setData] = useState({});
    const [keyControlProcesses, setkeyControlProcesses] = useState([]);
    const [keyTestingEquipments, setkeyTestingEquipments] = useState([]);
    const [cannotTestItems, setcannotTestItems] = useState([]);
    const [finishedProductQualities, setfinishedProductQualities] = useState([]);
    const [materialQualities, setmaterialQualities] = useState([]);
    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    const { getFieldDecorator, getFieldValue } = form;

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'qualityAbilityTab' });
            if (res.success) {
                res.data && setData(res.data);
                setkeyControlProcesses(res.data.keyControlProcesses);
                setkeyTestingEquipments(res.data.keyTestingEquipments);
                setcannotTestItems(res.data.finishedProductQualities);
                setfinishedProductQualities(res.data.finishedProductQualities);
                setmaterialQualities(res.data.materialQualities);
            } else {
                message.error(res.message);
            }
            setLoading(false);
        };
        if (type !== 'add') {
            fetchData();
        }
    }, []);

    // 重点控制工序
    const columnsForKeyControl = [
        {
            "title": "工序名称",
            "dataIndex": "name",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "重点控制工序现场是否有标志和控制",
            "dataIndex": "exsitFlagControl",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Select',
        },
    ];
    // 关键检测、实验设备
    const columnsForProKeyPro = [
        {
            "title": "工厂名称",
            "dataIndex": "factoryName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "设备名称",
            "dataIndex": "equipmentName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "规格型号",
            "dataIndex": "specificationModel",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "生产厂家",
            "dataIndex": "manufacturer",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "产地",
            "dataIndex": "originPlace",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "购买时间",
            "dataIndex": "buyDate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'DatePicker',
        },
        {
            "title": "数量",
            "dataIndex": "number",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "检测项目",
            "dataIndex": "testItem",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "精度",
            "dataIndex": "accuracy",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "备注",
            "dataIndex": "emark",
            "ellipsis": true,
            "editable": true,
            "inputType": 'TextArea',
        }
    ];

    // 
    const columnsForProject = [
        {
            "title": "无能力检测项目",
            "dataIndex": "cannotTestItem",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "委托实验部门（检测机构）",
            "dataIndex": "testOrganization",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "检测周期",
            "dataIndex": "testCycle",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "周期单位",
            "dataIndex": "cycleUnit",
            "ellipsis": true,
            "editable": true,
        },
    ];

    // 成品检验项目
    const columnsForFinishPro = [
        {
            "title": "产品",
            "dataIndex": "product",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "检验项目",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "自检/外检",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "检验类型",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "检验周期",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "周期单位",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
    ];

    // 原材料质量状况
    const columnsForQuality = [
        {
            "title": "产品",
            "dataIndex": "product",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "原材料名称及规格型号/牌号",
            "dataIndex": "originModelBrand",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "物料入厂验收合格率",
            "dataIndex": "materialQualifiedRate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'percentInput',
        },
        {
            "title": "物料使用不良率",
            "dataIndex": "materialUseBadRate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'percentInput',
        },
    ];

    // 成品质量状况
    const columnsForFinishQua = [
        {
            "title": "产品",
            "dataIndex": "product",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "产品直通率",
            "dataIndex": "productStraightInRate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "成品检验合格率",
            "dataIndex": "testQualifiedRate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "成品出厂合格率",
            "dataIndex": "leaveFactoryQualifiedRate",
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
                tabKey: 'qualityAbilityTab',
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

    function setNewData(newData, type) {
        switch (type) {
            case 'keyControlProcesses':
                setkeyControlProcesses(newData);
                break;
            case 'keyTestingEquipments':
                setkeyTestingEquipments(newData);
                break;
            case 'cannotTestItems':
                setcannotTestItems(newData);
                break;
            case 'materialQualities':
                setmaterialQualities(newData);
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <Spin spinning={loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="质量控制"
                    extra={type === 'add' ? [
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
                            保存
                        </Button>,
                    ] : null}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>企业质量保证能力</div>
                            <div className={styles.content}>
                                <Divider>检测范围</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="材料入厂检验" {...formLayout}>
                                            {getFieldDecorator('materialIncomeInspection', {
                                                initialValue: type === 'add' ? '' : data.materialIncomeInspection,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="生产过程检验" {...formLayout}>
                                            {getFieldDecorator('productionProcessInspection', {
                                                initialValue: type === 'add' ? '' : data.productionProcessInspection,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="出厂检验" {...formLayout}>
                                            {getFieldDecorator('routineTest', {
                                                initialValue: type === 'add' ? '' : data.routineTest,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>重点控制工序</Divider>
                                <EditableFormTable
                                    dataSource={keyControlProcesses}
                                    columns={columnsForKeyControl}
                                    rowKey='id'
                                    setNewData={setNewData}
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                    tableType='keyControlProcesses'
                                />
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="关键工序是否实行了SPC控制" {...formLayout}>
                                            {getFieldDecorator('spcControl', {
                                                initialValue: type === 'add' ? '' : data.spcControl,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否有可靠性实验室" {...formLayout}>
                                            {getFieldDecorator('accessibilityLab', {
                                                initialValue: type === 'add' ? '' : data.accessibilityLab,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="是否制定试验计划并实施" {...formLayout}>
                                            {getFieldDecorator('testPlan', {
                                                initialValue: type === 'add' ? '' : data.testPlan,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>是</Radio>
                                                <Radio value={false}>否</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="是否培训" {...formLayout}>
                                            {getFieldDecorator('inspectorTrain', {
                                                initialValue: type === 'add' ? '' : data.inspectorTrain,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="资质认定" {...formLayout}>
                                            {getFieldDecorator('inspectorCertification', {
                                                initialValue: type === 'add' ? '' : data.inspectorCertification,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="产品追溯" {...formLayout}>
                                            {getFieldDecorator('productTracking', {
                                                initialValue: type === 'add' ? '' : data.productTracking,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="FMEA管理（过程）" {...formLayout}>
                                            {getFieldDecorator('productCertification', {
                                                initialValue: type === 'add' ? '' : data.productCertification,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>具备</Radio>
                                                <Radio value={false}>不具备</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>关键检测、实验设备（仪器、仪表、可靠性实验设备等）</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="设备清单" {...formLayout}>
                                            {getFieldDecorator('equipmentListFileIds', {
                                                initialValue: type === 'add' ? '' : data.equipmentListFileIds,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <UploadFile
                                                    showColor={type !== 'add' ? true : false}
                                                    type={type !== 'add'}
                                                    entityId={data.equipmentListFileIds}
                                                />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={keyTestingEquipments}
                                    columns={columnsForProKeyPro}
                                    rowKey='id'
                                    setNewData={setNewData}
                                    tableType='keyTestingEquipments'
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                />
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="企业有无目前无法检测的检测项目" {...formLayout}>
                                            {getFieldDecorator('haveCannotTestItem', {
                                                initialValue: type === 'add' ? '' : data.haveCannotTestItem,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Radio.Group>
                                                <Radio value={true}>有</Radio>
                                                <Radio value={false}>无</Radio>
                                            </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={cannotTestItems}
                                    columns={columnsForProject}
                                    rowKey='id'
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                    setNewData={setNewData}
                                    tableType='cannotTestItems'
                                />
                                <Divider>不检测项目</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="例举" {...formLayout}>
                                            {getFieldDecorator('noTestItem', {
                                                initialValue: type === 'add' ? '' : data.noTestItem,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>次年加强检测的手段、措施</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="从硬件上计划进哪些检测设备（仪表仪器" {...formLayout}>
                                            {getFieldDecorator('planBuyEquipment', {
                                                initialValue: type === 'add' ? '' : data.planBuyEquipment,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="从软件上有何措施" {...formLayout}>
                                            {getFieldDecorator('softwareStep', {
                                                initialValue: type === 'add' ? '' : data.softwareStep,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>产品质量控制流程简介及成品出货检验规范</Divider>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="产品质量控制流程简介" {...formLayout}>
                                            {getFieldDecorator('qualityControlBrief', {
                                                initialValue: type === 'add' ? '' : data.qualityControlBrief,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="附件" {...formLayout}>
                                            {getFieldDecorator('qualityControlBriefFileIds', {
                                                initialValue: type === 'add' ? '' : data.qualityControlBriefFileIds,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<UploadFile
                                                showColor={type !== 'add' ? true : false}
                                                type={type !== 'add'}
                                                entityId={data.qualityControlBriefFileIds}
                                            />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="成品检验规范" {...formLayout}>
                                            {getFieldDecorator('finishedProductTestNorm', {
                                                initialValue: type === 'add' ? '' : data.finishedProductTestNorm,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<Input.TextArea />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="成品检验规范附件" {...formLayout}>
                                            {getFieldDecorator('finishedProductTestNormFileIds', {
                                                initialValue: type === 'add' ? '' : data.finishedProductTestNormFileIds,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(<UploadFile
                                                showColor={type !== 'add' ? true : false}
                                                type={type !== 'add'}
                                                entityId={data.finishedProductTestNormFileIds}
                                            />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>成品检验项目</Divider>
                                <EditableFormTable
                                    dataSource={finishedProductQualities}
                                    columns={columnsForFinishPro}
                                    rowKey='id'
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                    setNewData={setNewData}
                                    tableType='finishedProductQualities'
                                />
                                <Divider>原材料质量状况</Divider>
                                <EditableFormTable
                                    dataSource={materialQualities}
                                    columns={columnsForQuality}
                                    rowKey='id'
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                    setNewData={setNewData}
                                    tableType='materialQualities'
                                />
                                <Divider>成品质量状况</Divider>
                                <EditableFormTable
                                    dataSource={finishedProductQualities}
                                    columns={columnsForFinishQua}
                                    rowKey='id'
                                />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(QualityAbility);