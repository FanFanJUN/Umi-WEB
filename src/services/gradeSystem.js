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
      message: '请求异常，请联系管理员',
      ...error,
    })
  })
}
/** 入厂验收批次合格率主数据 begin  */
// 导出
export const acceptExport = params => createServiceRequest({
  path: '/bafController/exportBafIncomingPassRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const acceptSaveList = params => createServiceRequest({
  path: '/api/bafIncomingPassRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const acceptCheck = params => createServiceRequest({
  path: '/api/bafIncomingPassRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const acceptSaveOne = params => createServiceRequest({
  path: '/api/bafIncomingPassRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const acceptRemove = params => createServiceRequest({
  path: '/api/bafIncomingPassRateService/deleteList',
  params,
  method: 'POST'
})

/** 入厂验收批次合格率主数据 end  */

/**********************************/

/** 交货异常事故次数主数据 begin  */
// 导出
export const deliveryExport = params => createServiceRequest({
  path: '/bafController/exportBafAbnormalDeliveryVo',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const deliverySaveList = params => createServiceRequest({
  path: '/api/samBafAbnormalDeliveryService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const deliveryCheck = params => createServiceRequest({
  path: '/api/samBafAbnormalDeliveryService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const deliverySaveOne = params => createServiceRequest({
  path: '/api/samBafAbnormalDeliveryService/save',
  params,
  method: 'POST'
})

// 删除数据
export const deliveryRemove = params => createServiceRequest({
  path: '/api/samBafAbnormalDeliveryService/deleteList',
  params,
  method: 'POST'
})

/** 交货异常事故次数主数据 end  */

/**********************************/

/** 商务问题响应主数据 begin  */
// 导出
export const businessProblemExport = params => createServiceRequest({
  path: '/bafController/exportBafBusinessQuestionResponse',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const businessProblemSaveList = params => createServiceRequest({
  path: '/api/samBafBusinessQuestionResponseService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const businessProblemCheck = params => createServiceRequest({
  path: '/api/samBafBusinessQuestionResponseService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const businessProblemSaveOne = params => createServiceRequest({
  path: '/api/samBafBusinessQuestionResponseService/save',
  params,
  method: 'POST'
})

// 删除数据
export const businessProblemRemove = params => createServiceRequest({
  path: '/api/samBafBusinessQuestionResponseService/deleteList',
  params,
  method: 'POST'
})

/** 商务问题响应主数据 end  */

/**********************************/

/** 订单及时确认率主数据 begin  */
// 导出
export const orderConfirmationExport = params => createServiceRequest({
  path: '/bafController/exportBafTimelyOrderConfirmationRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const orderConfirmationSaveList = params => createServiceRequest({
  path: '/api/bafTimelyOrderConfirmationRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const orderConfirmationCheck = params => createServiceRequest({
  path: '/api/bafTimelyOrderConfirmationRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const orderConfirmationSaveOne = params => createServiceRequest({
  path: '/api/bafTimelyOrderConfirmationRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const orderConfirmationRemove = params => createServiceRequest({
  path: '/api/bafTimelyOrderConfirmationRateService/deleteList',
  params,
  method: 'POST'
})

/** 订单及时确认率主数据 end  */

/**********************************/

/** 寄售订单比例主数据 begin  */
// 导出
export const consignmentOrdersExport = params => createServiceRequest({
  path: '/bafController/exportBafConsignmentOrderRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const consignmentOrdersSaveList = params => createServiceRequest({
  path: '/api/bafConsignmentOrderRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const consignmentOrdersCheck = params => createServiceRequest({
  path: '/api/bafConsignmentOrderRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const consignmentOrdersSaveOne = params => createServiceRequest({
  path: '/api/bafConsignmentOrderRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const consignmentOrdersRemove = params => createServiceRequest({
  path: '/api/bafConsignmentOrderRateService/deleteList',
  params,
  method: 'POST'
})

/** 寄售订单比例主数据 end  */

/**********************************/

/** 交货及时率主数据 begin  */
// 导出
export const timelyDeliveryRateExport = params => createServiceRequest({
  path: '/bafController/exportBafOnTimeDeliveryRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const timelyDeliveryRateSaveList = params => createServiceRequest({
  path: '/api/bafOnTimeDeliveryRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const timelyDeliveryRateCheck = params => createServiceRequest({
  path: '/api/bafOnTimeDeliveryRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const timelyDeliveryRateSaveOne = params => createServiceRequest({
  path: '/api/bafOnTimeDeliveryRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const timelyDeliveryRateRemove = params => createServiceRequest({
  path: '/api/bafOnTimeDeliveryRateService/deleteList',
  params,
  method: 'POST'
})

/** 交货及时率主数据 end  */


/**********************************/

/** 送样情况主数据 begin  */
// 导出
export const sampleProblemRateExport = params => createServiceRequest({
  path: '/bafController/exportBafSampleProblemRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const sampleProblemRateSaveList = params => createServiceRequest({
  path: '/api/bafSampleProblemRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const sampleProblemRateCheck = params => createServiceRequest({
  path: '/api/bafSampleProblemRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const sampleProblemRateSaveOne = params => createServiceRequest({
  path: '/api/bafSampleProblemRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const sampleProblemRateRemove = params => createServiceRequest({
  path: '/api/bafSampleProblemRateService/deleteList',
  params,
  method: 'POST'
})

/** 送样情况主数据 end  */

/**********************************/

/** 环境问题主数据 begin  */
// 导出
export const environmentalProblemExport = params => createServiceRequest({
  path: '/bafController/exportBafEnvironmentalProblem',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const environmentalProblemSaveList = params => createServiceRequest({
  path: '/api/bafEnvironmentalProblemService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const environmentalProblemCheck = params => createServiceRequest({
  path: '/api/bafEnvironmentalProblemService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const environmentalProblemSaveOne = params => createServiceRequest({
  path: '/api/bafEnvironmentalProblemService/save',
  params,
  method: 'POST'
})

// 删除数据
export const environmentalProblemRemove = params => createServiceRequest({
  path: '/api/bafEnvironmentalProblemService/deleteList',
  params,
  method: 'POST'
})

/** 环境问题主数据 end  */

/**********************************/

/** 质量赔偿和环保协议签订主数据 begin  */
// 导出
export const agreementSignedExport = params => createServiceRequest({
  path: '/bafController/exportBafAgreementSigned',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const agreementSignedSaveList = params => createServiceRequest({
  path: '/api/samBafAgreementSignedService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const agreementSignedCheck = params => createServiceRequest({
  path: '/api/samBafAgreementSignedService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const agreementSignedSaveOne = params => createServiceRequest({
  path: '/api/samBafAgreementSignedService/save',
  params,
  method: 'POST'
})

// 删除数据
export const agreementSignedRemove = params => createServiceRequest({
  path: '/api/samBafAgreementSignedService/deleteList',
  params,
  method: 'POST'
})

/** 质量赔偿和环保协议签订主数据 end  */

/**********************************/

/** 质量、技术方面的协作主数据 begin  */
// 导出
export const qualityTechnologyExport = params => createServiceRequest({
  path: '/bafController/exportBafQualityTechnologyCooperation',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const qualityTechnologySaveList = params => createServiceRequest({
  path: '/api/bafQualityTechnologyCooperationService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const qualityTechnologyCheck = params => createServiceRequest({
  path: '/api/bafQualityTechnologyCooperationService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const qualityTechnologySaveOne = params => createServiceRequest({
  path: '/api/bafQualityTechnologyCooperationService/save',
  params,
  method: 'POST'
})

// 删除数据
export const qualityTechnologyRemove = params => createServiceRequest({
  path: '/api/bafQualityTechnologyCooperationService/deleteList',
  params,
  method: 'POST'
})

/** 质量、技术方面的协作主数据 end  */

/**********************************/

/** PCN变更未告知次数主数据 begin  */
// 导出
export const pcnChangeNotInfomedExport = params => createServiceRequest({
  path: '/bafController/exportBafPcnChangesNotInformed',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const pcnChangeNotInfomedSaveList = params => createServiceRequest({
  path: '/api/bafPcnChangesNotInformedService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const pcnChangeNotInfomedCheck = params => createServiceRequest({
  path: '/api/bafPcnChangesNotInformedService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const pcnChangeNotInfomedSaveOne = params => createServiceRequest({
  path: '/api/bafPcnChangesNotInformedService/save',
  params,
  method: 'POST'
})

// 删除数据
export const pcnChangeNotInfomedRemove = params => createServiceRequest({
  path: '/api/bafPcnChangesNotInformedService/deleteList',
  params,
  method: 'POST'
})

/** PCN变更未告知次数主数据 end  */

/**********************************/

/** 质量问题投诉主数据 begin  */
// 导出
export const qualityProblemComplaintsExport = params => createServiceRequest({
  path: '/bafController/exportBafQualityProblemComplaint',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const qualityProblemComplaintsSaveList = params => createServiceRequest({
  path: '/api/bafQualityProblemComplaintsService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const qualityProblemComplaintsCheck = params => createServiceRequest({
  path: '/api/bafQualityProblemComplaintsService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const qualityProblemComplaintsSaveOne = params => createServiceRequest({
  path: '/api/bafQualityProblemComplaintsService/save',
  params,
  method: 'POST'
})

// 删除数据
export const qualityProblemComplaintsRemove = params => createServiceRequest({
  path: '/api/bafQualityProblemComplaintsService/deleteList',
  params,
  method: 'POST'
})

/** 质量问题投诉主数据 end  */

/**********************************/

/** 不良率主数据 begin  */
// 导出
export const defectRateExport = params => createServiceRequest({
  path: '/bafController/exportBafDefectRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const defectRateSaveList = params => createServiceRequest({
  path: '/api/bafDefectRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const defectRateCheck = params => createServiceRequest({
  path: '/api/bafDefectRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const defectRateSaveOne = params => createServiceRequest({
  path: '/api/bafDefectRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const defectRateRemove = params => createServiceRequest({
  path: '/api/bafDefectRateService/deleteList',
  params,
  method: 'POST'
})

/** 不良率主数据 end  */

/**********************************/

/** 目标不良率主数据 begin  */
// 导出
export const targetDefectRateExport = params => createServiceRequest({
  path: '/bafController/exportBafTargetDefectRate',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const targetDefectRateSaveList = params => createServiceRequest({
  path: '/api/samBafTargetDefectRateService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const targetDefectRateCheck = params => createServiceRequest({
  path: '/api/samBafTargetDefectRateService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const targetDefectRateSaveOne = params => createServiceRequest({
  path: '/api/samBafTargetDefectRateService/save',
  params,
  method: 'POST'
})

// 删除数据
export const targetDefectRateRemove = params => createServiceRequest({
  path: '/api/samBafTargetDefectRateService/deleteList',
  params,
  method: 'POST'
})

/** 目标不良率主数据 end  */

/**********************************/

/** 审核结果等级主数据 begin  */
// 导出
export const supplierExamineGradeExport = params => createServiceRequest({
  path: '/bafController/exportBafSupplierExamineGrade',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const supplierExamineGradeSaveList = params => createServiceRequest({
  path: '/api/bafSupplierExamineGradeService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const supplierExamineGradeCheck = params => createServiceRequest({
  path: '/api/bafSupplierExamineGradeService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const supplierExamineGradeSaveOne = params => createServiceRequest({
  path: '/api/bafSupplierExamineGradeService/save',
  params,
  method: 'POST'
})

// 删除数据
export const supplierExamineGradeRemove = params => createServiceRequest({
  path: '/api/bafSupplierExamineGradeService/deleteList',
  params,
  method: 'POST'
})

/** 审核结果等级主数据 end  */

/**********************************/

/** 计算方式对应指标主数据 begin  */

// 保存一条数据
export const ruleMapMethodSaveOne = params => createServiceRequest({
  path: '/api/samBafRuleMapMethodService/save',
  params,
  method: 'POST'
})

// 删除数据
export const ruleMapMethodRemove = params => createServiceRequest({
  path: '/api/samBafRuleMapMethodService/deleteOne',
  params,
  method: 'DELETE',
  hack: true
})

/** 计算方式对应指标主数据 end  */

/**********************************/

/** 物料单位转换关系主数据 begin  */

// 保存一条数据
export const materialCategoryUnitSaveOne = params => createServiceRequest({
  path: '/api/samBafMaterialCategoryUnitService/save',
  params,
  method: 'POST'
})

// 删除数据
export const materialCategoryUnitRemove = params => createServiceRequest({
  path: '/api/samBafMaterialCategoryUnitService/deleteOne',
  params,
  method: 'DELETE',
  hack: true
})

// 右侧的新增编辑
export const unitRightSaveOne = params => createServiceRequest({
  path: '/api/samBafActualUnitConversionService/save',
  params,
  method: 'POST'
})

// 右侧的删除数据
export const unitRightRemove = params => createServiceRequest({
  path: '/api/samBafActualUnitConversionService/deleteOne',
  params,
  method: 'DELETE',
  hack: true
})


/** 物料单位转换关系主数据 end  */

/**********************************/

/** 是否签订vmi协议主数据 begin  */
// 导出
export const vmiSituationExport = params => createServiceRequest({
  path: '/bafController/exportBafVmiSigned',
  params,
  method: 'POST',
  hack: true,
  responseType: 'blob'
})

// 保存导入
export const vmiSituationSaveList = params => createServiceRequest({
  path: '/api/bafVmiSignedService/saveList',
  params,
  method: 'POST'
})

// 检查导入的数据
export const vmiSituationCheck = params => createServiceRequest({
  path: '/api/bafVmiSignedService/checkImportData',
  params,
  method: 'POST'
})

// 保存一条数据
export const vmiSituationSaveOne = params => createServiceRequest({
  path: '/api/bafVmiSignedService/save',
  params,
  method: 'POST'
})

// 删除数据
export const vmiSituationRemove = params => createServiceRequest({
  path: '/api/bafVmiSignedService/deleteList',
  params,
  method: 'POST'
})

/** 是否签订vmi协议主数据 end  */


// 批量导出质量主数据
export const batchExportQualityData = params => createServiceRequest({
  path: '/bafController/exportQualityData',
  params,
  method: 'POST',
  responseType: 'blob'
})

export const batchCheckQualityData = params => createServiceRequest({
  path: '/api/bafEvlDataService/checkQualityDataImport',
  params,
  method: 'POST'
})

export const batchSaveQualityData = params => createServiceRequest({
  path: '/api/bafEvlDataService/saveQualityDataImport',
  params,
  method: 'POST'
})
// 批量导入质量主数据

// 批量导出技术主数据
export const batchExportTechnologyData = params => createServiceRequest({
  path: '/bafController/exportTechnologyData',
  params,
  method: 'POST',
  responseType: 'blob'
})

export const batchCheckTechnologyData = params => createServiceRequest({
  path: '/api/bafEvlDataService/checkTechnologyDataImport',
  params,
  method: 'POST'
})

export const batchSaveTechnologyData = params => createServiceRequest({
  path: '/api/bafEvlDataService/saveTechnologyDataImport',
  params,
  method: 'POST'
})
// 批量导入技术主数据

// 批量导出技术主数据
export const batchExportBusinessData = params => createServiceRequest({
  path: '/bafController/exportBusinessData',
  params,
  method: 'POST',
  responseType: 'blob'
})

export const batchCheckBusinessData = params => createServiceRequest({
  path: '/api/bafEvlDataService/checkBusinessDataImport',
  params,
  method: 'POST'
})

export const batchSaveBusinessData = params => createServiceRequest({
  path: '/api/bafEvlDataService/saveBusinessDataImport',
  params,
  method: 'POST'
})
// 批量导入技术主数据