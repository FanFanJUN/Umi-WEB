import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils } from 'suid';
import { Input, Button, message } from 'antd';
import Header from '@/components/Header';
import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import { Upload } from '@/components';
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
} from '../../utils/commonProps';
import {
  removeStrategyTableItem
} from '@/services/strategy';
import styles from './index.less';
import classnames from 'classnames';
import Modal from 'antd/es/modal';
// const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { Search } = Input
const { StartFlow, FlowHistory } = WorkFlow;
const { authAction } = utils;
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
  const {
    state: rowState,
    approvalState: rowApprovalState,
    changeable: rowChangeable,
    flowId: businessId
  } = singleRow;
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
      render: (text) => {
        return !!text ? <Upload entityId={text} type='show' /> : '无'
      }
    },
    { title: '创建时间', dataIndex: 'createdDate', width: 200 }
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
      params: { ...searchValue },
      type: 'POST'
    }
  }
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, []);
  function listenerParentClose(event) {
    const { data = {} } = event;
    if (data.tabAction === 'close') {
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
      key: 'Q_IN_adjustScope',
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
      title: '采购物料类别',
      type: 'tree',
      key: 'Q_EQ_purchaseGoodsClassificationCode',
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
      type: 'tree',
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
      type: 'list',
      key: 'Q_EQ_pricingFrequencyCode',
      props: frequencyProps
    },
    {
      title: '成本目标',
      type: 'list',
      key: 'Q_EQ_costTarget',
      props: costTargetProps
    },
    {
      title: '关键词',
      key: "Q_LK_keyWord",
      props: {
        placeholder: '输入关键词查询'
      }
    },
    {
      title: '申请人',
      key: 'Q_LK_creatorName',
      props: {
        placeholder: '输入申请人查询'
      }
    },
    {
      title: '状态',
      type: 'list',
      key: 'Q_EQ_state',
      props: effectStatusProps
    },
    // {
    //   title: '创建时间',
    //   type: 'rangePicker',
    //   key: 'Q_GE$LE_createdDate',
    //   props: {
    //     format: "YYYY-MM-DD HH:mm:ss"
    //   }
    // }
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
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    })
    const range = filters.find(item=> Array.isArray(item.value));
    const formatRangeValues = (rs) => {
      if(!rs){
        return [{ value: undefined }]
      }
      if(rs.value && rs.value.length > 0) {
        const [begin, end] = rs.value;
        const be = begin.format('YYYY-MM-DD HH:mm:ss')
        const en = end.format('YYYY-MM-DD HH:mm:ss')
        return [
          {
            fieldName: 'createdDate',
            operator: 'GE',
            value: be,
            fieldType: 'Date'
          },
          {
            fieldName: 'createdDate',
            operator: 'LE',
            value: en,
            fieldType: 'Date'
          }
        ]
      }
      return [{ value: undefined }]
    }
    const athoerFields = formatRangeValues(range);
    const formatFields = filters.concat(athoerFields).filter(item => !!item.value && !Array.isArray(item.value));
    setSearchValue({
      filters: formatFields
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
            {
              authAction(
                <Button type='primary' ignore={true} key='PURCHASE_CREATE' className={styles.btn} onClick={handleCreate}>新增</Button>
              )
            }
            {
              authAction(
                <Button ignore={true} key='PURCHASE_EDITOR' disabled={multiple || empty || approvaling || approvalFinish} className={styles.btn} onClick={handleEditor}>编辑</Button>
              )
            }
            {
              authAction(
                <Button ignore={true} key='	
                PURCHASE_DELETE' onClick={handleRemoveItem} disabled={empty || approvaling || approvalFinish} className={styles.btn}>删除</Button>
              )
            }
            {
              authAction(
                <Button ignore={true} key='PURCHASE_DETAIL' disabled={multiple || empty} className={styles.btn} onClick={handleCheckDetail}>明细</Button>
              )
            }
            {
              authAction(
                <StartFlow
                  ignore={true}
                  beforeStart={handleBeforeStartFlow}
                  key='PURCHASE_APPROVE'
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
              )

            }
            {
              authAction(
                <Button key='PURCHASE_APPROVE_HISTORY'
                  ignore={true} disabled={multiple || empty || approvalEffect} className={styles.btn} onClick={showHistory}>审核历史</Button>
              )
            }
            {
              authAction(
                <Button key='PURCHASE_CHANGE'
                  ignore={true} disabled={multiple || empty || !takeEffect || approvaling || !approvalFinish} className={styles.btn} onClick={handleChange}>变更</Button>
              )
            }
            {
              authAction(
                <Button key='PURCHASE_CHANGE_HISTORY'
                  ignore={true} disabled={multiple || empty || !rowChangeable} className={styles.btn} onClick={handleCheckChangeHistory}>变更历史</Button>
              )
            }
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
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tableRef}
            rowKey={(item) => item.id}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectedRowKeys}
            {...tableProps}
          />
        }
      </AutoSizeLayout>
      <ExtModal
        visible={visible}
        onCancel={hideHistory}
        footer={null}
        width={'80vw'}
      >
        <FlowHistory businessId={businessId} flowMapUrl='flow-web/design/showLook' />
      </ExtModal>
      <ExtModal
        visible={showAttach}
        onCancel={hideAttach}
        footer={null}
        destroyOnClose
      >

        {/* <ComboAttachment
          allowPreview={false}
          // allowDownload={false}
          maxUploadNum={1}
          allowUpload={false}
          serviceHost='/edm-service'
          uploadUrl='upload'
          attachment={attachId}
          multiple={false}
          customBatchDownloadFileName={true}
        /> */}
      </ExtModal>
    </>
  )
}

export default PurchaseStategy