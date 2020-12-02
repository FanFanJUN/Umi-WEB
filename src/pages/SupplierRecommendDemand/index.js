/**
 * 实现功能： 供应商推荐需求管理
 * @author hezhi
 * @date 2020-09-23
 */
import {
  useState,
  useRef,
  useEffect
} from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout, AdvancedForm } from '../../components'
import { ExtTable, utils, WorkFlow } from 'suid';
import { Button, Input, Checkbox, Modal, message } from 'antd';
import { commonProps, commonUrl, openNewTab, getFrameElement } from '../../utils';
import { removeSupplierRecommendDemand, submitToSupplier } from '../../services/recommend';
import { stopApproveingOrder } from '../../services/supplier';
const { Search } = Input;
const { StartFlow, FlowHistoryButton } = WorkFlow;
const { storage } = utils;
const { recommendUrl } = commonUrl;
const { corporationProps, materialClassProps, statusProps, flowStatusProps } = commonProps

const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
export default () => {
  const headerRef = useRef(null);
  const tableRef = useRef(null);
  // const [dataSource, setDataSource] = useState([]);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [onlyMe, setOnlyMe] = useState(true);
  const FRAMELEEMENT = getFrameElement();
  const [signleRow = {}] = selectedRows;
  const { account } = storage.sessionStorage.get("Authorization") || {};
  const { flowStatus: signleFlowStatus, id: flowId, supplierRecommendDemandStatus } = signleRow;
  // 已提交审批状态
  const underWay = signleFlowStatus !== 'INIT';
  // 审核完成状态
  const completed = signleFlowStatus === 'COMPLETED';
  // 填报完成状态
  const fillComplete = signleFlowStatus === 'FILLED';
  // 未提交填报状态
  const fillInit = supplierRecommendDemandStatus === 'DRAFT'
  // 未选中数据状态
  const empty = selectedRowKeys.length === 0;
  const tableProps = {
    store: {
      url: `${recommendUrl}/api/supplierRecommendDemandService/findByPage`,
      params: {
        ...searchValue,
        filters: searchValue.filters ?
          searchValue.filters.concat([{
            fieldName: 'creatorAccount',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }]) : [{
            fieldName: 'creatorAccount',
            operator: 'EQ',
            value: onlyMe ? account : undefined
          }],
        quickSearchProperties: ['supplierName', 'docNumber'],
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
  const left = (
    <>
      <Button className={styles.btn} type='primary' onClick={handleCreate}>新增</Button>
      <Button className={styles.btn} disabled={empty || underWay} onClick={handleEditor}>编辑</Button>
      <Button className={styles.btn} disabled={empty || !fillInit || underWay} onClick={handleRemove}>删除</Button>
      <Button className={styles.btn} disabled={empty || underWay || !fillInit} onClick={handleSubmitSupplierFillIn}>提交供应商填报</Button>
      <Button className={styles.btn} disabled={empty} onClick={handleOpenInfomationConfirm}>填报信息确认</Button>
      {/* <Button className={styles.btn} disabled={empty || !fillComplete}>提交审核</Button> */}
      <StartFlow
        businessModelCode='com.ecmp.srm.sam.entity.srd.SupplierRecommendDemand'
        businessKey={flowId}
        startComplete={uploadTable}
      >
        {
          loading => <Button className={styles.btn} loading={loading} disabled={empty || underWay || completed}>提交审核</Button>
        }
      </StartFlow>
      <FlowHistoryButton
        businessId={flowId}
        flowMapUrl='flow-web/design/showLook'
        ignore={DEVELOPER_ENV}
        key='SUPPLIER_RECOMMEND_APPROVE_HISTORY'
      >
        <Button className={styles.btn} disabled={empty || !fillComplete}>审核历史</Button>
      </FlowHistoryButton>
      <Button className={styles.btn} disabled={empty || !underWay} onClick={stopApprove}>审核终止</Button>
      <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe}>仅我的</Checkbox>
    </>
  )
  const right = (
    <>
      <Search
        placeholder='需求单号或供应商名称'
        allowClear
        onSearch={handleQuickSerach}
      />
    </>
  )
  const columns = [
    {
      title: '单据状态',
      dataIndex: 'supplierRecommendDemandStatusRemark',
    },
    {
      title: '审批状态',
      dataIndex: 'flowStatus',
      render(text) {
        switch (text) {
          case 'INIT':
            return '未提交审批'
          case 'INPROCESS':
            return '审批中'
          case 'COMPLETED':
            return '审批完成'
          default:
            return ''
        }
      }
    },
    {
      title: '需求单号',
      dataIndex: 'docNumber'
    },
    {
      title: '供应商代码',
      dataIndex: 'supplierCode'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '原厂代码',
      dataIndex: 'originFactoryName'
    },
    {
      title: '原厂名称',
      dataIndex: 'originFactoryCode'
    },
    {
      title: '物料分类',
      dataIndex: 'materialCategoryName'
    },
    {
      title: '申请公司',
      dataIndex: 'corporationName',
      width: 180
    },
    {
      title: '创建部门',
      dataIndex: 'orgName',
      width: 180
    },
    {
      title: '创建人员',
      dataIndex: 'creatorName'
    },
    {
      title: '创建时间',
      dataIndex: 'createdDate'
    }
  ].map(item => ({ ...item, align: 'center' }));
  const formItems = [
    {
      title: '需求单号',
      key: 'Q_LK_docNumber',
      props: {
        placeholder: '请输入采购单号'
      }
    },
    {
      title: '申请公司',
      key: 'Q_EQ_purchaseCompanyCode',
      type: 'list',
      props: {
        ...corporationProps,
        placeholder: '请选择申请公司'
      }
    },
    {
      title: '供应商名称',
      key: 'Q_LK_supplierName',
      props: {
        placeholder: '请输入供应商名称'
      }
    },
    {
      title: '原厂名称',
      key: 'Q_LK_originName',
      props: {
        placeholder: '请输入原厂名称'
      }
    },
    {
      title: '物料分类',
      key: 'Q_EQ_materialClassificationCode',
      type: 'tree',
      props: materialClassProps
    },
    {
      title: '物料认定类别',
      key: 'Q_EQ_materialConfirmCode',
      props: {
        placeholder: '选择物料认定类别'
      }
    },
    {
      title: '创建人',
      key: 'Q_LK_creatorName',
      props: {
        placeholder: '请输入创建人'
      }
    },
    {
      title: '单据状态',
      key: 'Q_EQ_status',
      type: 'list',
      props: {
        ...statusProps,
        placeholder: '选择单据状态'
      }
    },
    {
      title: '审批状态',
      key: 'Q_EQ_flowStatus',
      type: 'list',
      props: flowStatusProps
    },
  ];
  // 处理新增页签打开
  function handleCreate() {
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/demand/create?frameElementId=${id}&frameElementSrc=${pathname}`, '新增供应商推荐需求', false)
  }
  // 处理编辑页签打开
  function handleEditor() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/demand/editor?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}`, '编辑供应商推荐需求', false)
  }

  // 填报信息确认页签打开
  function handleOpenInfomationConfirm() {
    const [key] = selectedRowKeys;
    const { id = '' } = FRAMELEEMENT;
    const { pathname } = window.location;
    openNewTab(`supplier/recommend/fillIn/infomation/confirm?id=${key}&frameElementId=${id}&frameElementSrc=${pathname}&type=detail`, '填报信息确认', false)
  }

  // 处理删除
  async function handleRemove() {
    const [key] = selectedRowKeys;
    Modal.confirm({
      title: '删除供应商推荐需求',
      content: '删除后无法恢复，确定要删除当前所选数据？',
      onOk: async () => {
        const { success, message: msg } = await removeSupplierRecommendDemand({
          supplierRecommendDemandId: key
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
  // 高级查询
  function handleAdvnacedSearch(v) {
    const keys = Object.keys(v);
    const filters = keys.map((item) => {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item => !!item.value)
    setSearchValue({
      filters: filters
    })
    uploadTable()
    headerRef.current.hide()
  }
  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    tableRef.current.manualSelectedRows([])
    setRowKeys([])
  }
  // 快速搜索
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v
    })
    uploadTable()
  }
  // 切换仅查看我
  function handleOnlyMeChange(e) {
    setOnlyMe(e.target.checked)
    uploadTable()
  }
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  // 终止审核
  function stopApprove() {
    Modal.confirm({
      title: '终止审批流程',
      content: '流程终止后无法恢复，是否继续？',
      onOk: handleStopApproveRecord,
      okText: '确定',
      cancelText: '取消'
    })
  }
  // 审核终止
  async function handleStopApproveRecord() {
    const { success, message: msg } = await stopApproveingOrder({
      businessId: flowId
    })
    if (success) {
      message.success(msg)
      uploadTable()
      return
    }
    message.error(msg)
  }
  // 提交供应商填报
  function handleSubmitSupplierFillIn() {
    Modal.confirm({
      title: '提交供应商填报',
      content: '是否提交当前选中数据',
      onOk: async () => {
        const { success, message: msg } = await submitToSupplier({
          supplierRecommendDemandId: flowId
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
      tableRef.current.remoteDataRefresh()
    }
  }
  useEffect(() => {
    window.parent.frames.addEventListener('message', listenerParentClose, false);
    return () => window.parent.frames.removeEventListener('message', listenerParentClose, false)
  }, [])
  return (
    <div>
      <Header
        left={left}
        right={right}
        content={
          <AdvancedForm formItems={formItems} onOk={handleAdvnacedSearch} />
        }
        advanced
        ref={headerRef}
      />
      <AutoSizeLayout>
        {
          (h) => (
            <ExtTable
              columns={columns}
              bordered
              size='small'
              height={h}
              ref={tableRef}
              showSearch={false}
              rowKey={item => item.id}
              checkbox={{ multiSelect: false }}
              allowCancelSelect
              ellipsis={false}
              remotePaging
              selectedRowKeys={selectedRowKeys}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
          )
        }

      </AutoSizeLayout>
    </div>
  )
}
