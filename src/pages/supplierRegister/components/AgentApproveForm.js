import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification, countryListConfig,SupplierConfigWithName} from '@/utils/commonProps'
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { onlyNumber } from '@/utils/index';
import { ComboAttachment } from '@/components';
import UploadFile from '../../../components/Upload/index'
import { findCodeByName } from '../../../services/supplierRegister'
import SearchTable from './SearchTable' 
import '../index.less'
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 }
};
const getAgentregRef = forwardRef(({
    isView,
    form,
    onCancel = () => null,
    onOk = () => null,
    initialValues = {},
    editData
}, ref,) => {
    useImperativeHandle(ref, () => ({
        getFormValue,
        form
    }));
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [loading, triggerLoading] = useState(false);
    const [initData, setInitData] = useState(false); 
    const [originalCode, setoriginalCode] = useState([]);
    const [newOriginalCode, setnewOriginalCode] = useState([]);
    useEffect(() => {
        const {
            id,
            ...other
        } = initialValues;
        const fields = {
            ...other
        }
        setFieldsValue(fields);
        setupAgent();
    }, []);
    function setupAgent() {
        let initData = [];
        if (editData && editData.supplierAgents !== undefined) {
            initData = editData.supplierAgents
        }
        let sedinitData = initData.length > 0 ? initData[0] : null;
        //let originalCode = initData.length > 0 && initData[0].originalCode ? initData[0].originalCode : ''
        let originalCode = initData.length > 0 && initData[0].newOriginalCode ? initData[0].newOriginalCode : ''
        setInitData(sedinitData)
        setoriginalCode(originalCode)
    }
    // 获取表单值
    function getFormValue() {
        // let result = false;
        // form.validateFieldsAndScroll((err, values) => {
        //     if (!err) {
        //         result = values
        //     }
        // })
        // console.log(result)
        // return result;
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {};
                Object.keys(values).forEach((key) => {
                    obj[key] = values[key] || null;
                });
                obj.newOriginalCode = newOriginalCode || '';
                result = {...initData,...obj};
            }
        });
        return result;
    }
    //查代码
    async function nameChange() {
        const originalCompanyName = form.getFieldValue('originalCompanyName');
        triggerLoading(true)
        const { data, success, message: msg } = await findCodeByName({ name: originalCompanyName });
        if (success) {
            setoriginalCode(data)
        }
        triggerLoading(false)
    }
    
    function handleSupplierChange(row) {
        setnewOriginalCode(row.code)
    };
    return (
        <Form >
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"原厂代码"}
                        {...formItemLayout}
                    >
                        {
                            <span>{initData ? initData.originalCode : ""}</span>}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"代码"}
                        {...formItemLayout}
                    >
                        {
                            <span>{newOriginalCode}</span>
                        }
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"原公司名称"}
                        {...formItemLayout}
                    >
                        {
                            <span>{initData ? initData.originalCompanyName : ""}</span>
                        }
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"修改为"}
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('newOriginalCompanyName', {
                                initialValue: initData ? initData.newOriginalCompanyName : '',
                                rules: [{ required: true, message: '请选择供应商' }]
                            })(
                                <SearchTable
                                    selectChange={handleSupplierChange}
                                    config={SupplierConfigWithName}
                                    placeholder="请选择供应商"
                                />
                            )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"代理品牌"}
                        {...formItemLayout}
                    >
                        {
                            <span>{initData ? initData.agentBrand : ""}</span>}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"修改为"}
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator("newAgentBrand", {
                                initialValue: initData ? initData.newAgentBrand : "",
                                rules: [{
                                    required: true,
                                    message: '请输入代理品牌!'
                                }]
                            })(
                                <Input
                                    placeholder={"请输入代理品牌"}
                                />
                            )}
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"代理国别"}
                        {...formItemLayout}
                    >
                        {<span>{initData ? initData.countryName : ''}</span>}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"原厂地址"}
                        {...formItemLayout}
                    >
                        {
                            <span>{initData ? initData.originalAddress : ""}</span>}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label={"营业执照"}
                    >
                        {
                            getFieldDecorator("businessLicenseDocIds", {
                                initialValue: [],
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    accessType={['pdf', 'jpg', 'png']}
                                    warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                                    entityId={initData ? initData.businessLicenseDocId : null}
                                    type={"show"}
                                />
                            )
                        }
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label={"代理证"}
                    >
                        {
                            getFieldDecorator("powerAttorneyDocIds", {
                                initialValue: [],
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    accessType={['pdf', 'jpg', 'png']}
                                    warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                                    entityId={initData ? initData.powerAttorneyDocId : null}
                                    type={"show"}
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        </Form>
    );
},
);

export default create()(getAgentregRef);
