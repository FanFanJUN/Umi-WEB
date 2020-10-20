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
                            {getFieldDecorator('smFieldName', {
                            })(
                                <Radio.Group disabled={isView === true}>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
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
            </>
        );
    },
);

export default create()(getchangeResult);
