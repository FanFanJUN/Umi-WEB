import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import UploadFile from '../../../../components/Upload/index'
import {isEmpty} from '../../../../utils'
const { Item, create } = Form;
const { storage } = utils;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    }
};
const HeadFormRef = forwardRef(({
    form,
    isView,
    editformData
}, ref) => {
    useImperativeHandle(ref, () => ({
        getResultBaseInfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        setDataSource(editformData)
    }, [editformData])
    // 表单
    function getResultBaseInfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.resultAttachments = values.resultEnclosure
                delete values.resultEnclosure;
                result = {...dataSource, ...values}
            }
        });
        return result;
    }
    return (
        <>
            <Row>
                <Col span={20}>
                    <Item {...formLayout} label="结果">
                        {
                            isView ?
                            <span>{ !isEmpty(dataSource) && !isEmpty(dataSource.pcnResult) ? dataSource.pcnResult === 0 ? '同意' : '不同意' : ''}</span> : 
                                getFieldDecorator('pcnResult', {
                                    initialValue: dataSource && dataSource.pcnResult,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择结果',
                                        },
                                    ],
                                })(
                                    <Radio.Group disabled={isView === true}>
                                        <Radio value={0}>同意</Radio>
                                        <Radio value={1}>不同意</Radio>
                                    </Radio.Group>
                                ) 
                        }
                        
                    </Item>
                </Col>
            </Row>
            <Row>
                <Col span={20}>
                    <Item
                        {...formLayout}
                        label={'附件资料'}
                    >
                        {
                            getFieldDecorator('resultEnclosure', {
                                initialValue: [],
                                rules: [
                                    {
                                        required: !isView,
                                        message: '请上传附件',
                                    },
                                ],
                            })(
                                <UploadFile
                                    title={"附件上传"}
                                    entityId={dataSource ? dataSource.resultEnclosure : null}
                                    type={isView ? "show" : ""}
                                />
                            )
                        }
                    </Item>
                </Col>
            </Row>
        </>
    )
}
)
const CommonForm = create()(HeadFormRef)

export default CommonForm