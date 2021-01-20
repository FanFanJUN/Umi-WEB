import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Row, Col, Input, message, Checkbox } from 'antd';
import { ComboList } from 'suid';
import { onlyNumber } from '../../../utils'
import { IdentifiedTasklist } from '../commonProps'
import { TaskdataSave } from '../../../services/MaterialService'
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
    modifydata = {},
    type,
    leftId
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
    }));
    const getTrustinfor = useRef(null)
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [defaultsel, setdefaultsel] = useState(true);
    useEffect(() => {
        handledetermine(modifydata)
    }, [modifydata]);

    function handledetermine(modifydata) {
        if (modifydata) {
            if (modifydata.defaultRequired === 0) {
                setdefaultsel(false)
            } else if (modifydata.defaultRequired === 1) {
                setdefaultsel(true)
            }
        }

    }
    function handleModalVisible(flag) {
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
                    val.defaultRequired ? val.defaultRequired = 1 : val.defaultRequired = 0
                    params = { ...modifydata, ...val }
                } else {
                    val.stageId = leftId;
                    val.defaultRequired ? val.defaultRequired = 1 : val.defaultRequired = 0
                    params = val
                }
                masterSave(params)
            }
        });
    }
    async function masterSave(params) {
        const { success, message: msg } = await TaskdataSave(params);
        if (success) {
            message.success('保存成功');
            onOk();
        } else {
            message.error(msg);
        }
    }
    function handlechange(e) {
        setdefaultsel(e.target.checked)
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
                                    field={['taskCode']}
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
                                <Input placeholder="请输入任务描述" disabled />
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
                <Row>
                    <Col span={20}>
                        <Item {...formLayout} label="默认必选">
                            {getFieldDecorator('defaultRequired', {
                                //valuePropName: "checked",
                                initialValue: modifydata && modifydata.defaultRequired,
                            })(
                                <Checkbox onChange={handlechange} checked={defaultsel} />
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
