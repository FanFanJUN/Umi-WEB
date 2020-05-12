import React, { useState, useRef } from 'react';
import { ExtTable, utils } from 'suid';
import { Input, Button, Modal, message } from 'antd';
import Header from '@/components/Header';
import AdvancedForm from '@/components/AdvancedForm';
import { psBaseUrl } from '@/utils/commonUrl';
import { leftPad, downloadBlobFile } from '../../utils';
import {
  downloadExcelForChangeParams
} from '@/services/strategy'
import { ComboAttachment } from '@/components';
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
  effectStatusProps,
  priceCombineProps
} from '@/utils/commonProps';
import styles from './index.less';
const { Search } = Input;
function PurchaseStrategyExecute() {
  const headerRef = useRef(null)
  const tableRef = useRef(null)
  const [searchValue, setSearchValue] = useState({});
  const [attachId, setAttachId] = useState('');
  const [showAttach, triggerShowAttach] = useState(false);
  const [tableFilters, setTableFilters] = useState([]);
  const columns = [
    {
      title: '采购策略编号',
      dataIndex: 'code'
    },
    {
      title: '行号',
      dataIndex: 'lineNo',
      render(text) {
        return leftPad(text, 4, '0')
      }
    },
    {
      title: '行状态',
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
      title: '是否作废',
      dataIndex: 'invalid',
      render(invalid) {
        return invalid ? '是' : '否'
      },
      width: 80,
    },
    { title: '物料级别', dataIndex: 'materialLevelName' },
    { title: '物料分类', dataIndex: 'materialClassificationName' },
    { title: '适应范围', dataIndex: 'adjustScope' },
    { title: '策略周期开始日期', dataIndex: 'purchaseStrategyBegin' },
    { title: '策略周期结束日期', dataIndex: 'purchaseStrategyEnd' },
    {
      title: '预计需求规模(数量)',
      dataIndex: 'expectedDemandScaleAmount'
    },
    {
      title: '预计需求规模(数量)',
      dataIndex: 'expectedDemandScalePrice'
    },
    { title: '币种', dataIndex: 'currencyName' },
    {
      title: '采购方式',
      dataIndex: 'purchaseTypeName'
    },
    {
      title: '规划供应资源数量',
      dataIndex: 'planSupplyResourceAmountName',
      width: 150
    },
    {
      title: '价格组成',
      dataIndex: 'priceCombineName'
    },
    {
      title: '定价频次',
      dataIndex: 'pricingFrequencyName'
    },
    {
      title: '定价时间',
      dataIndex: 'pricingTime'
    },
    {
      title: '市场运行情况',
      dataIndex: 'runningOperation'
    },
    {
      title: '资源保障情况',
      dataIndex: 'resourceOperation'
    },
    {
      title: '成本目标',
      dataIndex: 'costTargetName'
    },
    {
      title: '成本控制方式',
      dataIndex: 'costControlWay'
    },
    {
      title: '库存控制方式',
      dataIndex: 'storageControlWay'
    },
    {
      title: '供应商选择原则',
      dataIndex: 'supplierSelectRule'
    },
    {
      title: '供应商合作方式',
      dataIndex: 'supplierCooperationWay'
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      render: (text) => {
        return !!text ? <Button onClick={() => {
          setAttachId(text)
          triggerShowAttach(true)
        }}>查看附件</Button> : '无'
      }
    }
  ].map(_ => ({ ..._, align: 'center' }))
  const tableProps = {
    store: {
      url: `${psBaseUrl}/purchaseStrategyHeader/findPurchaseStrategyExecuteDetailByPage`,
      params: {...searchValue, filters: tableFilters },
      type: 'POST'
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
      title: '物料分类',
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
      title: '价格组成',
      type: 'select',
      key: 'Q_LK_priceCombine',
      props: priceCombineProps
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
    const filters = keys.map((item)=> {
      const [_, operator, fieldName, isName] = item.split('_');
      return {
        fieldName,
        operator,
        value: !!isName ? undefined : v[item]
      }
    }).filter(item=> !!item.value)
    setTableFilters(filters);
    uploadTable()
    headerRef.current.hide()
  }
  function uploadTable() {
    tableRef.current.remoteDataRefresh()
  }
  async function downloadExcelForPamras() {
    message.loading()
    const { success, data, message: msg } = await downloadExcelForChangeParams(searchValue);
    message.destroy()
    if(success) {
      message.success(msg)
      downloadBlobFile(data, '采购策略执行明细.xlsx')
      return
    }
    message.error(msg)
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  return (
    <>
      <Header
        left={
          <>
            <Button onClick={downloadExcelForPamras} className={styles.btn}>导出Excel</Button>
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
          <AdvancedForm
            formItems={formItems}
            onOk={handleAdvnacedSearch}
            type='primary'
          />
        }
        advanced
        advancedProps={{
          type: 'primary'
        }}
        ref={headerRef}
      />
      <ExtTable
        columns={columns}
        showSearch={false}
        ref={tableRef}
        rowKey={(item) => item.id}
        checkbox={false}
        remotePaging={true}
        ellipsis={false}
        {...tableProps}
      />
      <Modal
        visible={showAttach}
        onCancel={hideAttach}
        footer={
          <Button type='ghost' onClick={hideAttach}>关闭</Button>
        }
      >
        <ComboAttachment
          allowPreview={false}
          allowDelete={false}
          showViewType={false}
          uploadButton={{
            disabled: true
          }}
          serviceHost='/edm-service'
          uploadUrl='upload'
          multiple={false}
          attachment={attachId}
          customBatchDownloadFileName={true}
        />
      </Modal>
    </>
  )
}

export default PurchaseStrategyExecute