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
    params: method === 'GET' ? data : hack ? data : null
  }).catch(error => {
    return ({
      message: '请求异常，请联系管理员',
      ...error,
    })
  })
}

// 保存评价项目
export const saveAppraiseProject = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/saveEvaluationProject',
  params,
  method: 'POST'
})

// 删除评价项目
export const removeAppraiseProject = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/deleteEvaluationProject',
  params,
  method: 'DELETE',
  hack: true
})

// 通过id查询评价体系
export const findListById = params => createServiceRequest({
  path: '/api/supplierEvlSysRuleService/findListBySystemId',
  params,
  method: 'POST',
  base: '/srm-baf-web',
  hack: true
})

// 通过业务单元或业务板块id获取数据
export const findByBuCodeOrBgCode = params => createServiceRequest({
  path: '/api/buCompanyPurchasingOrganizationService/findByBuCodeOrBgCode',
  params,
  method: 'GET',
  base: '/srm-baf-web'
})

// 通过业务单元或业务板块code获取结束时间
export const findDateForBuCodeOrBgCode = params => createServiceRequest({
  path: '/api/bmBuContactService/findEffectiveEndDateByBuOrBgCode',
  params,
  method: 'GET',
  base: '/srm-baf-web'
})

// 通过id获取评价项目
export const findAppraiseById = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/findEvaluationProjectById',
  params,
  method: 'GET'
})

// 查询当前需要分配评审人的评价项目
export const findScoreById = params => createServiceRequest({
  path: '/api/seScorerService/findScorerByEvaluationProjectId',
  params,
  method: 'GET'
})

// 导出评价项目评审人分配表
export const exportEvlProjectScorer = params => createServiceRequest({
  path: '/seController/exportEvlProjectScorer',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 导入评价项目评审人分配表
export const importEvlProjectScorer = params => createServiceRequest({
  path: '/seController/importEvlProjectScorer',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 发起评价
export const sponsorAppraise = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/publishEvaluationProject',
  params,
  method: 'POST',
  hack: true,
  timeout: 0
})

// 撤回评价
export const withdrawAppraise = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/withdrawEvaluationProject',
  params,
  method: 'POST',
  hack: true
})

// 生成评价结果
export const generateResult = params => createServiceRequest({
  path: '/api/seEvaluationProjectService/generateEvaluationResult',
  params,
  method: 'POST',
  hack: true,
  timeout: 0
})

// 评价结果采购小组审批导出
export const evaluateResultTeamExport = params => createServiceRequest({
  path: '/seController/exportEvlResultPurchaseTeam',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})
// 评价结果采购小组审批导入
export const evaluateResultTeamImport = params => createServiceRequest({
  path: '/seController/importEvlResultPurchaseTeam',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
// 评价结果采购小组审批导出
export const evaluateResultLeaderExport = params => createServiceRequest({
  path: '/seController/exportEvlResultLeader',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})
// 评价结果采购小组审批导入
export const evaluateResultLeaderImport = params => createServiceRequest({
  path: '/seController/importEvlResultLeader',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})

// 评价结果导出
export const exportAppraiseResult = params => createServiceRequest({
  path: '/seController/exportEvaluationResult',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})