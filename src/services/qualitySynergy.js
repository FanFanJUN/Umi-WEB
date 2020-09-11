import { supplierManagerBaseUrl, baseUrl } from '../utils/commonUrl';
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
        data: params,
    });
}

// 环保标准限用物资-删除
export async function ESPMDelete(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/whetherDelete`;
    console.log(url)
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 环保标准限用物资-冻结
export async function ESPMFreeze(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/frozen`;
    console.log(url)
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 环保标准限用物资批导验证
export async function JudgeTheListOfESPM(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/importData`;
    return request({
      url,
      method: 'POST',
      data: params,
    });
  }
  
  // 环保标准限用物资批导保存
  export async function SaveTheListOfESPM(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/addEnvironmentStandardLimitMaterialRelationList`;
    return request({
      url,
      method: 'POST',
      data: params,
    });
  }

// 技术资料文件类别-新增
export async function addTechnicalDataCategory(params) {
    const url = `${baseUrl}/technicalDataCategory/add_technicalDataCategory`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 技术资料文件类别-编辑
export async function updateTechnicalDataCategory(params) {
    const url = `${baseUrl}/technicalDataCategory/update_technicalDataCategory`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 技术资料文件类别-删除
export async function deleteTechnicalDataCategory(params) {
    const url = `${baseUrl}/technicalDataCategory/delete_technicalDataCategory`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 技术资料文件类别-删除
export async function frozenTechnicalDataCategory(params) {
    const url = `${baseUrl}/technicalDataCategory/batchWhetherFrozen`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}

// 
// BU-新增
export async function addBU(params) {
    const url = `${baseUrl}/bu/addBu`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// BU-删除
export async function deleteBU(params) {
    const url = `${baseUrl}/bu/whetherDelete`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// BU-冻结
export async function frozenBU(params) {
    const url = `${baseUrl}/bu/frozen`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 根据业务单元找业务板块
export async function findByBuCode(params) {
    const url = `${baseUrl}/bmBuContact/findByBuCode`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 填报环保资料物料-明细
export async function findVoById(params) {
    const url = `${supplierManagerBaseUrl}/api/epDemandService/findVoById`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-冻结
export async function epDemandFrozen(params) {
    const url = `${supplierManagerBaseUrl}/api/epDemandService/frozen`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
