import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal, ScrollBar, ComboList } from 'suid';
import { Button, Input, Form, Modal, Radio } from 'antd'
import { recommendUrl } from '@/utils/commonUrl';
const { create, Item: FormItem } = Form;
const { TextArea } = Input;
const formLayout = {
    labelCol: { span: 8, },
    wrapperCol: { span: 14, },
};
const checkModal = forwardRef(({ form, selectedRow={} }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [checkVisible, setCheckVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const { getFieldDecorator, validateFields, getFieldValue } = form;
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
            cancelText="退出"
            onCancel={() => { setVisible(false); }}
            onOk={() => { setCheckVisible(true) }}
            okText="复核"
            visible={visible}
            centered
            width={1100}
            title="抽检复核"
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
                store={{
                    url: `${recommendUrl}/api/epDataFillService/findAllByPage`,
                    params: {
                        id: selectedRow.id
                    },
                    type: 'POST'
                }}
            />
        </ExtModal>
        <ExtModal
            destroyOnClose
            cancelText="退出"
            onCancel={() => { setCheckVisible(false); }}
            onOk={handleOk}
            okText="复核"
            visible={checkVisible}
            centered
            zIndex={1001}
            width={600}
            title="复核"
        >
            <Form>
                <FormItem label='复核结果' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                    {
                        getFieldDecorator('pass',{
                            initialValue: 1,
                        })(
                            <Radio.Group>
                                <Radio value={1}>通过</Radio>
                                <Radio value={2}>不通过</Radio>
                            </Radio.Group>
                        )
                    }
                </FormItem>
                <FormItem label='复核意见' labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                    {
                        getFieldDecorator('text', {
                            rules: getFieldValue('pass') === 1 ? [] : [{ required: true, message: '请输入复核意见' }],
                        })(<TextArea />)
                    }
                </FormItem>
            </Form>
        </ExtModal>
    </Fragment>
})

export default create()(checkModal)
