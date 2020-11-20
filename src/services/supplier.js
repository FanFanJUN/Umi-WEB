import { request } from '../utils';
import { smBaseUrl, gatewayUrl } from '../utils/commonUrl';
import { FLOW_HOST } from '../utils/constants';
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = smBaseUrl,
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
      message: '请求异常，请联系管理员',
      ...error,
    })
  })
}

// 获取供应商采购会计视图变更列表
export const queryChangeAccountantList = params => createServiceRequest({
  path: '/supplierFinanceViewModify/listByPage',
  params
})

// 保存新增
export const saveViewModify = params => createServiceRequest({
  path: '/api/supplierFinanceViewModifyService/saveSupplierFinanceViewModify',
  params
})

// 删除
export const removeViewModify = params => createServiceRequest({
  path: '/supplierFinanceViewModify/deleteSupplierFinanceViewModify',
  params,
  hack: true
})

// 获取明细
export const queryViewModifyDetail = params => createServiceRequest({
  path: '/supplierFinanceViewModify/getSupplierFinanceViewModifyById',
  params,
  hack: true
})

// 终止审批流程
export const stopApproveingOrder = params =>
createServiceRequest({
  path: `${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`,
  params,
  base: gatewayUrl,
  hack: true
})