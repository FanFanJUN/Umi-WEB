import { request } from '@/utils';
import { supplierManagerBaseUrl} from '@/utils/commonUrl';
import { FLOW_HOST } from '../utils/constants';
import {convertDataToFormData} from '../utils'
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = supplierManagerBaseUrl,
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
// 供应商注册字段配置表保存
export const SaveSupplierRegister = params =>
  request({
    url: `${supplierManagerBaseUrl}/SmSupplierConfig/saveVo`,
    method: 'POST',
    data: convertDataToFormData(params),
    responseType: 'blob'
  })
// 供应商注册字段配置表删除
export const DetailSupplierRegister = params => createServiceRequest({
  path: '/SmSupplierConfig/deleteId',
  params
})
// 供应商注册配置表保存
export const SaveSupplierconfigure = params => createServiceRequest({
  path: `${supplierManagerBaseUrl}/SmSupplierConfig/listByPage`,
  params,
})
