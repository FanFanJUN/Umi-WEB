import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,message } from 'antd';
import { ComboList } from 'suid';
import {onlyNumber} from '../../../utils'
import {IdentifiedTasklist} from '../commonProps'
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
const commonRightFormRef = forwardRef(({
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
        function afterSelect(val) {
            form.setFieldsValue({
                'taskDesc': val.name,
            });
        }
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
            // data.push(params)
            // const { success, message: msg } = await MasterdataSave(data);
            // if (success) {
            //     message.success('保存成功');
            //     onOk();
            // } else {
            //     message.error(msg);
            // }
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
                            <Item {...formLayout} label="任务代码">
                                {getFieldDecorator('taskCode', {
                                    initialValue: modifydata && modifydata.taskCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入任务代码',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        {...IdentifiedTasklist}
                                        name='changeTypeName'
                                        field={['stageCode']}
                                        afterSelect={afterSelect}
                                        form={form}
                                    />
                                )}
                            </Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Item {...formLayout} label="任务描述">
                                {getFieldDecorator('taskDesc', {
                                    initialValue: modifydata && modifydata.taskDesc,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入任务描述',
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入任务描述" />
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
                                    <Input placeholder="请输入排序码" onBlur={onlyNumber} />
                                )}
                            </Item>
                        </Col>
                    </Row>
                </Modal>
            </>
        );
    },
);

export default create()(commonRightFormRef);
