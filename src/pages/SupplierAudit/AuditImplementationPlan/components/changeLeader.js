// 变更组长
import React, { useState, useEffect } from "react";
import { Form, Row, Spin, message } from "antd";
import { ExtModal } from 'suid';
import { GetUserTelByUserId } from "../../mainData/commomService";
import { changeTeamLeader } from "../service";
import { UserSelect } from '@/components';

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ChangeLeader = (props) => {
    const { visible, handleCancel, form, originData = {}, handleOk } = props
    const { getFieldDecorator, validateFieldsAndScroll, setFieldsValue } = form;
    const [loading, setLoading] = useState(false);

    const onOk = async () => {
        validateFieldsAndScroll((err, values) => {
            if (err) return;
            if(values.employeeNo === props.originData.leaderEmployeeNo) {
                handleCancel();
                return;
            }
            setLoading(true);
            changeTeamLeader({
                relatedId: props.originData && props.originData.id,
                ...values,
            }).then(res => {
                setLoading(false);
                if (res.success) {
                    message.success("操作成功");
                    handleOk()
                    handleCancel();
                } else {
                    message.error(res.message);
                }
            }).catch(()=>{
                setLoading(false);
            })
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
            }
        });
    }

    return <ExtModal
        width={'30vw'}
        maskClosable={false}
        visible={visible}
        title="变更组长"
        onCancel={handleCancel}
        onOk={onOk}
        destroyOnClose
    >
        <Spin spinning={loading}>
            <Row>
                <FormItem {...formItemLayoutLong} label={'审核小组组长'}>
                    {
                        getFieldDecorator('departmentId'),
                        getFieldDecorator('departmentCode'),
                        getFieldDecorator('departmentName'),
                        getFieldDecorator('codePath'),
                        getFieldDecorator('namePath'),
                        getFieldDecorator('memberId', { initialValue: originData.leaderId }),
                        getFieldDecorator('employeeNo', { initialValue: originData.leaderEmployeeNo }),
                        getFieldDecorator('memberTel', { initialValue: originData.leaderTel }),
                        getFieldDecorator('memberName', {
                            initialValue: originData.leaderName,
                            rules: [{ required: true, message: '审核小组组长不能为空', },],
                        })(
                            <UserSelect
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
                                    getMemberTel(item.id);
                                    setFieldsValue({
                                        departmentId: item.organization.id,
                                        departmentCode: item.organization.code,
                                        departmentName: item.organization.name,
                                        codePath: item.organization.codePath,
                                        namePath: item.organization.namePath,
                                        memberId: item.id,
                                        memberName: item.userName,
                                        employeeNo: item.code
                                      });
                                }}
                            />
                        )
                    }
                </FormItem>
            </Row>
        </Spin>
    </ExtModal>

}

export default Form.create()(ChangeLeader);