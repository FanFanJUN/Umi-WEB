import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification, countryListConfig } from '@/utils/commonProps'
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { onlyNumber } from '@/utils/index';
import { ComboAttachment } from '@/components';
import UploadFile from '../../../components/Upload/index'
import { findCodeByName } from '../../../services/supplierRegister'
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
    useEffect(() => {

    }, []);
    // 获取表单值
    function getFormValue() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                result = values
            }
        })
        return result;
    }
    //查代码
    async function nameChange() {
        const originalCompanyName = form.getFieldValue('originalCompanyName');
        triggerLoading(true)
        const { data, success, message: msg } = await findCodeByName({ name: originalCompanyName });
        if (success) {
            //setoriginalCode(data)
            form.setFieldsValue({
                'originalCode': data
            });
        }
        triggerLoading(false)
    }
    return (
        <Form >
            <Row>
                <Col span={16}>
                    <FormItem
                        label={"原厂公司名称"}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("originalCompanyName", {
                                    initialValue: initialValues && initialValues.originalCompanyName,
                                    rules: [{ required: !isView, message: '请输入完整原厂公司名称!', }]
                                })(
                                    <Input
                                        onBlur={nameChange}
                                        placeholder={"请输入完整原厂公司名称"}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"原厂代码"}
                        {...formItemLayout}
                    >
                        {
                            //<span>{originalCode}</span>
                            getFieldDecorator("originalCode", {
                                initialValue: initialValues && initialValues.originalCode,
                                rules: [{
                                    required: !isView,
                                    message: '请输入已有供应商代码的原厂名称带出原厂代码!'
                                }]
                            })(
                                <Input
                                    disabled={true}
                                />
                            )
                        }
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
                            isView ? <span></span> :
                                getFieldDecorator("agentBrand", {
                                    initialValue: initialValues && initialValues.agentBrand,
                                    rules: [{
                                        required: !isView,
                                        message: '请输入代理品牌!'
                                    }]
                                })(
                                    <Input
                                        placeholder={"请输入代理品牌"}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"代理国别"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("countryId", { initialValue: initialValues && initialValues.countryId, }),
                            getFieldDecorator("countryName", {
                                initialValue: initialValues && initialValues.countryName,
                                rules: [{
                                    required: !isView,
                                    message: '请选择代理国别!',
                                }]
                            })(
                                <ComboList
                                    {...countryListConfig}
                                    form={form}
                                    name="countryName"
                                    field={["countryId"]}
                                />
                            )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"原厂地址"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("originalAddress", {
                                    initialValue: initialValues && initialValues.originalAddress,
                                    rules: [{
                                        required: !isView,
                                        message: '请输入原厂地址!'
                                    }]
                                })(
                                    <Input
                                        placeholder={"请输入原厂地址"}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label={"营业执照"}
                    >
                        {
                            getFieldDecorator("businessLicenseDocIds", {
                                initialValue: initialValues && initialValues.businessLicenseDocIds,
                                rules: [{ required: !isView, message: "请上传营业执照" }]
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    accessType={['pdf', 'jpg', 'png']}
                                    warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                                    entityId={initData ? initData.businessLicenseDocId : null}
                                    type={isView ? "show" : ""}
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
                                initialValue: initialValues && initialValues.powerAttorneyDocIds,
                                rules: [{ required: !isView, message: "请上传代理证" }]
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    accessType={['pdf', 'jpg', 'png']}
                                    warning={'仅支持pdf,jpg,png格式，文件大小不超过10M'}
                                    entityId={initialValues ? initialValues.powerAttorneyDocId : null}
                                    type={isView ? "show" : ""}
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
