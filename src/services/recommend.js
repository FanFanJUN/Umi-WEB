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
    url: URI,
    method,
    headers,
    data,
    params: method === 'GET' ? data : hack ? data : null
  }).catch(error => {
    return ({
      ...error,
      message: '请求异常，请联系管理员'
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