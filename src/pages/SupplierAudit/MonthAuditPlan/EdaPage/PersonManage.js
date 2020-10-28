// 协同人员管理
import React, { useState, useEffect, useRef } from "react";
import { Button } from "antd";
import { ExtModal, ExtTable } from "suid";


const PersonManage = ({ visible, onOk, onCancel, originData }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const tableRef = useRef(null);
    const buttonClick = (type) => {
        switch (type) {
            case "add":
                console.log("点击新增");
                break;
            case "esit":
                console.log("点击编辑");
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
        { title: '部门', dataIndex: 'departmentName', width: 120  },
        { title: '员工编号', dataIndex: 'employeeNo', width: 100  },
        { title: '姓名', dataIndex: 'memberName', width: 120  },
        { title: '联系电话', dataIndex: 'memberTel', width: 100  },
    ]
    return <>
        <ExtModal
            width={'120vh'}
            maskClosable={false}
            visible={visible}
            title={'协同人员管理'}
            onCancel={onCancel}
            onOk={onOk}
            destroyOnClose={true}
        >
            <div style={{ marginTop: '10px' }}>
                <Button type='primary' onClick={() => buttonClick('add')}>新增</Button>
                <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('edit')}>编辑</Button>
                <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('delete')}>删除</Button>
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
        </ExtModal>
    </>
}
export default PersonManage;