import React, { Fragment, useRef, useState } from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input, Button } from 'antd';
import { ExtTable } from 'suid';
import { baseUrl, smBaseUrl } from '../../../../../utils/commonUrl';
import TechnicalDataModal from './component/TechnicalDataModal';

const TechnicalData = (props) => {

  const tableRef = useRef(null);

  const [data, setData] = useState({
    selectRows: [],
    selectedRowKeys: [],
    visible: false,
    title: '新增技术资料'
  })

  const columns = [
    { title: '文件类别', dataIndex: 'fileType', width: 350 },
    { title: '文件版本', dataIndex: 'fileVersion', width: 350, ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'technicalDataFileId', width: 350, ellipsis: true, },
    { title: '样品需求日期', dataIndex: 'sampleRequirementData', width: 350, ellipsis: true, },
  ].map(item => ({...item, align: 'center'}))

  const tableProps = {
    store: {
      url: `${smBaseUrl}/api/supplierFinanceViewModifyService/findByPage`,
      params: {
        quickSearchProperties: ['supplierName', 'supplierCode'],
        sortOrders: [
          {
            property: 'docNumber',
            direction: 'DESC'
          }
        ]
      },
      type: 'POST'
    }
  }

  const handleSelectedRows = (value, rows) => {
    console.log(value, rows);
    setData((v) => ({...v, selectedRowKeys: value, selectRows: rows}))
  }

  const handleBtn = (type) => {
    if (type === 'add') {
      setData((value) => ({...value, visible: true, title: '新增技术资料'}))
    }
  }

  const TechnicalDataAdd = (value) => {
    console.log(value, '技术资料新增')
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>技术资料</div>
        <div className={styles.content}>
          <div>
            <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
            <Button disabled={data.selectRows.length !== 1} onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
            <Button disabled={data.selectedRowKeys.length < 1} style={{marginLeft: '5px'}}>删除</Button>
          </div>
          <ExtTable
            style={{marginTop: '10px'}}
            rowKey={(v) => v.id}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={data.selectedRowKeys}
            columns={columns}
            ref={tableRef}
            {...tableProps}
          />
        </div>
        <TechnicalDataModal
          title={data.title}
          type={props.type}
          onOk={TechnicalDataAdd}
          onCancel={() => setData((value) => ({...value, visible: false}))}
          visible={data.visible}
        />
      </div>
    </div>
  );

};

export default Form.create()(TechnicalData);
