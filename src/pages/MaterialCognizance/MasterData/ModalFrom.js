import React, { forwardRef, useImperativeHandle, useEffect,useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input,message } from 'antd';
import { ComboList } from 'suid';
import {onlyNumber} from '../../../utils'
import {IdentifiedPhaselist} from '../commonProps' 
import {MasterdataSave} from '../../../services/MaterialService'
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
    type,
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
                'identificationStage': val.name,
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
            const { success, message: msg } = await MasterdataSave(params);
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
                    width="45vw"
                    maskClosable={false}
                    onOk={handleSubmit}
                >  
                    <Row>
                        <Col span={20}>
                            <Item {...formLayout} label="代码">
                                {getFieldDecorator('stageCode', {
                                    initialValue: modifydata && modifydata.stageCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入代码',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        {...IdentifiedPhaselist}
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
                            <Item {...formLayout} label="认定阶段描述">
                                {getFieldDecorator('identificationStage', {
                                    initialValue: modifydata && modifydata.identificationStage,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请输入认定阶段描述',
                                        },
                                    ],
                                })(
                                    <Input placeholder="请输入认定阶段描述" disabled />
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

export default create()(commonFormRef);
