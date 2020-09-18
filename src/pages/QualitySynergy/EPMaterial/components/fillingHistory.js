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
        {
            title: '提交状态', dataIndex: 'submitStatus', width: 70, align: 'center', render: (text) => {
                switch(text){
                    case "SUBMITTED": return '已提交';
                    case "NOTSUBMITTED": return '未提交';
                    default: return '';
                }
            }
        },
        {
            title: '符合性检查', dataIndex: 'compliance', ellipsis: true, align: 'center', render: (text) => {
                switch(text){
                    case "FIT": return '符合';
                    case "NOTFIT": return '不符合';
                    default: return '';
                }
            }
        },
        { title: '复核状态', dataIndex: 'reviewResults', ellipsis: true, align: 'center', render: (text) => {
            switch(text){
                case "NOPASS": return '复核不通过';
                case "PASS": return '复核通过';
                default: return '';
            }
        }},
        { title: '复核意见', dataIndex: 'reviewResultComments', ellipsis: true, align: 'center', },
        { title: '环保资料是否有效', dataIndex: 'effective', ellipsis: true, width: 140, align: 'center', render: (text)=>{
            switch(text){
                case "INVALID": return '无效';
                case "VALID": return '有效';
                default: return '';
            }
        }},
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, align: 'center', },
        { title: '有效开始日期', dataIndex: 'effectiveStartDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '分配批次', dataIndex: 'batch', ellipsis: true, align: 'center', },
        { title: '详情', dataIndex: 'detail', ellipsis: true, align: 'center', render: (text, item)=>{
            return <a onClick={()=>{
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${item.id}&pageStatus=detail`, '填报环保资料物料-明细', false);
            }}>查看</a>
        }},
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
            title="填报历史"
        >
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={true}
                searchPlaceHolder="输入填报编号查询"
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
                        id,
                        quickSearchProperties: []
                    },
                    type: 'POST'
                }}
            />
        </ExtModal>
    </Fragment>
})

export default create()(checkModal)
