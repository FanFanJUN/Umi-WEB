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
      ...error,
      message: '请求异常，请联系管理员'
    })
  })
}


// 下载导入模板
export const donwloadExcelDataImportTemplate = params => createServiceRequest({
  path: '/seController/downloadScorerConfigTemplate',
  params,
  method: 'POST',
  responseType: 'blob'
})

// 检查导入数据
export const checkExCelData = params => createServiceRequest({
  path: '/api/scorerConfigService/checkImportData',
  params,
  method: 'POST'
})

// 保存导入的数据
export const saveExcelData = params => createServiceRequest({
  path: '/api/scorerConfigService/saveList',
  params,
  method: 'POST'
})

// 删除数据
export const removeData = params => createServiceRequest({
  path: '/api/scorerConfigService/deleteList',
  params,
  method: 'POST'
})

// 导出数据
export const exportData = params => createServiceRequest({
  path: '/seController/exportScorerConfig',
  params,
  method: 'POST',
  responseType: 'blob'
})