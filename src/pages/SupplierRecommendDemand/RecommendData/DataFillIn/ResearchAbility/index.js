/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:53:17
 * @LastEditTime: 2020-09-15 14:59:26
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/ResearchAbility/index.js
 * @Description: 研发能力 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import { router } from 'dva';
import moment from 'moment';
import { findRdCapabilityById, requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';

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

const ResearchAbility = ({ form }) => {

    const [data, setData] = useState({});
    const [dataOrigin, setDataOrigin] = useState([{ id: '1' }]);
    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    const { getFieldDecorator, setFieldsValue } = form;

    useEffect(() => {
        const fetchData = async () => {
            const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'researchAbilityTab' });
            if (res.success) {
                res.data && setData(res.data);
            } else {
                message.error(res.message);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // 专利/获奖情况
    const columns = [
        {
            "title": "专利号/获奖证书",
            "dataIndex": "patentsAwardsCertificate",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "成果说明",
            "dataIndex": "resultDescription",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "时间",
            "dataIndex": "date",
            "ellipsis": true,
            "editable": true,
            "inputType": 'DatePicker',
            render: (text, context) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        {
            "title": "专利所有者",
            "dataIndex": "possessor",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "是否涉及提供给长虹的产品",
            "dataIndex": "involveChanghong",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Select',
            "width": 168
        }
    ];

    // 已完成的新产品开发
    const columnsForFinish = [
        {
            "title": "产品名称",
            "dataIndex": "productName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "产品特点",
            "dataIndex": "productFeature",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "新品销售金额",
            "dataIndex": "salesPrice",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "总销售金额",
            "dataIndex": "totalSalesMoney",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "币种",
            "dataIndex": "currencyName",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Select',
        },
        {
            "title": "获奖情况",
            "dataIndex": "awardSituation",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "设计定型日期",
            "dataIndex": "designFinalizeDate",
            "ellipsis": true,
            "editable": true,
            "inputType": 'DatePicker',
            render: function (text, context) {
                return text && moment(text).format('YYYY-MM-DD');
            }
        }
    ];

    // 正在进行和计划进行的设计开发
    const columnsForProcess = [
        {
            "title": "项目名称",
            "dataIndex": "projectName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "项目内容",
            "dataIndex": "projectContent",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "项目人员构成",
            "dataIndex": "projectStaff",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "时间安排",
            "dataIndex": "datePlan",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "项目成果",
            "dataIndex": "projectResult",
            "ellipsis": true,
            "editable": true,
        }
    ];
    // 
    const columnsForProSta = [
        {
            "title": "使用标准名称/编号",
            "dataIndex": "standardName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "国家/行业标准名称、编号",
            "dataIndex": "countryIndustryStandard",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "先进指标",
            "dataIndex": "advancedIndicator",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "低于国家/行业标准的指标",
            "dataIndex": "lowerIndicator",
            "ellipsis": true,
            "editable": true,
        },
    ];

    function setNewData(newData) {
        setDataOrigin(newData);
    }

    function handleSave() {
        form.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                supplierCertificates: data.supplierCertificates,
                supplierContacts: data.supplierContacts,
                managementSystems: data.managementSystems,
            };
            requestPostApi({key: 'researchAbilityTab'}).then((res) => {
                if (res && res.success) {
                    message.success('保存研发能力成功');
                } else {
                    message.error(res.message);
                }
            });
        });
    }

    return (
        <div>
            <Spin spinning={loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="研发能力"
                    extra={type === 'add' ? [
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={handleSave}>
                            保存
                        </Button>,
                    ] : null}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>自主技术开发能力情况</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={12}>
                                        <FormItem label="自主技术开发能力" {...formLayout}>
                                            {getFieldDecorator('selfRdCapability', {
                                                initialValue: type === 'add' ? 1 : data.selfRdCapability,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '自主技术开发能力不能为空',
                                                    },
                                                ],
                                            })(
                                                <Radio.Group>
                                                    <Radio value={1}>完全具备</Radio>
                                                    <Radio value={2}>基本具备</Radio>
                                                    <Radio value={3}>不具备</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem label="说明" {...formLayout}>
                                            {getFieldDecorator('selfRdCapabilityRemark', {
                                                initialValue: type === 'add' ? '' : data.selfRdCapabilityRemark,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '说明不能为空',
                                                    },
                                                ],
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
                                <EditableFormTable
                                    dataSource={dataOrigin}
                                    columns={columns}
                                    rowKey='id'
                                    setNewData={setNewData}
                                    isEditTable
                                    isToolBar={type === 'add'}
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
                                            {getFieldDecorator('canTechnicalSupport', {
                                                initialValue: type === 'add' ? '' : data.canTechnicalSupport,
                                                // rules: [
                                                //     {
                                                //         required: true,
                                                //         message: '自主技术开发能力不能为空',
                                                //     },
                                                // ],
                                            })(
                                                <Radio.Group>
                                                    <Radio value={1}>是</Radio>
                                                    <Radio value={2}>否</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="前一年新产品的个数占总产品个数的比重" {...formLayout}>
                                            {getFieldDecorator('numberRate', {
                                                initialValue: type === 'add' ? '' : data.numberRate,
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
                                            {getFieldDecorator('saleMoneyRate', {
                                                initialValue: type === 'add' ? '' : data.saleMoneyRate,
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
                                            {getFieldDecorator('devMaxCycle', {
                                                initialValue: type === 'add' ? '' : data.devMaxCycle,
                                            })(
                                                <span>最长 <InputNumber style={{ width: '20%' }} />天 </span>
                                            )}
                                            &nbsp;&nbsp;&nbsp;
                                            {getFieldDecorator('devAverageCycle', {
                                                initialValue: type === 'add' ? '' : data.devAverageCycle,
                                            })(
                                                <span>最长 <InputNumber style={{ width: '20%' }} />天 </span>
                                            )}
                                            &nbsp;&nbsp;&nbsp;
                                            {getFieldDecorator('devMinCycle', {
                                                initialValue: type === 'add' ? '' : data.devMinCycle,
                                            })(
                                                <span>平均 <InputNumber style={{ width: '20%' }} />天 </span>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForFinish}
                                    rowKey='id'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                                <Divider>正在进行和计划进行的设计开发</Divider>
                                <EditableFormTable
                                    dataSource={[]}
                                    columns={columnsForProcess}
                                    rowKey='id'
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
                                    columns={columnsForProSta}
                                    rowKey='id'
                                    // setNewData={setNewData}
                                    isEditTable
                                />
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div >
    )
};

export default Form.create()(ResearchAbility);