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

// 新增查询推荐准入基本信息
export const queryRecommendAccessFromRecommendDemand = params => createServiceRequest({
  path: '/api/recommendAccessService/getRecommendAccessFromRecommendDemand',
  params,
  method: 'POST'
})

// 保存推荐准入单
export const saveRecommendAccess = params => createServiceRequest({
  path: '/api/recommendAccessService/saveRecommendAccess',
  params,
  method: 'POST'
})

// 查询推荐准入单
export const queryRecommendAccess = params => createServiceRequest({
  path: '/api/recommendAccessService/findRecommendAccessById',
  params,
  method: 'GET'
})

// 删除推荐准入
export const removeRecommendAccess = params => createServiceRequest({
  path: '/api/recommendAccessService/deleteRecommendAccess',
  params,
  method: 'DELETE',
  hack: true
})

// 流程中更新是否需要供应商审核
export const updateNeedExamine = params => createServiceRequest({
  path: '/api/recommendAccessService/updateNeedExamine',
  params,
  method: 'POST',
  hack: true
})

// 流程中更新是否准入
export const updateAccess = params => createServiceRequest({
  path: '/api/recommendAccessService/updateAccess',
  params,
  method: 'POST'
})