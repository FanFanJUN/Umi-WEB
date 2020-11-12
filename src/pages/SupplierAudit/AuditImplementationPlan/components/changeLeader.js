/*
 * @Author: your name
 * @Date: 2020-11-11 10:31:15
 * @LastEditTime: 2020-11-11 10:57:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\components\changeLeader.js
 */
// 从年度审核新增
import React, { useState, useEffect } from "react";
import { Form, Row, Spin } from "antd";
import { ExtModal, ComboList, ComboTree, } from 'suid';
import { listAllOrgnazationWithDataAuth } from '../../MonthAuditPlan/service';
import { UserByDepartmentNameConfig } from "../../mainData/commomService";
import { basicServiceUrl, gatewayUrl } from '@/utils/commonUrl';

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
            handleOk()
            handleCancel();
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
                        getFieldDecorator('leaderId', { initialValue: originData.leaderId }),
                        getFieldDecorator('leaderEmployeeNo', { initialValue: originData.leaderEmployeeNo }),
                        getFieldDecorator('leaderTel', { initialValue: originData.leaderTel }),
                        getFieldDecorator('leaderName', {
                            initialValue: originData.leaderName,
                            rules: [{ required: true, message: '审核小组组长不能为空', },],
                        })(
                            <ComboList
                                form={form}
                                style={{width: "100%"}}
                                name={'leaderName'}
                                field={['leaderEmployeeNo', 'leaderId', 'leaderTel']}
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