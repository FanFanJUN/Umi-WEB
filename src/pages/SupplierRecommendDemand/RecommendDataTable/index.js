import react, { useState, useRef } from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout } from '../../../components';
import { ExtTable } from 'suid';
import { Input, Select, Button, Modal } from 'antd';
import { openNewTab, getFrameElement, commonUrl } from '../../../utils';
const { recommendUrl } = commonUrl;
const { Search } = Input
const { Option } = Select;

function RecommendDataTable() {
  const tableRef = useRef(null);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [detailModal, toggleDetailModal] = useState(false);
  const [searchValue, setSearchValue] = useState({});
  const FRAMELEEMENT = getFrameElement();
  const [signleRow = {}] = selectedRows;
  // 未选中数据状态
  const empty = selectedRowKeys.length === 0;
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findSupplierListByPage`,
      params: {

      },
      type: 'POST'
    },
    remotePaging: true,
    columns: [
      {
        title: '状态',
        dataIndex: 'supplierRecommendDemandStatus',
        render(text) {
          return text === 'FILLING' ? '填报中' : '填报完成'
        }
      },
      {
        title: '需求单号',
        dataIndex: 'docNumber'
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
      <Button className={styles.btn} onClick={handleFillIn} disabled={empty}>填报</Button>
      <Button className={styles.btn} disabled={empty} onClick={checkDetail}>明细</Button>
      <Button className={styles.btn} disabled={empty}>撤回</Button>
      <Button className={styles.btn} disabled={empty} onClick={checkOpinion}>查看意见</Button>
    </>
  )
  const right = (
    <>
      <Select style={{ width: 300 }} defaultValue='FILLING'>
        <Option key='FILLING' value='FILLING'>填报中</Option>
        <Option kye='COMPLETE' value='COMPLETE'>已填报</Option>
      </Select>
      <Search />
    </>
  )
  const footer = (
    <Button>知道了</Button>
  )
  function handleFillIn() {
    const { id = '' } = FRAMELEEMENT;
    const [key] = selectedRowKeys;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/fillIn/data?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '推荐资料填报', false)
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
  async function closeCheckOpinion() {
    await toggleDetailModal(false)
  }
  // 查看明细
  function checkDetail() {
    const { id = '' } = FRAMELEEMENT;
    const [key] = selectedRowKeys;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/demand/detail?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '供应商推荐需求明细', false)
  }

  // 撤回
  function handleWithdraw() {
    Modal  
  }
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
        />
      </Modal>
    </div>
  )
}

export default RecommendDataTable;