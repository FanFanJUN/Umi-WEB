import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../../components/Header';
import AdvancedForm from '../../../../components/AdvancedForm';
import { Button, Input } from 'antd';
import styles from './index.less';
import { ExtTable, utils } from 'suid';
import { distributionProps, materialCode, materialStatus, PDMStatus, statusProps } from '../../commonProps';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import { smBaseUrl } from '../../../../utils/commonUrl';
import { openNewTab } from '../../../../utils';
import SupplierModal from './component/SupplierModal';
import TacticAssign  from './component/TacticAssign';
const { authAction, storage } = utils;
const { Search } = Input;

const DEVELOPER_ENV = process.env.NODE_ENV === 'development'

export default function() {


  const tableRef = useRef(null);

  const [modalData, setModalData]= useState({
    title: '查看已分配的供应商',
    visible: false,
    type: 'vies'
  })

  const [assignData, setAssignData]= useState({
    visible: false,
  })

  const [data, setData] = useState({
    selectedRowKeys: [],
    selectedRows: []
  })

  const [searchValue, setSearchValue] = useState({});

  const redirectToPage = (type) => {
    switch (type) {
      case 'add':
        openNewTab('qualitySynergy/DataSharingAdd?pageState=add', '技术资料分享需求-新增', false);
        break
      case 'allot':
        setModalData({title: '分配供应商', visible: true, type: 'allot'})
        break
      case 'govern':
        setAssignData((value) => ({...value, visible: true}))
        break
    }
  }

  const handleQuickSearch = (value) => {
    console.log(value, 'value')
  }

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    console.log(value, '高级查询')
  }

  // 高级查询配置
  const formItems = [
    { title: '物料代码', key: 'data1', type: 'list', props: materialCode },
    { title: '物料组', key: 'data2', type: 'list', props: materialCode },
    { title: '战略采购', key: 'data3', type: 'list', props: materialCode },
    { title: 'BU', key: 'data4', props: { placeholder: '输入申请人查询' } },
    { title: '申请人', key: 'data5', props: { placeholder: '输入申请人查询' } },
    { title: '分配供应商状态', key: 'data7', type: 'list', props: distributionProps },
    { title: '状态', key: 'data6', type: 'list', props: statusProps },
  ]

  const columns = [
    {
      title: '状态', dataIndex: 'state', width: 80, render: (text) => {
        switch (text) {
          case 'draft': return '生效';
          case 'pre_publish': return '草稿';
          case 'publish': return '撤回';
          default: return ''
        }
      }
    },
    {
      title: '分配供应商状态', dataIndex: 'inquiryMethodName', width: 160, render: (text) => {
        switch (text) {
          case 'draft': return '已分配';
          case 'pre_publish': return '未分配';
          default: return ''
        }
      }
    },
    { title: '来源', dataIndex: 'turnNumber', width: 70 },
    { title: '分享需求号', dataIndex: 'name1', ellipsis: true, },
    { title: '物料代码', dataIndex: 'name2', ellipsis: true, },
    { title: '物料描述', dataIndex: 'name3', ellipsis: true, },
    { title: '物料组代码', dataIndex: 'name4', ellipsis: true, },
    { title: '物料组描述', dataIndex: 'name5', ellipsis: true, },
    { title: '战略采购代码', dataIndex: 'name6', ellipsis: true, },
    { title: '战略采购名称', dataIndex: 'name7', ellipsis: true, },
    { title: '供应商', dataIndex: 'name8', ellipsis: true,render: <a onClick={() => visibleSupplier()}>查看</a>},
    { title: 'BU代码', dataIndex: 'name9', ellipsis: true, },
    { title: 'BU名称', dataIndex: 'name10', ellipsis: true, },
    { title: '申请人', dataIndex: 'name11', ellipsis: true, },
    { title: '申请人联系方式', dataIndex: 'name12', ellipsis: true, },
    { title: '申请日期', dataIndex: 'name13', ellipsis: true, },
  ].map(item => ({ ...item, align: 'center' }));

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

  const visibleSupplier = () => {
    console.log('查看供应商')
  }


  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
        disabled={data.selectedRowKeys.length !== 1}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
        disabled={data.selectedRowKeys.length === 0}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
        disabled={data.selectedRowKeys.length !== 1}
      >明细</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('submit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='PURCHASE_VIEW_CHANGE_CREATE'
        disabled={data.selectedRowKeys.length !== 1}
      >提交</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('recall')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length !== 1}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('allot')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length !== 1}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >分配供应商</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('govern')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length !== 1}
        key='PURCHASE_VIEW_CHANGE_CREATE'
      >支配战略采购</Button>)
    }
  </>

  const headerRight = <>
    <Search
      placeholder='供应商代码或名称'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </>

  const handleSelectedRows = (value, rows) => {
    setData((v) => ({...v, selectedRowKeys: value, selectedRows: rows}))
  }

  const handleModalCancel = () => {
    setModalData((value) => ({...value, visible: false}))
  }

  return (
    <Fragment>
      <Header
        left={headerLeft}
        right={headerRight}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
        }
        advanced
      />
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            style={{marginTop: '10px'}}
            rowKey={(v) => v.id}
            height={h}
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
            dataSource={data.dataSource}
          />
        }
      </AutoSizeLayout>
      <SupplierModal
        type={modalData.type}
        visible={modalData.visible}
        title={modalData.title}
        onCancel={handleModalCancel}
      />
      <TacticAssign
        type={modalData.type}
        visible={assignData.visible}
        onCancel={() => setAssignData((value) => ({...value, visible: false}))}
      />
    </Fragment>
  )
}
