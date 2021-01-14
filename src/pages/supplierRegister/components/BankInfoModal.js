import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { onlyNumber, isEmpty } from '@/utils/index';
import { getRelationDocId, saveBankVo } from '../../../services/supplierRegister'
import { baseUrl, gatewayUrl, basicServiceUrl } from '../../../utils/commonUrl'
import {
    provinceListConfig,
    cityListConfig,
    BankcodeConfigTable,
    unionPayCodeConfig,
    paymentTypeConfig,
    countryListConfig,
    BankCountryListConfig,
    oddunionPayCodeConfig,
    AreaConfig,
    CountryIdConfig
} from '@/utils/commonProps'
import SelectWithService from "../components/SelectWithService";
import SearchTable from './SearchTable'
import UploadFile from '../../../components/Upload/index'
import myContext from './ContextName'
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const BankInfoRef = forwardRef(({
    //visible,
    isOverseas = false,
    isView,
    form,
    onCancel = () => null,
    onOk = () => null,
    initialValues = {},
    edit,
    Modeltitle,
    countryId,
    editData = {},
    mergeData = () => null,
    type,
}, ref,) => {
    const count = useContext(myContext);
    const BankbaseRef = useRef(null);
    const getBankoversRef = useRef(null);
    const [dataSource, setDataSource] = useState([]);
    const [confirmLoading, setconfirmLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const [visible, setvisible] = useState(false);
    const [loading, triggerLoading] = useState(false);
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    useEffect(() => {
        form.setFieldsValue({ countryId: countryId })
        if (initialValues && isEmpty(initialValues.bankOwner)) {
            initialValues.bankOwner = count
        }
    }, [initialValues, countryId]);
    const title = Modeltitle;
    // 保存银行
    async function handleSave() {
        validateFieldsAndScroll(async (err, val) => {
            let params;
            if (!err) {
                if (val.openingPermit && val.openingPermit.length > 0 && !val.openingPermitId) {
                    await RelationDocId(val.openingPermit, val.openingPermitId).then(id => {
                        val.openingPermitId = id;
                    })
                }
                setconfirmLoading(true)
                if (type) {
                    params = { ...initialValues, ...val }
                    await onOk(params);
                } else {
                    params = val
                    await mergeData(val)

                }
                handleModalVisible(false);
                setconfirmLoading(false)
            }
        })
    }
    async function RelationDocId(ids, docId) {
        const { data, success, message: msg } = await getRelationDocId({ json: JSON.stringify(ids), docId: docId });
        if (success) {
            return data;
        }
    };
    function banknumber(val) {
        form.setFieldsValue({ bankName: val.name })
    }
    function handleModalVisible(flag) {
        setvisible(!!flag)
    }
    function changevalue(val) {
        form.setFieldsValue({
            'paymentName': val.name,
        });
    }
    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            title={edit ? "编辑" : "新增"}
            onCancel={onCancel}
            destroyOnClose={true}
            width="80vw"
            onCancel={() => handleModalVisible(false)}
            maskClosable={false}
            confirmLoading={confirmLoading}
            onOk={handleSave}
        >
            {/* <BankBase
                isView={isView}
                initialValues={initialValues}
                CNCountryId={CNCountryId}
                wrappedComponentRef={BankbaseRef}
            /> */}
            <Row className="formstyl">
                <Col span={8}>
                    <FormItem
                        label={"国家"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator('countryId', {
                                    initialValue: initialValues && initialValues.countryId
                                }),
                            getFieldDecorator("countryName", {
                                //initialValue: { key: CNCountryId, label: "中国" },
                                initialValue: initialValues && initialValues.countryId ? initialValues.countryName : '中国',
                                rules: [{
                                    required: true,
                                    message: '请选择国家!',
                                }]
                            })(
                                // <SelectWithService
                                //     //disabled={true}
                                //     labelInValue={true}
                                //     placeholder={"请选择国家"}
                                //     config={BankCountryListConfig}
                                // />
                                <ComboList
                                    style={{ width: '100%' }}
                                    form={form}
                                    name={'countryName'}
                                    field={['countryId']}
                                    store={{
                                        type: 'POST',
                                        autoLoad: false,
                                        url: `${baseUrl}/supplierRegister/listAllCountry`,
                                    }}
                                    placeholder={'选择国家'}
                                    {...CountryIdConfig}
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
                                getFieldDecorator('provinceId', {
                                    initialValue: initialValues && initialValues.provinceId
                                }),
                            getFieldDecorator("provinceName", {
                                initialValue: initialValues && initialValues.provinceName,
                            })(
                                // <SelectWithService
                                //     labelInValue={true}
                                //     placeholder={"请选择省"}
                                //     config={provinceListConfig}
                                //     params={{ countryId: getFieldValue("country") ? getFieldValue("country").key : "" }}
                                // />
                                <ComboList
                                    style={{ width: '100%' }}
                                    form={form}
                                    afterSelect={() => {
                                        setFieldsValue({
                                            cityId: '',
                                            cityName: '',
                                            countyId: '',
                                            countyName: '',
                                            address: '',
                                        });
                                    }}
                                    name={'provinceName'}
                                    field={['provinceId']}
                                    cascadeParams={{
                                        countryId: getFieldValue('countryId'),
                                    }}
                                    store={{
                                        params: {
                                            countryId: getFieldValue('countryId'),
                                        },
                                        type: 'GET',
                                        autoLoad: false,
                                        url: `${gatewayUrl}${basicServiceUrl}/region/getProvinceByCountry`,
                                    }}
                                    placeholder={'选择省'}
                                    {...AreaConfig}
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
                                getFieldDecorator('regionId', {
                                    initialValue: initialValues && initialValues.regionId
                                }),
                            getFieldDecorator("regionName", {
                                initialValue: initialValues && initialValues.regionName,
                            })(
                                // <SelectWithService
                                //     labelInValue={true}
                                //     placeholder={"请选择市"}
                                //     config={cityListConfig}
                                //     params={{ provinceId: getFieldValue("province") ? getFieldValue("province").key : "" }}
                                // />
                                <ComboList
                                    style={{ width: '100%' }}
                                    form={form}
                                    afterSelect={() => {
                                        setFieldsValue({
                                            countyId: '',
                                            countyName: '',
                                            address: '',
                                        });
                                    }}
                                    name={'regionName'}
                                    field={['regionId']}
                                    cascadeParams={{
                                        provinceId: getFieldValue('provinceId'),
                                    }}
                                    store={{
                                        params: {
                                            provinceId: getFieldValue('provinceId'),
                                        },
                                        type: 'GET',
                                        autoLoad: false,
                                        url: `${gatewayUrl}${basicServiceUrl}/region/getCityByProvince`,
                                    }}
                                    placeholder={'选择市'}
                                    {...AreaConfig}
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
                                getFieldDecorator("bankCode", { initialValue: initialValues && initialValues.bankCode }),
                            getFieldDecorator("bankCodeName", {
                                initialValue: initialValues && initialValues.bankCodeName,
                                //rules: [{ required: !isView, message: '请选择银行编码!', }]
                            })(
                                <ComboGrid
                                    //searchProperties={searchbank}
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
                                    initialValue: initialValues ? initialValues.unionpayCode : "",
                                    rules: [{ required: !isView, message: '请选择联行号!', }]
                                })(
                                    <SearchTable
                                        placeholder={"请选择联行号"}
                                        config={oddunionPayCodeConfig}
                                        selectChange={banknumber}
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
                                    initialValue: initialValues && initialValues.bankName,
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
                            isView ? <span>{editData ? editData.swift : ""}</span> :
                                getFieldDecorator("swift", {
                                    initialValue: initialValues ? initialValues.swift : "",
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
                                    initialValue: initialValues && initialValues.bankAddress,
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
                                    initialValue: initialValues && initialValues.bankAccount,
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
                                //getFieldDecorator("paymentCode", { initialValue: initialValues && initialValues.paymentCode }),
                                getFieldDecorator('paymentCode', {
                                    initialValue: initialValues && initialValues.paymentCode,
                                    rules: [{ required: !isView, message: '请选择银行控制代码!', }]
                                })(
                                    <ComboList
                                        showSearch={false}
                                        {...paymentTypeConfig}
                                        name='paymentCode'
                                        field={['paymentCode']}
                                        afterSelect={changevalue}
                                        form={form}
                                    />
                                )
                        }
                    </FormItem>
                </Col>
                <Col span={8}>
                    <FormItem
                        label={"银行控制名称"}
                        {...formItemLayout}
                    >
                        {
                            isView ? <span></span> :
                                getFieldDecorator('paymentName', {
                                    initialValue: initialValues && initialValues.paymentName,
                                    rules: [{ required: !isView, message: '请选择银行控制名称!', }]
                                })(
                                    // <ComboList
                                    //     showSearch={false}
                                    //     {...paymentTypeConfig}
                                    //     name='paymentName'
                                    //     field={['paymentCode']}
                                    //     form={form}
                                    // />
                                    <Input
                                        disabled={true}
                                        placeholder={"请选择银行控制名称"}
                                    />
                                )
                        }
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
                                    initialValue: initialValues && initialValues.bankOwner,
                                    rules: [{
                                        required: !isView,
                                        message: '请填写银行户主!'
                                    }]
                                })(
                                    <Input placeholder={"请填写供应商名称"} />
                                )}
                    </FormItem>
                </Col>
            </Row>
            <Row>
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
                                    entityId={initialValues ? initialValues.openingPermitId : null}
                                />
                            )
                        }
                    </FormItem>
                </Col>
            </Row>
        </Modal>
    );
},
);
export default create()(BankInfoRef);
