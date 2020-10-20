import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList} from 'suid';
import { onlyNumber} from '@/utils'
import moment from 'moment';
import { PCNMasterdatalist } from '../../commonProps'
const { Item, create } = Form;
const { storage } = utils;
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
    isView,
    dataSource,
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const authorizations = storage.sessionStorage.get("Authorization");
    const [configure, setConfigure] = useState([]);
    useEffect(() => {

    }, [])
    return (
        <div >
            <div >
                <div >
                    <Row>
                        <Col span={10}>
                            <Item label='供应商名称' {...formLayout}>
                                {
                                    getFieldDecorator("smSupplierName", {
                                        initialValue: authorizations.userName,
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
                                    getFieldDecorator('smPcnChangeTypeCode',{initialValue: dataSource ? dataSource.smPcnChangeTypeCode : ""}),
                                    getFieldDecorator('smPcnChangeTypeName', {
                                        initialValue: dataSource ? dataSource.smPcnChangeTypeName : "",
                                        rules: [
                                            {
                                                required: true,
                                                message: '请选择变更类型'
                                            }
                                        ]
                                    })(
                                        <ComboList disabled={isView === true}
                                            {...PCNMasterdatalist}
                                            showSearch={false}
                                            style={{ width: '100%' }}
                                            name='smPcnChangeTypeName' 
                                            field={['smPcnChangeTypeCode']} 
                                            form={form} 
                                        />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item label='联系人' {...formLayout}>
                                {
                                    getFieldDecorator("smContacts", {
                                        initialValue: dataSource ? dataSource.smContacts : "",
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
                            <Item label='创建时间' {...formLayout}>
                                {
                                    getFieldDecorator("createdDate", {
                                        initialValue: moment().format('YYYY-MM-DD HH:mm:ss'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '请输入创建时间'
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
                                  getFieldDecorator("smContactNumber", {
                                    initialValue: dataSource ? dataSource.smContactNumber : "",
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入联系电话'
                                        }
                                    ]
                                    })(
                                        <Input
                                            onChange={onlyNumber} 
                                            disabled={isView === true}
                                            maxLength="16"
                                        />
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