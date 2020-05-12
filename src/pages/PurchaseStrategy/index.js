import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, AuthAction } from 'suid';
import { Input, Button, message } from 'antd';
import Header from '@/components/Header';
import AdvancedForm from '@/components/AdvancedForm';
import { ComboAttachment } from '@/components';
import { psBaseUrl } from '@/utils/commonUrl';
import { openNewTab } from '@/utils';
import {
  purchaseCompanyProps,
  purchaseOrganizationProps,
  majorGroupProps,
  proPlanMaterialTypeProps,
  materialLevel,
  materialClassProps,
  materialClassTypeProps,
  corporationProps,
  frequencyProps,
  costTargetProps,
  effectStatusProps
} from '@/utils/commonProps';
import {
  removeStrategyTableItem
} from '@/services/strategy';
import styles from './index.less';
import classnames from 'classnames';
import Modal from 'antd/es/modal';
const { Search } = Input
const { StartFlow, FlowHistory } = WorkFlow;

function PurchaseStategy() {
  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [visible, triggerVisible] = useState(false);
  const [attachId, setAttachId] = useState('');
  const [showAttach, triggerShowAttach] = useState(false);
  const [singleRow = {}] = selectedRows;
  const { state: rowState, approvalState: rowApprovalState, changeable: rowChangeable, flowId: businessId } = singleRow;
  const columns = [
    {
      title: '预警',
      dataIndex: 'warningStatus',
      render(state) {
        switch (state) {
          case 'Waring':
            return <div className={classnames([styles.dot, styles.warning])}></div>
          case 'Expire':
            return <div className={classnames([styles.dot, styles.error])}></div>
          default:
            return ''
        }
      },
      width: 96,
    },
    {
      title: '状态',
      dataIndex: 'state',
      render(st) {
        switch (st) {
          case 'Draft':
            return '草稿'
          case 'Effective':
            return '生效'
          case 'Changing':
            return '变更中'
          default:
            return '未知'
        }
      }
    },
    {
      title: '审批状态',
      dataIndex: 'approvalState',
      render(approvalState) {
        switch (approvalState) {
          case 'Uncommitted':
            return '未提交审批'
          case 'InApproval':
            return '审批中'
          case 'Finish':
            return '审批完成'
          default:
            return ''
        }
      },
    },
    {
      title: '是否作废',
      dataIndex: 'invalid',
      render(invalid) {
        return invalid ? '是' : '否'
      },
      width: 80,
    },
    {
      title: '是否变更',
      dataIndex: 'changeable',
      render(changeable) {
        return changeable ? '是' : '否'
      },
      width: 80,
    },
    { title: '采购策略编号', dataIndex: 'code' },
    { title: '采购策略名称', dataIndex: 'name' },
    { title: '物料级别', dataIndex: 'materialLevelName' },
    { title: '采购公司', dataIndex: 'purchaseCompanyName' },
    { title: '采购组织', dataIndex: 'purchaseOrganizationName' },
    { title: '专业组', dataIndex: 'professionalGroupName' },
    { title: '采购组', dataIndex: 'purchaseGroupName' },
    { title: '申请人', dataIndex: 'creatorName' },
    {
      title: '附件',
      dataIndex: 'attachment',
      render(text) {
        return !!text ? <Button onClick={() => {
          setAttachId(text)
          triggerShowAttach(true)
        }}>查看附件</Button> : '无'
      }
    },
    { title: '创建时间', dataIndex: 'createdDate' }
  ].map(_ => ({ ..._, align: 'center' }))
  /* 按钮禁用状态控制 */
  const takeEffect = rowState === 'Effective';
  const approvalEffect = rowApprovalState === 'Uncommitted';
  const approvaling = rowApprovalState === "InApproval";
  const multiple = selectedRowKeys.length > 1;
  const empty = selectedRowKeys.length === 0;
  const approvalFinish = rowApprovalState === 'Finish';
  const tableProps = {
    store: {
      url: `${psBaseUrl}/purchaseStrategyHeader/listByPageLocal`,
      params: searchValue,
      type: 'POST'
    }
  }
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, []);
  function listenerParentClose(event) {
    const { data={} } = event;
    if(data.tabAction === 'close') {
      tableRef.current.remoteDataRefresh()
    }
  }
  const formItems = [
    {
      title: '采购公司',
      type: 'list',
      key: 'Q_EQ_purchaseCompanyCode',
      props: purchaseCompanyProps
    },
    {
      title: '采购组织',
      type: 'list',
      key: 'Q_EQ_purchaseOrganizationCode',
      props: purchaseOrganizationProps
    },
    {
      title: '专业组',
      type: 'list',
      key: 'Q_EQ_professionalGroupCode',
      props: majorGroupProps
    },
    {
      title: '采购策略编号',
      key: 'Q_LK_code',
      props: {
        placeholder: '输入采购策略编号'
      }
    },
    {
      title: '适应范围',
      type: 'multiple',
      key: 'searchble',
      props: corporationProps
    },
    {
      title: '采购策略名称',
      key: 'Q_LK_name',
      props: {
        placeholder: '输入采购策略名称'
      }
    },
    {
      title: '采购计划物料类别',
      type: 'list',
      key: 'Q_EQ_purchaseGoodsClassificationName',
      props: proPlanMaterialTypeProps
    },
    {
      title: '物料级别',
      type: 'list',
      key: 'Q_EQ_materialLevelCode',
      props: materialLevel
    },
    {
      title: '二次分类物料组',
      type: 'list',
      key: 'Q_EQ_materialClassificationCode',
      props: materialClassProps
    },
    {
      title: '采购方式',
      type: 'list',
      key: 'Q_EQ_purchaseTypeCode',
      props: materialClassTypeProps
    },
    {
      title: '定价频次',
      type: 'select',
      key: 'Q_EQ_pricingFrequency',
      props: frequencyProps
    },
    {
      title: '成本目标',
      type: 'select',
      key: 'Q_LK_costTarget',
      props: costTargetProps
    },
    {
      title: '关键词',
      type: 'input',
      key: "Q_LK_keyWord",
      props: {
        placeholder: '输入关键词查询'
      }
    },
    {
      title: '申请人',
      type: 'input',
      key: 'Q_LK_creatorName',
      props: {
        placeholder: '输入申请人查询'
      }
    },
    {
      title: '状态',
      type: 'select',
      key: 'Q_EQ_state',
      props: effectStatusProps
    }
  ]
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  // 快速搜索
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  // 高级搜索
  function handleAdvnacedSearch(v) {
    setSearchValue({
      ...v
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 删除
  async function removeListItem() {
    const { success, message: msg } = await removeStrategyTableItem({
      ids: selectedRowKeys
    })
    if (success) {
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
  }
  function handleRemoveItem() {
    Modal.confirm({
      title: '删除采购策略',
      content: '删除后无法恢复，是否继续？',
      onOk: removeListItem,
      okText: '确定',
      cancelText: '取消'
    })
  }
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  function handleEditor() {
    const [key] = selectedRowKeys;
    openNewTab(`purchase/strategy/editor?id=${key}`, '编辑采购策略', false)
  }
  function handleCreate() {
    openNewTab('purchase/strategy/create', '新增采购策略', false)
  }
  function handleChange() {
    const [key] = selectedRowKeys;
    openNewTab(`purchase/strategy/change?id=${key}`, '变更采购策略', false)
  }
  function handleCheckDetail() {
    const [key] = selectedRowKeys;
    openNewTab(`purchase/strategy/detail?id=${key}`, '采购策略明细', false)
  }
  // 启动审核流程
  function handleBeforeStartFlow() {
    const [item] = selectedRows;
    const { flowId } = item;
    return new Promise(async (resolve, reject) => {
      resolve({
        success: true,
        message: 'success',
        data: {
          businessKey: flowId
        }
      })
      reject(false)
    })
  }
  function handleComplete() {
    uploadTable()
  }
  function showHistory() {
    triggerVisible(true)
  }
  function hideHistory() {
    triggerVisible(false)
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  function handleCheckChangeHistory() {
    const [row] = selectedRows
    const { code } = row;
    openNewTab(`purchase/strategy/change/history?code=${code}`, '采购策略变更历史', false)
  }
  return (
    <>
      <Header
        left={
          <>
            <Button type='primary' className={styles.btn} onClick={handleCreate}>新增</Button>
            <Button disabled={multiple || empty || approvaling || approvalFinish} className={styles.btn} onClick={handleEditor}>编辑</Button>
            <Button onClick={handleRemoveItem} disabled={empty || approvaling || approvalFinish} className={styles.btn}>删除</Button>
            <Button disabled={multiple || empty} className={styles.btn} onClick={handleCheckDetail}>明细</Button>
            <StartFlow
              beforeStart={handleBeforeStartFlow}
              startComplete={handleComplete}
              style={{ display: 'inline-flex' }}
              businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyHeader"
            >
              {
                (loading) => {
                  return (
                    <Button
                      className={styles.btn}
                      loading={loading}
                      disabled={multiple || empty || approvaling || approvalFinish} className={styles.btn}
                    >提交审核</Button>
                  )
                }
              }
            </StartFlow>
            <Button disabled={multiple || empty || approvalEffect} className={styles.btn} onClick={showHistory}>审核历史</Button>
            <Button disabled={multiple || empty || !takeEffect || approvaling || !approvalFinish} className={styles.btn} onClick={handleChange}>变更</Button>
            <Button disabled={multiple || empty || !rowChangeable} className={styles.btn} onClick={handleCheckChangeHistory}>变更历史</Button>
          </>
        }
        right={
          <>
            <Search
              placeholder='请输入采购策略编号或名称查询'
              className={styles.btn}
              onSearch={handleQuickSerach}
              allowClear
            />
          </>
        }
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
        }
        advanced
        ref={headerRef}
      />
      <ExtTable
        columns={columns}
        showSearch={false}
        ref={tableRef}
        rowKey={(item) => item.id}
        checkbox={{
          multiSelect: false
        }}
        remotePaging={true}
        ellipsis={false}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectedRowKeys}
        {...tableProps}
      />
      <ExtModal
        visible={visible}
        onCancel={hideHistory}
        footer={null}
        width={'80vw'}
      >
        <FlowHistory businessId={businessId} />
      </ExtModal>
      <ExtModal
        visible={showAttach}
        onCancel={hideAttach}
        footer={null}
        destroyOnClose
      >
        <ComboAttachment
          allowPreview={false}
          // allowDownload={false}
          maxUploadNum={1}
          allowUpload={false}
          serviceHost='/edm-service'
          uploadUrl='upload'
          attachment={attachId}
          multiple={false}
          customBatchDownloadFileName={true}
        />
      </ExtModal>
    </>
  )
}

export default PurchaseStategy