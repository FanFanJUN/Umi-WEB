import React, { forwardRef, useImperativeHandle, useEffect, useState,useRef } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList} from 'suid';
import { onlyNumber} from '@/utils'
import RecommendModle from './recommendModle'
import InfluenceMaterielModal from '../commons/InfluenceMaterielModal'
import UploadFile from '../../../../components/Upload/index'
import {CognizanceTypelist,MaterielCognlist} from '../../commonProps'
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
    manual
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        basefrom
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const getRecommendRef = useRef(null);
    const getModelRef = useRef(null)
    const authorizations = storage.sessionStorage.get("Authorization");
    const [configure, setConfigure] = useState([]);
    useEffect(() => {

    }, [])
    function basefrom() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
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
        console.log(record)
        form.setFieldsValue({
            'corporationName': record[0].corporation.name,
            'smSupplierName': record[0].purchaseOrg.name,
            'createdDate': record[0].supplier.name,
            'originSupplierName': record[0].originSupplierName,
            'materielCategory': record[0].materielCategory.name
        });
    }
    return (
        <>
        <div >
            <Row>
                <Col span={10}>
                    <Item {...formLayout} label='公司名称' >
                        {isView ? <span>{}</span> :
                            getFieldDecorator('corporationName', {
                                initialValue: '',
                                rules: [{required: true, message: "请输入公司名称！",}]
                            })(
                                <Input
                                    style={{
                                        width: !isView ? '75%' : '100%',
                                        marginRight: !isView ? '1%' : '0%',
                                    }}
                                    disabled
                                    placeholder={'请公司名称'}/>
                                    
                            )}
                            {!isView ?
                            <Button
                                style={{width: '24%'}}
                                onClick={() => handleSingle()}
                            >选择</Button> : ''}
                    </Item>
                </Col>
                <Col span={10}>
                    <Item label='采购组织名称' {...formLayout}>
                        {
                            isView ? <span>{editformData ? editformData.smSupplierName : ''}</span> :
                            getFieldDecorator("smSupplierName", {
                                initialValue: '',
                                rules: [{ required: true, message: "请选择采购组织名称", }]
                            })(
                                <Input disabled />
                            )
                        }
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Item label='供应商名称' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入供应商名称'
                                    }
                                ]
                            })(
                                <Input disabled />
                            )
                        }
                    </Item>
                </Col>
                <Col span={10}>
                    <Item label='原厂名称' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.originSupplierName : ''}</span> :
                            getFieldDecorator("originSupplierName", {
                                initialValue: '',
                            })(
                                <Input disabled />
                            )
                        }
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Item label='物料分类' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.materielCategory : ''}</span> :
                            getFieldDecorator("materielCategory", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入物料分类'
                                    }
                                ]
                            })(
                                <Input disabled />
                            )
                        }
                    </Item>
                </Col>
                <Col span={10}>
                    <Item label='认定物料类别' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入认定物料类别'
                                    }
                                ]
                            })(
                                <ComboList disabled={isView === true}
                                    {...MaterielCognlist}
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    name='smPcnChangeTypeName' 
                                    field={['smPcnChangeTypeCode']} 
                                    afterSelect={afterSelect}
                                    form={form} 
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Item label='认定类型' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入认定类型'
                                    }
                                ]
                            })(
                                <ComboList disabled={isView === true}
                                    {...CognizanceTypelist}
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    name='smPcnChangeTypeName' 
                                    field={['smPcnChangeTypeCode']} 
                                    afterSelect={afterSelect}
                                    form={form} 
                                />
                            )
                        }
                    </Item>
                </Col>
                <Col span={10}>
                    <Item label='计划说明' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入计划说明'
                                    }
                                ]
                            })(
                                <TextArea style={{width: "100%"}}
                                    placeholder="请输入计划说明"
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Item label='附件' {...formLayout}>
                        {
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    entityId={editformData ? editformData.attachmentId : null}
                                    type={isView ? "show" : ""}
                                />
                            )
                        }
                    </Item>
                </Col>
                {
                    !manual ?  <Col span={10}>
                        <Item label='准入单号' {...formLayout}>
                            {
                                isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <TextArea style={{width: "100%"}}
                                        placeholder="请输入计划说明"
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