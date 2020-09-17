import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, DatePicker, Form, Modal, message, Input } from 'antd'
import { materialCode } from '../../commonProps';
import { smBaseUrl, supplierManagerBaseUrl } from '@/utils/commonUrl';
import { getUserName, getMobile, getUserId, getUserAccount } from '../../../../utils';
import {
    addDemandSupplier,
    supplierIsPause,
    findByPageOfSupplier,
    releaseSupplier,
    cancelReleaseSupplier,
    editDemandSupplier,
    deleteSupplier
} from '../../../../services/qualitySynergy'
import styles from './index.less'
import moment from 'moment';
const { Search } = Input;
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const supplierModal = forwardRef(({ form, selectedRow }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const supplierTableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [editDateVisible, setEditDateVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [supplierSelected, setSupplierSelected] = useState([]);
    const [supplierSelectedRowKeys, setSupplierSelectedRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [editTag, setEditTag] = useState(false); // 编辑标记
    const { getFieldDecorator, validateFields } = form;
    useEffect(() => {
        if (visible === true) {
            getData();
        }
    }, [visible])
    const columns = [
        { title: '是否暂停', dataIndex: 'suspend', align: 'center', render: (text) => text ? '是' : '否' },
        { title: '是否发布', dataIndex: 'publish', ellipsis: true, align: 'center', render: (text) => text == 'true' ? '是' : '否' },
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, align: 'center', },
        { title: '填报截止日期', dataIndex: 'fillEndDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '分配日期', dataIndex: 'allotDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '分配批次 ', dataIndex: 'allotBatch', ellipsis: true, align: 'center', },
        { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, align: 'center', },
    ];
    const supplierColumns = [
        { title: '供应商代码', dataIndex: 'code', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'name', width: 150, ellipsis: true, align: 'center', },
    ];
    async function getData() {
        const res = await findByPageOfSupplier({ demandNumber: selectedRow.demandNumber });
        if (res.statusCode === 200) {
            let dataList = res.data.rows.map((item, index) => {
                return {
                    ...item,
                    rowKey: index
                }
            })
            setDataSource(dataList);
            tableRef.current.manualSelectedRows();
        } else {
            message.error(res.message);
        }
    }
    function handleOk() {

    }
    // 编辑填报截止日期
    function handleEditDate() {
        validateFields((err, fieldsValue) => {
            if (!err) {
                let endDate = moment(fieldsValue.endDate).format('YYYY-MM-DD')
                let newList = dataSource.map(item => {
                    return (selectedRowKeys.includes(item.rowKey)) ? {
                        ...item,
                        fillEndDate: endDate
                    } : item
                })
                setDataSource(newList);
                setEditTag(true);
                tableRef.current.manualSelectedRows();
                setEditDateVisible(false)
            }
        });
    }
    // 删除
    function handleDelete(v) {
        let newList = dataSource.filter(item => {
            return !(selectedRowKeys.includes(item.rowKey))
        });
        newList.map((item, index) => ({ ...item, rowKey: index }))
        setDataSource(newList);
        setEditTag(true);
        tableRef.current.manualSelectedRows();
    }
    // 暂停/取消暂停
    function handleSuspended() {
        let newList = dataSource.map(item => {
            return (selectedRowKeys.includes(item.rowKey)) ? {
                ...item,
                suspend: !item.suspend
            } : item
        });
        newList.map((item, index) => ({ ...item, rowKey: index }))
        setDataSource(newList);
        setEditTag(true);
        tableRef.current.manualSelectedRows();
    }
    // 新增
    function handleAdd(tag) {
        if (supplierSelected.length === 0) {
            message.warning('还未选中任何数据！');
            return;
        }
        let addList = [];
        supplierSelected.forEach((item, index) => {
            addList.push({
                rowKey: dataSource.length + index,
                supplierId: item.id,
                supplierCode: item.code,
                supplierName: item.name,
                publish: 0,
                suspend: 0,
                demandNumber: selectedRow.demandNumber,
                allotPeopleId: getUserId(),
                allotPeopleAccount: getUserAccount(),
                allotPeopleName: getUserName()
            })
        })
        addList = dataSource.concat(addList);
        setDataSource(addList);
        setEditTag(true);
        supplierTableRef.current.manualSelectedRows();
        if (tag) {
            setAddVisible(false);
        }
    }
    // 保存
    async function handleSave() {
        let res = {};
        res = await addDemandSupplier(dataSource);
        if (res.statusCode === 200) {
            message.success('操作成功');
            setEditTag(false);
            tableRef.current.remoteDataRefresh();
        } else {
            message.error(res.message);
        }
    }
    // 发布/取消发布
    async function handlePublish(tag) {
        let newList = dataSource.map(item => {
            return (selectedRowKeys.includes(item.rowKey)) ? {
                ...item,
                publish: tag
            } : item
        });
        newList.map((item, index) => ({ ...item, rowKey: index }))
        setDataSource(newList);
        setEditTag(true);
        tableRef.current.manualSelectedRows();
    }
    // 检查状态是否全部为true-1/false-2；不全相同或未选中数据则返回false
    const checkAllSameStatus = (key) => {
        if (!selectedRows || selectedRows.length === 0 || !key) return false;
        return selectedRows.every((item) => item[key]) ? 1 : selectedRows.every((item) => !item[key]) ? 2 : false
    }
    function handleQuickSearch(v) {
        console.log(v)
    }
    function checkSameBatch() {
        if (selectedRows.length < 2) return false;
        let allotBatch = selectedRows[0].allotBatch;
        let tag = selectedRows.every(item => item.allotBatch === allotBatch);
        return !tag;
    }
    function handleCancel() {
        console.log('点击退出', editTag)
        if(editTag) {
            Modal.confirm({
                title: '退出',
                content: '界面编辑还未保存，确认是否退出',
                onOk: () => {
                    setVisible(false);
                },
            })
        } else {
            setVisible(false);
        }
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={()=>{handleCancel()}}
            onOk={()=>{handleSave()}}
            okText="保存"
            visible={visible}
            centered
            width={1100}
            title="分配供应商"
        >
            <div className={styles.mbt}>
                <Button type='primary' className={styles.btn} onClick={() => { setAddVisible(true) }} key="add">新增</Button>
                <Button className={styles.btn}
                    disabled={selectedRows.length === 0 || checkSameBatch()}
                    onClick={() => { !checkSameBatch() && setEditDateVisible(true) }} key="edit">编辑填报截止日期</Button>
                <Button className={styles.btn}
                    disabled={selectedRows.length === 0}
                    onClick={() => { handleDelete() }} key="delete" >删除</Button>
                <Button className={styles.btn} onClick={() => { handleSuspended() }} key="suspend"
                    disabled={checkAllSameStatus('suspend') === false}>{checkAllSameStatus('suspend') === 1 ? '取消暂停' : checkAllSameStatus('suspend') === 2 ? '暂停' : '暂停/取消暂停'}</Button>
                <Button className={styles.btn} onClick={() => { handlePublish(true) }}
                    disabled={selectedRows.length === 0 || checkAllSameStatus('publish') === 1}
                >发布</Button>
                <Button className={styles.btn} onClick={() => { handlePublish(false) }}
                    disabled={selectedRows.length === 0 || checkAllSameStatus('publish') === 2}
                >取消发布</Button>
                <Button className={styles.btn} onClick={() => { handleSave() }}>保存</Button>
            </div>
            <ScrollBar>
                <ExtTable
                    columns={columns}
                    bordered
                    allowCancelSelect
                    showSearch={false}
                    remotePaging
                    // checkbox={{ multiSelect: false }}
                    ref={tableRef}
                    rowKey={(item) => item.rowKey}
                    size='small'
                    checkbox={true}
                    onSelectRow={(rowKeys, rows) => {
                        console.log(rows)
                        setRowKeys(rowKeys);
                        setRows(rows);
                    }}
                    selectedRowKeys={selectedRowKeys}
                    dataSource={dataSource}
                />
            </ScrollBar>
        </ExtModal>
        <ExtModal
            centered
            destroyOnClose
            onCancel={() => { setEditDateVisible(false) }}
            onOk={handleEditDate}
            visible={editDateVisible}
            title="编辑填报截止日期"
        >
            <FormItem label='填报截止日期' {...formLayout}>
                {
                    getFieldDecorator('endDate', {
                        rules: [{ required: true, message: '请选择填报截止日期' }]
                    })(<DatePicker />)
                }
            </FormItem>
        </ExtModal>
        <ExtModal
            centered
            destroyOnClose
            visible={addVisible}
            zIndex={1001}
            onCancel={() => { setAddVisible(false) }}
            footer={
                [<Button className={styles.btn} onClick={() => { setAddVisible(false) }} key="cancel">取消</Button>,
                <Button className={styles.btn} type="primary" onClick={() => { handleAdd(true) }} key="ok">确认</Button>,
                <Button className={styles.btn} type="primary" onClick={() => { handleAdd() }} key="continue">确认并继续</Button>]
            }
        >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '15px' }}>
                <Search style={{ width: '60%' }} placeholder='请输入关键字查询' onSearch={handleQuickSearch} allowClear />
            </div>
            <ExtTable
                columns={supplierColumns}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                ref={supplierTableRef}
                checkbox={true}
                rowKey={(item) => item.id}
                size='small'
                onSelectRow={(rowKeys, rows) => {
                    setSupplierSelectedRowKeys(rowKeys);
                    setSupplierSelected(rows);
                }}
                selectedRowKeys={supplierSelectedRowKeys}
                store={{
                    url: `${supplierManagerBaseUrl}/api/supplierService/findSupplierVoByPage`,
                    type: 'POST',
                }}
            />
        </ExtModal>
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm