import React, { Fragment, useState } from 'react';
import { Button, Input } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import {DataImport, ExtTable, utils, AuthAction } from 'suid';
const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development'

export default () => {

  const [data, setData] = useState({
    visible: false
  })

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '限用物质代码', dataIndex: 'turnNumber', width: 200 },
    { title: '限用物质名称', dataIndex: 'name1', ellipsis: true, },
    { title: 'CAS.NO', dataIndex: 'name2', ellipsis: true, },
    { title: '基本单位代码', dataIndex: 'name3', ellipsis: true, },
    { title: '基本单位名称', dataIndex: 'name4', ellipsis: true, },
    { title: '是否测试记录表中检查项', dataIndex: 'name5', ellipsis: true,width: 300 },
    { title: '排序号', dataIndex: 'name6', ellipsis: true, },
    { title: '冻结', dataIndex: 'name6', ellipsis: true, },
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = (type) => {
    switch (type) {
      case 'import':
        setData((value) => ({...value, visible: true}))
        break
    }
    console.log(type)
  }

  const validateItem = (data) => {
    console.log(data, 'data')
  }

  const headerLeft = <div style={{width: '100%', display: 'flex', height: '100%', alignItems:'center'}}>
    {
      authAction(<Button
        type='primary'
        onClick={() => buttonClick('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >冻结</Button>)
    }
    {
      <AuthAction key="PURCHASE_VIEW_CHANGE_CREATE" ignore>
        <DataImport
          style={{float: 'none'}}
          tableProps={{ columns }}
          validateFunc={validateItem}
          importData={console.log('data')}
        />
      </AuthAction>
    }
    </div>

  return(
    <Fragment>
        <ExtTable
          columns={columns}
          store={{
            url: `${baseUrl}/limitSubstanceListData/find_by_page`,
            type: 'GET'
          }}
          checkbox={true}
          selectedRowKeys={selectedRowKeys}
          toolBar={{
            left: headerLeft
          }}
        />
    </Fragment>
  )

}
