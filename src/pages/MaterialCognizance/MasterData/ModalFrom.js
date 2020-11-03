import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,message } from 'antd';
import {MasterdataSave} from '../../../services/pcnModifyService' 
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
    modifydata={},
    type
},ref,) => {
        useImperativeHandle(ref, () => ({ 
            handleModalVisible,
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
                let params;
                if (!err) {
                    if (type) {
                        params= { ...modifydata, ...val }
                    }else {
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
                    title={'新增'}
                    onCancel={() => handleModalVisible(false)}
                    destroyOnClose={true}
                    width="45vw"
                    maskClosable={false}
                    onOk={handleSubmit}
                >  
                    <Row>
                        <Col span={20}>
                            <Item {...formLayout} label="代码">
                                {getFieldDecorator('changeContent', {
                                    initialValue: modifydata && modifydata.changeContent,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入代码',
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入代码" />
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
                                    <Input placeholder="请输入代码" />
                                )}
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
