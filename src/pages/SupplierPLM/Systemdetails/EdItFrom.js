import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message, Button } from 'antd';
import { buList } from '../commonProps'
import { ComboList, utils, AuthButton } from 'suid';
import { SystemdataSave, MasterdataList } from '../../../services/plmService'
import { PLMType, qualifiedList } from '../commonProps'
import { isEmpty } from '../../../utils/index'
import QualifiedModle from './qualifiedModle'
const { storage } = utils;

const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const commonFormRef = forwardRef(({
    form,
    title,
    onOk = () => null,
    modifydata = {},
    type
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
    }));
    const getecommendRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [supplier, setsupplier] = useState('');
    useEffect(() => {
    }, []);

    function handleSupplier() {
        getecommendRef.current.handleModalqualified(true)
    }
    // 合格供应商
    function selectanalysis(record) {
        form.setFieldsValue({
            'supplierId': record[0].supplier.id,
            'supplierCode': record[0].supplier.code,
            'supplierName': record[0].supplier.name,
            'supplierAbbreviation': record[0].supplier.abbreviation,
            'unitCode': record[0].buCode,
            'unitName': record[0].buName
        })
    }
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };
    function handleSubmit() {
        validateFieldsAndScroll(async (err, val) => {
            let params, business = [];
            if (!err) {
                business = await compareData()
                val.status === '有效' ? val.status = 0 : val.status = 1
                if (business.includes(val.unitCode)) {
                    if (type) {
                        params = { ...modifydata, ...val }
                    } else {
                        val.plmStatus = 0
                        params = val
                    }
                    masterSave(params)
                } else {
                    message.error('同步PLM系统主数据不存在该业务单元代码!');
                }
            }
        });
    }
    async function masterSave(params) {
        const { success, message: msg } = await SystemdataSave(params);
        if (success) {
            message.success('保存成功');
            onOk();
        } else {
            message.error(msg);
        }
    }
    // 主数据物料分类比对
    async function compareData() {
        let params = {}, newsdata = []
        const { data, success, message: msg } = await MasterdataList(params);
        if (success) {
            data.rows.map(item => {
                newsdata.push(item.unitCode)
            })
            return newsdata;
            //setbusiness(newsdata)
        }
    }
    return (
        <>
            <Modal
                visible={visible}
                title={title}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >

                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="供应商代码">
                            {
                                getFieldDecorator('supplierId', { initialValue: modifydata ? modifydata && modifydata.supplierId : '' }),
                                getFieldDecorator('supplierCode', {
                                    initialValue: modifydata && modifydata.supplierCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择供应商',
                                        },
                                    ],
                                })(

                                    <Input
                                        style={{
                                            width: '69%',
                                            marginRight: '1%',
                                        }}
                                        placeholder="请选择供应商" disabled />


                                    // <ComboList
                                    //     showSearch={true}
                                    //     style={{ width: '100%' }}
                                    //     {...qualifiedList}
                                    //     name='supplierCode'
                                    //     field={['supplierId']}
                                    //     searchProperties={['supplier.code', 'supplier.name']}
                                    //     form={form}
                                    //     afterSelect={hanleSupplier}
                                    // />
                                )
                            }
                            {!type || type ?
                                <Button
                                    style={{ width: '29%' }}
                                    onClick={() => handleSupplier()}
                                >选择</Button> : ''}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="供应商全称">
                            {getFieldDecorator('supplierName', {
                                initialValue: modifydata && modifydata.supplierName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择供应商名称',
                                    },
                                ],
                            })(
                                <Input placeholder="请选择供应商名称" disabled />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="业务单元代码">
                            {
                                //getFieldDecorator('unitId', { initialValue: modifydata ? modifydata && modifydata.unitId : '' }),
                                getFieldDecorator('unitCode', {
                                    initialValue: modifydata && modifydata.unitCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务单元代码',
                                        },
                                    ],
                                })(
                                    // <ComboList
                                    //     showSearch={true}
                                    //     style={{ width: '100%' }}
                                    //     {...buList}
                                    //     name='unitCode'
                                    //     field={['unitId']}
                                    //     form={form}
                                    //     afterSelect={handlBusiness}
                                    // />
                                    <Input placeholder="请选择业务单元名称" disabled />
                                )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="业务单元名称">
                            {getFieldDecorator('unitName', {
                                initialValue: modifydata && modifydata.unitName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择业务单元名称',
                                    },
                                ],
                            })(
                                <Input placeholder="请选择业务单元名称" disabled />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="供应商简称">
                            {getFieldDecorator('supplierAbbreviation', {
                                initialValue: modifydata && modifydata.supplierAbbreviation,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入供应商简称',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入供应商简称" disabled />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
            {/*** 合格通知单*/}
            <QualifiedModle
                modifyanalysis={selectanalysis}
                wrappedComponentRef={getecommendRef}
            />
        </>
    );
},
);

export default create()(commonFormRef);
