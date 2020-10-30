// 新增协同人员弹框
import React, { useEffect, useState } from 'react';
import { ComboList, ComboTree, ExtModal } from 'suid';
import { Col, Form, Input, Row } from 'antd';
import { ApplyOrganizationProps, UserByDepartmentConfig, GetUserTelByUserId} from '../../mainData/commomService';
import { basicServiceUrl, gatewayUrl } from '../../../../utils/commonUrl';

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const AddPersonModal = (props) => {
    const { visible, onCancel, isEdit, personHandleOK, form } = props;
    const { getFieldDecorator, setFieldsValue, getFieldValue } = props.form;

    const clearSelected = () => {
        form.resetFields();
    };
    const onOk = () => {
        props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (data.lineNum) {
                    values.lineNum = data.lineNum
                    values.memberRuleBoList = data.memberRuleBoList
                }
                personHandleOK(values);
            }
        });
    }
    const userSelect = (value) => {
        setFieldsValue({
            memberName: value.userName,
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
        width={'80vh'}
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
                        getFieldDecorator('departmentCode'),
                        getFieldDecorator('departmentId'),
                        getFieldDecorator('departmentName', {
                            initialValue: isEdit ? originData.departmentName : '',
                        })(
                            <ComboTree
                                form={form}
                                name={'departmentName'}
                                field={['departmentCode', 'departmentId']}
                                afterSelect={(item) => {
                                    console.log(item)
                                }}
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
                        getFieldDecorator('memberName', {
                            initialValue: isEdit ? originData.memberName : "",
                            rules: [
                                {
                                    required: true,
                                    message: '姓名不能为空',
                                },
                            ],
                        })(<Input disabled={true} placeholder='请输入姓名' />)
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'联系电话'}>
                    {
                        getFieldDecorator('memberTel', {
                            initialValue: isEdit ? originData.memberTel : '',
                            rules: [
                                {
                                    required: true,
                                    message: '联系电话不能为空',
                                },
                            ],
                        })(<Input placeholder='请输入联系电话' disabled={true} />)
                    }
                </FormItem>
            </Row>

        </Form>

    </ExtModal>
}
export default Form.create()(AddPersonModal);