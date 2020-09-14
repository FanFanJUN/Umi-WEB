/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 11:25:57
 * @LastEditTime: 2020-09-14 14:55:23
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/AuthPrincipal.js
 * @Description: 授权委托人 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button } from 'antd';
import EditableFormTable from '../Common/EditTable';

export default function () {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columns = [
        { title: '职务', dataIndex: 'positionName', ellipsis: true, },
        { title: '联系人', dataIndex: 'name', ellipsis: true, },
        { title: '身份证号', dataIndex: 'idNo', ellipsis: true, },
        { title: '手机', dataIndex: 'mobile', ellipsis: true, },
        { title: '邮箱', dataIndex: 'email', ellipsis: true, },
        { title: '电话', dataIndex: 'telephone', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    // 行选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    return <Fragment>
        {/* <div className={styles.mb}>
            <Button type='primary' className={styles.btn} onClick={()=>{editRef.current.showModal('add')}}>新增</Button>
            <Button className={styles.btn} onClick={()=>{editRef.current.showModal('edit')}}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete}>删除</Button>
            <Button className={styles.btn}>批量导入</Button>
        </div> */}
        <div>
            <EditableFormTable
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
                // {...tableProps}
                dataSource={[{id: '1'}]}
            />
        </div>
    </Fragment>
}