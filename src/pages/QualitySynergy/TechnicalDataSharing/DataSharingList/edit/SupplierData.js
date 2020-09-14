import React from 'react';
import styles from './BaseInfo.less';
import { ExtTable } from 'suid';

const SupplierData = (props) => {

  const columns = [
    { title: '行号', dataIndex: 'technicalLineNumber', width: 80 },
    { title: '文件类别', dataIndex: 'fileCategoryName', width: 160 },
    { title: '文件版本', dataIndex: 'fileVersion', width: 160 },
    { title: '供应商代码', dataIndex: 'supplierCode', ellipsis: true, width: 150 },
    { title: '供应商名称', dataIndex: 'supplierName', ellipsis: true, width: 160 },
    { title: '分配日期', dataIndex: 'allotDate', width: 160 },
    { title: '分配人', dataIndex: 'allotPeopleName', ellipsis: true, width: 150 },
    { title: '资料下载截止日期', dataIndex: 'downloadAbortDate', ellipsis: true, width: 160 },
    { title: '下载状态', dataIndex: 'fileDownloadState', width: 160 },
    { title: '下载日期', dataIndex: 'fileDownloadDate', ellipsis: true, width: 150 },
  ].map(item => ({ ...item, align: 'center' }));

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>分配供应商明细</div>
          <ExtTable
            style={{marginTop: '10px'}}
            rowKey={(v) => v.technicalLineNumber}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            columns={columns}
            dataSource={props.data}
          />
        </div>
    </div>
  )

}

export default SupplierData
