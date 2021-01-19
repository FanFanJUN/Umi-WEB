import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Modal, Form, Row, Col, Input } from 'antd';
import { ComboList } from 'suid';
import { recommendUrl, basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';
import { isEmpty } from '@/utils'
import {
    Tasktypelist, Identification,
    Identificationtask, PersonliableList
} from '../../commonProps'
const { create, Item } = Form
const { TextArea } = Input;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16
    },
};
const getInformation = forwardRef(({
    form,
    title,
    editData,
    attachId,
    onOk = () => null,
    seltaskid,
    type
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [visible, setvisible] = useState(false);
    const [taskid, setTaskid] = useState('');
    const [edit, setEdit] = useState(false);
    const [others, setOthers] = useState(true);
    const [selectype, setSelectype] = useState('');
    useEffect(() => {
        handleDate(editData)
    }, [editData]);
    function handleDate(value) {
        if (type && attachId === 2) {
            setOthers(false)
            setTaskid(seltaskid)
        } else {
            setOthers(true)
        }
        if (type && value.key === 1) {
            setEdit(true)
        } else {
            setEdit(false)
        }
    }
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };

    function handleSubmit() {
        validateFieldsAndScroll((err, val) => {
            let params;
            if (!err) {
                if (attachId === 2) {
                    params = { ...editData, ...val }
                } else {
                    val.defaultRequired = selectype
                    params = val
                }
                onOk(params);
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
        if (!isEmpty(editData.stageId)) {
            form.setFieldsValue({
                stageId: editData.stageId,
                stageCode: editData.stageCode,
                stageSort: editData.stageSort,
            });
        }
        form.setFieldsValue({
            'sort': val.changeSort,
        })
        setSelectype(val.defaultRequired)
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
                    <Col span={12}>
                        <Item {...formLayout} label="认定阶段">
                            {
                                getFieldDecorator('stageId', { initialValue: editData ? editData.stageId : '' }),
                                getFieldDecorator('stageCode', { initialValue: editData ? editData.stageCode : '' }),
                                getFieldDecorator('stageSort', { initialValue: editData ? editData.stageSort : '' }),
                                getFieldDecorator('stageName', {
                                    initialValue: editData ? editData.stageName : '',
                                    rules: [{ required: true, message: '请选择认定阶段' }],
                                })(
                                    <ComboList
                                        showSearch={false}
                                        style={{ width: '100%' }}
                                        name={'stageName'}
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
                                getFieldDecorator(`taskCode`, { initialValue: editData ? editData.taskCode : '' }),
                                getFieldDecorator('taskName', {
                                    initialValue: editData ? editData.taskName : '',
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
                                getFieldDecorator('taskTypeCode', { initialValue: editData ? editData.taskTypeCode : '' }),
                                getFieldDecorator('taskTypeName', {
                                    initialValue: editData ? editData.taskTypeName : '',
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
                                initialValue: editData ? editData.sort : '',
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
                                getFieldDecorator('responsiblePartyId', { initialValue: editData ? editData.responsiblePartyId : '' }),
                                getFieldDecorator('responsiblePartyName', {
                                    initialValue: editData ? editData.responsiblePartyName : '',
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
                                    initialValue: editData ? editData.executiveDepartmentId : ''
                                }),
                                getFieldDecorator('executiveDepartmentName', {
                                    initialValue: editData ? editData.executiveDepartmentName : '',
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
                                initialValue: editData ? editData.writeDay : '',
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
                                initialValue: editData ? editData.remark : '',
                            })(
                                <TextArea placeholder="请输入备注信息" maxLength={100} />
                            )}
                        </Item>
                    </Col>
                </Row>
            </Modal>
        </>
    );
},
);

export default create()(getInformation);
