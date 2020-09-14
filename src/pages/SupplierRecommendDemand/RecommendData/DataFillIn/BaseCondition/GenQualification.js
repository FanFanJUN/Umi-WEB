/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:29:41
 * @LastEditTime: 2020-09-14 18:11:56
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/GenQualification.js
 * @Description: 通用资质 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button } from 'antd';
import EditableFormTable from '../CommonUtil/EditTable';
import moment from 'moment';

export default function () {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columns = [
        { title: '资质文件类型', dataIndex: 'qualificationName', ellipsis: true, },
        { title: '证照编号', dataIndex: 'certificateNo', ellipsis: true, },
        { title: '发证机构', dataIndex: 'institution', ellipsis: true, },
        { title: '有效期', dataIndex: 'date', ellipsis: true, render: function (text, record) {
            return record.startDate && `${moment(record.startDate).format('YYYY-MM-DD')} ~ ${moment(record.endDate).format('YYYY-MM-DD')}`;
        } },
        { title: '附件', dataIndex: 'attachments', ellipsis: true, },
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
            />
        </div>
    </Fragment>
}