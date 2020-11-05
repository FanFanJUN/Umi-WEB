import React, { forwardRef, useImperativeHandle, useEffect, useState,useRef } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList} from 'suid';
import { onlyNumber} from '@/utils'
import UploadFile from '../../../../components/Upload/index'
import recommendModle from './recommendModle'
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
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        basefrom
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const getMatermodRef = useRef(null);
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
        console.log(getMatermodRef)
        //getMatermodRef.current.handleModalVisible(true);
    }
    return (
        <>
        <div >
            <Row>
                <Col span={10}>
                    <Item {...formLayout} label='公司名称' >
                        {isView ? <span>{}</span> :
                            getFieldDecorator('supplierVo.name', {
                                initialValue: '',
                                rules: [{required: true, message: "请输入公司名称！",}]
                            })(
                                <Input
                                    style={{
                                        width: !isView ? '80%' : '100%',
                                        marginRight: !isView ? '1%' : '0%',
                                    }}
                                    disabled
                                    placeholder={'请公司名称'}/>
                                    
                            )}
                            {!isView ?
                            <Button
                                style={{width: '18%'}}
                                onClick={() => handleSingle()}
                            >选择</Button> : ''}
                    </Item>
                </Col>
                <Col span={10}>
                    <Item label='采购组织名称' {...formLayout}>
                        {
                            isView ? <span>{editformData ? editformData.smSupplierName : ''}</span> :
                            getFieldDecorator("smSupplierName", {
                                initialValue: authorizations.userName,
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
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
                                initialValue: '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入原厂名称'
                                    }
                                ]
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
                            isView ? <span>{editformData ?  editformData.createdDate : ''}</span> :
                            getFieldDecorator("createdDate", {
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
                                <Input disabled />
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
                                <Input disabled />
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
                <Col span={10}>
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
                </Col>
            </Row>
                      
        </div>
        <recommendModle 
            wrappedComponentRef={getMatermodRef} 
        /> 
       </>  
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm