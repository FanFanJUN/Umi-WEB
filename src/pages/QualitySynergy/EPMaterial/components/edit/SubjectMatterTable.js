import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import EditModal from '../editModal'
import { Button, message } from 'antd'
import styles from '../index.less'

export default function ({buCode}) {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columns = [
        { title: '物料代码', dataIndex: 'name1', ellipsis: true, },
        { title: '物料描述', dataIndex: 'name2', ellipsis: true, },
        { title: '物料组代码', dataIndex: 'name3', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'name4', ellipsis: true, },
        { title: '环保标准代码', dataIndex: 'name5', ellipsis: true, },
        { title: '环保标准名称', dataIndex: 'name6', ellipsis: true, },
        { title: '战略采购代码', dataIndex: 'name7', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'name8', ellipsis: true, },
        { title: '环保管理人员员工编号', dataIndex: 'name9', ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'name10', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    // 行选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 删除
    function handleDelete() {
        console.log('删除')
    }
    function handleAdd() {
        if(!buCode){
            message.warning('请先选择业务单元！');
            return;
        }
        editRef.current.showModal('add');
    }
    function handleEdit() {
        if(selectedRows.length === 0){
            message.warning('请先选择数据！');
            return;
        }
        editRef.current.showModal('edit');
    }
    return <Fragment>
        <div className={styles.mb}>
            <Button type='primary' className={styles.btn} onClick={handleAdd}>新增</Button>
            <Button className={styles.btn} onClick={handleEdit}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete}>删除</Button>
            <Button className={styles.btn}>批量导入</Button>
        </div>
        <div>
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
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                dataSource={[{id: 1}]}
                // {...tableProps}
            />
        </div>
        {/* 新增编辑弹框 */}
        <EditModal wrappedComponentRef={editRef} />
    </Fragment>
}