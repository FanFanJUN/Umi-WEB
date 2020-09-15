import React, { useState, useRef, Fragment } from 'react';
import Header from '../../../components/Header';
import AdvancedForm from '../../../components/AdvancedForm';
import { Input, Checkbox } from 'antd';
import styles from '../TechnicalDataSharing/DataSharingList/index.less';
import { ExtTable, utils } from 'suid';
import {
  BUConfigNoFrost,
  DownloadStatus,
  materialCode,
} from '../commonProps';
import AutoSizeLayout from '../../../components/AutoSizeLayout';
import { smBaseUrl } from '../../../utils/commonUrl';
const { Search } = Input;


export default function() {


  const tableRef = useRef(null);

  const [data, setData] = useState({
    checked: true,
    selectedRowKeys: [],
    selectedRows: []
  })

  const [searchValue, setSearchValue] = useState({});

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
    { title: '业务单元', key: 'data4', type: 'list', props: BUConfigNoFrost},
    { title: '申请人', key: 'data5', props: { placeholder: '输入申请人查询' } },
    { title: '下载状态', key: 'data7', type: 'list', props: DownloadStatus },
  ]

  const columns = [
    {
      title: '下载状态', dataIndex: 'state', width: 80, render: (text) => {
        switch (text) {
          case 'draft': return '已下载';
          case 'pre_publish': return '未下载';
          default: return ''
        }
      }
    },
    {
      title: '预警', dataIndex: 'inquiryMethodName', width: 160, render: (text) => {
        switch (text) {
          case 'draft': return '已分配';
          case 'pre_publish': return '未分配';
          default: return ''
        }
      }
    },
    { title: '资料下载截止日期', dataIndex: 'turnNumber', width: 70 },
    { title: '物料代码', dataIndex: 'name1', ellipsis: true, },
    { title: '物料描述', dataIndex: 'name2', ellipsis: true, },
    { title: '物料组代码', dataIndex: 'name3', ellipsis: true, },
    { title: '物料组描述', dataIndex: 'name4', ellipsis: true, },
    { title: '物料组描述', dataIndex: 'name5', ellipsis: true, },
    { title: '文件类别', dataIndex: 'name6', ellipsis: true, },
    { title: '文件版本', dataIndex: 'name7', ellipsis: true, },
    { title: '技术资料附件', dataIndex: 'name8', ellipsis: true,render: <a onClick={() => visibleSupplier()}>查看</a>},
    { title: '样品需求日期', dataIndex: 'name9', ellipsis: true, },
    { title: '战略采购名称', dataIndex: 'name10', ellipsis: true, },
    { title: '业务单元名称', dataIndex: 'name11', ellipsis: true, },
    { title: '申请人', dataIndex: 'name12', ellipsis: true, },
    { title: '申请人联系方式', dataIndex: 'name13', ellipsis: true, },
    { title: '分享需求号', dataIndex: 'name13', ellipsis: true, },
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

  const onChange = (e) => {
    setData(v => ({...v, checked: e.target.checked}))
    console.log(e)
  }

  const headerRight = <div style={{display: 'flex', alignItems: 'center'}}>
    <div style={{width: '150px'}}>
      <Checkbox onChange={onChange} checked={data.checked}>未下载</Checkbox>
    </div>
    <Search
      placeholder='供应商代码或名称'
      className={styles.btn}
      onSearch={handleQuickSearch}
      allowClear
    />
  </div>

  const handleSelectedRows = (value, rows) => {
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
    </Fragment>
  )
}
