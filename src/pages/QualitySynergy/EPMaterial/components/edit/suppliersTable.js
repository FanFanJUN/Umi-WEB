import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';

export default function () {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const tableRef = useRef(null);
    const columns = [
        { title: '是否暂停', dataIndex: 'name1', ellipsis: true, },
        { title: '是否发布', dataIndex: 'name2', ellipsis: true, },
        { title: '供应商代码', dataIndex: 'name3', ellipsis: true, },
        { title: '供应商名称', dataIndex: 'name4', ellipsis: true, },
        { title: '分配日期', dataIndex: 'name5', ellipsis: true, },
        { title: '分配批次', dataIndex: 'name6', ellipsis: true, },
        { title: '分配人', dataIndex: 'name7', ellipsis: true, },
        { title: '填报编号', dataIndex: 'name8', ellipsis: true, },
        { title: '填报截止日期', dataIndex: 'name9', ellipsis: true, },
        { title: '填报日期', dataIndex: 'name10', ellipsis: true, },
        { title: '填报状态', dataIndex: 'name11', ellipsis: true, },
        { title: '符合性检查', dataIndex: 'name12', ellipsis: true, },
        { title: '复核结果', dataIndex: 'name13', ellipsis: true, },
        { title: '复核意见', dataIndex: 'name14', ellipsis: true, },
        { title: '环保资料是否有效', dataIndex: 'name15', ellipsis: true, },
        { title: '填报历史', dataIndex: 'name16', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    // 行选中
    // function handleSelectedRows(rowKeys, rows) {
    //     setRowKeys(rowKeys);
    //     setRows(rows);
    // }
    return <Fragment>
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                rowKey={(item) => item.id}
                size='small'
                // onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                // {...tableProps}
            />
    </Fragment>
}