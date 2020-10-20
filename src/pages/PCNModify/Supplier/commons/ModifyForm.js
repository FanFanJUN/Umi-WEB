import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import UploadFile from '../../../../components/Upload/index'
import {ChangecontentList} from '../../commonProps'
// import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const ModifyForm = forwardRef(
    (
        {
            visible,
            form,
            onCancel = () => null,
            onOk = () => null,
            type,
            loading,
            dataSource,
            isView,
            title
        },
        ref,
    ) => {
        useImperativeHandle(ref, () => ({ form }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        const [initialValue, setInitialValue] = useState({});
        useEffect(() => {
            if (type) {
                setInitialValue(dataSource)
            }
        }, [visible]);

        function handleSubmit() {
            validateFieldsAndScroll((err, val) => {
                if (!err) {
                    onOk({ ...initialValue, ...val });
                }
            });
        }
        // 变更内容
        function changevalue(val) {
            form.setFieldsValue({ smFieldName: val.changeRequiredSubmission})
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
                                initialValue: dataSource && dataSource.smFieldCode,
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
                                    {...ChangecontentList}
                                    name='smFieldCode'
                                    form={form}
                                    afterSelect={changevalue}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更描述（变更前）">
                            {getFieldDecorator('smFieldNamee', {
                                initialValue: dataSource && dataSource.smFieldNamee,
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
                            {getFieldDecorator('smFieldNamed', {
                                initialValue: dataSource && dataSource.smFieldNamed,
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
                            {getFieldDecorator('smFieldNamef', {
                                initialValue: dataSource && dataSource.smFieldNamef,
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
                                initialValue: dataSource && dataSource.smFieldName,
                            })(
                                <TextArea
                                    disabled
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
