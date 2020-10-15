import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import UploadFile from '../../../../components/Upload/index'
// import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14
    },
};
const data = [
    {
        name: '单值',
        code: '0',
    },
    {
        name: '多值',
        code: '1',
    }
];
const ModifyForm = forwardRef(
    (
        {
            visible,
            form,
            onCancel = () => null,
            onOk = () => null,
            initialValues = {},
            type = 'add',
            loading,
            dataSource,
            isView,
            title
        },
        ref,
    ) => {
        useImperativeHandle(ref, () => ({ form }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        useEffect(() => {
            if (type === 'editor' && visible) {
                const {
                    id,
                    createdDate,
                    creatorName,
                    ...other
                } = initialValues;
                const fields = {
                    ...other
                }
                setFieldsValue(fields);
            }
        }, [visible]);
        function handleSubmit() {
            validateFieldsAndScroll((err, val) => {
                if (!err) {
                    onOk({ ...initialValues, ...val });
                }
            });
        }
        return (
            <Modal
                confirmLoading={loading}
                visible={visible}
                title={title}
                onCancel={onCancel}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更内容">
                            {getFieldDecorator('smFieldCode', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择变更内容',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    dataSource={data}
                                    reader={{
                                        name: 'name',
                                        field: ['code'],
                                        description: 'code',

                                    }}
                                    name='smFieldCode'
                                    field={['code']}
                                    form={form}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更描述（变更前）">
                            {getFieldDecorator('smFieldName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写变更描述（变更前）',
                                    },
                                ],
                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入变更描述（变更前）"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更描述（变更后）">
                            {getFieldDecorator('smFieldName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写变更描述（变更后）',
                                    },
                                ],
                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入变更描述（变更后）"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更原因">
                            {getFieldDecorator('smFieldName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写变更原因',
                                    },
                                ],
                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入变更原因"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="证明材料（参考）">
                            {getFieldDecorator('smFieldName', {

                            })(
                                <TextArea
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入证明材料"
                                />
                            )}
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
                                getFieldDecorator('attachment', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请上传附件资料',
                                        },
                                    ],
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
            </Modal>
        );
    },
);

export default create()(ModifyForm);
