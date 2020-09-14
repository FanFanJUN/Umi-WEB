/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 13:47:57
 * @LastEditTime: 2020-09-14 14:56:15
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/BaseCondition/MproCertification.js
 * @Description: 管理体系及产品认证
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button, Divider } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../common/EditTable';

export default function () {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columnsForMan = [
        { title: '管理体系', dataIndex: 'certificateName', ellipsis: true, },
        { title: '执行标准', dataIndex: 'executiveStandard', ellipsis: true, },
        { title: '证照编号', dataIndex: 'certificateNumber', ellipsis: true, },
        { title: '发证机构', dataIndex: 'certifyingAuthority', ellipsis: true, },
        {
            title: '首次获证时间', dataIndex: 'firstObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '有效期间', dataIndex: 'validDate', ellipsis: true, },
        { title: '附件', dataIndex: 'attachmentIds', ellipsis: true, },
        {
            title: '计划取得时间', dataIndex: 'planObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
    ].map(item => ({ ...item, align: 'center' }));
    const columnsForPro = [
        { title: '产品', dataIndex: 'productName', ellipsis: true, },
        { title: '认证类型', dataIndex: 'certificateName', ellipsis: true, },
        { title: '执行标准', dataIndex: 'executiveStandard', ellipsis: true, },
        { title: '证照编号', dataIndex: 'certificateNumber', ellipsis: true, },
        { title: '发证机构', dataIndex: 'certifyingAuthority', ellipsis: true, },
        {
            title: '首次获证时间', dataIndex: 'firstObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '最新年审', dataIndex: 'newestAnnualReview', ellipsis: true, },
        { title: '附件', dataIndex: 'name4', ellipsis: true, },
        {
            title: '计划取得时间', dataIndex: 'planObtainTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
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
            <Divider>管理体系</Divider>
            <EditableFormTable
                columns={columnsForMan}
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
            <Divider>产品认证</Divider>
            {/* <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div> */}
            <EditableFormTable
                columns={columnsForPro}
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
                isEditTable
                isToolBar
            // {...tableProps}
            />
            <Divider>其他认证</Divider>
            {/* <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div> */}
            <EditableFormTable
                columns={columnsForPro}
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
                isEditTable
                isToolBar
                dataSource={[{id: '1'}]}
            />
        </div>
    </Fragment>
}