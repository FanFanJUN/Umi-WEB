/*
 * @Author: your name
 * @Date: 2020-11-04 16:24:34
 * @LastEditTime: 2020-11-10 15:25:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\ChangeHistory.js
 */
// 从年度审核新增
import React, { useState, useEffect } from "react";
import { ExtTable, ExtModal } from 'suid';
import { recommendUrl } from '@/utils/commonUrl';

const ChangeLineModal = (props) => {
    const { visible, handleCancel } = props

    const columns = [
        { title: '操作内容', dataIndex: 'operationType', render:text=>{
            switch(text) {
                case "UPDATE":
                    return "更新";
                default:
                    return ''
            }
        } },
        { title: '行号', dataIndex: 'type', ellipsis: true },
        { title: '更改字段', dataIndex: 'field', ellipsis: true },
        { title: '更改前', dataIndex: 'fieldBeforValue', ellipsis: true, render:(text)=>text&&text!=="null"?text:'' },
        { title: '更改后', dataIndex: 'fieldAfterValue', ellipsis: true, render:(text)=>text&&text!=="null"?text:'' },
    ].map(item => ({ ...item, align: 'center' }))

    return <ExtModal
        width={'50vw'}
        maskClosable={false}
        visible={visible}
        title="变更明细"
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
    >
        <ExtTable
            rowKey='id'
            showSearch={false}
            checkbox={false}
            size='small'
            remotePaging
            columns={columns}
            store={{
                url: `${recommendUrl}/api/reviewPlanMonthChangeService/findChangeHistoryPageById`,
                type: 'POST',
                params: {
                    businessId: props.id
                }
            }}
        />
    </ExtModal>

}

export default ChangeLineModal;