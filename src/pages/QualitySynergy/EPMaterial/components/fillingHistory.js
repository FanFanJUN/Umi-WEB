import { useImperativeHandle, forwardRef, useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ExtModal } from 'suid';
import { openNewTab} from '@/utils';
import { Form } from 'antd'
import { recommendUrl } from '@/utils/commonUrl';
const { create, Item: FormItem } = Form;

const checkModal = forwardRef(({ form, supplierCode, materialCode }, ref) => {
    useImperativeHandle(ref, () => ({
        setVisible
    }))
    const tableRef = useRef(null);
    const [visible, setVisible] = useState(false);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const columns = [
        {
            title: '提交状态', dataIndex: 'submitStatus', width: 100, align: 'center', render: (text) => {
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
        {
            title: '是否撤回', dataIndex: 'withdraw', width: 100, align: 'center', render: (text) => text? '是' : '否'
        },
        { title: '复核状态', dataIndex: 'reviewResults', ellipsis: true, align: 'center', render: (text) => {
            switch(text){
                case "NOPASS": return '不通过';
                case "PASS": return '通过';
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
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, align: 'center', render: (text, item)=>{
            return <a onClick={()=>{
                openNewTab(`qualitySynergy/EPMaterial/suppliersFillForm?id=${item.id}&pageStatus=detail`, '环保资料填报-明细', false);
            }}>{text}</a>
        }},
        { title: '有效开始日期', dataIndex: 'effectiveStartDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '有效截止日期', dataIndex: 'effectiveEndDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '分配批次', dataIndex: 'batch', ellipsis: true, align: 'center', },
        // { title: '详情', dataIndex: 'detail', ellipsis: true, align: 'center'},
    ];
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
                        supplierCode,
                        materialCode,
                        quickSearchProperties: []
                    },
                    type: 'POST'
                }}
            />
        </ExtModal>
    </Fragment>
})

export default create()(checkModal)
