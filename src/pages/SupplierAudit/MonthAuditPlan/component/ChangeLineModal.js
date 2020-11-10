/*
 * @Author: your name
 * @Date: 2020-11-04 16:24:34
 * @LastEditTime: 2020-11-10 10:01:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\ChangeHistory.js
 */
// 从年度审核新增
import React, { useState, useEffect } from "react";
import { ExtTable, ExtModal } from 'suid';
import { findHistoryPageByChangId } from "../service";
import { message } from 'antd';

const ChangeLineModal = (props) => {
    const { visible, handleCancel } = props

    const [dataSource, setDataSource] = useState([]);
    useEffect(()=>{
        (async function(){
            const res = await findHistoryPageByChangId({id: props.id});
            if(res.success) {
                const dataList = res.data.map((item, index)=> {
                    item.id = index + 1;
                    return item;
                })
                setDataSource(dataList)
            } else {
                message.error(res.message)
            }
        })()
    }, [])

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
            columns={columns}
            dataSource={dataSource}
        />
    </ExtModal>

}

export default ChangeLineModal;