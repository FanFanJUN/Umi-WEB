import { useEffect, useState, useRef, Fragment } from 'react'
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import FillingHistory from '../fillingHistory';

export default function ({originData={}}) {
    const tableRef = useRef(null);
    const historyRef = useRef(null);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [params, setParams] = useState({});
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
        { title: '分配日期', dataIndex: 'allotDate', ellipsis: true, align: 'center', render: (text) => text ? text.slice(0, 10) : ''},
        { title: '分配批次 ', dataIndex: 'allotBatch', ellipsis: true, align: 'center', },
        { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, align: 'center', },
        { title: '填报编号', dataIndex: 'fillNumber', ellipsis: true, },
        { title: '填报截止日期', dataIndex: 'fillEndDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : ''},
        { title: '填报日期', dataIndex: 'fillDate', ellipsis: true, render: (text) => text ? text.slice(0, 10) : ''},
        { title: '填报状态', dataIndex: 'fillState', ellipsis: true, render: (text) => {
            switch (text) {
                case 'NOTCOMPLETED': return '未填报';
                case 'COMPLETED': return '已填报';
                default: return '未填报'
            }
        }},
        {
            title: '符合性检查', dataIndex: 'coincidenceCheck', ellipsis: true, align: 'center', render: (text) => {
                switch(text){
                    case "FIT": return '符合';
                    case "NOTFIT": return '不符合';
                    default: return '';
                }
            }
        },
        { title: '复核状态', dataIndex: 'reviewResult', ellipsis: true, align: 'center', render: (text) => {
            switch(text){
                case "NOPASS": return '复核不通过';
                case "PASS": return '复核通过';
                default: return '';
            }
        }},
        { title: '复核意见', dataIndex: 'reviewResultComments', ellipsis: true, align: 'center', },
        { title: '环保资料是否有效', dataIndex: 'environmentDataEffective', ellipsis: true, width: 140, align: 'center', render: (text)=>{
            switch(text){
                case "INVALID": return '无效';
                case "VALID": return '有效';
                default: return '';
            }
        }},
        { title: '填报历史', dataIndex: 'name16', ellipsis: true, render: (text, item) => <span onClick={(e) => { showHistory(e, item) }} style={{ color: 'blue', cursor: 'pointer' }}>查看</span>},
    ].map(item => ({ ...item, align: 'center' }));
    function showHistory(e, item) {
        e.stopPropagation();
        setParams({
            supplierCode: item.supplierCode,
            materialCode: originData.materialCode
        })
        historyRef.current.setVisible(true);
        // console.log(item)
    }
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
            {/* 填报历史 */}
        <FillingHistory wrappedComponentRef={historyRef} supplierCode={params.supplierCode} materialCode={params.materialCode} />
    </Fragment>
}