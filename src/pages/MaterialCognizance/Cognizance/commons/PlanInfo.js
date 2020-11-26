import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList } from 'suid';
import { onlyNumber } from '@/utils'
import RecommendModle from './recommendModle'
import InfluenceMaterielModal from '../commons/InfluenceMaterielModal'
import UploadFile from '../../../../components/Upload/index'
import { CognizanceTypelist, MaterielCognlist } from '../../commonProps'
import { isEmpty } from '@/utils';
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
    manual,
    cancel
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        planfrom
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const getRecommendRef = useRef(null);
    const getModelRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const [configure, setConfigure] = useState([]);
    useEffect(() => {

    }, [])
    function planfrom() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                if (isEmpty(val.attachment)) {
                    val.attachment = []
                }
                modifyinfluen = val;
            }
        })
        return modifyinfluen ? modifyinfluen : false
    }
    function afterSelect(val) {
        //setSetupval(val.value)
        onOk(val.value);
    }
    function handleSingle() {
        // if (manual) {
        //     //getMatermodRef.current.handleModalVisible(true);
        // }else {
        //     getModelRef.current.handleModalVisible(true);
        // }
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
                                                width: !isView && cancel !== '2' ? '75%' : '100%',
                                                marginRight: !isView && cancel !== '2' ? '1%' : '0%',
                                            }}
                                            disabled
                                            placeholder={'请公司名称'} />

                                    ))
                            }
                            {!isView && cancel !== '2' ?
                                <Button
                                    style={{ width: '24%' }}
                                    onClick={() => handleSingle()}
                                >选择</Button> : ''}
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
                                            initialValue: editformData ? editformData.purchaseCode : ''
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
                        !manual ? <Col span={10}>
                            <Item label='准入单号' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.admittanceNo : ''}</span> :
                                        getFieldDecorator("admittanceNo", {
                                            initialValue: '',
                                        })(
                                            <TextArea style={{ width: "100%" }}
                                                placeholder="请输入计划说明"
                                                maxLength={100}
                                            />
                                        )
                                }
                            </Item>
                        </Col> : null
                    }
                </Row>

            </div>
            <RecommendModle
                wrappedComponentRef={getRecommendRef}
            />
            <InfluenceMaterielModal
                modifyanalysis={selectanalysis}
                wrappedComponentRef={getModelRef}
            />
        </>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm