import React, { forwardRef, useImperativeHandle, useEffect,useRef } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { Fieldclassification} from '@/utils/commonProps'
import { ComboTree, ComboGrid, ComboList } from 'suid';
// import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
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
const CommonForm = forwardRef(
    (
        {
            visible,
            form,
            onCancel = () => null,
            onOk = () => null,
            initialValues = {},
            type = 'add',
            loading,
        },
        ref,
    ) => {
        useImperativeHandle(ref, () => ({ form }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        useEffect(() => {
            if (type === 'editor' && visible) {
                const {
                    id,
                    standby1,
                    standby2,
                    standby3,
                    standby4,
                    ...other
                } = initialValues;
                const fields = {
                    ...other
                }
                setFieldsValue(fields);
            }
        }, [visible]);
        const title = `新增字段`;
        function handleSubmit() {
            validateFieldsAndScroll((err, val) => {
                console.log(initialValues)
                if (!err) {
                    onOk({...initialValues, ...val});
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
                    <Col span={12}>
                        <Item {...formLayout} label="字段代码">
                            {getFieldDecorator('smFieldCode', {
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
                                getFieldDecorator('smMsgTypeCode'),
                                getFieldDecorator('smMsgTypeName', {
                                  rules: [
                                    {
                                      required: true,
                                      message: '请选择信息分类'
                                    }
                                  ]
                                })(<ComboList remotePaging showSearch={false} {...Fieldclassification} name='smMsgTypeName' field={['smMsgTypeCode']} form={form} />)
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="表名称">
                            {getFieldDecorator('smTableName', {
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
                            getFieldDecorator('smFieldTypeCode'),
                            getFieldDecorator('smFieldTypeName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择字段类型',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width:'100%' }}
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
                        <Item {...formLayout} label="备注">
                            {getFieldDecorator('smExplain', {
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
        );
    },
);

export default create()(CommonForm);
