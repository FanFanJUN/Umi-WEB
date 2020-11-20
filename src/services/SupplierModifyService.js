import { request } from '@/utils';
import { smBaseUrl,baseUrl,gatewayUrl} from '@/utils/commonUrl';
import { BASE_URL,FLOW_HOST } from '../utils/constants';
import {convertDataToFormData} from '../utils'
import httpUtils from '../utils/FeatchUtils'
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
// 变更新增列表

export const findCanChooseSupplier = (params) => {
    return request({
      headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      url: `${smBaseUrl}/supplierModify/findCanChooseSupplier`,
      params,
      method: 'POST',
    })
  };
// 删除
export const deleteSupplierModify = (params) => {
    return request({
      headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      url: `${smBaseUrl}/supplierModify/deleteSupplierModify`,
      params,
      method: 'POST',
    })
  };
// 供应商变更暂存
export const TemporarySupplierRegister = params => createServiceRequest({
    path: '/api/supplierChangeService/saveRequest',
    params
})
// 供应商变更保存效验
// export const checkExistUnfinishedValidity = (params) => {
//     return request({
//       headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//       url: `${smBaseUrl}/api/supplierChangeService/checkExistUnfinished`,
//       params,
//       method: 'POST',
//     })
//   };
  export const checkExistUnfinishedValidity = params => createServiceRequest({
    path: '/api/supplierChangeService/checkExistUnfinished',
    params,
    method: 'GET',
})
// // 供应商变更保存
// export const saveSupplierRegister = params => createServiceRequest({
//     path: '/api/supplierChangeService/saveSupplierModify',
//     params
// })
// 查询供应商变更信息明细  
export const findByRequestIdForModify = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierModify/findByRequestId`,
    params,
    method: 'POST',
  })
};
// 变更明细 
export const findSupplierModifyHistroyList = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierModifyHistroy/findSupplierModifyHistroyList`,
    params,
    method: 'POST',
  })
};
 // 变更审批供应商流程保存
 export const saveLietInFlow = params => {
  return request({
   //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
   url: `${smBaseUrl}/supplierAgentBackups/saveAgentBackupInFlow`,
   data: convertDataToFormData(params),
   method: 'POST',
 })
}
// 选择可变更的供应商列表
export const findCanModifySupplierList = params => createServiceRequest({
  path: '/supplierModify/findCanChooseSupplier',
  params
})
// 保存效验
export const ValiditySupplierRegister = params => createServiceRequest({
  path: '/api/supplierChangeService/checkBySave',
  params
})