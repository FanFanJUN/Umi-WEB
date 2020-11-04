// 从年度审核新增
import React, { useState, useRef } from "react";
import {  Button } from "antd";
import { ExtTable, ExtModal } from 'suid';
import { recommendUrl } from '@/utils/commonUrl';

const ChangeHistory = (props) => {
    const { visible, handleCancel } = props
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);

    const columns = [
        { title: '需求公司', dataIndex: 'applyCorporationName', width: 140, ellipsis: true },
        { title: '采购组织', dataIndex: 'purchaseOrgName', ellipsis: true, width: 140 },
        { title: '供应商', dataIndex: 'supplierCode', ellipsis: true, width: 140 },
        { title: '代理商', dataIndex: 'agentName', ellipsis: true, width: 140 },
        { title: '物料分类', dataIndex: 'materialGroupName', ellipsis: true, width: 140 },
    ].map(item => ({ ...item, align: 'center' }))

    const handleBtn = (type) => {

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
            <Button onClick={()=>{handleBtn("view")}} style={{margin: "0 3px"}} key="view">查看</Button>
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
                url: `${recommendUrl}/api/reviewPlanYearService/findPageLineById`,
                type: 'POST',
            }}
            columns={columns}
        />
    </ExtModal>

}

export default ChangeHistory;