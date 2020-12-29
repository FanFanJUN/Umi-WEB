import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message, Button } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboTree, ComboGrid, ComboList } from 'suid';
import { SaveSupplierRegister } from "../../services/supplierConfig"
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
    const getecommendRef = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    useEffect(() => {
    }, []);
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };
    // 字段保存
    function handleSubmit() {
        validateFieldsAndScroll(async (err, val) => {
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
        const { success, message: msg } = await SaveSupplierRegister(params);
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
                    <Col span={12}>
                        <Item {...formLayout} label="字段代码">
                            {getFieldDecorator('smFieldCode', {
                                initialValue: modifydata && modifydata.smFieldCode,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写字段代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入字段代码"
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="字段名称">
                            {getFieldDecorator('smFieldName', {
                                initialValue: modifydata && modifydata.smFieldName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写字段名称',
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入字段名称"
                                />
                            )}
                        </Item>
                    </Col>

                </Row>
                <Row>
                    <Col span={12}>
                        <Item label="信息分类" {...formLayout}>
                            {
                                getFieldDecorator('smMsgTypeCode', { initialValue: modifydata && modifydata.smMsgTypeCode }),
                                getFieldDecorator('rank', { initialValue: modifydata && modifydata.rank }),
                                getFieldDecorator('smMsgTypeName', {
                                    initialValue: modifydata && modifydata.smMsgTypeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择信息分类'
                                        }
                                    ]
                                })(
                                    <ComboList remotePaging showSearch={false}
                                        {...Fieldclassification}
                                        name='smMsgTypeName'
                                        field={['smMsgTypeCode', 'rank']} form={form}
                                    />)
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="表名称">
                            {getFieldDecorator('smTableName', {
                                initialValue: modifydata && modifydata.smTableName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写表名称',
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入表名称"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="字段类型">
                            {
                                getFieldDecorator('smFieldTypeCode', { initialValue: modifydata && modifydata.smFieldTypeCode }),
                                getFieldDecorator('smFieldTypeName', {
                                    initialValue: modifydata && modifydata.smFieldTypeName,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择字段类型',
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
                                        name='smFieldTypeName'
                                        field={['smFieldTypeCode']}
                                        form={form}
                                    />
                                )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="排序码">
                            {getFieldDecorator('sort', {
                                initialValue: modifydata && modifydata.sort,
                                rules: [
                                    {
                                        required: true,
                                        message: '请请输入排序码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入排序码"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="备注">
                            {getFieldDecorator('smExplain', {
                                initialValue: modifydata && modifydata.smExplain,
                                // rules: [
                                //     {
                                //         required: true,
                                //         message: '请选择字段类型',
                                //     },
                                // ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入备注"
                                />
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
