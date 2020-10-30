// 新增协同人员弹框
import React, { useEffect, useState } from 'react';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import { ApplyOrganizationProps, UserByDepartmentConfig, GetUserTelByUserId } from '../../mainData/commomService';
import { basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const AddPersonModal = (props) => {
    const { visible, onCancel, isEdit, personHandleOK, form, originData } = props;
    const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

    const clearSelected = () => {
        form.resetFields();
    };
    const onOk = () => {
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                personHandleOK(values);
                onCancel();
            }
        });
    }
    // 部门选择更改
    const departChange = (value) => {
        console.log('部门选择更改', value)
        setFieldsValue({
            namePath: value.namePath,
            codePath: value.codePath,
            memberName: '',
            memberTel: '',
            employeeNo: ''
        });
    }
    // 员工选择更改
    const userSelect = (value) => {
        console.log('员工选择更改', value)
        setFieldsValue({
            memberName: value.userName,
            memberId: value.id,
            employeeNo: value.user.tenantCode
        });
        GetUserTelByUserId({
            userId: value.user.id,
        }).then(res => {
            if (res.success) {
                setFieldsValue({
                    memberTel: res.data.mobile,
                });
            } else {
                message.error('获取手机号失败');
            }
        });
    };

    return <ExtModal
        width={'30vw'}
        visible={visible}
        title={isEdit ? "编辑协同管理人员" : "新增协同管理人员"}
        onCancel={onCancel}
        maskClosable={false}
        afterClose={clearSelected}
        onOk={onOk}
    >
        <Form>
            <Row>
                <FormItem {...formItemLayoutLong} label={'部门'}>
                    {
                        getFieldDecorator('namePath', { initialValue: isEdit ? originData.namePath : '', }),
                        getFieldDecorator('codePath', { initialValue: isEdit ? originData.codePath : '', }),
                        getFieldDecorator('departmentCode', { initialValue: isEdit ? originData.departmentCode : '', }),
                        getFieldDecorator('departmentId', { initialValue: isEdit ? originData.departmentId : '', }),
                        getFieldDecorator('departmentName', {
                            initialValue: isEdit ? originData.departmentName : '',
                            rules: [{ required: true, message: '部门不能为空', },]
                        })(
                            <ComboTree
                                form={form}
                                name={'departmentName'}
                                field={['departmentCode', 'departmentId']}
                                afterSelect={departChange}
                                {...ApplyOrganizationProps}
                            />,
                        )
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'员工编号'}>
                    {
                        getFieldDecorator('employeeNo', {
                            initialValue: isEdit ? originData.employeeNo : "",
                            rules: [{ required: true, message: '员工编号不能为空', },]
                        })(
                            <ComboList
                                form={form}
                                name={'employeeNo'}
                                cascadeParams={{
                                    organizationId: getFieldValue('departmentId'),
                                }}
                                afterSelect={userSelect}
                                store={{
                                    data: {
                                        includeSubNode: true,
                                        quickSearchProperties: ['code', 'user.userName'],
                                        organizationId: getFieldValue('departmentId'),
                                        sortOrders: [{ property: 'code', direction: 'ASC' }],
                                    },
                                    type: 'POST',
                                    autoLoad: false,
                                    url: `${gatewayUrl}${basicServiceUrl}/employee/findByUserQueryParam`,
                                }}
                                {...UserByDepartmentConfig}
                            />,
                        )
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'姓名'}>
                    {
                        getFieldDecorator('memberId', { initialValue: isEdit ? originData.memberId : '', }),
                        getFieldDecorator('memberName', {
                            initialValue: isEdit ? originData.memberName : "",
                            rules: [{ required: true, message: '姓名不能为空', },],
                        })(<Input disabled={true} placeholder='请输入姓名' />)
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'联系电话'}>
                    {
                        getFieldDecorator('memberTel', {
                            initialValue: isEdit ? originData.memberTel : '',
                        })(<Input placeholder='请输入联系电话' />)
                    }
                </FormItem>
            </Row>

        </Form>

    </ExtModal>
}
export default Form.create()(AddPersonModal);