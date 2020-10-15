import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import { purchaseCompanyPropsreg, FieldconfigureList } from '@/utils/commonProps'
const { Item, create } = Form;
const { Group } = Radio;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}
const confirmRadioOptions = [
    {
        label: '新增',
        value: '1'
    }, {
        label: '变更',
        value: '2'
    }, {
        label: '明细',
        value: '3'
    }
]
const HeadFormRef = forwardRef(({
    form,
    type = "",
    Opertype = null,
    initialValue = {},
    handcopy = () => null,
    isView,
    dataSource
}, ref) => {
    useImperativeHandle(ref, () => ({
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const { attachment = null } = initialValue;
    useEffect(() => {
        setFieldsValue({
            configProperty: Opertype
        })
    }, [])
    //复制从获取ID
    function handleCopySelect(item) {
        handcopy(item.id)
    }
    return (
        <div >
            <div >
                <div >
                    <Row>
                        <Col span={10}>
                            <Item label='供应商名称' {...formLayout}>
                                {
                                    getFieldDecorator("corporationId", {
                                        initialValue: dataSource ? dataSource.corporationId : "",
                                        rules: [{ required: true, message: "请选择供应商名称", }]
                                    })(
                                        <Input disabled />
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='变更类型' {...formLayout}>
                                {
                                    getFieldDecorator('supplierCategoryCode'),
                                    getFieldDecorator('supplierCategoryId'),
                                    getFieldDecorator('supplierCategoryName', {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择变更类型'
                                            }
                                        ]
                                    })(
                                        <ComboTree disabled={isView === true}
                                            {...confirmRadioOptions}
                                            showSearch={false}
                                            name='supplierCategoryName' field={['supplierCategoryCode', 'supplierCategoryId']} form={form} />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item label='联系人' {...formLayout}>
                                {
                                    getFieldDecorator("configProperty", {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入联系人'
                                            }
                                        ]
                                    })(
                                        <Input disabled={isView === true}/>
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='创建人' {...formLayout}>
                                {
                                    getFieldDecorator("configProperty", {
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入创建人'
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
                            <Item label='联系电话' {...formLayout}>
                                {
                                  getFieldDecorator("configProperty", {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入联系电话'
                                        }
                                    ]
                                    })(
                                        <Input disabled={isView === true}/>
                                    )  
                                }
                            </Item>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm