/*
 * @Author: 黄永翠
 * @Date: 2020-11-05 15:12:46
 * @LastEditTime: 2020-11-09 16:07:23
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\MonthAuditPlan\component\ChangeLineInfo.js
 */
import React, { Fragment, useRef, useState } from 'react';
import { recommendUrl } from '@/utils/commonUrl';
import { ExtTable, utils } from 'suid';
import styles from '../index.less';

const Index = (props) => {

    const columns = [
        { title: '操作内容', dataIndex: 'reviewTypeCode', width: 200 },
        { title: '对象', dataIndex: 'reviewTypeName', ellipsis: true },
        { title: '更改字段', dataIndex: 'conclusionCode', ellipsis: true },
        { title: '更改前', dataIndex: 'conclusionName', ellipsis: true },
        { title: '更改后', dataIndex: 'rank', ellipsis: true },
    ].map(item => ({ ...item, align: 'center' }));

    return (<div className={styles.wrapper}>
        <div className={styles.bgw}>
            <div className={styles.title}>变更明细</div>
            <div className={styles.content}>
                <ExtTable
                    rowKey={(v) => v.id}
                    columns={columns}
                    store={{
                        url: `${recommendUrl}/api/reviewPlanMonthChangeService/findHistoryPageByChangId`,
                        type: 'GET',
                        params: {
                            id: props.id
                        }
                    }}
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
