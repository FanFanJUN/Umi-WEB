import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../../components/Header';
import AdvancedForm from '../../../../components/AdvancedForm';
import { Button, Input } from 'antd';
import styles from './index.less';
import { ExtTable, utils } from 'suid';
import {
  BUConfig,
  BUConfigNoFrost,
  distributionProps,
  materialCode, MaterialConfig, MaterialGroupConfig,
  materialStatus,
  PDMStatus,
  statusProps,
} from '../../commonProps';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import { baseUrl, samBaseUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { openNewTab } from '../../../../utils';
import SupplierModal from './component/SupplierModal';
import TacticAssign  from './component/TacticAssign';
import EventModal from '../../mainData/BUCompanyOrganizationRelation/component/EventModal';
const { authAction, storage } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()

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
      case 'edit':
        openNewTab(`qualitySynergy/DataSharingAdd?pageState=edit&id=${data.selectedRowKeys[0]}`, '技术资料分享需求-编辑', false);
        break
      case 'detail':
        openNewTab(`qualitySynergy/DataSharingAdd?pageState=detail&id=${data.selectedRowKeys[0]}`, '技术资料分享需求-明细', false);
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
    { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
    { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: materialCode },
    { title: '业务单元', key: 'buCode', type: 'list', props: BUConfigNoFrost},
    { title: '申请人', key: 'applyPeopleName', props: { placeholder: '输入申请人查询' } },
    { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: distributionProps },
    { title: '状态', key: 'status', type: 'list', props: statusProps },
  ]

  const columns = [
    { title: '状态', dataIndex: 'state', width: 80 },
    { title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 160},
    { title: '来源', dataIndex: 'source', width: 70 },
    { title: '分享需求号', dataIndex: 'strategicPurchaseId', ellipsis: true,width: 320 },
    { title: '物料代码', dataIndex: 'materialCode', ellipsis: true,width: 160 },
    { title: '物料描述', dataIndex: 'materialName', ellipsis: true, },
    { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true, },
    { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true, },
    { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true, },
    { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true, },
    { title: '供应商',dataIndex: 'buId', render: () => <a>查看</a>},
    { title: 'BU代码', dataIndex: 'buCode', ellipsis: true, },
    { title: 'BU名称', dataIndex: 'buName', ellipsis: true, },
    { title: '申请人', dataIndex: 'applyPeopleName', ellipsis: true, },
    { title: '申请人联系方式', dataIndex: 'applyPeoplePhone', ellipsis: true, },
    { title: '申请日期', dataIndex: 'applyDate', ellipsis: true, width: 160},
  ].map(item => ({ ...item, align: 'center' }));

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

  const onSelectRow = (value, rows) => {
    console.log(value, rows)
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
          (h) =>  <ExtTable
            rowKey={(v) => v.id}
            height={h}
            columns={columns}
            store={{
              url: `${smBaseUrl}/api/epTechnicalShareDemandService/findByPage`,
              type: 'POST',
            }}
            allowCancelSelect={true}
            remotePaging={true}
            checkbox={{
              multiSelect: true,
            }}
            ref={tableRef}
            showSearch={false}
            onSelectRow={onSelectRow}
            selectedRowKeys={data.selectedRowKeys}
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
