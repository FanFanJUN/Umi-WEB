import React, { useState, useRef, useEffect, Fragment } from 'react';
import Header from '../../../../components/Header';
import AdvancedForm from '../../../../components/AdvancedForm';
import { Button, Checkbox, Input, message, Modal } from 'antd';
import styles from './index.less';
import { DataExport, ExtTable, utils } from 'suid';
import moment from "moment";
import {
  BUConfigNoFrostHighSearch,
  DeleteDataSharingList,
  judge,
  materialCode,
  MaterialConfig,
  MaterialGroupConfig, RecallDataSharingList,
  ShareDistributionProps,
  ShareStatusProps,
  StrategicPurchaseConfig,
  SubmitDataSharingList,
} from '../../commonProps';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import { recommendUrl } from '../../../../utils/commonUrl';
import { openNewTab } from '../../../../utils';
import SupplierModal from './component/SupplierModal';
import TacticAssign from './component/TacticAssign';

const { authAction } = utils;
const { Search } = Input;

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString();

export default function () {


  const tableRef = useRef(null);

  const [modalData, setModalData] = useState({
    title: '查看已分配的供应商',
    visible: false,
    type: 'vies',
    shareDemanNumber: '',
  });

  const [assignData, setAssignData] = useState({
    visible: false,
  });

  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false);
  }, []);

  const listenerParentClose = (event) => {
    const { data = {} } = event;
    console.log('进入监听', data.tabAction);
    if (data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh();
    }
  };

  const [data, setData] = useState({
    checkedCreate: false,
    checkedDistribution: false,
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
        deleteList();
        break;
      case 'submit':
        submitOrRecall('submit');
        break;
      case 'recall':
        recallList();
        break;
      case 'allot':
        setModalData({ title: '分配供应商', visible: true, type: 'allot' });
        break;
      case 'govern':
        setAssignData((value) => ({ ...value, visible: true }));
        break;
    }
  };

  // 撤回选中单据
  const recallList = () => {
    Modal.confirm({
      title: '撤回',
      content: '是否撤回选中的数据',
      okText: '是',
      cancelText: '否',
      onOk: () => {
        RecallDataSharingList({
          ids: data.selectedRowKeys.toString(),
        }).then(res => {
          if (res.success) {
            message.success(res.message);
            tableRef.current.manualSelectedRows();
            tableRef.current.remoteDataRefresh();
          } else {
            message.error(res.message);
          }
        });
      },
    });
  };

  const handleQuickSearch = (value) => {
    setData(v => ({ ...v, quickSearchValue: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
    console.log(value, 'value');
  };


  const submitOrRecall = (type) => {
    if (type === 'submit') {
      SubmitDataSharingList({
        ids: data.selectedRowKeys.toString(),
      }).then(res => {
        if (res.success) {
          message.success('提交成功');
          tableRef.current.manualSelectedRows();
          tableRef.current.remoteDataRefresh();
        } else {
          message.error(res.message);
        }
      });
    } else {

    }
  };

  // 删除
  const deleteList = () => {
    Modal.confirm({
      title: '删除',
      content: '是否删除选中的数据',
      okText: '是',
      okType: 'danger',
      cancelText: '否',
      onOk: () => {
        DeleteDataSharingList({
          ids: data.selectedRowKeys.toString(),
        }).then(res => {
          if (res.success) {
            message.success(res.message);
            tableRef.current.manualSelectedRows();
            tableRef.current.remoteDataRefresh();

          } else {
            message.error(res.message);
          }
        });
      },
    });
  };

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    console.log(value, '高级查询');
    value.materialCode = value.materialCode_name;
    value.materialGroupCode = value.materialGroupCode_name;
    value.strategicPurchaseCode = value.strategicPurchaseCode_name;
    value.buCode = value.buCode_name;
    value.state = value.state_name;
    value.allotSupplierState = value.allotSupplierState_name;
    delete value.materialCode_name;
    delete value.materialGroupCode_name;
    delete value.strategicPurchaseCode_name;
    delete value.buCode_name;
    delete value.state_name;
    delete value.allotSupplierState_name;
    setData(v => ({ ...v, epTechnicalShareDemandSearchBo: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  };

  // 高级查询配置
  const formItems = [
    { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
    { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
    { title: '业务单元', key: 'buCode', type: 'list', props: BUConfigNoFrostHighSearch },
    { title: '申请人', key: 'applyPeopleName', props: { placeholder: '输入申请人查询' } },
    { title: '分配供应商状态', key: 'allotSupplierState', type: 'list', props: ShareDistributionProps },
    { title: '状态', key: 'state', type: 'list', props: ShareStatusProps },
  ];

  const columns = [
    { title: '状态', dataIndex: 'state', width: 80 },
    { title: '分配供应商状态', dataIndex: 'allotSupplierState', width: 160 },
    { title: '来源', dataIndex: 'source', width: 70 },
    { title: '分享需求号', dataIndex: 'shareDemanNumber', ellipsis: true, width: 180 },
    { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, width: 160, render: (text, item) => item.source === 'SRM' ? text : '' },
    { title: '物料描述', dataIndex: 'materialName', ellipsis: true },
    { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true },
    { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true },
    { title: '战略采购代码', dataIndex: 'strategicPurchaseCode', ellipsis: true },
    { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true },
    // {
    //   title: '供应商',
    //   dataIndex: 'buId',
    //   render: (v, data) => <a onClick={() => handleSeesSupplier(data.shareDemanNumber)}>查看</a>,
    // },
    { title: '业务单元代码', dataIndex: 'buCode', ellipsis: true },
    { title: '业务单元名称', dataIndex: 'buName', ellipsis: true },
    { title: '申请人', dataIndex: 'applyPeopleName', ellipsis: true },
    { title: '申请人联系方式', dataIndex: 'applyPeoplePhone', ellipsis: true },
    { title: '申请日期', dataIndex: 'applyDate', ellipsis: true, width: 160 },
  ].map(item => ({ ...item, align: 'center' }));

  const onChangeCreate = (e) => {
    setData(v => ({ ...v, checkedCreate: e.target.checked }))
    tableRef.current.remoteDataRefresh();
  }

  const onChangeDistribution = (e) => {
    setData(v => ({ ...v, checkedDistribution: e.target.checked }))
    tableRef.current.remoteDataRefresh();
  }

  // 导出
  const explainResponse = res => {
    let arr = [];
    res.data.rows.map(item => {
      arr.push({
        '状态': item.state,
        '分配供应商状态': item.allotSupplierState,
        '来源': item.source,
        '分享需求号': item.shareDemanNumber,
        '物料代码': item.materialCode,
        '物料描述': item.materialName,
        '物料组代码': item.materialGroupCode,
        '物料组描述': item.materialGroupName,
        '战略采购代码': item.strategicPurchaseCode,
        '战略采购名称': item.strategicPurchaseName,
        '业务单元代码': item.buCode,
        '业务单元名称': item.buName,
        '申请人': item.applyPeopleName,
        '申请人联系方式': item.applyPersonPhone,
        '申请日期': item.applyDate,
      });
    });
    if (res.success) {
      return arr;
    }
    return [];
  };
  // 获取导出的数据
  const requestParams = {
    data: {
      ...data.checkedCreate ? { onlyOwn: data.checkedCreate } : null,
      ...data.checkedDistribution ? { onlyAllocation: data.checkedDistribution } : null,
      quickSearchValue: data.quickSearchValue,
      ...data.epTechnicalShareDemandSearchBo,
      pageInfo: { page: 1, rows: 100000 }
    },
    url: `${recommendUrl}/api/epTechnicalShareDemandService/findByPage`,
    method: 'POST',
  };

  const headerLeft = <>
    {
      authAction(<Button
        type='primary'
        onClick={() => redirectToPage('add')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_ADD'
      >新增</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('edit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_EDIT'
        disabled={
          data.selectedRowKeys.length !== 1 || data.selectedRows[0]?.source !== 'SRM' ||
          data.selectedRows[0]?.state === '生效' || data.selectedRows[0]?.allotSupplierState === '已分配'}
      >编辑</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('delete')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DELETE'
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', '草稿')}
      >删除</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('detail')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_DETAIL'
        disabled={data.selectedRowKeys.length !== 1}
      >明细</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('submit')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        key='TECHNICAL_DATA_SHARING_SUBMIT'
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', '草稿')}    /*先提交后分配战略采购 秦老师20.11.05提*/
      >提交</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('recall')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0 || !judge(data.selectedRows, 'state', '生效') || !judge(data.selectedRows, 'allotSupplierState', '未分配')}
        key='TECHNICAL_DATA_SHARING_UNDO'
      >撤回</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('allot')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={
          data.selectedRowKeys.length !== 1 ||
          !data.selectedRows.every(item => item.strategicPurchaseCode) ||
          !judge(data.selectedRows, 'state', '生效') ||
          (data.selectedRows.length > 1 && data.selectedRows.some(item => item.allotSupplierState === '已分配'))
        }
        key='TECHNICAL_DATA_SHARING_ALLOT'
      >分配供应商</Button>)
    }
    {
      authAction(<Button
        onClick={() => redirectToPage('govern')}
        className={styles.btn}
        ignore={DEVELOPER_ENV}
        disabled={data.selectedRowKeys.length === 0
          // || data.selectedRows.every(item => item.strategicPurchaseCode)
          || !judge(data.selectedRows, 'state', '生效')
        }
        key='TECHNICAL_DATA_SHARING_GOVERN'
      >指派战略采购</Button>)
    }
    {
      authAction(<DataExport.Button
        requestParams={requestParams}
        explainResponse={explainResponse}
        filenameFormat={'技术资料分享' + moment().format('YYYYMMDD')}
        key='TECHNICAL_DATA_SHARING_EXPORT'
        ignore={DEVELOPER_ENV}
      >导出</DataExport.Button>)
    }
  </>;

  const headerRight = <div style={{ display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '380px' }}>
      <Checkbox onChange={onChangeCreate} checked={data.checkedCreate}>仅我创建</Checkbox>
      <Checkbox onChange={onChangeDistribution} checked={data.checkedDistribution}>仅我分配</Checkbox>
    </div>
    <Search
      placeholder='请输入物料、物料组或分享需求号查询'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>;

  const onSelectRow = (value, rows) => {
    console.log(value, rows);
    setData((v) => ({ ...v, selectedRowKeys: value, selectedRows: rows }));
  };

  const handleModalCancel = () => {
    setModalData((value) => ({ ...value, visible: false }));
  };

  const handleSeesSupplier = (shareDemanNumber) => {
    setModalData(v => ({ ...v, visible: true, shareDemanNumber }));
  };

  const tacticCancel = () => {
    setAssignData((value) => ({ ...value, visible: false }));
    tableRef.current.remoteDataRefresh();
  };

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
            rowKey={(v) => v.id}
            height={h}
            columns={columns}
            store={{
              params: {
                ...data.checkedCreate ? { onlyOwn: data.checkedCreate } : null,
                ...data.checkedDistribution ? { onlyAllocation: data.checkedDistribution } : null,
                quickSearchValue: data.quickSearchValue,
                ...data.epTechnicalShareDemandSearchBo,
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
        selectedRows={data.selectedRows}
        tableRefresh={() => tableRef.current.remoteDataRefresh()}
        onCancel={handleModalCancel}
      />
      <TacticAssign
        type={modalData.type}
        selectedRowKeys={data.selectedRowKeys}
        visible={assignData.visible}
        onCancel={tacticCancel}
      />
    </Fragment>
  );
}
