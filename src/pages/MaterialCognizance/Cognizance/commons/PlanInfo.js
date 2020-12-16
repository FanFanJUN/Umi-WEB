import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList, AuthALink } from 'suid';
import UploadFile from '../../../../components/Upload/index'
import { CognizanceTypelist, MaterielCognlist } from '../../commonProps'
import { openNewTab, isEmpty } from '@/utils';
const { Item, create } = Form;
const { TextArea } = Input;
const { storage } = utils;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData,
    onOk = () => null,
    isEdit,
    cancel,
    admitype
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        planfrom
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const getModelRef = useRef(null)
    const getecommendRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    useEffect(() => {
        if (!isEdit) {
            selectanalysis(editformData)
        }
    }, [])
    function planfrom() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                if (isEmpty(val.attachment)) {
                    val.attachment = []
                }
                modifyinfluen = val;
                modifyinfluen = { ...modifyinfluen }
            }
        })
        return modifyinfluen ? modifyinfluen : false
    }
    function afterSelect(val) {
        //setSetupval(val.value)
        onOk(val.value);
    }

    function handleSingle() {
        getModelRef.current.handleModalVisible(true);

    }
    function selectanalysis(record) {
        form.setFieldsValue({
            'companyCode': record[0].corporation.code,
            'companyName': record[0].corporation.name,
            'purchaseCode': record[0].purchaseOrg.code,
            'purchaseName': record[0].purchaseOrg.name,
            'supplierCode': record[0].supplier.code,
            'supplierName': record[0].supplier.name,
            'originalFactoryCode': record[0].originSupplierCode,
            'originalFactoryName': record[0].originSupplierName,
            'materielTypeName': record[0].materielCategory.name,
            'materielTypeCode': record[0].materielCategory.code,
        });
    }
    // 准入明细
    function handleAdmit(val) {
        openNewTab(`supplier/recommend/admittance/manage/detail?id=${val.admittanceHeadId}`, '供应商推荐准入明细', false)
    }
    return (
        <>
            <div >
                <Row>
                    <Col span={10}>
                        <Item {...formLayout} label='公司名称' >
                            {isView ? <span>{editformData ? editformData.companyName : null}</span> :
                                (getFieldDecorator('companyCode', {
                                    initialValue: editformData ? editformData.companyCode : ''
                                }),
                                    getFieldDecorator('companyName', {
                                        initialValue: editformData ? editformData.companyName : '',
                                        rules: [{ required: true, message: "请输入公司名称！", }]
                                    })(
                                        <Input
                                            style={{
                                                width: '100%',
                                            }}
                                            disabled
                                            placeholder={'请公司名称'} />

                                    ))
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='采购组织名称' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.purchaseName : ''}</span> :
                                    (
                                        getFieldDecorator('purchaseCode', {
                                            initialValue: editformData ? editformData.purchaseCode : ''
                                        }),
                                        getFieldDecorator("purchaseName", {
                                            initialValue: editformData ? editformData.purchaseName : '',
                                            rules: [{ required: true, message: "请选择采购组织名称", }]
                                        })(
                                            <Input disabled />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.supplierName : ''}</span> :
                                    (
                                        getFieldDecorator('supplierCode', {
                                            initialValue: editformData ? editformData.supplierCode : ''
                                        }),
                                        getFieldDecorator("supplierName", {
                                            initialValue: editformData ? editformData.supplierName : '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入供应商名称'
                                                }
                                            ]
                                        })(
                                            <Input disabled />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='原厂名称' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.originalFactoryName : ''}</span> :
                                    (
                                        getFieldDecorator('originalFactoryCode', {
                                            initialValue: editformData ? editformData.originalFactoryCode : ''
                                        }),
                                        getFieldDecorator("originalFactoryName", {
                                            initialValue: editformData ? editformData.originalFactoryName : '',
                                        })(
                                            <Input disabled />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='物料分类' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.materielTypeName : ''}</span> :
                                    (
                                        getFieldDecorator('materielTypeCode', {
                                            initialValue: editformData ? editformData.materielTypeCode : ''
                                        }),
                                        getFieldDecorator("materielTypeName", {
                                            initialValue: editformData ? editformData.materielTypeName : '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入物料分类'
                                                }
                                            ]
                                        })(
                                            <Input disabled />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='认定物料类别' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.identifiedMaterialCategoryName : ''}</span> :
                                    (
                                        getFieldDecorator('identifiedMaterialCategoryId', { initialValue: editformData ? editformData.identifiedMaterialCategoryId : "" }),
                                        getFieldDecorator("identifiedMaterialCategoryName", {
                                            initialValue: editformData ? editformData.identifiedMaterialCategoryName : "",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择认定物料类别'
                                                }
                                            ]
                                        })(
                                            <ComboList disabled={isView === true || cancel === '2'}
                                                {...MaterielCognlist}
                                                showSearch={false}
                                                style={{ width: '100%' }}
                                                name='identifiedMaterialCategoryName'
                                                field={['identifiedMaterialCategoryId']}
                                                afterSelect={afterSelect}
                                                form={form}
                                                disabled={admitype === '1'}
                                            />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='认定类型' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.identificationTypeName : ''}</span> :
                                    (
                                        getFieldDecorator('identificationTypeId', { initialValue: editformData ? editformData.identificationTypeId : "" }),
                                        getFieldDecorator("identificationTypeName", {
                                            initialValue: editformData ? editformData.identificationTypeName : "",
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请选择认定类型'
                                                }
                                            ]
                                        })(
                                            <ComboList disabled={isView === true || cancel === '2'}
                                                {...CognizanceTypelist}
                                                showSearch={false}
                                                style={{ width: '100%' }}
                                                name='identificationTypeName'
                                                field={['identificationTypeId']}
                                                afterSelect={afterSelect}
                                                form={form}
                                                disabled={admitype === '1'}
                                            />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='计划说明' {...formLayout}>
                            {
                                isView ? <span>{editformData ? editformData.planDesc : ''}</span> :
                                    (
                                        getFieldDecorator("planDesc", {
                                            initialValue: editformData ? editformData.planDesc : '',
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '请输入计划说明'
                                                }
                                            ]
                                        })(
                                            <TextArea style={{ width: "100%" }}
                                                placeholder="请输入计划说明"
                                                maxLength={100}
                                                disabled={cancel === '2'}
                                            />
                                        )
                                    )

                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='附件' {...formLayout}>
                            {
                                getFieldDecorator("attachment", {
                                    initialValue: [],
                                })(
                                    <UploadFile
                                        title={"附件上传"}
                                        entityId={editformData ? editformData.enclosureId : null}
                                        type={isView || cancel === '2' ? "show" : ""}
                                    />
                                )

                            }
                        </Item>
                    </Col>
                    {
                        isView && admitype === '1' || isView && admitype === 1 ? <Col span={10}>
                            <Item label='准入单号' {...formLayout}>
                                {

                                    <AuthALink onClick={() => handleAdmit(editformData)}>{editformData ? editformData.admittanceNo : ''}</AuthALink>

                                }
                            </Item>
                        </Col> : null
                    }
                </Row>

            </div>
        </>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm