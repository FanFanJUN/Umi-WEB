import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input,Radio } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList,AuthButton } from 'suid';
import UploadFile from '../../../../components/Upload/index'
// import { baseUrl } from '../../../utils/commonUrl';
const { create, Item } = Form;
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
const getInformation = forwardRef(({
    form,
},ref,) => {
        useImperativeHandle(ref, () => ({ 
            handleModalVisible,
            form 
        }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        const [visible, setvisible] = useState(false);
        const [trust, settrust] = useState(false);
        useEffect(() => {

        }, []);
        function handleModalVisible (flag) {
            setvisible(!!flag)
        };
        function handleSubmit() {
            validateFieldsAndScroll((err, val) => {
                if (!err) {
                    //onOk({ ...initialValues, ...val });
                }
            });
        }
        function showtrustModal() {
            
        }
        function ChangRadio(e) {
            console.log(e.target.value)
            settrust(true)
        }
        return (
            <Modal
                visible={visible}
                title={'新增'}
                onCancel={() => handleModalVisible(false)}
                destroyOnClose={true}
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >  
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="物料分类">
                            {getFieldDecorator('smFieldName', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择物料分类',
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
                    <Col span={12}>
                        <Item {...formLayout} label="公司代码">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选择公司代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="公司名称">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选择公司名称',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="采购组织代码">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="采购组织名称">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请填写采购组织名称',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="是否安规件">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="是否安规件">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
                                    },
                                ],
                            })(
                                <Radio.Group onChange={ChangRadio()}>
                                    <Radio value={true}>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row style={{ display: trust === false ? 'none' : 'block'}}>
                    <Col span={12}>
                        <AuthButton onClick={() => showtrustModal()}>选择信任信息</AuthButton>
                    </Col>
                </Row>
                <Row style={{ display: trust === false ? 'none' : 'block'}}>
                    <Col span={12}>
                        <Item {...formLayout} label="信任公司">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="信任采购组织">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
                                    },
                                ],
                            })(
                                <Input
                                    style={{width: "100%"}}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row style={{ display: trust === false ? 'none' : 'block'}}>
                    <Col span={12}>
                        <Item {...formLayout} label="实物认定确认人">
                            {getFieldDecorator('smFieldName', {
                                 rules: [
                                    {
                                        required: true,
                                        message: '请选采购组织代码',
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
            </Modal>
        );
    },
);

export default create()(getInformation);
