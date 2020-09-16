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
    isView = false,
    businesshide = [],
    isOverseas = null
}, ref) => {
    useImperativeHandle(ref, () => ({
        getALLbusinCheck,
        businerTemporary,
        setHeaderFields,
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
    // 暂存
    function businerTemporary() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (values) {
                let endData = values;
                const { mainTemporary } = MainClientRef.current;
                const { ThreeTemporary } = ThreeYearRef.current;
                const getMaSaa = mainTemporary();
                const incomeVal = ThreeTemporary();
                if (getMaSaa) {
                    endData.extendVo = getMaSaa;
                }
                if (incomeVal) {
                    endData.supplierRecentIncomes = incomeVal;
                }
                result = endData
            }
        });
        return result;
    }
    // 获取表单值
    function getALLbusinCheck() {
        let result = false;
        console.log(form)
        form.validateFieldsAndScroll((err, values) => {
            const { getMainclient } = MainClientRef.current;
            const { getThreeYear } = ThreeYearRef.current;
            const getMaSaa = getMainclient();
            const incomeVal = getThreeYear();
            if (!err) {
                let endData = values;

                if (!getMaSaa || !incomeVal) {
                    return false
                }
                endData.extendVo = getMaSaa;
                endData.supplierRecentIncomes = incomeVal;
                result = endData
            }
        });
        return result;
    }
    // 设置所有表格参数
    const setHeaderFields = (fields) => {
        //const { attachmentId = null, ...fs } = fields;
        // setAttachment(attachmentId)
        // setFieldsValue(fs)
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
                                            isView ? <div style={{
                                                width: "600px",
                                                overflow: "auto",
                                                maxHeight: "100px",
                                                wordWrap: "break-word"
                                            }}>
                                                {editData && editData.supplierVo ? editData.supplierVo.enterpriseProfile : ''}</div> :
                                                getFieldDecorator("supplierVo.enterpriseProfile", {
                                                    initialValue: editData && editData.supplierVo ? editData.supplierVo.enterpriseProfile : '',
                                                    rules: [{ required: true, message: "请输入供应商简介", whitespace: true }]
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
                                            isView ? <div style={{
                                                width: "600px",
                                                overflow: "auto",
                                                maxHeight: "100px",
                                                wordWrap: "break-word"
                                            }}>
                                                {editData && editData.supplierVo ? editData.supplierVo.businessScope : ''}</div> :
                                                getFieldDecorator("supplierVo.businessScope", {
                                                    initialValue: editData && editData.supplierVo ? editData.supplierVo.businessScope : '',
                                                    rules: [{ required: true, message: "请输入供应商经营范围", whitespace: true }]
                                                })(
                                                    <Input.TextArea disabled={item.verifi === '2'} maxLength={250} placeholder={"请输入供应商经营范围"} />
                                                )
                                        }
                                    </FormItem>
                                </Row> : null}
                                {item.key === "majorCustomersVos" ? <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><label className="ant-form-item-required" title=""></label>主要客户</span>}
                                    >
                                        {
                                            <MainClient
                                                disabled={item.verifi === '2'}
                                                isView={isView}
                                                editData={editData}
                                                wrappedComponentRef={MainClientRef} />
                                        }
                                    </FormItem>
                                </Row> : null}
                                {item.key === "supplierRecentIncomes" ? <Row>
                                    <FormItem
                                        {...formItemLayout}
                                        label={<span><label className="ant-form-item-required" title=""></label>近三年收入</span>}
                                    >
                                        {
                                            <ThreeYearIncome
                                            disabled={item.verifi === '2'}
                                                isView={isView}
                                                editData={editData}
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