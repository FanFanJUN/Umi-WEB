import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState,useContext} from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { onlyNumber,isEmpty } from '@/utils/index';
import { ComboAttachment } from '@/components';
import UploadFile from '../../../components/Upload/index'
import myContext from './ContextName'
import {
    provinceListConfig,
    cityListConfig,
    BankcodeConfigTable,
    unionPayCodeConfig,
    paymentTypeConfig,
    countryListConfig,
    BankCountryListConfig
} from '@/utils/commonProps'
import SelectWithService from "../components/SelectWithService";
import '../index.less'
import { fromPairs } from 'lodash';
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const BankbaseRef = forwardRef(({
    isView,
    form,
    onCancel = () => null,
    onOk = () => null,
    initialValues = {},
    type = 'add',
    CNCountryId,
    loading }, ref,) => {

    useImperativeHandle(ref, () => ({
        handleModalVisible,
        getFormValue,
        form
    }));
    const count = useContext(myContext); 
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [bankcodeTab, setBankcode] = useState([]);
    const [initData, setInitData] = useState([]);
    const [countryId, setcountryId] = useState([]);
    const [visible, setvisible] = useState(false);
    useEffect(() => {
        const {
            id,
            ...other
        } = initialValues;
        const fields = {
            ...other
        }
        if (isEmpty(fields.bankOwner)) {
            fields.bankOwner = count
        }
        
        let initData = [], editData = [];
        editData.push(fields);
        if (editData && editData.length > 0) {
            initData = editData.map((item, index) => {
               
                item.country = {
                    key: item.countryId || item.country && item.country.key || "",
                    label: item.countryName || item.country && item.country.label || ""
                };
                setcountryId(item.country.key);
                if (item.province || item.provinceName || item.provinceId) {
                    item.province = {
                        key: item.provinceId || item.province && item.province.key || ""
                        , label: item.provinceName || item.province && item.province.label || ""
                    };
                }
                if (item.payment || item.paymentName || item.paymentCode) {
                    item.payment = {
                        key: item.paymentCode || item.payment && item.payment.key || ""
                        , label: item.paymentName || item.payment && item.payment.label || ""
                    };
                }
                if (item.region || item.regionName || item.regionId) {
                    item.region = {
                        key: item.regionId || item.region && item.region.key || "",
                        label: item.regionName || item.region && item.region.label || ""
                    };
                }
                // this.bankCodeName = item.bankCodeName;
                // this.bankCode = item.bankCode;
                delete item.countryId;
                delete item.countryName;
                delete item.provinceId;
                delete item.provinceName;
                delete item.regionId;
                delete item.regionName;
                // delete item.paymentCode;
                // delete item.paymentName;
                return item;
            })
        };
        console.log(initData)
        initData = initData.length > 0 ? initData[0] : null;
        setInitData(initData);
        setFieldsValue(initData);
        
    }, []);
    
    // async function BankcodeConfigTable() {
    //     let params = {code:'BANK_CODE','Q_EQ_frozen__bool':'0'}
    //     const { data, success, message: msg } = await getBankcodelist(params);
    //     if (success) {
    //         console.log(data)
    //         setBankcode(data)
    //     }
    // }
    function handleModalVisible(flag) {
        setvisible(!!flag)
      }
    function handleSubmit() {
        let addbanklist = form.validateFieldsAndScroll;
        return addbanklist;
    }
    function afterSelect(val) {
        form.setFieldsValue({ unionpayCode: val.code, bankName: val.name })
    }
    // 保存
    function getFormValue() {
        //let obj = {};
        //let initData = initData;
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let obj = {};
                Object.keys(values).forEach((key) => {
                if (key === "country") {
                    console.log(countryId)
                    obj[key + "Name"] = values[key].label;
                    obj[key + "Id"] = values[key].key  || countryId;
                } else if (key === "province" && values.province) {
                    obj[key + "Name"] = values[key].label;
                    obj[key + "Id"] = values[key].key;
                } else if (key === "region" && values.region) {
                    obj[key + "Name"] = values[key].label;
                    obj[key + "Id"] = values[key].key;
                } else if (key === "payment") {
                    obj[key + "Name"] = values[key].label;
                    obj[key + "Code"] = values[key].key;
                } else if (key === "bankCode") {
                    obj.bankCodeName = this.bankCodeName;
                    obj.bankCode = this.bankCode;
                } else {
                    obj[key] = values[key] || null;
                }
                obj[key] = values[key] || null;
                obj.country = countryId;
                });
                result = obj;
                console.log(obj)
            }
        })
        return result;
    }
    return (
        <Form >
            <Row className="formstyl">
                <Col span={8}>
                    <FormItem
                        label={"国家"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("country", {
                                    initialValue: { key: CNCountryId, label: "中国" },
                                    rules: [{
                                        required: !isView,
                                        type: "object",
                                        message: '请选择国家!',
                                    }]
                                })(
                                    <SelectWithService
                                        //disabled={true}
                                        labelInValue={true}
                                        placeholder={"请选择国家"}
                                        config={BankCountryListConfig}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"省"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("province", {
                                    //initialValue: "",
                                    // rules: [{
                                    //     required: !isView,
                                    //     message: '请选择省!',
                                    // }]
                                })(
                                    <SelectWithService
                                        labelInValue={true}
                                        placeholder={"请选择省"}
                                        config={provinceListConfig}
                                        params={{ countryId: getFieldValue("country") ? getFieldValue("country").key : "" }}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"市"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("region", {
                                    //initialValue: "",
                                    // rules: [{
                                    //     required: !isView,
                                    //     message: '请选择市!',
                                    // }]
                                })(
                                    <SelectWithService
                                        labelInValue={true}
                                        placeholder={"请选择市"}
                                        config={cityListConfig}
                                        params={{ provinceId: getFieldValue("province") ? getFieldValue("province").key : "" }}
                                    />
                                )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"银行编码"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                            getFieldDecorator("bankCode"),
                            getFieldDecorator("bankCodeName", {
                                initialValue: "",
                                rules: [{ required: !isView, message: '请选择银行编码!', }]
                            })(
                                <ComboGrid
                                    {...BankcodeConfigTable}
                                    form={form}
                                    name='bankCodeName'
                                    field={['bankCode']}
                                />
                            )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"联行号"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("unionpayCode", {
                                    initialValue: "",
                                    rules: [{ required: !isView, message: '请选择联行号!', }]
                                })(
                                    <ComboGrid
                                        {...unionPayCodeConfig}
                                        afterSelect={afterSelect}
                                        name='unionpayCode'
                                        form={form}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"银行名称"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("bankName", {
                                    initialValue: "",
                                    rules: [{
                                        required: !isView,
                                        message: '请选择联行号!', whitespace: !isView
                                    }]
                                })(
                                    <Input
                                        disabled={true}
                                        placeholder={"请选择联行号"}
                                    />
                                )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"SWIFT码"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span>{initData ? initData.swift : ""}</span> :
                                getFieldDecorator("swift", {
                                    initialValue: initData ? initData.swift : "",
                                    rules: [{ required: false, message: '请输入SWIFT码!' },
                                    { pattern: "^[A-Z0-9]{8,11}$", message: "只能输入8至11位的大写英文和数字" }]
                                })(
                                    <Input
                                        maxLength={11}
                                        placeholder={"请输入SWIFT码"}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"银行地址"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("bankAddress", {
                                    initialValue: "",
                                    rules: [{ required: false, message: '请输入银行地址!', whitespace: !isView }]
                                })(
                                    <Input
                                        placeholder={"请输入银行地址"}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"银行账号"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator("bankAccount", {
                                    initialValue: "",
                                    rules: [{ required: !isView, message: '请输入银行账号!' },
                                        // {pattern: "^[0-9]*$", message: "只能输入数字，最多25位"}
                                    ]
                                })(
                                    <Input
                                        onChange={onlyNumber}
                                        maxLength={25}
                                        placeholder={"请输入银行账号"}
                                    />
                                )}
                    </FormItem>
                </Col>

            </Row>
            <Row>
                <Col span={8}>
                    <FormItem
                        label={"银行控制代码"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                    getFieldDecorator("paymentName",
                                    getFieldDecorator('paymentCode'), {
                                    initialValue: "",
                                    rules: [{ required: true, message: '请选择银行控制代码!' }]
                                })(
                                    <ComboList
                                        showSearch={false}
                                        {...paymentTypeConfig}
                                        name='paymentName'
                                        field={['paymentCode']}
                                        form={form}
                                    />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"银行户主"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span>{}</span> :
                                getFieldDecorator("bankOwner", {
                                    initialValue: '',
                                    rules: [{
                                        required: !isView,
                                        message: '请填写银行户主!'
                                    }]
                                })(
                                    <Input placeholder={"请填写供应商名称"} />
                                )}
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        {...formItemLayout}
                        label={"开户许可证"}
                    >
                        {
                            getFieldDecorator("openingPermit", {
                                initialValue: [],
                                rules: [{ required: true, message: "请上传开户许可证" }]
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    entityId={initData ? initData.openingPermitId : null}
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

export default create()(BankbaseRef);
