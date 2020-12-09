// 协同人员管理
import React, { useState, useEffect, useRef } from "react";
import { Button, Modal } from "antd";
import { ExtModal, ExtTable } from "suid";
import AddPersonModal from "./addPersonModal";
import { getRandom } from '../../../QualitySynergy/commonProps';


const PersonManage = ({ visible, onOk, onCancel, originData, isView, deleteArr, setDeleteArr }) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [addModalData, setAddData] = useState({});
    const tableRef = useRef(null);
    const buttonClick = (type) => {
        switch (type) {
            case "add":
                setAddData({ visible: true, })
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
    useEffect(() => {
        let dataList = originData.map((item, index) => {
            item.rowKey = getRandom(10);
            return item;
        })
        setDataSource(dataList)
    }, originData)
    const columns = [
        { title: '部门', dataIndex: 'departmentName', width: 160 },
        { title: '员工编号', dataIndex: 'employeeNo', width: 100 },
        { title: '姓名', dataIndex: 'memberName', width: 120 },
        { title: '联系电话', dataIndex: 'memberTel', width: 100 },
    ]
    const personHandleOK = (value) => {
        let newList = [].concat(dataSource);
        if (addModalData.isEdit) {
            newList = newList.map(item => {
                if (selectedRowKeys.includes(item.rowKey)) {
                    return {
                        ...item,
                        ...value,
                    }
                }
                return item;
            })
            
            tableRef.current.manualSelectedRows();
        } else {
            
            newList.push({
                rowKey: getRandom(10),
                ...value
            })
        }
        setDataSource(newList);
    }
    const checkRepeat = (employeeNo) => {
        return dataSource.some(item => item.employeeNo === employeeNo);
    }
    const handleDelet = () => {
        Modal.confirm({
            title: '删除',
            content: '是否确认删除选中数据',
            onOk: () => {
                let newList = dataSource.filter(item => {
                    if (item.id && selectedRowKeys.includes(item.rowKey)) {
                        let arr = JSON.parse(JSON.stringify(deleteArr));
                        arr.push({ id: item.id, type: 'COORDINATION' });
                        setDeleteArr(arr);
                    }
                    return !selectedRowKeys.includes(item.rowKey);
                });
                setDataSource(newList);
                tableRef.current.manualSelectedRows();
            },
        });
    }
    return <>
        <ExtModal
            width={'50vw'}
            maskClosable={false}
            visible={visible}
            title={'协同人员管理'}
            onCancel={onCancel}
            onOk={() => { onOk(dataSource) }}
            {...isView && { footer: null }}
            destroyOnClose={true}
        >
            <div style={{ display: isView ? "none" : "block", margin: '10px 0' }}>
                <Button type='primary' onClick={() => buttonClick('add')}>新增</Button>
                <Button style={{ marginLeft: '5px' }} onClick={() => buttonClick('edit')} disabled={selectedRows.length !== 1}>编辑</Button>
                <Button style={{ marginLeft: '5px' }} onClick={handleDelet} disabled={selectedRows.length === 0}>删除</Button>
            </div>
            <ExtTable
                rowKey={(v) => v.rowKey}
                allowCancelSelect={true}
                showSearch={false}
                checkbox={{ multiSelect: true }}
                height='50vh'
                onSelectRow={(keys, rows) => {
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
                onCancel={() => { setAddData({ visible: false }) }}
                checkRepeat={checkRepeat}
                originData={addModalData.originData}
            />
            }
        </ExtModal>
    </>
}
export default PersonManage;