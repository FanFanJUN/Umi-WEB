import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message } from 'antd';
import { PCNMasterdatalist, SupplierToexamine } from '../commonProps'
import { ComboList } from 'suid';
import { MasterdataSave } from '../../../services/pcnModifyService'
const { create, Item } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18
    },
};
const commonFormRef = forwardRef(({
    form,
    title,
    onOk = () => null,
    modifydata = {},
    type
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
    }));
    const getTrustinfor = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [trust, settrust] = useState(false);
    useEffect(() => {
    }, []);
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };
    function handleSubmit() {
        validateFieldsAndScroll((err, val) => {
            let params;
            if (!err) {
                if (type) {
                    params = { ...modifydata, ...val }
                } else {
                    params = val
                }
                masterSave(params)
            }
        });
    }
    async function masterSave(params) {
        let data = [];
        data.push(params)
        const { success, message: msg } = await MasterdataSave(data);
        if (success) {
            message.success('保存成功');
            onOk();
        } else {
            message.error(msg);
        }
    }
    return (
        <>
            <Modal
                visible={visible}
                title={title}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更类型">
                            {
                                getFieldDecorator('changeTypeCode', { initialValue: modifydata ? modifydata && modifydata.changeTypeCode : '' }),
                                getFieldDecorator('changeTypeName', {
                                    initialValue: modifydata && modifydata.changeTypeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择变更类型',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        {...PCNMasterdatalist}
                                        name='changeTypeName'
                                        field={['changeTypeCode']}
                                        form={form}
                                    />
                                )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="变更内容">
                            {getFieldDecorator('changeContent', {
                                initialValue: modifydata && modifydata.changeContent,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入变更内容',
                                    },
                                ],
                            })(
                                <TextArea placeholder="请输入变更内容" />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="所需提交资料">
                            {getFieldDecorator('changeRequiredSubmission', {
                                initialValue: modifydata && modifydata.changeRequiredSubmission,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入所需提交资料',
                                    },
                                ],
                            })(
                                <TextArea placeholder="请输入所需提交资料" />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="供应商审核确认">
                            {
                                getFieldDecorator('supplierConfirm', { initialValue: modifydata ? modifydata.supplierConfirm : '' }),
                                getFieldDecorator('supplierConfirmName', {
                                    initialValue: modifydata && modifydata.supplierConfirmName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择供应商审核确认',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        form={form}
                                        {...SupplierToexamine}
                                        showSearch={false}
                                        name={'supplierConfirmName'}
                                        field={['supplierConfirm']}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="排序码">
                            {getFieldDecorator('changeSort', {
                                initialValue: modifydata && modifydata.changeSort,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入排序码',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入排序码" />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        </>
    );
},
);

export default create()(commonFormRef);
