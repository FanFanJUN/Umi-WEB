// 协同人员管理
import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { ExtModal, ExtTable } from "suid";
import AddPersonModal from "./addPersonModal";


const PersonManage = ({ visible, onOk, onCancel, originData, isView }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [addModalData, setAddData] = useState({});
    const tableRef = useRef(null);
    const buttonClick = (type) => {
        switch (type) {
            case "add":
                setAddData({ visible: true,})
                break;
            case "edit":
                setAddData({
                    visible: true,
                    isEdit: true,
                    originData: selectedRows[0]
                })
                break;
            case "delet":
                console.log("点击删除");
                break;
        }
    }
    useEffect(()=>{
        let dataList = originData.map((item, index) => {
            item.rowKey = index;
            return item;
        })
        setDataSource(dataList)
    }, originData)
    const columns = [
        { title: '部门', dataIndex: 'departmentName', width: 160  },
        { title: '员工编号', dataIndex: 'employeeNo', width: 100  },
        { title: '姓名', dataIndex: 'memberName', width: 120  },
        { title: '联系电话', dataIndex: 'memberTel', width: 100  },
    ]
    const personHandleOK = (value) => {
        console.log("新增数据", value)
        let newList = [].concat(dataSource);
        newList.push({
            rowKey: dataSource.length,
            ...value
        })
        setDataSource(newList)
    }
    return <>
        <ExtModal
            width={'50vw'}
            maskClosable={false}
            visible={visible}
            title={'协同人员管理'}
            onCancel={onCancel}
            onOk={()=>{onOk(dataSource)}}
            destroyOnClose={true}
        >
            <div style={{display:isView?"none":"block", margin: '10px 0'}}>
                <Button type='primary' onClick={() => buttonClick('add')}>新增</Button>
                <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('edit')} disabled={selectedRows.length !== 1}>编辑</Button>
                <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('delete')}  disabled={selectedRows.length === 0}>删除</Button>
            </div>
            <ExtTable
                rowKey={(v) => v.rowKey}
                allowCancelSelect={true}
                showSearch={false}
                checkbox={{ multiSelect: true }}
                size='small'
                onSelectRow={(keys, rows)=>{
                    setSelectedRowKeys(keys);
                    setSelectedRows(rows);
                }}
                selectedRowKeys={selectedRowKeys}
                columns={columns}
                ref={tableRef}
                dataSource={dataSource}
            />
            {addModalData.visible && <AddPersonModal
                visible={addModalData.visible}
                isEdit={addModalData.isEdit}
                personHandleOK={personHandleOK}
                onCancel={()=>{setAddData({visible: false})}}
                originData={addModalData.originData}
            />
            }
        </ExtModal>
    </>
}
export default PersonManage;