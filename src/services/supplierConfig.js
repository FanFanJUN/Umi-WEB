import { request } from '@/utils';
import { smBaseUrl,baseUrl} from '@/utils/commonUrl';
import { FLOW_HOST } from '../utils/constants';
import {convertDataToFormData} from '../utils'
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
      ...error,
      message: '请求异常，请联系管理员'
    })
  })
}
// 供应商注册字段配置表保存
// export const SaveSupplierRegister = params =>
//   request({
//     url: `${smBaseUrl}/SmSupplierConfig/saveVo`,
//     method: 'POST',
//     data: convertDataToFormData(params),
//     responseType: 'blob'
//   })
export const SaveSupplierRegister = params => createServiceRequest({
  path: '/api/SmSupplierConfigService/saveSmSupplierConfig',
  params
})
// 供应商注册字段配置表删除
export const DetailSupplierRegister = params =>
  request({
    headers:{'content-type': 'application/json'},
    url: `${smBaseUrl}/api/SmSupplierConfigService/deleteId`,
    data: params,
    method: 'POST',
    //responseType: 'blob'
  })
// 供应商注册配置表字段查询
export const findSupplierconfigureService = params => createServiceRequest({
  path: '/api/SmSupplierConfigService/findByPage',
  params,
})

// 供应商注册配置表ID查询
// export const findSupplierconfigureId = params => createServiceRequest({
//   path: '/api/SmSupplierRegConfigService/findByregConfId',
//   params,
//   hack: true
// })
export const findSupplierconfigureId = params =>
  request({
    headers:{'content-type': 'application/json'},
    url: `${smBaseUrl}/api/SmSupplierRegConfigService/findByRegConfId`,
    data: params,
    method: 'POST',
    //responseType: 'blob'
  })
// 供应商注册配置表字段查询
export const SaveSupplierconfigureService = params => createServiceRequest({
  path: '/api/SmSupplierRegConfigService/saveRegConfigVo',
  params,
})
