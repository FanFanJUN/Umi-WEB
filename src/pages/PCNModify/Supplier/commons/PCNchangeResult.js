import React, { forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Modal, Form, Row, Col, Input,Radio } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import UploadFile from '../../../../components/Upload/index'
// import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 12,
    }
};
const getchangeResult = forwardRef(
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
            <>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="结果">
                            {getFieldDecorator('pcnResult', {
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
                                getFieldDecorator('resultEnclosure', {
                                    initialValue: [],
                                    rules: [
                                        {
                                            required: true,
                                            message: '请上传附件',
                                        },
                                    ],
                                })(
                                    <UploadFile
                                        title={"附件上传"}
                                        entityId={dataSource ? dataSource.resultAttachments : null}
                                        type={isView ? "show" : ""}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
            </>
        );
    },
);

export default create()(getchangeResult);
