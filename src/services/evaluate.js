import { request } from '../utils';
import { recommendUrl, baseUrl } from '../utils/commonUrl';
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
      ...error,
      message: '请求异常，请联系管理员'
    })
  })
}
// 导出
export const exportEvaluateData = params => createServiceRequest({
  path: '/seController/exportScoreItem',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 导入
export const importEvaluateData = params => createServiceRequest({
  path: '/seController/importScoreItem',
  params,
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})


// 保存
export const saveEvaluateData = params => createServiceRequest({
  path: '/api/seSubEvaluationProjectService/save',
  params, 
  method: 'POST'
})

// 提交审核检查
export const checkEvaluateData = params => createServiceRequest({
  path: '/api/seSubEvaluationProjectService/checkSubmitScore',
  params,
  method: 'GET'
})

// 获取基本信息
export const queryEvaluateApproveBaseDate = params => createServiceRequest({
  path: '/api/seSubEvaluationProjectService/findEvaluationProjectBySubEvlId',
  params,
  method: 'GET'
})

// 指标列表
export const queryEvaluateData = params => createServiceRequest({
  path: '/api/seSubEvaluationProjectService/findSeScoreItemBySubEvlProjectId',
  params,
  method: 'POST',
  hack: true
})

// 获取评价结果
export const queryEvaluateResultData = params => createServiceRequest({
  path: '/api/seEvaluationResultService/findResultsByEvlProjectId'
})