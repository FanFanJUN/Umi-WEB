import React, { Fragment, useState, useRef } from 'react';
import { Button, Form, Row, Input, Modal, message, Card, Col, Empty, InputNumber, Radio } from 'antd';
import { ExtTable, ExtModal, utils, ComboList } from 'suid';
import { limitScopeList, limitMaterialList } from '../../commonProps';
import { baseUrl } from '../../../../utils/commonUrl';
import { AutoSizeLayout } from '../../../../components'
import {
    addEnvironmentalProtectionData,
    addEnvironmentStandardLimitMaterialRelation,
    ESPDeleted,
    ESPFreeze,
    ESPMDelete,
    ESPMFreeze
} from '../../../../services/qualitySynergy'
import { getUserName, getUserId, getUserAccount, getUserTenantCode } from '../../../../utils'
import styles from './index.less'
import moment from 'moment'
const { authAction } = utils;
const { create, Item: FormItem } = Form;
const { confirm } = Modal;
// const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const DEVELOPER_ENV = true;
const formLayout = {
    labelCol: { span: 9, },
    wrapperCol: { span: 14, },
};
const LimitMaterial = ({ form }) => {
    // 环保标准
    const tableRef = useRef(null);
    const [ESPdata, setESPData] = useState({
        visible: false,
        modalSource: '',
        isView: false
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    // 限用物资
    const tableRightRef = useRef(null);
    const [selectedRightKeys, setSelectedRightKeys] = useState([]);
    const [selectedRight, setSelectedRight] = useState([]);
    const [data, setData] = useState({
        visible: false,
        modalSource: '',
        isView: false
    });
    const { getFieldDecorator, setFieldsValue, validateFields } = form;
    const columns = [
        { title: '环保标准代码', dataIndex: 'environmentalProtectionCode', width: 80 },
        { title: '环保标准名称', dataIndex: 'environmentalProtectionName', ellipsis: true, },
        { title: 'REACH环保符合性声明', dataIndex: 'reach', ellipsis: true, render: (text) => text ? '符合' : '不符合' },
        { title: '备注', dataIndex: 'note', ellipsis: true },
        { title: '排序号', dataIndex: 'orderNo', ellipsis: true, width: 80 },
        { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (text) => text ? '已冻结' : '未冻结' },
    ]
    const rightColums = [
        { title: '限用物质代码', dataIndex: 'name1', width: 200 },
        { title: '限用物质名称', dataIndex: 'name2', ellipsis: true, },
        { title: 'CAS.NO', dataIndex: 'name3', ellipsis: true, },
        { title: '限量', dataIndex: 'name4', ellipsis: true },
        { title: '基本单位代码', dataIndex: 'name5', ellipsis: true },
        { title: '均质材质中的含量(%)', dataIndex: 'name6', ellipsis: true },
        { title: '适用范围名称排序号', dataIndex: 'name7', ellipsis: true },
        { title: '冻结', dataIndex: 'name8', ellipsis: true },
        { title: '处理人', dataIndex: 'name9', ellipsis: true },
        { title: '处理时间', dataIndex: 'name10', ellipsis: true },
    ]
    const headerRight = <div>
        {
            authAction(<Button
                type='primary'
                onClick={() => buttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_UML_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRightKeys.length !== 1}
                key='QUALITYSYNERGY_LM_UML_EDIT'
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRightKeys.length === 0}
                key='QUALITYSYNERGY_LM_UML_DELETE'
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('freeze')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRightKeys.length === 0}
                key='QUALITYSYNERGY_LM_UML_FREEZE'
            >冻结</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                disabled={selectedRightKeys.length  === 0}
                key='QUALITYSYNERGY_LM_UML_THAW'
            >解冻</Button>)
        }
        {
            authAction(<Button
                onClick={() => buttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_UML_IMPORT'
            >批量导入</Button>)
        }
    </div>
    const EPStandardHaderLeft = <>
        {
            authAction(<Button
                type='primary'
                onClick={() => EPSbuttonClick('add')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_EPS_ADD'
            >新增</Button>)
        }
        {
            authAction(<Button
                onClick={() => EPSbuttonClick('edit')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_EPS_EDIT'
                disabled={selectedRowKeys.length !== 1}
            >编辑</Button>)
        }
        {
            authAction(<Button
                onClick={() => EPSbuttonClick('delete')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_EPS_DELETE'
                disabled={selectedRowKeys.length === 0}
            >删除</Button>)
        }
        {
            authAction(<Button
                onClick={() => EPSbuttonClick('freeze')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_EPS_FREEZE'
                disabled={selectedRowKeys.length === 0}
            >冻结</Button>)
        }
        {
            authAction(<Button
                onClick={() => EPSbuttonClick('thaw')}
                className={styles.btn}
                ignore={DEVELOPER_ENV}
                key='QUALITYSYNERGY_LM_EPS_THAW'
                disabled={selectedRowKeys.length === 0}
            >解冻</Button>)
        }
    </>
    // 限用物资按钮操作
    const buttonClick = (type) => {
        console.log('限用物资按钮操作')
        switch (type) {
            case 'add':
                setData((value) => ({ ...value, visible: true, modalSource: '', isView: false }));
                break;
            case 'edit':
                setData((value) => ({
                    ...value,
                    visible: true,
                    modalSource: selectedRow[selectedRow.length -1],
                    isView: type === 'detail'
                }));
                break;
            case 'freeze':
            case 'thaw':
                confirm({
                    title: '请确认是否删除选中技术资料类别数据',
                    onOk: () => {
                        console.log('确认删除', selectedRowKeys);
                    },
                });
                break;
            case 'delete':
                confirm({
                    title: '请确认是否删除选中技术资料类别数据',
                    onOk: () => {
                        console.log('确认删除', selectedRowKeys);
                    },
                });
                break;
        }
    }
    // 环保标准按钮操作
    const EPSbuttonClick = (type) => {
        console.log('环保标准按钮操作')
        switch (type) {
            case 'add':
                setESPData((value) => ({
                    ...value,
                    visible: true,
                    modalSource: '',
                    isView: false
                }));
                break;
            case 'edit':
                setESPData((value) => ({
                    ...value,
                    visible: true,
                    modalSource: selectedRow[selectedRow.length -1],
                    isView: type === 'detail'
                }));
                break;
            case 'freeze':
            case 'thaw':
                confirm({
                    title: `请确认是否${type === 'thaw' ? '解冻' : '冻结'}选中环保标准数据`,
                    onOk: async () => {
                        const res = await ESPFreeze({
                            frozen: type === 'freeze',
                            ids: selectedRowKeys.join()
                        })
                        if (res.success) {
                            message.success('冻结成功');
                            tableRef.current.remoteDataRefresh()
                        } else {
                            message.error(res.message)
                        }
                    },
                });
                break;
            case 'delete':
                confirm({
                    title: '请确认是否删除选中环保标准数据',
                    onOk: async () => {
                        const res = await ESPDeleted({ ids: selectedRowKeys.join() });
                        if (res.success) {
                            message.success('删除成功');
                            tableRef.current.remoteDataRefresh()
                        } else {
                            message.error(res.message)
                        }
                    },
                });
                break;
        }
    }
    // 限用物资新增/编辑
    function handleOk() {
        if (data.isView) {
            setData((value) => ({ ...value, visible: false }))
        } else {
            validateFields(async (errs, values) => {
                if (!errs) {
                    values.environmentalProtectionId = selectedRow[selectedRow.length -1].id;
                    values.environmentalProtectionCode = selectedRow[selectedRow.length -1].environmentalProtectionCode;
                    values.environmentalProtectionName = selectedRow[selectedRow.length -1].environmentalProtectionName;
                    delete values.basicUnitId;
                    if (data.modalSource) {
                        values = { ...data.modalSource, ...values }
                    }
                    const res = await addEnvironmentStandardLimitMaterialRelation({...values})
                    if (res.success) {
                        message.success('操作成功');
                        setData((value) => ({ ...value, visible: false }))
                        tableRightRef.current.remoteDataRefresh()
                    } else {
                        message.error(res.message)
                    }
                }
            })
        }
    }
    // 环保标准新增/编辑
    function handleESPOk() {
        if (ESPdata.isView) {
            setESPData((value) => ({ ...value, visible: false }))
        } else {
            validateFields(async (errs, values) => {
                if (!errs) {
                    values.exemptionExpireDate = moment(values.exemptionExpireDate).format('YYYY-MM-DD');
                    if (ESPdata.modalSource) {
                        values = { ...ESPdata.modalSource, ...values }
                    }
                    const res = await addEnvironmentalProtectionData(values)
                    if (res.success) {
                        message.success('操作成功');
                        setESPData((value) => ({ ...value, visible: false }))
                        tableRef.current.remoteDataRefresh()
                    } else {
                        message.error(res.message)
                    }
                }
            })
        }
    }
    return <Fragment>
        <Row className={styles.around}>
            <Col span={11}>
                <Card
                    title="环保标准"
                    bordered={false}
                >
                    <ExtTable
                        columns={columns}
                        store={{
                            url: `${baseUrl}/environmentalProtectionData/findByPage`,
                            type: 'GET',
                            params: {
                                quickSearchProperties: []
                            }
                        }}
                        ref={tableRef}
                        searchPlaceHolder="输入搜索项"
                        checkbox={true}
                        remotePaging={true}
                        allowCancelSelect={true}
                        selectedRowKeys={selectedRowKeys}
                        onSelectRow={(selectedRowKeys, selectedRows) => {
                            setSelectedRow(selectedRows);
                            setSelectedRowKeys(selectedRowKeys);
                        }}
                        toolBar={{
                            left: EPStandardHaderLeft
                        }}
                    />
                </Card>
            </Col>
            <Col span={13} className={styles.right}>
                <div className={styles.triangle}></div>
                <Card
                    title="限用物质"
                    bordered={false}
                    className={styles.maxHeight}
                >
                    {
                        selectedRowKeys.length !== 1 ? <Empty description="请选择左边的一条环保标准数据进行操作" className={styles.mt} /> :
                            <div>
                                <ExtTable
                                    columns={rightColums}
                                    checkbox={true}
                                    store={{
                                        url: `${baseUrl}/environmentStandardLimitMaterialRelation/findByPage`,
                                        type: 'GET',
                                        params: {
                                            environmentalProtectionCode: selectedRow[selectedRow.length -1].environmentalProtectionCode
                                        }
                                    }}
                                    searchPlaceHolder="输入搜索项"
                                    ref={tableRightRef}
                                    selectedRowKeys={selectedRightKeys}
                                    onSelectRow={(selectedRightKeys, selectedRows) => {
                                        setSelectedRight(selectedRows)
                                        setSelectedRightKeys(selectedRightKeys)
                                    }}
                                    toolBar={{
                                        left: headerRight
                                    }}
                                />
                            </div>

                    }

                </Card>
            </Col>
        </Row>
        {/* 限用物资新增/编辑弹框 */}
        {data.visible && <ExtModal
            centered
            destroyOnClose
            visible={data.visible}
            width={1000}
            okText="保存"
            onCancel={() => { setData((value) => ({ ...value, visible: false })) }}
            onOk={() => { handleOk() }}
            title={data.modalSource ? '编辑' : '新增'}
        >
            <Form>
                <Row>
                    <Col span={12}>
                        <FormItem label='限用物质代码' {...formLayout}>
                            {
                                getFieldDecorator('limitMaterialId'),
                                getFieldDecorator('limitMaterialCode', {
                                    initialValue: data.modalSource && data.modalSource.limitMaterialCode,
                                    rules: [{ required: true, message: '请选择限用物质代码' }]
                                })(<ComboList
                                    form={form}
                                    {...limitMaterialList}
                                    name='limitMaterialCode'
                                    field={['limitMaterialId', 'limitMaterialName', 'basicUnitCode', 'basicUnitId', 'basicUnitName', 'casNo']}
                                />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='限用物质名称' {...formLayout}>
                            {
                                getFieldDecorator('limitMaterialName', {
                                    initialValue: data.modalSource && data.modalSource.limitMaterialName,
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='CAS.NO' {...formLayout}>
                            {
                                getFieldDecorator('casNo', {
                                    initialValue: data.modalSource && data.modalSource.casNo,
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='限量' {...formLayout}>
                            {
                                getFieldDecorator('limitNumber', {
                                    initialValue: data.modalSource && data.modalSource.limitNumber,
                                    rules: [{ required: true, message: '请填写限量' }]
                                })(<InputNumber
                                    style={{ width: '100%' }}
                                    precision={2}
                                    step={0.01}
                                    formatter={value => `${value ? value + '%' : ''}`}
                                    parser={value => value.replace('%', '')}
                                    min={0} max={100}
                                />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='基本单位' {...formLayout}>
                            {
                                getFieldDecorator('basicUnitId'),
                                getFieldDecorator('basicUnitCode'),
                                getFieldDecorator('basicUnitName', {
                                    initialValue: data.modalSource && data.modalSource.basicUnitName,
                                })(<Input disabled />)

                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label='均质材质中的含量(%)' {...formLayout}>
                            {
                                getFieldDecorator('materialWeight', {
                                    initialValue: data.modalSource && data.modalSource.materialWeight,
                                    rules: [{ required: true, message: '请填写均质材质中的含量' }]
                                })(<Input precision={8} />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='适用范围' {...formLayout}>
                            {
                                getFieldDecorator('practicalRangeId'),
                                getFieldDecorator('practicalRangeCode'),
                                getFieldDecorator('practicalRangeName', {
                                    initialValue: data.modalSource && data.modalSource.practicalRangeName,
                                    rules: [{ required: true, message: '请选择适用范围' }]
                                })(<ComboList form={form} {...limitScopeList}
                                    name='practicalRangeName'
                                    field={['practicalRangeId', 'practicalRangeCode']}
                                />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label=' 排序号' {...formLayout}>
                            {
                                getFieldDecorator('orderNo', {
                                    initialValue: data.modalSource && data.modalSource.orderNo,
                                })(<InputNumber style={{ width: '100%' }} />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <FormItem label='处理人' {...formLayout}>
                            {
                                getFieldDecorator('conductorId', { initialValue: getUserId() }),
                                getFieldDecorator('conductorAccount', { initialValue: getUserAccount() }),
                                getFieldDecorator('tenantCode', { initialValue: getUserTenantCode() }),
                                getFieldDecorator('conductorName', {
                                    initialValue: data.modalSource ? data.modalSource.conductorName : getUserName(),
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem label=' 处理时间' {...formLayout}>
                            {
                                getFieldDecorator('conductorDate', {
                                    initialValue: data.modalSource ? data.modalSource.conductorDate : moment().format('YYYY-MM-DD'),
                                })(<Input disabled />)
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </ExtModal>}
        {/* 环保标准新增/编辑弹框 */}
        {ESPdata.visible && <ExtModal
            centered
            destroyOnClose
            visible={ESPdata.visible}
            okText="保存"
            onCancel={() => { setESPData((value) => ({ ...value, visible: false })) }}
            onOk={() => { handleESPOk() }}
            title={ESPdata.modalSource ? '编辑环保标准' : '新增环保标准'}
        >
            <Form>
                <Row>
                    <FormItem label='环保标准代码' {...formLayout}>
                        {
                            getFieldDecorator('environmentalProtectionCode', {
                                initialValue: ESPdata.modalSource && ESPdata.modalSource.environmentalProtectionCode,
                                rules: [{ required: true, message: '请填写环保标准代码' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label='环保标准名称' {...formLayout}>
                        {
                            getFieldDecorator('environmentalProtectionName', {
                                initialValue: ESPdata.modalSource && ESPdata.modalSource.environmentalProtectionName,
                                rules: [{ required: true, message: '请填写环保标准名称' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>

                <Row>
                    <FormItem label='REACH环保符合性声明' {...formLayout}>
                        {
                            getFieldDecorator('reach', {
                                initialValue: ESPdata.modalSource ? ESPdata.modalSource.reach : true,
                                rules: [{ required: true, message: '请填写REACH环保符合性声明' }]
                            })(<Radio.Group>
                                <Radio value={true}>符合</Radio>
                                <Radio value={false}>不符合</Radio>
                            </Radio.Group>)
                        }
                    </FormItem>

                </Row>
                <Row>
                    <FormItem label='备注' {...formLayout}>
                        {
                            getFieldDecorator('note', {
                                initialValue: ESPdata.modalSource && ESPdata.modalSource.note,
                                rules: [{ required: true, message: '请填写限量' }]
                            })(<Input />)
                        }
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label=' 排序号' {...formLayout}>
                        {
                            getFieldDecorator('orderNo', {
                                initialValue: ESPdata.modalSource && ESPdata.modalSource.orderNo,
                                rules: [{ required: true, message: '请填写限量' }]
                            })(<InputNumber min={0} style={{ width: '100%' }} />)
                        }
                    </FormItem>
                </Row>
            </Form>
        </ExtModal>}
    </Fragment>

}
export default create()(LimitMaterial)