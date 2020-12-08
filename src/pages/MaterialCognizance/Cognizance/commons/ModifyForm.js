import React, { forwardRef, useImperativeHandle, useEffect, useState, useCallback } from 'react';
import { Modal, Form, Row, Col, Input, InputNumber } from 'antd';
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
            title,
            attachId
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
        }, [dataSource, visible]);
        // 处理认定任务
        function handleDate(value) {
            if (type && attachId === 2) {
                setInitialValue(value)
                setOthers(false)
                setTaskid(value.stageId)
            } else {
                setOthers(true)
                setInitialValue({})
            }
            if (type && value.key === 1) {
                setEdit(true)
            } else {
                setEdit(false)
            }
        }
        // 表单值
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
            form.setFieldsValue({
                'taskCode': '',
                'taskName': '',
            })
        }
        // 执行部门
        function handlExecutor(val) {
            form.setFieldsValue({
                'executiveDepartmentName': val.organization.name,
                'executiveDepartmentId': val.organization.id,
            })
        }
        // 排序号
        function changeSort(val) {
            form.setFieldsValue({
                'sort': val.changeSort,
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
                                getFieldDecorator('stageId', { initialValue: dataSource ? dataSource.stageId : '' }),
                                getFieldDecorator('stageCode', { initialValue: dataSource ? dataSource.stageCode : '' }),
                                getFieldDecorator('stageSort', { initialValue: dataSource ? dataSource.stageSort : '' }),
                                getFieldDecorator('stageName', {
                                    initialValue: initialValue ? initialValue.stageName : '',
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
                                        field={['stageId', 'stageCode', 'stageSort']}
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
                                        afterSelect={changeSort}
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
                                    { required: true, message: '请填写排序号' },
                                    { pattern: RegExp(/^[1-9]\d*$/, "g"), message: '只能是数字' },
                                ],

                            })(
                                <Input
                                    style={{
                                        width: "100%"
                                    }}
                                    placeholder="请输入排序号"
                                    // onBlur={onlyNumber}
                                    disabled={true}
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
                            {getFieldDecorator('writeDay', {
                                initialValue: initialValue ? initialValue.writeDay : '',
                                rules: [
                                    { required: true, message: '请输入计划完成天数' },
                                    { pattern: RegExp(/^[1-9]\d*$/, "g"), message: '只能是数字' },
                                ],
                            })(
                                <Input placeholder="请输入计划完成天数" />
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
