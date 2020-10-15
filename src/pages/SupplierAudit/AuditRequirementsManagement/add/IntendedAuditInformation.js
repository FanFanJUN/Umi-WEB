import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import styles from '../../../QualitySynergy/TechnicalDataSharing/DataSharingList/edit/BaseInfo.less';
import { Col, Form, Modal, Row, Input, DatePicker, Button } from 'antd';
import { ExtTable } from 'suid';

let IntendedAuditInformation = React.forwardRef((props, ref) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    type: 'add',
    dataSource: [],
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增技术资料'
  })

  const columns = [
    { title: '操作', dataIndex: 'fileCategoryName', width: 140 },
    { title: '审核类型', dataIndex: 'fileVersion', width: 140, ellipsis: true, },
    { title: '审核原因', dataIndex: 'drawFlag', ellipsis: true, width: 140},
    { title: '物料分类', dataIndex: 'technicalDataFileIdList', width: 140, ellipsis: true, },
    { title: '供应商', dataIndex: 'sampleRequirementNum', ellipsis: true, width: 140},
    { title: '代理商', dataIndex: 'measureUnit', ellipsis: true, width: 140},
    { title: '生产厂地址', dataIndex: 'sampleRequirementDate', width: 140, ellipsis: true,},
    { title: '供应商联系人', dataIndex: 'sampleReceiverName', ellipsis: true, width: 140},
    { title: '供应商联系电话', dataIndex: 'sampleReceiverTel', ellipsis: true, width: 140},
    { title: '备注', dataIndex: 'remark', ellipsis: true, width: 140},
  ].map(item => ({...item, align: 'center'}))

  const { isView } = props;

  const handleBtn = (type) => {
    console.log(type)
  }

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({...v, selectedRowKeys: value, selectRows: rows, type: 'add'}))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>拟审核信息</div>
        <div className={styles.content}>
          {
            !isView && <div>
              <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {handleBtn('delete')}} style={{marginLeft: '5px'}}>删除</Button>
              <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>审核内容管理</Button>
              <Button disabled={data.selectedRowKeys.length < 1} onClick={() => {handleBtn('delete')}} style={{marginLeft: '5px'}}>审核小组管理</Button>
            </div>
          }
          <ExtTable
            style={{marginTop: '10px'}}
            rowKey={(v) => v.lineNumber}
            allowCancelSelect={true}
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            dataSource={data.dataSource}
          />
        </div>
      </div>
    </div>
  );
})
export default Form.create()(IntendedAuditInformation);
