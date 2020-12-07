import { request } from '../utils';
import { recommendUrl } from '../utils/commonUrl';
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = recommendUrl,
    // 处理未按标准post请求处理接收参数的接口
    // 后端获取参数不是从post请求的body中获取，而是从url params中获取参数的接口将hack设置为true
    hack = false
  } = option
  const URI = `${base}${url}`
  return request({
    ...option,
    url: URI,
    method,
    headers,
    data,
    params: method === 'GET' ? data : hack ? data : null,
  }).catch(error => {
    return ({
      message: '请求异常，请联系管理员',
      ...error,
    })
  })
}

// 保存推荐需求
export const saveSupplierRecommendDemand = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/saveSupplierRecommendDemand',
  params
})

// 查询推荐需求明细
export const querySupplierRecommendDemand = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/findSupplierRecommendDemandById',
  params,
  method: 'GET'
})

// 删除推荐需求
export const removeSupplierRecommendDemand = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/deleteSupplierRecommendDemand',
  params,
  method: 'DELETE',
  hack: true
})

// 提交供应商填报
export const submitToSupplier = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/submitToSupplier',
  params,
  method: 'POST',
  hack: true
})

// 供应商填报提交
export const supplierSubmitToSystem = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/submitSupplierFilledInfo',
  params,
  method: 'POST',
  hack: true
})

// 企业社会责任及企业生产环境表单主数据
// 保存
export const saveCsrConfig = params => createServiceRequest({
  path: '/api/csrConfigService/save',
  params,
  method: 'POST',
  // hack: true
})
// 删除
export const removeCsrConfig = params => createServiceRequest({
  path: '/api/csrConfigService/delete',
  params,
  method: 'DELETE',
  hack: true
})

// 填表状态获取
export const queryGlobalState = params => createServiceRequest({
  path: '/api/reportingStatusService/findReportingStatusByRecommendDemandId',
  params,
  method: 'GET'
})

// 自评表获取
export const querySelfAssessment = params => createServiceRequest({
  path: '/api/samSupplierEvlSystemService/findSelfEvlRules',
  params,
  method: 'GET'
})

// 自评评分保存
export const saveSelfAssessment = params => createServiceRequest({
  path: '/api/samSupplierEvlSystemService/saveSelfEvlRuleScore',
  params,
  method: 'POST'
})

// 填报状态获取
export const queryDataFillStatus = params => createServiceRequest({
  path: '/api/reportingStatusService/findReportingStatusByRecommendDemandId',
  params,
  method: 'GET'
})

// 企业社会责任填报主数据获取
export const queryCSRorEPEData = params => createServiceRequest({
  path: '/api/csrProductionEnvironmentService/findCsrProductionEnvironmentByRecommendDemandId',
  params,
  method: 'POST',
  hack: true
})

// 保存企业社会责任填报
export const saveCSRorEPEData = params => createServiceRequest({
  path: '/api/csrProductionEnvironmentService/saveCsrProductionEnvironment',
  params,
  method: 'POST'
})

// 保存意见
export const saveOpinion = params => createServiceRequest({
  path: '/api/fillingOpinionService/save',
  params,
  method: 'POST'
})

// 删除意见
export const removeOpinion = params => createServiceRequest({
  path: '/api/fillingOpinionService/delete',
  params,
  method: 'DELETE',
  hack: true
})

// 提交意见
export const submitOpinion = params => createServiceRequest({
  path: '/api/fillingOpinionService/submitOpinion',
  params,
  method: 'POST',
  hack: true
})

// 保存评审小组确定的评价体系
export const queryTeamConfirm = params => createServiceRequest({
  path: '/api/samSupplierEvlSystemService/saveRecommendDemandSystemTree',
  params,
  method: 'POST',
  hack: true
})


// 保存分配评审人
export const saveTeamConfrim = params => createServiceRequest({
  path: '/api/samSupplierEvlSystemService/saveRuleJurors',
  params,
  method: 'POST'
})

// 查询已分配评审人的评价体系
export const queryTeamConfirmHistoryList = params => createServiceRequest({
  path: '/api/samSupplierEvlSystemService/findReviewEvlRuleVoByRecommendDemandId',
  params,
  method: 'GET'
})

// 导出打分项
export const exportProject = params => createServiceRequest({
  path: '/srdController/exportSelfRuleScore',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 导入打分项
export const importProject = params => createServiceRequest({
  path: '/srdController/importSelfRuleScore',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 推荐需求评审-评审打分
export const queryReviewMarkData = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/findCompareSupplierByRecommendDemandId',
  params,
  method: 'GET'
})

// 推荐需求评审-评审打分保存
export const saveReviewMarkData = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/saveReviewVo',
  params,
  method: 'POST'
})

// 推荐需求评审-导出打分项
export const exportRevieMarkData = params => createServiceRequest({
  path: '/srdController/exportReviewRuleScore',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 推荐需求评审-导入打分项
export const importRevieMarkData = params => createServiceRequest({
  path: '/srdController/importReviewRuleScore',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 推荐需求评审-获取采购小组筛选意见数据
export const queryFilterOpinion = params => createServiceRequest({
  path: '/api/compareResultService/findResultByRecommendDemandId',
  params,
  method: 'GET'
})

// 推荐需求评审-保存采购小组筛选意见数据
export const saveFilterOpinion = params => createServiceRequest({
  path: '/api/compareResultService/saveCompareResult',
  params,
  method: 'POST'
})

// 填表说明拟推荐产品
export const queryRecommendProductList = params => createServiceRequest({
  path: '/api/SupplierRecommendDemandLineService/findRecommendProductList',
  params,
  method: 'POST'
})

// 撤回供应商推荐需求
export const withdrawSupplierFilledInfo = params => createServiceRequest({
  path: '/api/supplierRecommendDemandService/withdrawSupplierFilledInfo',
  params,
  method: 'post',
  hack: true
})