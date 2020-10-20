import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,Radio } from 'antd';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList,AuthButton } from 'suid';
import UploadFile from '../../../../components/Upload/index'
// import { baseUrl } from '../../../utils/commonUrl';
import TrustinforModal from './TrustinforModal'
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
const getauditinfor = forwardRef(({
    form,
},ref,) => {
        useImperativeHandle(ref, () => ({ 
            handleModalVisible,
            form 
        }));
        const getTrustinfor = useRef(null)
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
        function ChangRadio(e) {
            if (e.target.value) {
                settrust(true)
            }else {
                settrust(false)
            }
            
        }
        return (
            <>
                <Modal
                    visible={visible}
                    title={'编辑客户信息'}
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
                                    <Input disabled />
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
                                    <Input disabled />
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
                                    <Input disabled />
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
                                    <Input disabled />
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
                                    <Input disabled />
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
                                    <Input disabled />
                                )}
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Item {...formLayout} label="是否供应商审核">
                                {getFieldDecorator('smFieldNamerty', {
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选采购组织代码',
                                        },
                                    ],
                                })(
                                    <Radio.Group onChange={(value) => ChangRadio(value)}>
                                        <Radio value={true}>是</Radio>
                                        <Radio value={false}>否</Radio>
                                    </Radio.Group>
                                )}
                            </Item>
                        </Col>
                        <Col span={12} style={{ display: trust === false ? 'none' : 'block'}}>
                            <Item {...formLayout} label="供应商审核确认人">
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
            </>
        );
    },
);

export default create()(getauditinfor);
