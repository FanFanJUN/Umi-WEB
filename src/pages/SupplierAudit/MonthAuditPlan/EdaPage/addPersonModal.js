// 新增协同人员弹框
import React, { useEffect, useState } from 'react';
import { ExtModal, message } from 'suid';
import { Form, Input, Row } from 'antd';
import { UserSelect } from '@/components';
import { GetUserTelByUserId } from "../../mainData/commomService";

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const AddPersonModal = (props) => {
    const { visible, onCancel, isEdit, personHandleOK, form, originData = {}, checkRepeat } = props;
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
    const getMemberTel = (id) => {
        GetUserTelByUserId({
            userId: id,
        }).then(res => {
            if (res.success) {
                setFieldsValue({
                    memberTel: res.data.mobile,
                });
            } else {
                message.warning('获取手机号失败');
            }
        });
    }
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
                <FormItem {...formItemLayoutLong} label={'姓名'} style={{marginBottom: '0px'}}>
                    {
                        getFieldDecorator('memberId', { initialValue: isEdit ? originData.memberId : '', }),
                        getFieldDecorator('memberName', {
                            initialValue: isEdit ? originData.memberName : "",
                            rules: [{ required: true, message: '姓名不能为空', },],
                        })(<UserSelect
                            placeholder='选择成员'
                            form={form}
                            mode="tags"
                            name='name'
                            multiple={false}
                            reader={{
                                name: 'userName',
                                field: ['code', 'id']
                            }}
                            onRowsChange={(item) => {
                                if (checkRepeat(item.code)) {
                                    message.warning("选中人员已存在！");
                                    setFieldsValue({ memberName: isEdit ? originData.memberName : "" })
                                } else {
                                    getMemberTel(item.id);
                                    setFieldsValue({
                                        memberName: item.userName,
                                        memberId: item.id,
                                        employeeNo: item.code,
                                        namePath: item.organization?.namePath,
                                        codePath: item.organization?.codePath,
                                        departmentCode: item.organization?.code,
                                        departmentId: item.organization?.id,
                                        departmentName: item.organization?.name,
                                    });
                                }
                            }}
                        />)
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'部门'} style={{marginBottom: '0px'}}>
                    {
                        getFieldDecorator('namePath', { initialValue: isEdit ? originData.namePath : '', }),
                        getFieldDecorator('codePath', { initialValue: isEdit ? originData.codePath : '', }),
                        getFieldDecorator('departmentCode', { initialValue: isEdit ? originData.departmentCode : '', }),
                        getFieldDecorator('departmentId', { initialValue: isEdit ? originData.departmentId : '', }),
                        getFieldDecorator('departmentName', {
                            initialValue: isEdit ? originData.departmentName : '',
                            rules: [{ required: true, message: '部门不能为空', },]
                        })(
                            <Input disabled={true} />
                        )
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'员工编号'} style={{marginBottom: '0px'}}>
                    {
                        getFieldDecorator('employeeNo', {
                            initialValue: isEdit ? originData.employeeNo : "",
                            rules: [{ required: true, message: '员工编号不能为空', },]
                        })(
                            <Input disabled={true} />
                        )
                    }
                </FormItem>
            </Row>
            <Row>
                <FormItem {...formItemLayoutLong} label={'联系电话'} style={{marginBottom: '0px'}}>
                    {
                        getFieldDecorator('memberTel', {
                            initialValue: isEdit ? originData.memberTel : '',
                            rules: [{ required: true, message: '联系电话不能为空', },],
                        })(<Input placeholder='请输入联系电话' />)
                    }
                </FormItem>
            </Row>

        </Form>

    </ExtModal>
}
export default Form.create()(AddPersonModal);