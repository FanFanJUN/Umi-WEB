/*
 * @Author: your name
 * @Date: 2020-11-04 16:24:34
 * @LastEditTime: 2020-11-10 11:01:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\ChangeHistory.js
 */
// 从年度审核新增
import React, { useState, useRef } from "react";
import {  Button } from "antd";
import { ExtTable, ExtModal, WorkFlow } from 'suid';
import { StartFlow } from 'seid';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab } from '../../../../utils';
import Upload from "../../Upload";
import { deleteChangeById } from "../service";
import ChangeLineModal from "./ChangeLineModal";

const { FlowHistoryButton } = WorkFlow;

const ChangeHistory = (props) => {
    const { visible, handleCancel } = props
    const tableRef = useRef(null)
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectRows, setselectRows] = useState([]);
    const [detailData, setDetailData] = useState({});

    const columns = [
        { title: '变更单号', dataIndex: 'changeCode', width: 200, ellipsis: true },
        { title: '流程状态', dataIndex: 'flowState', ellipsis: true, width: 140, render: v=>{
            switch (v) {
                case 'INIT':
                    return '未进入流程';
                case 'INPROCESS':
                    return '流程中';
                case 'COMPLETED':
                    return '流程处理完成';
            }
        } },
        { title: '变更原因', dataIndex: 'changeReason', ellipsis: true, width: 140 },
        // { title: '附件', dataIndex: 'changeFileId', ellipsis: true, width: 140, render:(text)=>{
        //     return <Upload entityId={text} type={'show'} />
        //     return text;
        // } },
        { title: '变更人', dataIndex: 'applyName', ellipsis: true, width: 140 },
        { title: '变更时间', dataIndex: 'applyDate', ellipsis: true, width: 140 },
        { title: '链接', dataIndex: 'id', ellipsis: true, width: 140, render:(text)=><a onClick={(e)=>{
            e.stopPropagation();
            setDetailData({
                visible: true,
                id: text
            })
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
    const refresh = () => {
        tableRef.current.manualSelectedRows();
        tableRef.current.remoteDataRefresh();
    }
    const handleDelete = async () => {
        const res = await deleteChangeById({id: selectedRowKeys[0]})
        if(res.success) {
            message.success("删除成功");
            refresh();
        } else {
            message.error(res.message);
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
            <Button onClick={()=>{handleBtn("view")}} key="view" disabled={selectRows.length !== 1}>查看</Button>
            <Button onClick={handleDelete} style={{margin: "0 6px"}} key="delete" disabled={selectRows.length === 0 || !selectRows.every(item=>item.flowState == "INIT")}>删除</Button>
            <StartFlow
                businessKey={selectedRowKeys[0] ? selectedRowKeys[0] : ''}
                callBack={refresh}
                disabled={selectedRowKeys.length !== 1 || selectRows[0].flowState != "INIT" }
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewPlanMonthChange'
            >提交审核</StartFlow>
            <FlowHistoryButton
                businessId={selectedRowKeys[0]}
                flowMapUrl='flow-web/design/showLook'
            >
                <Button disabled={selectedRowKeys.length !== 1 || selectRows[0].flowState == "INIT"} style={{ margin: '0 6px' }}>审核历史</Button>
            </FlowHistoryButton>
        </div>
        <ExtTable
            style={{ marginTop: '10px' }}
            rowKey='id'
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
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
        {detailData.visible && <ChangeLineModal
            visible={detailData.visible}
            id={detailData.id}
            onCancel={()=>{setDetailData({visible: false})}}
        />}
    </ExtModal>

}

export default ChangeHistory;