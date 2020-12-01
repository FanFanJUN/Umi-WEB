import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Input, Col, message, Radio } from 'antd';
const { create } = Form;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
};
const tipsLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};
const confirmRadioOptions = [
    {
        label: '组织成为供应商',
        value: 1
    }, {
        label: '个人成为供应商',
        value: 0
    }
]
const SupplierTypeRef = forwardRef(({
    hidden,
    form,
}, ref) => {
    useImperativeHandle(ref, () => ({
        getTypeinfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [organiz, setOrganiz] = useState(false);
    const [person, setPerson] = useState(false);
    useEffect(() => {

    }, [])
    // 表单
    function getTypeinfo() {
        let typenum = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                typenum = val;
            }
        })
        return typenum ? typenum : false
    }
    // 组织
    function handleOrgan(e) {
        form.setFieldsValue({
            'personal': '',
        })
        setOrganiz(true)
        setPerson(false)
    }
    // 个人
    function handlePersonal(e) {
        form.setFieldsValue({
            'organization': '',
        })
        setPerson(true)
        setOrganiz(false)
    }
    return (
        <div style={{ display: hidden ? "none" : "block", textAlign: 'center' }}>
            <Form style={{ paddingTop: '80px', paddingLeft: '35%' }}>
                <Row>
                    <Col span={5} >
                        <FormItem
                            {...formItemLayout}
                            label={''}
                        >
                            {
                                getFieldDecorator('organization', {
                                    initialValue: '',
                                })(
                                    <Radio.Group name="radiogroup" onChange={handleOrgan}>
                                        <Radio value={1} style={{ paddingTop: '10px', fontSize: '22px' }}>组织成为供应商</Radio>
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                {
                    organiz ? <Row Row style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '14px', color: 'red' }}>(大陆地区有社会信用代码或者其他地区供应商，供应商账号必须绑定邮箱)</span>
                    </Row> : null
                }

                <Row>
                    <Col span={5} >
                        <FormItem
                            {...formItemLayout}
                            label={''}
                        >
                            {
                                getFieldDecorator('personal', {
                                    initialValue: '',
                                })(
                                    <Radio.Group name="radiogroup" onChange={handlePersonal}>
                                        <Radio value={0} style={{ paddingTop: '10px', fontSize: '22px' }}>个人成为供应商</Radio>
                                    </Radio.Group>
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
                {
                    person ? <Row style={{ textAlign: 'left' }}>
                        <span style={{ fontSize: '14px', color: 'red' }}>(以个人名义注册供应商，只有身份证号，供应商账号不需要绑定邮箱)</span>
                    </Row> : null
                }

            </Form>
        </div >
    )
}
)
const CommonForm = create()(SupplierTypeRef)

export default CommonForm
