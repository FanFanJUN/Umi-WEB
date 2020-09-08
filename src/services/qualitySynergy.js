import { smBaseUrl, baseUrl } from '../utils/commonUrl';
import request from '../utils/request';


// 豁免条款-新增/编辑
export async function exemptionClauseDataInsert(params) {
    const url = `${baseUrl}/exemptionClauseData/insert`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}

// 豁免条款-删除
export async function exemptionClauseDataDelete(params) {
    const url = `${baseUrl}/exemptionClauseData/delete`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 豁免条款批导验证
export async function JudgeTheListOfExemptionClause(params) {
    const url = `${baseUrl}/exemptionClauseData/importExcel`;
    return request({
      url,
      method: 'POST',
      data: params,
    });
  }
  
  // 豁免条款批导验证
  export async function SaveTheListOfExemptionClause(params) {
    const url = `${baseUrl}/exemptionClauseData/insertImportExcel`;
    return request({
      url,
      method: 'POST',
      data: params,
    });
  }

// 环保标准-新增/编辑
export async function addEnvironmentalProtectionData(params) {
    const url = `${baseUrl}/environmentalProtectionData/addEnvironmentalProtectionData`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 环保标准-删除
export async function ESPDeleted(params) {
    const url = `${baseUrl}/environmentalProtectionData/deleted`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 环保标准-冻结
export async function ESPFreeze(params) {
    const url = `${baseUrl}/environmentalProtectionData/freeze`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 环保标准限用物资-新增/编辑
export async function addEnvironmentStandardLimitMaterialRelation(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/addEnvironmentStandardLimitMaterialRelation`;
    console.log(url)
    return request({
        url,
        method: 'POST',
        params: params,
    });
}

// 环保标准限用物资-删除
export async function ESPMDelete(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/deleted`;
    console.log(url)
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 环保标准限用物资-冻结
export async function ESPMFreeze(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/freeze`;
    console.log(url)
    return request({
        url,
        method: 'GET',
        params: params,
    });
}