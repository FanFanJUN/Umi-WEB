import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio, Button } from 'antd';
import { utils, ComboList } from 'suid';
import { establishSupplierConfig } from '../../../utils/commonProps'
import UploadFile from '../../../components/Upload/index'
const { Item, create } = Form;
const { storage } = utils;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const longFormItemLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 19 },
};
const HeadFormRef = forwardRef(({
    form,
    isView,
    Opertype = null,
    initialValue = {},
    handcopy = () => null,
    dataSource
}, ref) => {
    useImperativeHandle(ref, () => ({
        getImportBaseInfo,
        form
    }));
    const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const [configure, setConfigure] = useState([]);
    const { attachment = null } = initialValue;
    const authorizations = storage.sessionStorage.get("Authorization");
    useEffect(() => {
        setFieldsValue({
            configProperty: Opertype
        })
    }, [])
    // 表单
    function getImportBaseInfo() {
        let result = false;
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                result = values;
            }
        });
        return result;
    }
    return (
        <div >
            <div >
                <div >
                    <Row>
                        <Col span={10}>
                            <Item label='申请公司' {...formItemLayout}>
                                {isView ? dataSource ? dataSource.corporation ? dataSource.corporation.name : '' : "" :
                                    getFieldDecorator('corporationId', {
                                        initialValue: dataSource ? dataSource.corporationId : "",
                                    }),
                                    getFieldDecorator("corporation", {
                                        initialValue: dataSource ? dataSource.corporation : "",
                                        rules: [{ required: true, message: "请选择申请公司", }]
                                    })(
                                        <ComboList
                                            style={{ width: '100%' }}
                                            {...establishSupplierConfig}
                                            showSearch={true}
                                            form={form}
                                            name='corporation'
                                            field={['corporationId']}
                                        />
                                    )
                                }
                            </Item>
                        </Col>
                        <Col span={10}>
                            <Item label='申请人员' {...formItemLayout}>
                                {isView ? <span>{dataSource ? dataSource.applyName : authorizations.userName}</span> :
                                    getFieldDecorator("applyName", {
                                        initialValue: dataSource ? dataSource.applyName : "",
                                    })(
                                        <span>{authorizations.userName}</span>
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Item
                                {...longFormItemLayout}
                                label={"申请说明"}
                            >
                                {isView ? <span>{dataSource ? dataSource.remark : ""}</span> :
                                    getFieldDecorator("remark", {
                                        initialValue: dataSource ? dataSource.remark : "",
                                    })(
                                        <Input.TextArea />
                                    )
                                }
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={10}>
                            <Item
                                {...formItemLayout}
                                label={'申请资料'}
                            >
                                {
                                    getFieldDecorator('attachment', {
                                        initialValue: [],
                                    })(
                                        <UploadFile
                                            title={"附件上传"}
                                            entityId={dataSource ? dataSource.enclosureId : null}
                                            type={isView ? "show" : ""}
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