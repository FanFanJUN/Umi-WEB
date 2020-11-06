import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { smBaseUrl} from '../../../../utils/commonUrl';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
// import {ChangecontentList} from '../../commonProps'
// import {getRelationDocId} from '../../../../services/pcnModifyService'
// import { baseUrl } from '../../../utils/commonUrl';
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
const ModifyForm = forwardRef(
    (
        {
            visible,
            form,
            onCancel = () => null,
            onOk = () => null,
            type,
            loading,
            dataSource,
            isView,
            title,
            modifytype
        },
        ref,
    ) => {
        useImperativeHandle(ref, () => ({ form }));
        const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
        const [initialValue, setInitialValue] = useState({});
        useEffect(() => {
            if (type) {
                setInitialValue(dataSource)
            }else {
                setInitialValue({})
            }
        }, [visible]);

        function handleSubmit() {
            validateFieldsAndScroll(async(err, val) => {
                if (!err) {
                    if (val.attachment && val.attachment.length > 0 && !val.attachmentId) {
                        
                    }
                    onOk({ ...initialValue, ...val });
                }
            });
        }
        // 变更内容
        function changevalue(val) {
            form.setFieldsValue({ smChangeProve: val.changeRequiredSubmission})
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
                        <Item {...formLayout} label="认定阶段">
                            {getFieldDecorator('smChangeValue', {
                                initialValue: initialValue && initialValue.smChangeValue,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择认定阶段',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    //{...ChangecontentList}
                                    name='smChangeValue'
                                    store={{
                                        url: `${smBaseUrl}/api/smPcnChangesService/findByPage`,
                                        params: {
                                            filters: [{
                                              fieldName:'changeTypeCode',
                                              value: modifytype,
                                              operator:'EQ'
                                            }],
                                        },
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'changeContent'
                                    }}
                                    form={form}
                                    afterSelect={changevalue}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="认定任务">
                            {getFieldDecorator('smChangeDescriptionBefore', {
                                initialValue: initialValue && initialValue.smChangeDescriptionBefore,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择认定任务',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    //{...ChangecontentList}
                                    name='smChangeValue'
                                    store={{
                                        url: `${smBaseUrl}/api/smPcnChangesService/findByPage`,
                                        params: {
                                            filters: [{
                                              fieldName:'changeTypeCode',
                                              value: modifytype,
                                              operator:'EQ'
                                            }],
                                        },
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'changeContent'
                                    }}
                                    form={form}
                                    afterSelect={changevalue}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="任务类型">
                            {getFieldDecorator('smChangeDescriptionBefore', {
                                initialValue: initialValue && initialValue.smChangeDescriptionBefore,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择任务类型',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    //{...ChangecontentList}
                                    name='smChangeValue'
                                    store={{
                                        url: `${smBaseUrl}/api/smPcnChangesService/findByPage`,
                                        params: {
                                            filters: [{
                                              fieldName:'changeTypeCode',
                                              value: modifytype,
                                              operator:'EQ'
                                            }],
                                        },
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'changeContent'
                                    }}
                                    form={form}
                                    afterSelect={changevalue}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="排序号">
                            {getFieldDecorator('smChangeDescriptionAfter', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写排序号',
                                    },
                                ],
                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入排序号"
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="执行责任人">
                            {getFieldDecorator('smChangeDescriptionAfter', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择执行责任人',
                                    },
                                ],
                            })(
                                <ComboList
                                    showSearch={false}
                                    style={{ width: '100%' }}
                                    //{...ChangecontentList}
                                    name='smChangeValue'
                                    store={{
                                        url: `${smBaseUrl}/api/smPcnChangesService/findByPage`,
                                        params: {
                                            filters: [{
                                              fieldName:'changeTypeCode',
                                              value: modifytype,
                                              operator:'EQ'
                                            }],
                                        },
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'changeContent'
                                    }}
                                    form={form}
                                    afterSelect={changevalue}
                                />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="执行部门">
                            {getFieldDecorator('smChangeDescriptionAfter', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写执行部门',
                                    },
                                ],
                            })(
                                <Input disabled placeholder="请输入执行部门" />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="计划完成天数">
                            {getFieldDecorator('smChangeDescriptionAfter', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入计划完成天数',
                                    },
                                ],
                            })(
                                <Input placeholder="请输入计划完成天数" />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="备注">
                            {getFieldDecorator('smChangeDescriptionAfter', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                            })(
                                <TextArea placeholder="请输入备注" />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        );
    },
);

export default create()(ModifyForm);
