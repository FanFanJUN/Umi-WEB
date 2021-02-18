import { useState, useRef, useEffect } from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout } from '../../../components';
import { ExtTable } from 'suid';
import { Input, Select, Button, Modal, message } from 'antd';
import { useLocation } from 'dva/router'
import { openNewTab, getFrameElement, commonUrl, commonProps } from '../../../utils';
import { withdrawSupplierFilledInfo } from '../../../services/recommend';
const { recommendUrl } = commonUrl;
const { Search } = Input
const { Option } = Select;
const { supplierRecommendDemandStatusProps } = commonProps;

function RecommendDataTable() {
  const tableRef = useRef(null);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [detailModal, toggleDetailModal] = useState(false);
  const { query } = useLocation();
  const [status, setStatus] = useState('');
  const [searchValue, setSearchValue] = useState({});
  const FRAMELEEMENT = getFrameElement();
  const [signleRow = {}] = selectedRows;
  const { supplierRecommendDemandStatus = '', unitCode = null, unitName = null } = signleRow;
  // 未选中数据状态
  const empty = selectedRowKeys.length === 0;
  const complete = supplierRecommendDemandStatus === 'FILLED';
  const underWay = (
    supplierRecommendDemandStatus === 'DRAFT' ||
    supplierRecommendDemandStatus === 'FILLING'
  );
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findSupplierListByPage`,
      params: {
        quickSearchProperties: ['docNumber'],
        filters: !!status ? [
          {
            fieldName: 'supplierRecommendDemandStatus',
            value: status,
            operator: 'EQ'
          }
        ] : [],
        ...searchValue,
        sortOrders: [
          {
            property: 'createdDate',
            direction: 'DESC'
          }
        ]
      },
      type: 'POST'
    },
    remotePaging: true,
    columns: [
      {
        title: '状态',
        dataIndex: 'supplierRecommendDemandStatusRemark'
      },
      {
        title: '需求单号',
        dataIndex: 'docNumber',
        width: 200
      },
      {
        title: '物料分类',
        dataIndex: 'materialCategoryName',
        width: 200
      },
      {
        title: '推荐部门',
        dataIndex: 'orgName',
        width: 300
      },
      {
        title: '推荐人',
        dataIndex: 'creatorName'
      },
      {
        title: '推荐日期',
        dataIndex: 'createdDate',
        width: 200
      }
    ],
    bordered: true,
    size: 'small',
    showSearch: false,
    checkbox: {
      multiSelect: false
    },
    ellipsis: false,
    // rowKey: (_, index) => `tree-recommend-damend-${index}`,
    selectedRowKeys: selectedRowKeys,
    onSelectRow: handleSelectedRows,
    allowCancelSelect: true
  }
  const left = (
    <>
      <Button
        className={styles.btn}
        onClick={handleFillIn}
        disabled={empty || !underWay}
        type='primary'
      >填报</Button>
      <Button
        className={styles.btn}
        disabled={empty}
        onClick={checkDetail}
      >明细</Button>
      <Button
        className={styles.btn}
        disabled={empty || !complete}
        onClick={handleWithdraw}
      >撤回</Button>
      <Button
        className={styles.btn}
        disabled={empty}
        onClick={checkOpinion}
      >查看意见</Button>
    </>
  )
  const right = (
    <>
      <Select
        style={{ width: 300 }}
        value={status}
        // onSelect={handleStateSelect}
        placeholder='填报状态'
        allowClear
        onChange={handleStateSelect}
      >
        {
          supplierRecommendDemandStatusProps.dataSource.map(item => (
            <Option key={item.code} value={item.code}>{item.name}</Option>
          ))
        }
      </Select>
      <Search allowClear onSearch={handleSearch} placeholder='请输入需求单号' />
    </>
  )
  const opinionTableProps = {
    store: {
      url: `${recommendUrl}/api/fillingOpinionService/findOpinionBySupplierRecommendDemandId`,
      type: 'get',
      params: {
        supplierRecommendDemandId: signleRow?.id
      }
    },
    columns: [
      {
        title: '意见',
        dataIndex: 'opinion',
        width: 250
      },
      {
        title: '提出意见时间',
        dataIndex: 'submitTime',
        width: 200
      }
    ]
  }
  const footer = (
    <Button onClick={closeCheckOpinion} type='primary'>知道了</Button>
  )
  function handleStateSelect(v) {
    setStatus(v)
  }
  function handleSearch(v) {
    setSearchValue({
      quickSearchValue: v.trim()
    })
    uploadTable()
  }
  // 清除选中项
  function cleanSelectedRecord() {
    tableRef.current.manualSelectedRows([])
    setRowKeys([])
  }
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  function handleFillIn() {
    const { id = '' } = FRAMELEEMENT;
    const [key] = selectedRowKeys;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/fillIn/data?id=${key}&unitCode=${unitCode}&unitName=${unitName}&frameElementId=${id}&frameElementSrc=${pathname}`, '推荐资料填报', false)
  }
  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
  }
  // 查看意见
  async function checkOpinion() {
    await toggleDetailModal(true)
  }
  // 关闭查看意见窗口
  function closeCheckOpinion() {
    toggleDetailModal(false)
  }
  // 查看明细
  function checkDetail() {
    const { id = '' } = FRAMELEEMENT;
    const [key] = selectedRowKeys;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/fillIn/data/supplier/detail?type=detail&id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '推荐资料填报明细', false)
  }

  // 撤回
  function handleWithdraw() {
    Modal.confirm({
      title: '撤回',
      content: '确定要撤回当前选中数据的填报信息吗？',
      okText: '撤回',
      cancelText: '取消',
      onOk: async () => {
        const { id } = signleRow;
        const { success, message: msg } = await withdrawSupplierFilledInfo({
          supplierRecommendDemandId: id
        })
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 监听二级路由关闭更新列表
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
      uploadTable()
    }
  }
  useEffect(() => {
    const { supplierRecommendDemandStatus = null } = query;
    if (!!supplierRecommendDemandStatus) {
      setSearchValue({
        filters: [
          {
            fieldName: 'supplierRecommendDemandStatus',
            value: supplierRecommendDemandStatus,
            operator: 'EQ'
          }
        ]
      })
      uploadTable()
    }
    window
      .parent
      .frames
      .addEventListener('message', listenerParentClose, false);
    return () =>
      window
        .parent
        .frames
        .removeEventListener('message', listenerParentClose, false)
  }, [])
  return (
    <div>
      <Header left={left} right={right} />
      <AutoSizeLayout>
        {
          (h) => <ExtTable
            ref={tableRef}
            height={h}
            {...tableProps}
          />
        }
      </AutoSizeLayout>
      <Modal
        visible={detailModal}
        bodyStyle={{
          height: '60vh',
          overflowY: 'scroll'
        }}
        destroyOnClose
        width='60vw'
        onCancel={closeCheckOpinion}
        footer={footer}
        centered
        title='查看意见'
      >
        <ExtTable
          showSearch={false}
          {...opinionTableProps}
        />
      </Modal>
    </div>
  )
}

export default RecommendDataTable;