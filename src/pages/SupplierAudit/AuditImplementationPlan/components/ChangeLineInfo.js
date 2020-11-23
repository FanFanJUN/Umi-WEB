/*
 * @Author: your name
 * @Date: 2020-11-20 17:17:02
 * @LastEditTime: 2020-11-23 09:32:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\components\ChangeLineInfo.js
 */
import React, { useEffect, useState } from 'react';
import { ExtTable } from 'suid';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { message } from 'antd';
import { findHistoryPageByChangId } from "../service";

const Index = (props) => {
    const [dataSource, setDataSource] = useState([]);
    useEffect(()=>{
        (async function(){
            const res = await findHistoryPageByChangId({businessId: props.id});
            if(res.success) {
                if(!res.data.rows)return;
                const dataList = res.data.rows.map((item, index)=> {
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
        }},
        { title: '行号', dataIndex: 'type', ellipsis: true },
        { title: '更改字段', dataIndex: 'field', ellipsis: true },
        { title: '更改前', dataIndex: 'fieldBeforValue', ellipsis: true, render:(text)=>text&&text!=="null"?text:'' },
        { title: '更改后', dataIndex: 'fieldAfterValue', ellipsis: true, render:(text)=>text&&text!=="null"?text:'' },
    ].map(item => ({ ...item, align: 'center' }));

    return (<div className={styles.wrapper}>
        <div className={styles.bgw}>
            <div className={styles.title}>变更明细</div>
            <div className={styles.content}>
                <ExtTable
                    rowKey={v => v.id}
                    columns={columns}
                    dataSource={dataSource}
                    showSearch={false}
                    remotePaging={false}
                    checkbox={false}
                />
            </div>
        </div>

    </div>

    );

};

export default Index;
