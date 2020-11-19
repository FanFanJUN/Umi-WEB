import React, { forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { Modal, Form, Row, Col, Input, } from 'antd';
import { smBaseUrl } from '../../../../utils/commonUrl';
import { Fieldclassification } from '@/utils/commonProps'
import { ComboGrid, ComboList } from 'suid';
import { recommendUrl, basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';
import UserSelect from '../../../PCNModify/UserSelect/index'
import {
    Tasktypelist, Identification,
    Identificationtask, PersonliableList
} from '../../commonProps'
import { onlyNumber, isEmpty } from '../../../../utils'
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
        const [edit, setEdit] = useState(false);
        const [others, setOthers] = useState(true);
        useEffect(() => {
            handleDate(dataSource)
        }, [dataSource, handleDate, visible]);

        const handleDate = useCallback(
            function handleDate(value) {
                if (type) {
                    setInitialValue(value)
                } else {
                    setInitialValue({})
                }
                if (type && value.key === 1) {
                    setEdit(true)
                } else {
                    setEdit(false)
                }
            }
        )
        function handleSubmit() {
            validateFieldsAndScroll(async (err, val) => {
                if (!err) {
                    onOk({ ...initialValue, ...val });
                }
            });
        }
        // 变更内容
        function changevalue(val) {
            setOthers(false)
            setTaskid(val.id)
        }
        // 执行部门
        function personliable(val) {
            console.log(val)

        }
        function handleminate() {
            form.setFieldsValue({ executiveDepartmentName: '' })
        }
        function handlExecutor(val) {
            console.log(val)
            form.setFieldsValue({
                'executiveDepartmentName': val.organization.name,
                'executiveDepartmentId': val.organization.id,
            })
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
                            {
                                getFieldDecorator('stageCode', { initialValue: dataSource ? dataSource.stageCode : '' }),
                                getFieldDecorator('stageName', {
                                    initialValue: dataSource ? dataSource.stageName : '',
                                    rules: [{ required: true, message: '请选择认定阶段' }],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        name={'stageName'}
                                        store={{
                                            url: `${recommendUrl}/api/samPhysicalIdentificationStageService/findByPage`,
                                            type: 'POST'
                                        }}
                                        field={['stageCode']}
                                        form={form}
                                        afterSelect={changevalue}
                                        {...Identification}
                                        disabled={edit}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="认定任务">
                            {
                                getFieldDecorator(`taskCode`, { initialValue: initialValue ? initialValue.taskCode : '' }),
                                getFieldDecorator('taskName', {
                                    initialValue: initialValue ? initialValue.taskName : '',
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
                                        {...Identificationtask}
                                        name='taskName'
                                        cascadeParams={{ stageId: taskid }}
                                        store={{
                                            url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/findByStageId?stageId=` + taskid,
                                            type: 'POST',
                                        }}
                                        field={['taskCode']}
                                        form={form}
                                        afterSelect={changevalue}
                                        disabled={edit || others}
                                    />
                                )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="任务类型">
                            {
                                getFieldDecorator('taskTypeCode', { initialValue: initialValue ? initialValue.taskTypeCode : '' }),
                                getFieldDecorator('taskTypeName', {
                                    initialValue: initialValue ? initialValue.taskTypeName : '',
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
                                        name='taskTypeName'
                                        field={['taskTypeCode']}
                                        form={form}
                                        disabled={edit}
                                    />
                                )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="排序号">
                            {getFieldDecorator('sort', {
                                initialValue: initialValue ? initialValue.sort : '',
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
                                    disabled={edit}
                                />
                            )}
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="执行责任人">
                            {
                                getFieldDecorator('responsiblePartyId', { initialValue: initialValue ? initialValue.responsiblePartyId : '' }),
                                getFieldDecorator('responsiblePartyName', {
                                    initialValue: initialValue ? initialValue.responsiblePartyName : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择执行责任人',
                                        },
                                    ],
                                })(
                                    <ComboList
                                        form={form}
                                        style={{ width: "100%" }}
                                        name={'responsiblePartyName'}
                                        field={['responsiblePartyId']}
                                        store={{
                                            params: {
                                                includeFrozen: false,
                                                includeSubNode: false,
                                                quickSearchProperties: ['code', 'user.userName'],
                                                organizationId: '',
                                                sortOrders: [{ property: 'code', direction: 'ASC' }],
                                            },
                                            type: 'POST',
                                            autoLoad: false,
                                            url: `${gatewayUrl}${basicServiceUrl}/employee/findByUserQueryParam`,
                                        }}
                                        {...PersonliableList}
                                        afterSelect={handlExecutor}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="执行部门">
                            {
                                getFieldDecorator('executiveDepartmentId', {
                                    initialValue: initialValue ? initialValue.executiveDepartmentId : ''
                                }),
                                getFieldDecorator('executiveDepartmentName', {
                                    initialValue: initialValue ? initialValue.executiveDepartmentName : '',
                                    rules: [
                                        {
                                            required: true,
                                            message: '请选择执行部门',
                                        },
                                    ],
                                })(
                                    <Input disabled placeholder="请选择执行部门" />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Item {...formLayout} label="计划完成天数">
                            {getFieldDecorator('planDay', {
                                initialValue: initialValue ? initialValue.planDay : '',
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入计划完成天数',
                                    },
                                ],
                            })(
                                <Input onBlur={onlyNumber} placeholder="请输入计划完成天数" />
                            )}
                        </Item>
                    </Col>
                    <Col span={12}>
                        <Item {...formLayout} label="备注信息">
                            {getFieldDecorator('remark', {
                                initialValue: initialValue ? initialValue.remark : '',
                            })(
                                <TextArea placeholder="请输入备注信息" maxLength={100} />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        );
    },
);

export default create()(ModifyForm);
