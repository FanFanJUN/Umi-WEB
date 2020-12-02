/**
 * @Description: 供应商审核不足及改善
 * @Author: M!keW
 * @Date: 2020-11-26
 */

import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { AuthButton, ExtTable, utils } from 'suid';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import Header from '@/components/Header';
import { Form } from 'antd';
import AddSupplierInfoModal from './AddSupplierInfoModal';

let keys = 0;

const AuditTable = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({
    getTableData,
  }));
  const getModelRef = useRef(null);
  const tableRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const empty = selectRowKeys.length === 0;
  const [modalType, setModalType] = useState(false);//判断是新增还是编辑
  const [isTableView, setIsTableView] = useState(false);//判断是否为明细
  useEffect(() => {
    transferData();
  }, [editData]);
  const columns = [
    { title: '改善事项描述', dataIndex: 'departmentName', width: 220 },
    { title: '原因分析', dataIndex: 'employeeNo', width: 100 },
    { title: '改进措施及要求', dataIndex: 'memberName', width: 120 },
    { title: '责任人', dataIndex: 'memberTel', width: 100 },
    { title: '检查', dataIndex: 'check', width: 100 },
  ];
  const headerLeft = <>
    {
      <AuthButton type="primary" className={styles.btn} onClick={() => handleAdd()}>新增</AuthButton>
    }
    {
      <AuthButton className={styles.btn} disabled={empty} onClick={() => handleEdit(false)}>编辑</AuthButton>
    }
    {
      <AuthButton className={styles.btn} disabled={empty} onClick={() => handleDelete()}>删除</AuthButton>
    }
    {
      <AuthButton className={styles.btn} disabled={empty} onClick={() => handleEdit(true)}>明细</AuthButton>
    }
  </>;


  //初始化赋值
  const transferData = () => {
    if (editData && editData.length > 0) {
      let newsData = editData.map((item, index) => ({ key: index, ...item }));
      keys = editData.length - 1;
      setTableData(newsData);
    }
  };
  // 记录列表选中
  const handleSelectedRows = (rowKeys, rows) => {
    setRowKeys(rowKeys);
    setRows(rows);
  };
  // 清空列选择并刷新
  const uploadTable = () => {
    tableRef.current.manualSelectedRows();
    tableRef.current.manualSelectedRows();
  };
  const getTableData = () => {
    return tableData;
  };
  //新增
  const handleAdd = () => {
    setModalType(false);
    getModelRef.current.handleModalVisible(true);
  };
  //编辑
  const handleEdit = (isView) => {
    setModalType(true);
    setIsTableView(isView);
    getModelRef.current.handleModalVisible(true);
  };
  //删除
  const handleDelete = () => {
    const filterData = tableData.filter(item => item.key !== selectedRows[0].key);
    setTableData(filterData);
    uploadTable();
  };
  //新增数据
  const handleOk = (value) => {
    let newsData = [];
    [...newsData] = tableData;
    //新增
    if (!modalType) {
      newsData.push({
        ...value,
        key: ++keys,
      });
      setTableData(newsData);
    } else {
      tableData.forEach((item, index) => {
        if (item.key === value.key) {
          const copyData = tableData.slice(0);
          copyData[index] = value;
          setTableData(copyData);
        }
      });
    }
    getModelRef.current.handleModalVisible(false);
    uploadTable();
  };
  return (
    <div>
      <span style={{ paddingBottom: '10px', fontSize: '14px' }}>3、供应商审核不足及改善</span>
      <Header
        left={isView ? null : headerLeft}
        advanced={false}
        extra={false}
      />
      <AutoSizeLayout>
        {(height) => <ExtTable
          rowKey={(item) => item.key}
          height={height}
          checkbox={{
            multiSelect: false,
          }}
          pagination={{
            hideOnSinglePage: true,
            disabled: false,
            pageSize: 100,
          }}
          ref={tableRef}
          allowCancelSelect={true}
          showSearch={false}
          size='small'
          columns={columns}
          onSelectRow={handleSelectedRows}
          selectedRowKeys={selectRowKeys}
          dataSource={tableData}
        />}
      </AutoSizeLayout>
      <AddSupplierInfoModal
        onOk={handleOk}
        isView={isTableView}
        editData={modalType ? selectedRows[0] : {}}
        wrappedComponentRef={getModelRef}
      />
    </div>
  );
});
export default Form.create()(AuditTable);
