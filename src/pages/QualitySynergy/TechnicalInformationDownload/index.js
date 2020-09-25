import React, { useState, useRef, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Input, Checkbox, message } from 'antd';
import styles from '../TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils } from 'suid';
import {
  BUConfigNoFrostHighSearch,
  downloadStatusProps,
  materialCode,
  MaterialConfig,
  MaterialGroupConfig,
  ShareDownloadStatus,
  StrategicPurchaseConfig, UpdateShareDownLoadState,
} from '../commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { recommendUrl, smBaseUrl } from '../../../utils/commonUrl';
import Upload from '../compoent/Upload';
const { Search } = Input;


export default function() {
  const tableRef = useRef(null);

  const [data, setData] = useState({
    quickSearchValue: '',
    checked: true,
    selectedRowKeys: [],
    selectedRows: [],
    EpTechnicalShareDemandSearchBo: {},
  })

  const handleQuickSearch = (value) => {
    setData(v => ({...v, quickSearchValue: value}))
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  }

  // 高级查询搜索
  const handleAdvancedSearch = (value) => {
    value.materialCode = value.materialCode_name;
    value.materialGroupCode = value.materialGroupCode_name;
    value.strategicPurchaseCode = value.strategicPurchaseCode_name;
    value.buCode = value.buCode_name;
    // value.fileDownloadState = value.fileDownloadState_name;
    delete value.materialCode_name;
    delete value.materialGroupCode_name;
    delete value.strategicPurchaseCode_name;
    delete value.buCode_name;
    // delete value.fileDownloadState_name;
    setData(v => ({ ...v, EpTechnicalShareDemandSearchBo: value }));
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  }

  // 高级查询配置
  const formItems = [
    { title: '物料代码', key: 'materialCode', type: 'list', props: MaterialConfig },
    { title: '物料组', key: 'materialGroupCode', type: 'list', props: MaterialGroupConfig },
    { title: '战略采购', key: 'strategicPurchaseCode', type: 'list', props: StrategicPurchaseConfig },
    { title: '业务单元', key: 'buCode', type: 'list', props: BUConfigNoFrostHighSearch },
    { title: '申请人', key: 'applyPeopleName', props: { placeholder: '输入申请人查询' } },
    // { title: '状态', key: 'fileDownloadState', type: 'list', props: ShareDownloadStatus },
  ]

  const columns = [
    { title: '下载状态', dataIndex: 'fileDownloadState', width: 80, render: (v) => v ? v : '未下载' },
    { title: '预警', dataIndex: 'warning', width: 80, render: (v) => <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{width: '20px', height: '20px', borderRadius: '50%', background: v}} />
      </div>},
    { title: '资料下载截止日期', dataIndex: 'downloadAbortDate', width: 180 },
    // { title: '物料代码', dataIndex: 'materialCode', ellipsis: true, },
    { title: '物料描述', dataIndex: 'materialName', ellipsis: true, width: 180},
    { title: '物料组代码', dataIndex: 'materialGroupCode', ellipsis: true, },
    { title: '物料组描述', dataIndex: 'materialGroupName', ellipsis: true, },
    { title: '文件类别', dataIndex: 'fileCategoryName', ellipsis: true, },
    { title: '文件版本', dataIndex: 'fileVersion', ellipsis: true, },
    { title: '图纸状态', dataIndex: 'drawFlag', ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'technicalDataFileIdList', width: 120, render: (v, data) => <Upload type='show' entityId={v} downloadClick={() => changeDownloadStatus(data)}/>},
    { title: '样品需求数量', dataIndex: 'sampleRequirementNum', ellipsis: true, },
    { title: '计量单位', dataIndex: 'measureUnit', ellipsis: true, },
    { title: '样品需求日期', dataIndex: 'sampleRequirementDate', ellipsis: true, },
    { title: '战略采购名称', dataIndex: 'strategicPurchaseName', ellipsis: true, },
    { title: '业务单元名称', dataIndex: 'buName', ellipsis: true, },
    { title: '申请人', dataIndex: 'applyPeopleName', ellipsis: true, },
    { title: '申请人联系方式', dataIndex: 'applyPeoplePhone', ellipsis: true, },
    { title: '收件人姓名', dataIndex: 'sampleReceiverName', ellipsis: true, },
    { title: '收件人联系方式', dataIndex: 'sampleReceiverTel', ellipsis: true, },
    { title: '分享需求号', dataIndex: 'shareDemanNumber', ellipsis: true,  width: 180 },
    { title: '分享需求行号', dataIndex: 'technicalLineNumber', ellipsis: true, },
  ].map(item => ({ ...item, align: 'center' }));

  const onChange = (e) => {
    setData(v => ({...v, checked: e.target.checked}))
    tableRef.current.manualSelectedRows();
    tableRef.current.remoteDataRefresh();
  }

  const changeDownloadStatus = (data) => {
    UpdateShareDownLoadState({
      epTechnicalSupplierId: data.epTechnicalSupplierId,
      epTechnicalDataId: data.epTechnicalDataId
    }).then(res => {
      if (res.success) {
        tableRef.current.remoteDataRefresh();
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
  }

  const headerRight = <div style={{display: 'flex', alignItems: 'center'}}>
    <div style={{width: '150px'}}>
      <Checkbox onChange={onChange} checked={data.checked}>未下载</Checkbox>
    </div>
    <Search
      placeholder='物料或物料组或资料类别'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>

  const onSelectRow = (value, rows) => {
    setData((v) => ({...v, selectedRowKeys: value, selectedRows: rows}))
  }

  return (
    <Fragment>
      <Header
        right={headerRight}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvancedSearch} />
        }
        advanced
      />
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            rowKey={(v) => v.key}
            height={h}
            columns={columns}
            store={{
              params: {
                ...data.checked ? {fileDownloadState: '未下载'} : null,
                quickSearchValue: data.quickSearchValue,
                ...data.EpTechnicalShareDemandSearchBo ,
              },
              url: `${recommendUrl}/api/epTechnicalShareDemandService/findDetail`,
              type: 'POST',
            }}
            allowCancelSelect={true}
            remotePaging={true}
            checkbox={{
              multiSelect: false,
            }}
            ref={tableRef}
            showSearch={false}
            onSelectRow={onSelectRow}
            selectedRowKeys={data.selectedRowKeys}
          />
        }
      </AutoSizeLayout>
    </Fragment>
  )
}
