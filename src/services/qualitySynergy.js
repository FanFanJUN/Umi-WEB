import { basicServiceUrl, baseUrl, recommendUrl } from '../utils/commonUrl';
import request from '../utils/request';
// 豁免条款-新增/编辑
export async function materialCompositionVerification(params) {
  const url = `${recommendUrl}/api/epDataFillMaterialConstituentService/checkImport`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

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
// 豁免条款-删除
export async function exemptionClauseDataFrozen(params) {
    const url = `${baseUrl}/exemptionClauseData/frozen`;
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
// 根据业务板块+物料组找战略采购
export async function sapMaterialGroupMapPurchaseGroup(params) {
    const url = `${baseUrl}/sapMaterialGroupMapPurchaseGroup/listByPage`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 根据环境标准查环境标准数据
export async function epsFindByCode(params) {
    const url = `${baseUrl}/environmentalProtectionData/findByCode`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}
// 填报环保资料物料-明细
export async function findVoById(params) {
    const url = `${recommendUrl}/api/epDemandService/findVoById`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-新增-保存并提交
export async function submitAndSave(params) {
    const url = `${recommendUrl}/api/epDemandService/submitAndSave`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-新增-保存
export async function addEpDemandList(params) {
    const url = `${recommendUrl}/api/epDemandService/addEpDemandList`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-编辑
export async function editEpDemand(params) {
    const url = `${recommendUrl}/api/epDemandService/editEpDemand`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-删除
export async function epWhetherDelete(params) {
    const url = `${recommendUrl}/api/epDemandService/whetherDelete`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-冻结
export async function epFrozen(params) {
    const url = `${recommendUrl}/api/epDemandService/frozen`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-提交
export async function epSubmit(params) {
    const url = `${recommendUrl}/api/epDemandService/submit`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-指派战略采购
export async function allotStrategicPurchase(params) {
    const url = `${recommendUrl}/api/epDemandService/allotStrategicPurchase`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-撤回
export async function epWithdraw(params) {
    const url = `${recommendUrl}/api/epDemandService/withdraw`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-分配供应商-根据填报物料行号查询分配供应商
export async function findByPageOfSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/findByPage`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-分配供应商-保存
export async function addDemandSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/saveDemandSupplierList`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-批量导入
export async function addDemandImport(params) {
    const url = `${recommendUrl}/api/epDemandService/importData`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-分配供应商-暂停/取消暂停
export async function supplierIsPause(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/isPause`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-分配供应商-编辑填报截止日期
export async function editDemandSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/editDemandSupplier`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 填报环保资料物料-分配供应商-删除
export async function deleteSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/deleted`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-根据需求号查看供应商
export async function findByDemandNumber(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/findByDemandNumber`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-分配供应商-发布
export async function releaseSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/release`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-分配供应商-取消发布
export async function cancelReleaseSupplier(params) {
    const url = `${recommendUrl}/api/epDemandSupplierService/cancelRelease`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-分配供应商-同步pdm
export async function syncPdm(params) {
    const url = `${recommendUrl}/api/epDemandService/syncPdm`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 填报环保资料物料-抽检复核
export async function checkReview(params) {
    const url = `${recommendUrl}/api/epDataFillService/checkReview`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 供应商-填报环保资料-获取填报数据
export async function supplerFindVoById(params) {
    const url = `${recommendUrl}/api/epDataFillService/findVoById`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}

// 供应商-填报环保资料-填报
export async function epDemandUpdate(params) {
    const url = `${recommendUrl}/api/epDataFillService/update`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 供应商-填报环保资料-提交
export async function epDemandSubmit(params) {
    const url = `${recommendUrl}/api/epDataFillService/submit`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 供应商-填报环保资料-撤回
export async function epDemandRecall(params) {
    const url = `${recommendUrl}/api/epDataFillService/recall`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 供应商-填报环保资料-撤回
export async function epDemandCopyAll(params) {
    const url = `${recommendUrl}/api/epDataFillService/copyAll`;
    return request({
        url,
        method: 'GET',
        params: params,
    });
}
// 供应商-填报环保资料-上传资质文件
export async function uploadFile(params) {
    const url = `${recommendUrl}/api/epSupplierAptitudeService/insert`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 查询组织机构
export async function findOrgTreeWithoutFrozen(params) {
    const url = `/api-gateway/basic-service/organization/findOrgTreeWithoutFrozen`;
    return request({
        url,
        method: 'GET',
    });
}

// 根据环境标准查环境标准数据
export async function findByProtectionCodeAndMaterialCodeAndRangeCode(params) {
    const url = `${baseUrl}/environmentStandardLimitMaterialRelation/findByProtectionCodeAndMaterialCodeAndRangeCode`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 批导拆分部件验证
export async function splitCheckImport(params) {
    const url = `${recommendUrl}/api/epDataFillSplitPartsService/checkImport`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 测试记录表批导验证
export async function testRecordCheckImport(params) {
    const url = `${recommendUrl}/api/epDataFillTestLogService/checkImport`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
