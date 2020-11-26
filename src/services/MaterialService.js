import { request } from '@/utils';
import { smBaseUrl, recommendUrl } from '@/utils/commonUrl';
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

// 认定阶段保存

export const MasterdataSave = params => {
  return request({
    url: `${recommendUrl}/api/samPhysicalIdentificationStageService/save`,
    data: params,
    method: 'POST',
  })
}
// 阶段删除
export const deleteBatchByLeftId = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samPhysicalIdentificationStageService/deleteSanPhyStageId`,
    params,
    method: 'POST',
  })
};

// 任务保存
export const TaskdataSave = params => {
  return request({
    url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/save`,
    data: params,
    method: 'POST',
  })
}

// 任务删除
export const deleteRightId = (params) => {
  return request({
    //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${recommendUrl}/api/samPhysicalIdentificationTaskService/deleteByTaskId`,
    params,
    method: 'POST',
    hack: true
  })
};
// 实物认定手工保存
export const ManualSaveVo = params => {
  return request({
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/insertDentificationPlan`,
    data: params,
    method: 'POST',
  })
}
// 认定计划明细
export const AdmissionDetails = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/findByPlanId`,
    params,
    method: 'POST',
    hack: true
  })
};

// 实物认定计划删除
export const MaterialObjectDelete = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/deletePlanVo`,
    params,
    method: 'POST',
  })
};

// 实物认定发布、取消发布
export const MaterialRelease = params => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/publishAndUnpublicPlan`,
    params,
    method: 'POST',
  })
}

// 确认认定结果
export const CognizanceRelease = params => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/confirmPlan`,
    params,
    method: 'POST',
  })
}
// 认定执行任务明细
export const TaskImplementDetailsVo = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samIdentifyPlanImplementationService/findByImplementId`,
    params,
    method: 'POST',
    hack: true
  })
};

// 认定执行明细
export const ImplementDetailsVo = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samIdentifyPlanImplementationService/findDetailVoByImplementationId`,
    params,
    method: 'POST',
    hack: true
  })
};
// 实物认定执行保存
export const CarrytaskSaveVo = params => {
  return request({
    url: `${recommendUrl}/api/samIdentifyPlanImplementationService/executeImplemention`,
    data: params,
    method: 'POST',
  })
}
// 明细催办
export const Urgingdetailed = params => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/sendMailByImpId`,
    params,
    method: 'POST',
  })
}
// 确认认定结果获取单据状态
export const ConfirmBilltype = (params) => {
  return request({
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    url: `${recommendUrl}/api/samSupplierIdentificationPlanService/checkConfirmPlan`,
    params,
    method: 'POST',
    hack: true
  })
};