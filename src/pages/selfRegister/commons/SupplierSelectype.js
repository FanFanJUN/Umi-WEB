import React, { forwardRef, useImperativeHandle, useEffect, useState, useRef } from 'react';
import { Form, Row, Input, Col, message, Radio } from 'antd';
import { ComboTree } from 'suid'
const { create } = Form;
const FormItem = Form.Item;
const { Group } = Radio;
const formItemLayout = {
    labelCol: { span: 14 },
    wrapperCol: { span: 10 },
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
    return (
        <div style={{ display: hidden ? "none" : "block", textAlign: 'center' }}>
            <Form style={{ paddingTop: '80px', paddingLeft: '30%' }}>
                <Row>
                    <Col span={15}>
                        <FormItem
                            {...formItemLayout}
                            label={''}
                        >
                            {
                                getFieldDecorator('suppliertype', {
                                    initialValue: '',
                                })(
                                    <Group
                                        options={confirmRadioOptions}
                                        style={{ fontSize: '60px' }}
                                    />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}
)
const CommonForm = create()(SupplierTypeRef)

export default CommonForm
