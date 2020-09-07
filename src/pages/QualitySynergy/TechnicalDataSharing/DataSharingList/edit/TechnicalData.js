import React, { useState } from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input, Button } from 'antd';
import { ExtTable } from 'suid';
import { smBaseUrl } from '../../../../../utils/commonUrl';
import TechnicalDataModal from './component/TechnicalDataModal';

const TechnicalData = (props) => {

  const [searchValue, setSearchValue] = useState({});

  const [data, setData] = useState({
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
        ...searchValue,
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

  const handleSelectedRows = () => {

  }

  const selectedRowKeys = () => {

  }

  const handleBtn = (type) => {
    if (type === 'add') {
      setData((value) => ({...value, visible: true, title: '新增技术资料'}))
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>技术资料</div>
        <div className={styles.content}>
          <div>
            <Button onClick={() => {handleBtn('add')}} type='primary'>新增</Button>
            <Button onClick={() => {handleBtn('edit')}} style={{marginLeft: '5px'}}>编辑</Button>
            <Button style={{marginLeft: '5px'}}>删除</Button>
          </div>
          <ExtTable
            style={{marginTop: '10px'}}
            columns={columns}
            bordered
            allowCancelSelect
            showSearch={false}
            remotePaging
            checkbox={{ multiSelect: false }}
            rowKey={(item) => item.id}
            size='small'
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            {...tableProps}
          />
        </div>
        <TechnicalDataModal
          title={data.title}
          type={props.type}
          onCancel={() => setData((value) => ({...value, visible: false}))}
          visible={data.visible}
        />
      </div>
    </div>
  );

};

export default Form.create()(TechnicalData);
