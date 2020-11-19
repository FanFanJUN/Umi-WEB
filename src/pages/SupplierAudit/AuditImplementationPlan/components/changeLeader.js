/*
 * @Author: your name
 * @Date: 2020-11-11 10:31:15
 * @LastEditTime: 2020-11-19 16:04:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\components\changeLeader.js
 */
// 从年度审核新增
import React, { useState, useEffect } from "react";
import { Form, Row, Spin, message } from "antd";
import { ExtModal, ComboList, ComboTree, } from 'suid';
import { listAllOrgnazationWithDataAuth } from '../../MonthAuditPlan/service';
import { UserByDepartmentNameConfig } from "../../mainData/commomService";
import { basicServiceUrl, gatewayUrl } from '@/utils/commonUrl';
import { changeTeamLeader } from "../service";

const FormItem = Form.Item;
const formItemLayoutLong = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ChangeLeader = (props) => {
    const { visible, handleCancel, form, originData = {}, handleOk } = props
    const { getFieldDecorator, validateFieldsAndScroll } = form;
    const [loading, setLoading] = useState(false);
    const [prgId, setOrgId] = useState('');
    const [selectObj, setSelectObj] = useState({})

    useEffect(() => {
        listAllOrgnazationWithDataAuth().then(res => {
            if (res.success) {
                setOrgId(res.data[0] ? res.data[0].id : '');
            }
        })
    }, [])

    const onOk = async () => {
        validateFieldsAndScroll((err, values) => {
            if (err) return;
            changeTeamLeader({
                relatedId: props.originData && props.originData.id,
                ...values,
                ...selectObj,
            }).then(res => {
                console.log("变更组长", res)
                if (res.success) {
                    message.success("操作成功");
                    handleOk()
                    handleCancel();
                } else {
                    message.error(res.message);
                }
            })
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
                <FormItem {...formItemLayoutLong} label={'月度审核计划'}>
                    {
                        getFieldDecorator('memberId', { initialValue: originData.leaderId }),
                        getFieldDecorator('employeeNo', { initialValue: originData.leaderEmployeeNo }),
                        getFieldDecorator('memberTel', { initialValue: originData.leaderTel }),
                        getFieldDecorator('memberName', {
                            initialValue: originData.leaderName,
                            rules: [{ required: true, message: '审核小组组长不能为空', },],
                        })(
                            <ComboList
                                form={form}
                                style={{ width: "100%" }}
                                name={'memberName'}
                                field={['employeeNo', 'memberId', 'memberTel']}
                                store={{
                                    data: {
                                        includeSubNode: true,
                                        quickSearchProperties: ['code', 'user.userName'],
                                        organizationId: prgId,
                                        sortOrders: [{ property: 'code', direction: 'ASC' }],
                                    },
                                    type: 'POST',
                                    autoLoad: false,
                                    url: `${gatewayUrl}${basicServiceUrl}/employee/findByUserQueryParam`,
                                }}
                                afterSelect={(item) => {
                                    console.log("选中数据", item);
                                    let selectObj = {
                                        departmentId: item.organization.id,
                                        departmentCode: item.organization.code,
                                        departmentName: item.organization.name,
                                        codePath: item.organization.codePath,
                                        namePath: item.organization.namePath
                                    }
                                    setSelectObj(selectObj);
                                }}
                                {...UserByDepartmentNameConfig}
                            />
                        )
                    }
                </FormItem>
            </Row>
        </Spin>
    </ExtModal>

}

export default Form.create()(ChangeLeader);