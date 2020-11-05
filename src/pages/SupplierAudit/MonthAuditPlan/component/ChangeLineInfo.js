import React, { Fragment, useRef, useState } from 'react';
import { recommendUrl } from '@/utils/commonUrl';
import { ExtTable, utils } from 'suid';
import styles from '../index.less';

const Index = (props) => {

    const columns = [
        { title: '审核类型代码', dataIndex: 'reviewTypeCode', width: 200 },
        { title: '审核类型名称', dataIndex: 'reviewTypeName', ellipsis: true },
        { title: '结论代码', dataIndex: 'conclusionCode', ellipsis: true },
        { title: '结论名称', dataIndex: 'conclusionName', ellipsis: true },
        {
            title: '是否通过', dataIndex: 'whetherPass', ellipsis: true, render: function (text, context) {
                return text ? '是' : '否';
            }
        },
        { title: '排序号', dataIndex: 'rank', ellipsis: true },
        { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否' },
    ].map(item => ({ ...item, align: 'center' }));

    return (<div className={styles.wrapper}>
        <div className={styles.bgw}>
            <div className={styles.title}>拟审核信息</div>
            <div className={styles.content}>
                <ExtTable
                    rowKey={(v) => v.id}
                    columns={columns}
                    store={{
                        url: `${recommendUrl}/api/reviewPlanMonthChangeService/findHistoryPageByChangId`,
                        type: 'POST',
                        params: {
                            businessId: props.id
                        }
                    }}
                    remotePaging={true}
                    checkbox={false}
                />
            </div>
        </div>

    </div>

    );

};

export default Index;
