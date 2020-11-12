import { request } from '@/utils';
import { smBaseUrl,recommendUrl} from '@/utils/commonUrl';
import { BASE_URL,FLOW_HOST } from '../utils/constants';
import {convertDataToFormData} from '../utils'
import { utils} from 'suid';
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

// 认定阶段保存

export const MasterdataSave = params => {
  return request({
      url: `${recommendUrl}/api/samPhysicalIdentificationStageService/save`,
      data:params,
      method: 'POST',
  })
}
// 阶段删除
export const deleteBatchByLeftId = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${recommendUrl}/api/samPhysicalIdentificationStageService/deleteSanPhyStageId`,
    params,
    method: 'POST',
  })
};

// 任务保存
export const TaskdataSave = params => {
  return request({
      url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/save`,
      data:params,
      method: 'POST',
  })
}

// 任务删除
export const deleteRightId = (params) => {
  return request({
    //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/delete`,
    params,
    method: 'DELETE',
    hack: true
  })
};