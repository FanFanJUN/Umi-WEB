import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../../components/Header';
import AdvancedForm from '../../../../components/AdvancedForm';
import { Button, Input, message, Modal } from 'antd';
import styles from './index.less';
import { ExtTable, utils } from 'suid';
import {
  BUConfigNoFrostHighSearch, DeleteDataSharingList,
  distributionProps,
  materialCode, MaterialConfig, MaterialGroupConfig,
  statusProps, StrategicPurchaseConfig,
} from '../../commonProps';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import { recommendUrl, smBaseUrl } from '../../../../utils/commonUrl';
import { openNewTab } from '../../../../utils';
import SupplierModal from './component/SupplierModal';
import TacticAssign from './component/TacticAssign';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function() {


  const tableRef = useRef(null);

  const [modalData, setModalData] = useState({
    title: '查看已分配的供应商',
    visible: false,
    type: 'vies',
    shareDemanNumber: ''
  });

  const [assignData, setAssignData] = useState({
    visible: false,
  });

  const [data, setData] = useState({
    quickSearchValue: '',
    epTechnicalShareDemandSearchBo: {},
    selectedRowKeys: [],
    selectedRows: [],
  });

  const redirectToPage = (type) => {
    switch (type) {
      case 'add':
        openNewTab('qualitySynergy/DataSharingAdd?pageState=add', '技术资料分享需求-新增', false);
        break;
      case 'edit':
        openNewTab(`qualitySynergy/DataSharingAdd?pageState=edit&id=${data.selectedRowKeys[0]}`, '技术资料分享需求-编辑', false);
        break;
      case 'detail':
        openNewTab(`qualitySynergy/DataSharingAdd?pageState=detail&id=${data.selectedRowKeys[0]}`, '技术资料分享需求-明细', false);
        break;
      case 'delete':
        deleteList()
        break;
      case 'allot':
        setModalData({ title: '分配供应商', visible: true, type: 'allot' });
        break;
      case 'govern':
        setAssignData((value) => ({ ...value, visible: true }));
        break;
    }
  };

  const handleQuickSearch = (value) => {
    setData(v => ({...v, quickSearchValue: value}))
    tableRef.current.remoteDataRefresh();
    console.log(value, 'value');
  };

  // 删除
  const deleteList = () => {
    Modal.confirm({
      title: '删除',
      content:'是否删除选中的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        DeleteDataSharingList({
          ids: data.selectedRowKeys.toString()
        }).then(res => {
          if (res.success) {
            message.success(res.message)
            tableRef.current.manualSelectedRows();
            tableRef.current.remoteDataRefresh();

          } else {
            message.error(res.message)
          }
        })
      }
    })
  }

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    value.materialCode = value.materialCode_name;
    value.materialGroupCode = value.materialGroupCode_name;
    value.strategicPurchaseCode = value.strategicPurchaseCode_name;
    value.buCode = value.buCode_name;
    delete value.materialCode_name
    delete value.materialGroupCode_name
    delete value.strategicPurchaseCode_name
    delete value.buCode_name
    delete value.state_name
    delete value.allotSupplierState_name
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    tableRef.current.remoteDataRefresh();
    console.log(value, '高级查询');
  };

  // 高级查询配置
  const formItems = [
    { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
    { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
    { title: '业务单元', key: 'buCode', type: 'list', props: BUConfigNoFrostHighSearch },
    { title: '申请人', key: 'applyPeopleName', props: { placeholder: '输入申请人查询' } },
    { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: distributionProps },
    { title: '状态', key: 'state', type: 'list', props: statusProps },
  ];

  const columns = [
    { title: '状态', dataIndex: 'state', width: 80 },
    { title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 160 },
    { title: '来源', dataIndex: 'source', width: 70 },
    { title: '分享需求号', dataIndex: 'shareDemanNumber', ellipsis: true, width: 150 },
    { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, width: 160 },
    { title: '物料描述', dataIndex: 'materialName', ellipsis: true },
    { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true },
    { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true },
    { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true },
    { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true },
    { title: '供应商', dataIndex: 'buId', render: (v, data) => <a onClick={() => handleSeesSupplier(data.shareDemanNumber)}>查看</a> },
    { title: 'BU代码', dataIndex: 'buCode', ellipsis: true },
    { title: 'BU名称', dataIndex: 'buName', ellipsis: true },
    { title: '申请人', dataIndex: 'applyPeopleName', ellipsis: true },
    { title: '申请人联系方式', dataIndex: 'applyPeoplePhone', ellipsis: true },
    { title: '申请日期', dataIndex: 'applyDate', ellipsis: true, width: 160 },
  ].map(item => ({ ...item, align: 'center' }));

  const visibleSupplier = () => {
    console.log('查看供应商');
  };


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
        disabled={data.selectedRowKeys.length !== 1 || data.selectedRows[0]?.source !== 'SRM'}
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
        disabled={data.selectedRowKeys.length === 0}
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
  </>;

  const headerRight = <>
    <Search
      placeholder='物料代码和物料描述'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </>;

  const onSelectRow = (value, rows) => {
    console.log(value, rows);
    setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows }));
  };

  const handleModalCancel = () => {
    setModalData((value) => ({ ...value, visible: false }));
  };

  const handleSeesSupplier = (shareDemanNumber) => {
    setModalData(v => ({...v, visible: true, shareDemanNumber}))
  }

  return (
    <Fragment>
      <Header
        left={headerLeft}
        right={headerRight}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch}/>
        }
        advanced
      />
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            rowKey={(v) => v.id}
            height={h}
            columns={columns}
            store={{
              params: {
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo
              },
              url: `${recommendUrl}/api/epTechnicalShareDemandService/findByPage`,
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
        {...modalData}
        onCancel={handleModalCancel}
      />
      <TacticAssign
        type={modalData.type}
        visible={assignData.visible}
        onCancel={() => setAssignData((value) => ({ ...value, visible: false }))}
      />
    </Fragment>
  );
}
