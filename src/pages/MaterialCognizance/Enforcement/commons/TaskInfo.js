import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList } from 'suid';
import { onlyNumber } from '@/utils'
import moment from 'moment';
// import { PCNMasterdatalist } from '../../commonProps'
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
                            <Item label='认定阶段' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.identificationStageName : ''}</span> : ''
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='认定任务' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.identificationTaskName : ''}</span> : ''
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item label='执行部门' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.departmentName : ''}</span> : ''
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='任务类型' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.taskTypeName : ''}</span> : ''
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item label='执行责任人' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.executorName : ''}</span> : ''
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='计划时间' {...formLayout}>
                                {
                                    isView ? <span>{editformData ? editformData.planTime : ''}</span> : ''
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