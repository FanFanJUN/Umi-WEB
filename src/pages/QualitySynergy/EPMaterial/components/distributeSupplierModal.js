import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, DatePicker, Form, Modal } from 'antd'
import { materialCode } from '../../commonProps'
import { smBaseUrl } from '@/utils/commonUrl';
import styles from './index.less'
import moment from 'moment'
const { confirm } = Modal;
const { create, Item: FormItem } = Form;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const supplierModal = forwardRef(({ form }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [addVisible, setAddVisible] = useState(false);
    const [editDateVisible, setEditDateVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields } = form;
    const tableProps = {
        store: {
            url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
            params: {
            },
            type: 'POST'
        }
    }
    const columns = [
        {
            title: '是否暂停', dataIndex: 'turnNumber', width: 70, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        {
            title: '是否发布', dataIndex: 'name1', ellipsis: true, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        { title: '供应商代码', dataIndex: 'name2', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'name3', ellipsis: true, align: 'center', },
        { title: '填报截止日期', dataIndex: 'name4', ellipsis: true, align: 'center', },
        { title: '分配日期', dataIndex: 'name5', ellipsis: true, align: 'center', },
        { title: '分配批次 ', dataIndex: 'name6', ellipsis: true, align: 'center', },
        { title: '分配人', dataIndex: 'name7', ellipsis: true, align: 'center', },
    ];
    const supplierColumns = [
        { title: '供应商代码', dataIndex: 'name2', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'name3', ellipsis: true, align: 'center', },
    ];
    function handleOk() {

    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 编辑填报截止日期
    function handleEditDate() {
        validateFields((err, fieldsValue) => {
            if (!err) {
                let endDate = `${moment(fieldsValue.endDate).format('YYYY-MM-DD HH:mm')}:00`
                console.log('时间选中', endDate)
                setEditDateVisible(false)
            }
        });
    }
    // 删除
    function handleDelete(v) {
        confirm({
            title: '删除',
            content: '请确认是否删除选中供应商',
            onOk: async () => {
                console.log('确定删除')
            }
        })
    }
    // 暂停/取消暂停
    function handleSuspended() {

    }
    // 新增
    function handleAdd(tag) {
        setAddVisible(false)
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={() => { setVisible(false) }}
            onOk={handleOk}
            visible={visible}
            centered
            width={1100}
            bodyStyle={{ height: 380, padding: 0 }}
            title="分配供应商"
        >
            <div className={styles.mbt}>
                <Button type='primary' className={styles.btn} onClick={() => { setAddVisible(true) }} key="add">新增</Button>
                <Button className={styles.btn} onClick={() => { setEditDateVisible(true) }} key="edit">编辑填报截止日期</Button>
                <Button className={styles.btn} onClick={handleDelete} key="delete">删除</Button>
                <Button className={styles.btn} onClick={() => { handleSuspended() }} key="suspend">暂停/取消暂停</Button>
                <Button className={styles.btn}>保存</Button>
                <Button className={styles.btn}>保存并发布</Button>
                <Button className={styles.btn}>取消发布</Button>
            </div>
            <ScrollBar>
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
                    {...tableProps}
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
            footer={
                [<Button className={styles.btn} onClick={() => { setAddVisible(false) }} key="cancel">取消</Button>,
                <Button className={styles.btn} type="primary" onClick={() => { handleAdd() }} key="ok">确认</Button>,
                <Button className={styles.btn} type="primary" onClick={() => { handleAdd() }} key="continue">确认并继续</Button>]
            }
        >
            <FormItem label='供应商' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                <ComboList form={form} {...materialCode} name='supplierCode' field={['supplierId']} afterSelect={() => {
                    console.log('选择更改')
                }} />
            </FormItem>
            <ExtTable
                columns={supplierColumns}
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
                {...tableProps}
            />
        </ExtModal>
    </Fragment>
})

const editForm = create()(supplierModal)
export default editForm