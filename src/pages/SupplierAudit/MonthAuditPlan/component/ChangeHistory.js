// 从年度审核新增
import React, { useState, useRef } from "react";
import {  Button } from "antd";
import { ExtTable, ExtModal } from 'suid';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab } from '../../../../utils';

const ChangeHistory = (props) => {
    const { visible, handleCancel } = props
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);

    const columns = [
        { title: '变更单号', dataIndex: 'changeCode', width: 140, ellipsis: true },
        { title: '流程状态', dataIndex: 'flowState', ellipsis: true, width: 140 },
        { title: '变更原因', dataIndex: 'changeReason', ellipsis: true, width: 140 },
        { title: '附件', dataIndex: 'changeFileId', ellipsis: true, width: 140 },
        { title: '变更人', dataIndex: 'applyName', ellipsis: true, width: 140 },
        { title: '变更时间', dataIndex: 'applyDate', ellipsis: true, width: 140 },
        { title: '链接', dataIndex: 'id', ellipsis: true, width: 140, render:(text)=><a onClick={(e)=>{
            e.stopPropagation();
            console.log("查看")
        }}>变更明细</a> },
    ].map(item => ({ ...item, align: 'center' }))

    const handleBtn = (type) => {
        switch(type) {
            case "view":
                openNewTab(`supplierAudit/MonthAuditChangeDetail?id=${selectedRowKeys[0]}&orderId=${props.id}`, '月度审核计划变更单详情', false);
                break;
            default:
                break;
        }
    }
    return <ExtModal
        width={'60vw'}
        maskClosable={false}
        visible={visible}
        title="变更历史"
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
    >
        <div>
            <Button onClick={()=>{handleBtn("view")}} style={{margin: "0 3px"}} key="view" disabled={selectRows.length !== 1}>查看</Button>
            <Button onClick={()=>{handleBtn("delete")}} style={{margin: "0 3px"}} key="delete">删除</Button>
            <Button onClick={()=>{handleBtn("publish")}} style={{margin: "0 3px"}} key="publish">提交审核</Button>
            <Button onClick={()=>{handleBtn("history")}} style={{margin: "0 3px"}} key="history">审核历史</Button>
        </div>
        <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='id'
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: true }}
            size='small'
            onSelectRow={(key, rows) => {
                setselectedRowKeys(key);
                setselectRows(rows);
            }}
            ref={tableRef}
            selectedRowKeys={selectedRowKeys}
            store={{
                url: `${recommendUrl}/api/reviewPlanMonthChangeService/findPageById`,
                type: 'POST',
                params: {
                    reviewPlanMonthCode: props.code
                }
            }}
            columns={columns}
        />
    </ExtModal>

}

export default ChangeHistory;