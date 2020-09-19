import { useEffect, useState, useRef, Fragment, useImperativeHandle, forwardRef } from 'react';
import { ExtTable, DataImport } from 'suid';
import { Form } from 'antd';
import EditModal from '../editModal';
import { Button, message, Modal } from 'antd';
import styles from '../index.less';
import { addDemandImport } from '../../../../../services/qualitySynergy';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const SubjectMatterTable = forwardRef(({ buCode }, ref) => {
    useImperativeHandle(ref, () => ({
        getTableList
    }))
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columns = [
        { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, },
        { title: '物料描述', dataIndex: 'materialName', ellipsis: true, },
        { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true, },
        { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true, },
        { title: '环保标准代码', dataIndex: 'environmentalProtectionCode', ellipsis: true, },
        { title: '环保标准名称', dataIndex: 'environmentalProtectionName', ellipsis: true, },
        { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true, },
        { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true, },
        { title: '环保管理人员员工编号', dataIndex: 'environmentAdminAccount', width: 160, ellipsis: true, },
        { title: '环保管理人员', dataIndex: 'environmentAdminName', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    function getTableList() {
        return dataSource;
    }
    function handleAdd() {
        if (!buCode) {
            message.warning('请先选择业务单元！');
            return;
        }
        editRef.current.showModal('add');
    }
    function handleEdit() {
        if (selectedRows.length === 0) {
            message.warning('请先选择数据！');
            return;
        }
        editRef.current.showModal('edit');
    }
    function handleTableTada(type, obj) {
        console.log('更新表格数据', type, obj)
        let newList = [];
        if (type === 'add') {
            [...newList] = dataSource;
            newList.push({
                ...obj,
                lineNum: dataSource.length + 1
            })
            setDataSource(newList);
            tableRef.current.manualSelectedRows();
        } else if (type === 'edit') {
            newList = dataSource.map(item => {
                if (item.lineNum === obj.lineNum) {
                    return obj;
                }
                return item;
            })
            setDataSource(newList);
            tableRef.current.manualSelectedRows();
        } else {
            confirm({
                title: '删除',
                content: '请确认删除选中数据',
                onOk: () => {
                    newList = dataSource.filter(item => {
                        return !selectedRowKeys.includes(item.lineNum);
                    })
                    setDataSource(newList);
                    tableRef.current.manualSelectedRows();
                }
            })
        }
    }
    const validateItem = (data) => {
        return new Promise((resolve, reject) => {
            let sendList = data.map(item => {
                return { ...item, buCode }
            })
            addDemandImport(sendList).then(res => {
                const response = res.data && res.data.map((item, index) => ({
                    ...item,
                    key: index,
                    validate: item.importResult,
                    status: item.importResult ? '数据完整' : '失败',
                    statusCode: item.importResult ? 'success' : 'error',
                    message: item.importResult ? '成功' : item.importResultInfo
                }))
                resolve(response);
            })
        })
    };

    const importFunc = (value) => {
        let newList = [].concat(dataSource);
        value.forEach((addItem, index) => {
            delete addItem.status;
            delete addItem.statusCode;
            delete addItem.message;
            delete addItem.validate;
            addItem.rowKey = dataSource.length + index;
            newList.push(addItem);
        })
        console.log('newList', newList)
        // setDataSource(newList);
        tableRef.current.manualSelectedRows();
    };
    return <Fragment>
        <div className={styles.mb} style={{ display: 'flex' }}>
            <Button type='primary' className={styles.btn} onClick={handleAdd}>新增</Button>
            <Button className={styles.btn} onClick={handleEdit}>编辑</Button>
            <Button className={styles.btn} onClick={() => { handleTableTada('delete') }}>删除</Button>
            {!buCode && <Button type='primary' className={styles.btn} onClick={() => { message.warning('请先选择业务单元!') }}>导入</Button>}
            {buCode && <DataImport
                tableProps={{ columns }}
                validateFunc={validateItem}
                importFunc={importFunc}
                validateAll={true}
                key='import'
                templateFileList={[
                    {
                        download: `${DEVELOPER_ENV === 'true' ? '' : '/react-srm-sm-web'}/templates/环保资料物料批导模板V1.0.xlsx`,
                        fileName: '环保资料物料批导模板V1.0.xlsx',
                        key: 'ExemptionClause',
                    },
                ]}
            />}
        </div>
        <div>
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={false}
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                checkbox={true}
                rowKey={(item) => item.id}
                size='small'
                rowKey="lineNum"
                onSelectRow={(rowKeys, rows) => {
                    setRowKeys(rowKeys);
                    setRows(rows);
                }}
                selectedRowKeys={selectedRowKeys}
                dataSource={dataSource}
            />
        </div>
        {/* 新增编辑弹框 */}
        <EditModal
            buCode={buCode}
            initData={selectedRows[0]}
            wrappedComponentRef={editRef}
            handleTableTada={handleTableTada}
        />
    </Fragment>
})
export default create()(SubjectMatterTable)