import { request } from '@/utils';
import { psBaseUrl, gatewayUrl, basicUrl } from '@/utils/commonUrl';
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = psBaseUrl
  } = option
  const URI = `${base}${url}`
  return request({
    url: URI,
    method,
    headers,
    data,
    params: method === 'GET' ? data : null
  })
}

// 获取采购策略列表数据源
export const queryStrategyTableList = params => createServiceRequest({
  path: '/purchaseStrategyHeader/listByPage',
  params
})

// 删除采购策略
export const removeStrategyTableItem = params => createServiceRequest({
  path: '/purchaseStrategyHeader/deleteBatch',
  params
})

// 保存采购策略

export const savePurchaseStrategy = params => createServiceRequest({
  path: '/purchaseStrategyHeader/saveVo',
  params
})

// 采购策略保存并提交审核
export const savePurcahseAndApprove = params => createServiceRequest({
  path: '/purchaseStrategyHeader/saveAndApprove',
  params
})

// 变更采购策略保存并提交审核
export const changePurchaseAndApprove = params => createServiceRequest({
  path: '/purchaseStrategyHeader/changeAndApprove',
  params
})

export const changeEditorAndApprove = params => createServiceRequest({
  path: '/purchaseStrategyHeader/changeEditOnApprove',
  params
})

// 采购策略行创建
export const strategyTableCreateLine = params => createServiceRequest({
  path: '/purchaseStrategyDetail/check',
  params
})

// 保存批量导入采购策略行
export const saveStrategyTableImportData = params => createServiceRequest({
  path: '/purchaseStrategyDetail/importFromExcel',
  params
})

// 关联创建行附件
export const strategyTableLineRelevanceDocment = (params) => createServiceRequest({
  path: '/purchaseStrategyHeader/submitBusinessInfos',
  params
})

// 通过ID查询采购策略详情
export const findStrategyDetailById = params => createServiceRequest({
  path: '/purchaseStrategyHeader/findEditVo',
  params
})

// 采购策略整单作废/取消作废
export const changeOwnInvalidState = params => createServiceRequest({
  path: '/purchaseStrategyHeader/invalidOrCancel',
  params
})

// 采购策略标的物行作废
export const changeLineInvalidState = params => createServiceRequest({
  path: '/purchaseStrategyDetail/invalidOrCancel',
  params
})

// 变更历史、审核历史界面获取流程id
// 通过采购策略列表code，查询流程id (businessKey)
export const getBusinessKeyByListCode = params => createServiceRequest({
  path: '/purchaseStrategyHeader/findFlowIdByPurchaseStrategyCode',
  params,
  method: 'GET'
})

// 通过采购策略列表ID，查询流程ID
export const getBusinessKeyByListId = params => createServiceRequest({
  path: '/purchaseStrategyHeader/approve',
  params,
  method: 'GET'
})

// 根据流程id查询采购策略Vo
export const getPurchaseStrategyVoByFlowId = params => createServiceRequest({
  path: '/purchaseStrategyHeader/findVoByFlowId',
  params,
  method: 'GET'
})

// 删除采购策略变更历史
export const removePurchaseStrategyChangeHistory = params => createServiceRequest({
  path: '/purchaseStrategyModifyHeader/deleteChange',
  params,
  method: 'GET'
})

// 变更策略审批获取Vo参数
export const getPurchaseStrategyChangeVoByFlowId = params => createServiceRequest({
  path: '/purchaseStrategyHeader/findChangeVoByFlowId',
  params,
  method: 'GET'
})

// 变更明细下载excel
export const downloadExcelForChangeParams = params =>
  request({
    url: `${psBaseUrl}/purchaseStrategyHeader/exportData`,
    method: 'POST',
    data: params,
    responseType: 'blob'
  })

// 采购策略批量上传模板下载
export const downloadExcelDataImportTemplate = params =>
  request({
    url: `${psBaseUrl}/purchaseStrategyDetail/downloadTemplate`,
    data: params,
    method: 'POST',
    responseType: 'blob'
  })

// 获取当前用户联系方式
export const getUserPhoneNumberForAccount = params => createServiceRequest({
  path: `${basicUrl}/userProfile/findPersonalSettingInfo`,
  params,
  method: 'GET',
  base: gatewayUrl
})