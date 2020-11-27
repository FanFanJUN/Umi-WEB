/**
 * @Description: 供应商审核不足及改善
 * @Author: M!keW
 * @Date: 2020-11-26
 */

import React, {  useImperativeHandle, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { AuthButton, ExtTable, utils } from 'suid';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import Header from '@/components/Header';
import { Form } from 'antd';

const AuditTable = React.forwardRef(({ form, isView, editData, type }, ref) => {
  useImperativeHandle(ref, () => ({}));
  const columns = [
    { title: '部门', dataIndex: 'departmentName', width: 220 },
    { title: '员工编号', dataIndex: 'employeeNo', width: 100 },
    { title: '姓名', dataIndex: 'memberName', width: 120 },
    { title: '联系电话', dataIndex: 'memberTel', width: 100 },
  ];
  const headerLeft = <>
    {
      <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
    }
    {
      <AuthButton className={styles.btn} onClick={() => showModal()}>编辑</AuthButton>
    }
    {
      <AuthButton className={styles.btn} onClick={() => showModal()}>删除</AuthButton>
    }

  </>;
  const [tableData, setTableData] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  // 记录列表选中
  const handleSelectedRows = (rowKeys, rows) => {
    setRowKeys(rowKeys);
    setRows(rows);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.content}>
          <span>3.供应商审核不足及改善</span>
          <Header
            left={headerLeft}
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
              allowCancelSelect={true}
              showSearch={false}
              size='small'
              columns={columns}
              onSelectRow={handleSelectedRows}
              selectedRowKeys={selectRowKeys}
              dataSource={tableData}
            />}
          </AutoSizeLayout>
        </div>
      </div>
    </div>
  );
});
export default Form.create()(AuditTable);
