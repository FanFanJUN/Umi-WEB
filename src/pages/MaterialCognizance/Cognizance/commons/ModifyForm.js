import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { smBaseUrl} from '../../../../utils/commonUrl';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import { recommendUrl} from '../../../../utils/commonUrl';
import UserSelect from '../../../PCNModify/UserSelect/index'
import {Tasktypelist} from '../../commonProps'
import {onlyNumber} from '../../../../utils'
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
        const [taskid, setTaskid] = useState({});
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
            setTaskid(val.id)
        }
        // 执行部门
        function personliable(val) {
            form.setFieldsValue({ smChangeDescriptionAfter: val[0].organization.name}) 
        }
        function awfssa() {
            form.setFieldsValue({ smChangeDescriptionAfter: ''}) 
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
                                        url: `${recommendUrl}/api/samPhysicalIdentificationStageService/findByPage`,
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'identificationStage'
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
                                        url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/findByStageId?stageId=` + taskid,
                                        type: 'POST'
                                    }}
                                    reader={{
                                        name: 'taskDesc'
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
                                    {...Tasktypelist}
                                    name='smChangeValue'
                                    form={form}
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
                                    onBlur={onlyNumber} 
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="执行责任人">
                            {getFieldDecorator('smInKindManName', {
                                initialValue: initialValue && initialValue.smChangeDescriptionAfter,
                                rules: [
                                    {
                                        required: true,
                                        message: '请选择执行责任人',
                                    },
                                ],
                            })(
                                <UserSelect name="smInKindManName" style={{width:"100%",zIndex:10}}
                                    disabled={type === 'detail'}
                                    wrapperStyle={{width:950}}
                                    reader={{name:'userName',field:['code']}} 
                                    form={form}
                                    multiple={false}
                                    onRowsChange={personliable}
                                    onChange={awfssa}
                                    field={['smInKindManId']}
                                    placeholder="请选择执行责任人"
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
                                        message: '请选择执行部门',
                                    },
                                ],
                            })(
                                <Input disabled placeholder="请选择执行部门" />
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
                                <Input onBlur={onlyNumber} placeholder="请输入计划完成天数"  />
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
