import React, { useState } from 'react';
import styles from './BaseInfo.less';
import { Col, Form, Modal, Row, Input, Button } from 'antd';
import { ExtTable } from 'suid';
import { smBaseUrl } from '../../../../../utils/commonUrl';

const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const TechnicalData = () => {

  const [searchValue, setSearchValue] = useState({});

  const columns = [
    { title: '文件类别', dataIndex: 'turnNumber', width: 350 },
    { title: '文件版本', dataIndex: 'name1', width: 350, ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'name2', width: 350, ellipsis: true, },
    { title: '样品需求日期', dataIndex: 'name3', width: 350, ellipsis: true, },
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
          <div>
            <Button type='primary'>新增</Button>
            <Button style={{marginLeft: '5px'}}>编辑</Button>
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
      </div>
    </div>
  );

};

export default Form.create()(TechnicalData);
