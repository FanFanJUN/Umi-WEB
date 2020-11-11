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

// PCN主数据-保存

export const MasterdataSave = params => {
    return request({
        url: `${recommendUrl}/api/samPhysicalIdentificationStageService/save`,
        data:params,
        method: 'POST',
    })
  }

