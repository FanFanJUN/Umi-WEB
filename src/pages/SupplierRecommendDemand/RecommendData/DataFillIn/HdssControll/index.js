/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:22
 * @LastEditTime: 2020-09-22 10:33:06
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/HdssControll/index.js
 * @Description: 产品有害物质管控 tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useEffect } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row, Col, Input, InputNumber, Divider, message } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../CommonUtil/UploadFile';
import { router } from 'dva';
import { requestGetApi, requestPostApi } from '../../../../../services/dataFillInApi';
import { filterEmptyFileds, checkNull, isEmptyArray } from '../CommonUtil/utils';

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

const HdssControll = ({ form, updateGlobalStatus }) => {

    const [data, setData] = useState({});
    const [tableTata, setTableTata] = useState([]);
    const [loading, setLoading] = useState(false);

    const { query: { id, type = 'add' } } = router.useLocation();

    const { getFieldDecorator, getFieldValue } = form;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await requestGetApi({ supplierRecommendDemandId: id, tabKey: 'hdssControllTab' });
            if (res.success) {
                res.data && setData(res.data);
                res.data && setTableTata(res.data.environmentalTestingEquipments);
            } else {
                message.error(res.message);
            }
            setLoading(false);
        };
        if (type !== 'add') {
            fetchData();
        }
    }, []);

    const columns = [
        {
            "title": "设备名称",
            "dataIndex": "equipmentName",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "设备型号",
            "dataIndex": "equipmentModel",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "检测项目（元素）",
            "dataIndex": "testingItem",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "备注",
            "dataIndex": "remark",
            "ellipsis": true,
            "editable": true,
            "inputType": 'TextArea',
        },
    ];

    function handleSave() {
        if (getFieldValue('haveEnvironmentalTestingEquipment')) {
            if (isEmptyArray(tableTata)) {
                message.info('列表至少填写一条设备信息！');
                return;
            }
        }
        form.validateFieldsAndScroll((error, value) => {
            console.log(value);
            if (error) return;
            const saveParams = {
                ...value,
                tabKey: 'hdssControllTab',
                rohsFileId: value.rohsFileId ? (value.rohsFileId)[0] : null,
                recommendDemandId: id || '676800B6-F19D-11EA-9F88-0242C0A8442E',
                environmentalTestingEquipments: tableTata || [],
            };
            requestPostApi(filterEmptyFileds(saveParams)).then((res) => {
                if (res && res.success) {
                    message.success('保存数据成功');
                    updateGlobalStatus();
                } else {
                    message.error(res.message);
                }
            })
        })
    }

    function setNewData(newData) {
        setTableTata(newData);
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
                        <Button key="save" type="primary" style={{ marginRight: '12px' }} onClick={() => handleSave()}>
                            保存
                        </Button>,
                    ] : null}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>产品有害物质管控</div>
                            <div className={styles.content}>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="有无自有环保检测设备" {...formLayout}>
                                            {getFieldDecorator('haveEnvironmentalTestingEquipment', {
                                                initialValue: type === 'add' ? true : data.haveEnvironmentalTestingEquipment,
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={true}>有</Radio>
                                                    <Radio value={false}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <EditableFormTable
                                    dataSource={tableTata || []}
                                    columns={columns}
                                    rowKey='id'
                                    setNewData={setNewData}
                                    isEditTable={type === 'add'}
                                    isToolBar={type === 'add'}
                                    recommendDemandId={id}
                                />
                                <Divider>RoHS</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="RoHS管控标准" {...formLayout}>
                                            {getFieldDecorator('haveRohs', {
                                                initialValue: type === 'add' ? true : data.haveRohs,
                                            })(
                                                <Radio.Group value={'1'}>
                                                    <Radio value={true}>有</Radio>
                                                    <Radio value={false}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="标准类型" {...formLayout}>
                                            {getFieldDecorator('standardTypeEnum', {
                                                initialValue: type === 'add' ? 'ROHS_10' : data.standardTypeEnum,
                                            })(
                                                <Radio.Group>
                                                    <Radio value={'ROHS_10'}>RoHS1.0</Radio>
                                                    <Radio value={'ROHS_20'}>RoHS2.0</Radio>
                                                    <Radio value={'ROHS_10_HALOGEN_FREE'}>RoHS1.0+无卤</Radio>
                                                    <Radio value={'ROHS_20_HALOGEN_FREE'}>RoHS2.0+无卤</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="RoHS检测报告" {...formLayout}>
                                            {getFieldDecorator('rohsFileId', {
                                                initialValue: type === 'add' ? '' : data.rohsFileId,
                                            })(
                                                <UploadFile
                                                    showColor={type !== 'add' ? true : false}
                                                    type={type !== 'add'}
                                                    entityId={data.rohsFileId}
                                                />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Divider>REACH</Divider>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="化学品注册、评估、许可和限制" {...formLayout}>
                                            {getFieldDecorator('chemicalsControl', {
                                                initialValue: type === 'add' ? true : data.chemicalsControl,
                                            })(
                                                <Radio.Group>
                                                    <Radio value={true}>有</Radio>
                                                    <Radio value={false}>无</Radio>
                                                </Radio.Group>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="备注" {...formLayout}>
                                            {getFieldDecorator('remark', {
                                                initialValue: type === 'add' ? '' : data.remark,
                                            })(<Input.TextArea></Input.TextArea>)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem label="附件材料" {...formLayout}>
                                            {getFieldDecorator('attachmentIds', {
                                                initialValue: type === 'add' ? '' : data.attachmentIds,
                                            })(<UploadFile
                                                showColor={type !== 'add' ? true : false}
                                                type={type === 'add' ? '' : 'show'}
                                                entityId={data.attachmentIds} />)}
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