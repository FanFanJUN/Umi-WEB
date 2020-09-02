import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, Input, Form, Modal, Radio } from 'antd'
import { smBaseUrl } from '@/utils/commonUrl';
const { create, Item: FormItem } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const generateModal = forwardRef(({ form }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [checkVisible, setCheckVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form
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
            title: '提交状态', dataIndex: 'turnNumber', width: 70, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        {
            title: '符合性检查', dataIndex: 'name1', ellipsis: true, align: 'center', render: (text) => {
                return text ? '是' : '否'
            }
        },
        { title: '复核状态', dataIndex: 'name2', ellipsis: true, align: 'center', },
        { title: '复核意见', dataIndex: 'name3', ellipsis: true, align: 'center', },
        { title: '环保资料是否有效', dataIndex: 'name4', ellipsis: true, align: 'center', },
        { title: '供应商代码', dataIndex: 'name5', ellipsis: true, align: 'center', },
        { title: '供应商名称 ', dataIndex: 'name6', ellipsis: true, align: 'center', },
        { title: '填报编号', dataIndex: 'name7', ellipsis: true, align: 'center', },
        { title: '有效开始日期', dataIndex: 'name7', ellipsis: true, align: 'center', },
        { title: '有效截止日期', dataIndex: 'name7', ellipsis: true, align: 'center', },
        { title: '分配批次', dataIndex: 'name7', ellipsis: true, align: 'center', },
        { title: '详情', dataIndex: 'name7', ellipsis: true, align: 'center', },
    ];
    // 复核确定
    function handleOk() {
        console.log('生成报表')
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            cancelText="退出"
            onCancel={() => { setVisible(false); }}
            onOk={() => { handleOk() }}
            okText="生成"
            visible={visible}
            centered
            width={1100}
            title="生成报表-MCD表"
        >
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={true}
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

export default create()(generateModal)
