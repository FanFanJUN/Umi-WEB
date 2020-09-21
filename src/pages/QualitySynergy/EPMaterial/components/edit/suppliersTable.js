import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';

export default function ({originData={}}) {
    const [selectedRowKeys, setRowKeys] = useState([]);
    const tableRef = useRef(null);
    const [dataSource, setDataSource] = useState([])
    useEffect(()=>{
        if(originData && originData.supplierVoList){
            setDataSource(originData.supplierVoList)
        }
    }, [originData])
    const columns = [
        { title: '是否暂停', dataIndex: 'suspend', align: 'center', render: (text) => text ? '是' : '否'},
        { title: '是否发布', dataIndex: 'publish', ellipsis: true, align: 'center', render: (text) => text ? '已发布' : '草稿'},
        { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, align: 'center', },
        { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, align: 'center', },
        { title: '填报截止日期', dataIndex: 'fillEndDate', ellipsis: true, align: 'center', },
        { title: '分配日期', dataIndex: 'allotDate', ellipsis: true, align: 'center', },
        { title: '分配批次 ', dataIndex: 'allotBatch', ellipsis: true, align: 'center', },
        { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, align: 'center', },
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, },
        { title: '填报截止日期', dataIndex: 'name9', ellipsis: true, },
        { title: '填报日期', dataIndex: 'name10', ellipsis: true, },
        { title: '填报状态', dataIndex: 'name11', ellipsis: true, },
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
        { title: '填报历史', dataIndex: 'name16', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    return <Fragment>
            <ExtTable
                columns={columns}
                bordered
                allowCancelSelect
                showSearch={false}
                checkbox={false}
                ref={tableRef}
                rowKey={(item) => item.id}
                size='small'
                selectedRowKeys={selectedRowKeys}
                dataSource={dataSource}
            />
    </Fragment>
}