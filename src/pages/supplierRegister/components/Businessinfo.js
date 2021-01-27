import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Icon, Input, Col, message, Button } from 'antd';
import { utils, ExtTable, ComboList } from 'suid';
import { AddButtonWrapper } from './style'
import MainClient from './MainClient'
import ThreeYearIncome from './ThreeYearIncome'
import { checkCardNo, onlyNumber, onMailCheck, toUpperCase, getLineCode } from '@/utils/index'
import { purchaseCompanyProps, FieldconfigureList } from '@/utils/commonProps'
const { create } = Form;
const FormItem = Form.Item;

const BusinessRef = forwardRef(({
    form,
    editformData = {},
    editData = {},
    isView,
    businesshide = [],
    isOverseas = null
}, ref) => {
    useImperativeHandle(ref, () => ({
        getALLbusinCheck,
        businerTemporary,
        form
    }));
    const MainClientRef = useRef(null);
    const ThreeYearRef = useRef(null);
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [keys, setKey] = useState(0);
    const [lineCode, setLineCode] = useState(1);
    useEffect(() => {
        let initData = [{ keyId: keys, lineCode: getLineCode(lineCode) }];
        setLineCode(lineCode + 1);
        setDataSource(initData)
    }, [])
    const formItemLayout = {
        labelCol: { span: 3 },
        wrapperCol: { span: 15 },
    };
    const otherformItemLayout = {
        labelCol: { span: 2 },
        wrapperCol: { span: 22 },
    };
    // 暂存
    function businerTemporary() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (values) {
                let endData = values;
                businesshide.map((item, index) => {
                    if (item.verifi !== '3' && item.key === "majorCustomersVos") {
                        const { mainTemporary } = MainClientRef.current;
                        const getMaSaa = mainTemporary();
                        if (getMaSaa) {
                            endData.extendVo = getMaSaa;
                        }
                    }
                    if (item.verifi !== '3' && item.key === "supplierRecentIncomes") {
                        const { ThreeTemporary } = ThreeYearRef.current;
                        const incomeVal = ThreeTemporary();
                        if (incomeVal) {
                            endData.supplierRecentIncomes = incomeVal;
                        }
                    }
                })
                result = endData
            }
        });

        return result;
    }
    // 获取表单值
    function getALLbusinCheck() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let endData = values, getMaSaa, incomeVal;
                for (let item of businesshide) {
                    if (item.verifi !== '3' && item.key === "majorCustomersVos") {
                        const { getMainclient } = MainClientRef.current;
                        getMaSaa = getMainclient();
                        if (getMaSaa) {
                            endData.extendVo = getMaSaa;
                        } else {
                            return false;
                        }

                    }

                    if (item.verifi !== '3' && item.key === "supplierRecentIncomes") {
                        const { getThreeYear } = ThreeYearRef.current;
                        incomeVal = getThreeYear();
                        if (incomeVal) {
                            endData.supplierRecentIncomes = incomeVal;
                        } else {
                            return false;
                        }
                    }
                }
                result = endData
            }

        });
        return result;
    }
    editData = editformData;
    return (
        <Form>
            {
                businesshide.map((item, index) => {
                    if (item.verifi === '0' || item.verifi === '1' || item.verifi === '2') {
                        return (
                            <>
                                {item.key === "enterpriseProfile" ? <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={'供应商简介'}
                                        style={{ marginBottom: '5px' }}
                                    >
                                        {
                                            isView ? <div>
                                                {editData && editData.supplierVo ? editData.supplierVo.enterpriseProfile : ''}</div> :
                                                getFieldDecorator("supplierVo.enterpriseProfile", {
                                                    initialValue: editData && editData.supplierVo ? editData.supplierVo.enterpriseProfile : '',
                                                    rules: [{ required: item.verifi === '0', message: "请输入供应商简介", whitespace: true }]
                                                })(
                                                    <Input.TextArea
                                                        disabled={item.verifi === '2'}
                                                        maxLength={250}
                                                        placeholder={"请输入供应商简介,主要应包括人数、地址、经营范围、拟准入产品生产能力、资质等信息。"} />
                                                )
                                        }
                                    </FormItem>
                                </Row> : null}
                                {item.key === "businessScope" ? <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={'供应商经营范围'}
                                        style={{ marginBottom: '5px' }}
                                    >
                                        {
                                            isView ? <div>
                                                {editData && editData.supplierVo ? editData.supplierVo.businessScope : ''}</div> :
                                                getFieldDecorator("supplierVo.businessScope", {
                                                    initialValue: editData && editData.supplierVo ? editData.supplierVo.businessScope : '',
                                                    rules: [{ required: item.verifi === '0', message: "请输入供应商经营范围", whitespace: true }]
                                                })(
                                                    <Input.TextArea disabled={item.verifi === '2'} maxLength={250} placeholder={"请输入供应商经营范围"} />
                                                )
                                        }
                                    </FormItem>
                                </Row> : null}
                                {item.key === "majorCustomersVos" ? <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span>
                                            {
                                                item.verifi === '0' ? <label className="ant-form-item-required" title=""></label> : ''
                                            }
                                            主要客户</span>}
                                    >
                                        {
                                            <MainClient
                                                disabled={item.verifi === '2'}
                                                isView={isView}
                                                editData={editData}
                                                maintype={item.verifi}
                                                wrappedComponentRef={MainClientRef} />
                                        }
                                    </FormItem>
                                </Row> : null}
                                {item.key === "supplierRecentIncomes" ? <Row>
                                    <FormItem
                                        {...otherformItemLayout}
                                        label={<span>
                                            {
                                                item.verifi === '0' ? <label className="ant-form-item-required" title=""></label> : ''
                                            }
                                            近三年收入</span>}
                                    >
                                        {
                                            <ThreeYearIncome
                                                disabled={item.verifi === '2'}
                                                isView={isView}
                                                editData={editData}
                                                maintype={item.verifi}
                                                wrappedComponentRef={ThreeYearRef} />
                                        }
                                    </FormItem>
                                </Row> : null}
                            </>

                        )
                    }
                })
            }
        </Form>
    )
}
)
const CommonForm = create()(BusinessRef)

export default CommonForm