import { useState, useEffect } from 'react';
import { queryDataFillStatus } from '../services/recommend'

export function useGlobalStatus(supplierRecommendDemandId) {
  const [status, changeStatus] = useState({
    // 自评
    selfEvaluation: false,
    // 资料填报
    informationFilling: false,
    // 基本情况
    baseInfo: false,
    // 销售情况
    salesSituation: false,
    // 研发能力
    rdCapability: false,
    // 质量能力
    qualityCapability: false,
    // 供应链管理能力
    supplyChainCapability: false,
    // 制造能力
    manufacturingCapacity: false,
    // 产品有害物
    productHazards: false,
    // 合作意愿
    willingnessToCooperate: false,
    // 企业社会责任
    socialResponsibility: false,
    // 企业生产环境
    productionEnvironment: false,
    // 其他附加资料
    otherInformation: false,
    // 报价单及成本分析表
    quotationCostAnalysis: false,
  });
  async function updateGlobalStatus() {
    const { data, success } = await queryDataFillStatus({ supplierRecommendDemandId })
    if (success) {
      const {
        id,
        recommendDemandId,
        tenantCode,
        display,
        ...statuses
      } = data;
      changeStatus(statuses)
    }
  }
  useEffect(() => {
    updateGlobalStatus()
  }, [])
  return [status, updateGlobalStatus]
}

export function useTableProps() {
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const [onlyMe, setOnlyMe] = useState(true);
  const [loading, toggleLoading] = useState(false);
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  return [
    {
      selectedRowKeys,
      selectedRows,
      searchValue,
      dataSource,
      onlyMe,
      loading,
    },
    {
      setRowKeys,
      setRows,
      setDataSource,
      handleSelectedRows,
      setSearchValue,
      setOnlyMe,
      toggleLoading
    }
  ]
}