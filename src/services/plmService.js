import { request } from '@/utils';
import { smBaseUrl, baseUrl, gatewayUrl, recommendUrl } from '@/utils/commonUrl';
import { BASE_URL, FLOW_HOST } from '../utils/constants';
import { convertDataToFormData } from '../utils'
import { utils } from 'suid';
import httpUtils from '../utils/FeatchUtils'
const { storage } = utils;
const authorizations = storage.sessionStorage.get("Authorization");
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

// PLM主数据-保存
export const MasterdataSave = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierBusinessUnitService/save`,
        data: params,
        method: 'POST',
    })
}
// PLM主数据-删除
export const PLMSupplierDelete = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierBusinessUnitService/deleteById`,
        params,
        method: 'POST',
        hack: true
    })
}
// PLM主数据-冻结
export const MasterfrozenList = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierBusinessUnitService/frozen`,
        params,
        method: 'POST',
        hack: true
    })
}
// PLM主数据查询验证
export const MasterdataList = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierBusinessUnitService/findByPage`,
        data: params,
        method: 'POST',
    })
}
// 导入效验
export const Importvalidity = params => createServiceRequest({
    path: '/api/smPcnChangesService/importSmPcnChanges',
    params,
})


// PLM系统明细表-保存
export const SystemdataSave = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierPlmService/save`,
        data: params,
        method: 'POST',
    })
}
// PLM系统明细表-删除
export const SystemDelete = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierPlmService/deleteById`,
        params,
        method: 'POST',
        hack: true
    })
}
// PLM系统明细表-同步
export const SynchronizationList = params => {
    return request({
        url: `${smBaseUrl}/api/bafSupplierPlmService/publishPlm`,
        params,
        method: 'POST',
        hack: true
    })
}
// PLM系统明细表-导出
export const SynchronizationExportt = params => {
    return request({
        url: `${smBaseUrl}/bafsupplierplm/exportSupplierPlm`,
        data: params,
        method: 'POST',
        // hack: true,
        responseType: 'blob'
    })
}
