
import React, { useState, useRef } from "react";
import { Button, message } from "antd";
import { ExtTable, ExtModal, WorkFlow } from 'suid';
import { StartFlow } from 'seid';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab, getUserAccount } from '@/utils';
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
        {
            title: '流程状态', dataIndex: 'flowStatus', ellipsis: true, width: 140, render: v => {
                switch (v) {
                    case 'INIT':
                        return '未进入流程';
                    case 'INPROCESS':
                        return '流程中';
                    case 'COMPLETED':
                        return '流程处理完成';
                }
            }
        },
        { title: '变更原因', dataIndex: 'changeReason', ellipsis: true, width: 140 },
        // { title: '附件', dataIndex: 'changeFileId', ellipsis: true, width: 140, render:(text)=>{
        //     return <Upload entityId={text} type={'show'} />
        //     return text;
        // } },
        { title: '变更人', dataIndex: 'applyName', ellipsis: true, width: 140 },
        { title: '变更时间', dataIndex: 'applyDate', ellipsis: true, width: 140 },
        {
            title: '链接', dataIndex: 'id', ellipsis: true, width: 140, render: (text) => <a onClick={(e) => {
                e.stopPropagation();
                setDetailData({
                    visible: true,
                    id: text
                })
            }}>变更明细</a>
        },
    ].map(item => ({ ...item, align: 'center' }))

    const handleBtn = (type) => {
        switch (type) {
            case "view":
                openNewTab(`supplierAudit/AuditIPChangeDetail?id=${selectedRowKeys[0]}`, '审核实施计划变更单详情', false);
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
        const res = await deleteChangeById({ id: selectedRowKeys[0] })
        if (res.success) {
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
            <Button onClick={() => { handleBtn("view") }} key="view" disabled={selectRows.length !== 1}>查看</Button>
            <Button onClick={handleDelete} style={{ margin: "0 6px" }} key="delete"
                disabled={selectRows.length === 0
                    || !selectRows.every(item => item.flowStatus == "INIT")
                    || !selectRows.every(item => item.applyAccount == getUserAccount())
                }>删除</Button>
            <StartFlow
                businessKey={selectedRowKeys[0] ? selectedRowKeys[0] : ''}
                callBack={refresh}
                disabled={selectedRowKeys.length !== 1 || selectRows[0].flowStatus != "INIT" || selectRows[0].applyAccount != getUserAccount()}
                businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewImplementPlanChange'
            >提交审核</StartFlow>
            <FlowHistoryButton
                businessId={selectedRowKeys[0]}
                flowMapUrl='flow-web/design/showLook'
            >
                <Button disabled={selectedRowKeys.length !== 1 || selectRows[0].flowStatus == "INIT"} style={{ margin: '0 6px' }}>审核历史</Button>
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
                url: `${recommendUrl}/api/reviewImplementPlanChangeService/findPageByCode`,
                type: 'POST',
                params: {
                    reviewImplementPlanCode: props.code
                }
            }}
            columns={columns}
        />
        {detailData.visible && <ChangeLineModal
            visible={detailData.visible}
            id={detailData.id}
            handleCancel={() => { setDetailData({ visible: false }) }}
        />}
    </ExtModal>

}

export default ChangeHistory;