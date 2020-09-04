import React, { Fragment, useRef, useState } from 'react';
import { Form, Button, message } from 'antd';
import styles from '../../TechnicalDataSharing/DataSharingList/index.less';
import { baseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import {DataImport, ExtTable, utils, AuthAction } from 'suid';
import EventModal from './component/EventModal';
import { AddTheListOfRestrictedMaterials, EditTheListOfRestrictedMaterials } from '../../commonProps';
const { authAction } = utils;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development'

const Index = (props) => {

  const tableRef = useRef(null)

  const [data, setData] = useState({
    visible: false,
    title: '限用物资清单新增',
    type: 'add'
  })

  const [selectRows, setSelectRows] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const columns = [
    { title: '限用物质代码', dataIndex: 'limitMaterialCode', width: 200 },
    { title: '限用物质名称', dataIndex: 'limitMaterialName', ellipsis: true, },
    { title: 'CAS.NO', dataIndex: 'casNo', ellipsis: true, },
    { title: '基本单位代码', dataIndex: 'basicUnitCode', ellipsis: true, },
    { title: '基本单位名称', dataIndex: 'basicUnitName', ellipsis: true, },
    { title: '是否测试记录表中检查项', dataIndex: 'recordCheckList', ellipsis: true,width: 300, render: (value) => value ? '是' : '否' },
    { title: '排序号', dataIndex: 'orderNo', ellipsis: true, },
    { title: '冻结', dataIndex: 'frozen', ellipsis: true, render: (value) => value ? '是' : '否'},
  ].map(item => ({ ...item, align: 'center' }));

  const buttonClick = async (type) => {
    console.log(selectedRowKeys)
    switch (type) {
      case 'add':
        setData((value) => ({...value, visible: true,title: '限用物资清单新增', type: 'add'}))
        break
      case 'edit':
        setData((value) => ({...value, visible: true,title: '限用物资清单编辑', type: 'edit'}))
        break
      case 'frost':
        await editData(type)
        break
    }
  }

  const editData = async (type) => {
    if (type === 'frost') {
      const data = await EditTheListOfRestrictedMaterials({
        id: selectRows[selectRows.length - 1].id,
        frozen: !selectRows[selectRows.length - 1].frozen
      })
      if (data.success) {
        setSelectRows([])
        setSelectedRowKeys([])
        tableRef.current.remoteDataRefresh()
      }
    }
  }

  const onSelectRow = (value, rows) => {
    console.log(value, rows)
    setSelectRows(rows)
    setSelectedRowKeys(value)
  }

  const validateItem = (data) => {
    console.log(data, 'data')
  }

  const importData = (value) => {
    console.log(value, 'value')
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
        disabled={selectRows.length === 0}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => buttonClick('frost')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
        disabled={selectRows.length === 0}
      >{selectRows.length > 0 && selectRows[selectRows.length - 1].frozen ? '解冻' : '冻结'}</Button>)
    }
    {
      <AuthAction key="PURCHASE_VIEW_CHANGE_CREATE" ignore>
        <DataImport
          tableProps={{ columns }}
          validateFunc={validateItem}
          importFunc={importData}
          importData={(value) => console.log(value,'data')}
        />
      </AuthAction>
    }
    </div>

  const handleOk = async (value) => {
    if (data.type === 'add') {
      AddTheListOfRestrictedMaterials(value).then(res => {
        if (res.success) {
          setData((value) => ({...value, visible: false}))
          tableRef.current.remoteDataRefresh()
        } else {
          message.error(res.msg)
        }
      })
    } else {
      const id = selectRows[selectRows.length - 1].id
     const params = {...value, id}
      EditTheListOfRestrictedMaterials(params).then(res => {
        if (res.success) {
          setData((value) => ({...value, visible: false}))
          tableRef.current.remoteDataRefresh()
        } else {
          message.error(res.msg)
        }
      })
    }
    console.log(value, 'save')
    }


  return(
    <Fragment>
        <ExtTable
          rowKey={(v) => v.id}
          columns={columns}
          store={{
            url: `${baseUrl}/limitSubstanceListData/find_by_page_all`,
            type: 'GET',
          }}
          allowCancelSelect={true}
          remotePaging={true}
          checkbox={{
            multiSelect: false
          }}
          ref={tableRef}
          onSelectRow={onSelectRow}
          selectedRowKeys={selectedRowKeys}
          toolBar={{
            left: headerLeft
          }}
        />
        <EventModal
          visible={data.visible}
          onOk={handleOk}
          type={data.type}
          data={selectRows[selectRows.length - 1]}
          onCancel={() => setData((value) => ({...value, visible: false}))}
          title='限用物资清单新增'
        />
    </Fragment>
  )

}

export default Form.create()(Index)
