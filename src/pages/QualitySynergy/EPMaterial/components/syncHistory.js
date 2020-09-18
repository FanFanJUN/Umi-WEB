import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { Button, Input, Form, Modal, Radio } from 'antd'
import { recommendUrl } from '@/utils/commonUrl';
const { create, Item: FormItem } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const checkModal = forwardRef(({ form, id }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form;
    const columns = [
        { title: '版本号', dataIndex: 'versionNo', width: 70, align: 'center' },
        {
            title: '同步状态', dataIndex: 'syncStatus', ellipsis: true, align: 'center', render: (text) => {
                return text==='SYNC_SUCCESS' ? '同步成功' : text==='SYNC_FAILURE' ? '同步失败' : ''
            }
        },
        { title: '报错信息', dataIndex: 'msg', ellipsis: true, align: 'center', },
        { title: '同步时间', dataIndex: 'syncDate', ellipsis: true, align: 'center', width: 160},
        { title: '同步人', dataIndex: 'syncUser', ellipsis: true, align: 'center', },
    ];
    // 复核确定
    function handleOk() {
        validateFields((err, fieldsValue)=>{
            if (!err) {
                console.log(fieldsValue)
            }
        })
    }
    // 记录列表选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    return <Fragment>
        <ExtModal
            destroyOnClose
            onCancel={() => { setVisible(false); }}
            onOk={() => { setVisible(false); }}
            visible={visible}
            maskClosable={false}
            centered
            width={1100}
            title="同步历史"
        >
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
                store={{
                    url: `${recommendUrl}/api/epDemandSyncHistoryService/findByPage`,
                    params: {
                        dataSourceId: id
                    },
                    type: 'POST'
                }}
            />
        </ExtModal>
    </Fragment>
})

export default create()(checkModal)
