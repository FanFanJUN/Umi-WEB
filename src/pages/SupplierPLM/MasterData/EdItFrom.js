import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message } from 'antd';
import { buList } from '../commonProps'
import { ComboList } from 'suid';
import { MasterdataSave } from '../../../services/plmService'
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
    function handlBusiness(val) {
        form.setFieldsValue({
            'unitName': val.buName,
        })
    }
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
                width="60vw"
                maskClosable={false}
                onOk={handleSubmit}
            >
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="业务单元代码">
                            {
                                getFieldDecorator('unitId', { initialValue: modifydata ? modifydata && modifydata.unitId : '' }),
                                getFieldDecorator('unitCode', {
                                    initialValue: modifydata && modifydata.unitCode,
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择业务单元代码',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        {...buList}
                                        name='unitCode'
                                        field={['unitId']}
                                        form={form}
                                        afterSelect={handlBusiness}
                                    />
                                )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="业务单元名称">
                            {getFieldDecorator('unitName', {
                                initialValue: modifydata && modifydata.unitName,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择业务单元名称',
                                    },
                                ],
                            })(
                                <Input placeholder="请选择业务单元名称" disabled />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="排序号">
                            {getFieldDecorator('sort', {
                                initialValue: modifydata && modifydata.sort,
                                rules: [
                                    { required: true, message: '请输入排序号' },
                                    { pattern: RegExp(/^[1-9]\d*$/, "g"), message: '只能是数字' },
                                ],
                            })(
                                <Input placeholder="请输入排序号" />
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
