import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboTree } from 'suid';
import { onlyNumber } from '@/utils'
import moment from 'moment';
import { OrganizationList } from '../../commonProps'
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
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData,
    cancel
}, ref) => {
    useImperativeHandle(ref, () => ({
        form,
        basefrom
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const authorizations = storage.sessionStorage.get("Authorization");
    const [configure, setConfigure] = useState([]);
    useEffect(() => {

    }, [])
    function basefrom() {
        let modifyinfluen = false;
        form.validateFieldsAndScroll(async (err, val) => {
            if (!err) {
                modifyinfluen = val;
                delete val.createdName
                delete val.createdDate
            }
        })
        return modifyinfluen ? modifyinfluen : false
    }
    return (
        <div >
            <div >
                <div >
                    <Row>
                        <Col span={10}>
                            <Item label='创建部门' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.createDepartmentName : ''}</span> :
                                        (
                                            getFieldDecorator('createDepartmentId', { initialValue: editformData ? editformData.createDepartmentId : "" }),
                                            getFieldDecorator('createDepartmentName', {
                                                initialValue: editformData ? editformData.createDepartmentName : "",
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '请选择创建部门'
                                                    }
                                                ]
                                            })(
                                                <ComboTree disabled={isView === true || cancel === '2'}
                                                    {...OrganizationList}
                                                    showSearch={false}
                                                    style={{ width: '100%' }}
                                                    name='createDepartmentName'
                                                    field={['createDepartmentId']}
                                                    //afterSelect={afterSelect}
                                                    form={form}
                                                />
                                                //<Input disabled />
                                            )
                                        )

                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='创建人' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.creatorName : ''}</span> :
                                        getFieldDecorator("createdName", {
                                            initialValue: authorizations.userName,
                                        })(
                                            <Input disabled />
                                        )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item label='创建时间' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.createdDate : ''}</span> :
                                        getFieldDecorator("createdDate", {
                                            initialValue: moment().format('YYYY-MM-DD')
                                        })(
                                            <Input disabled />
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