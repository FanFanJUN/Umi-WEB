/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-09-14 10:40:21
 * @LastEditTime: 2020-09-16 11:43:53
 * @Description: 资料填报Api接口
 * @FilePath: /srm-sm-web/src/services/dataFillInApi.js
 */
import { recommendUrl, baseUrl } from '../utils/commonUrl';
import request from '../utils/request';

/**
 * @description: 基本情况 查询 
 * @param {type} 
 * @return {type} 
 */
export async function findrBaseInfoById(params) {
    const url = `${recommendUrl}/api/samSupplierBaseInfoService/findSupplierBaseInfoByRecommendDemandId`;
    return request({
        url,
        method: 'GET',
        params,
    });
}

/**
 * @description: 基本情况 保存
 * @param {type} 
 * @return {type} 
 */
export async function saveBaseInfo(params) {
    const url = `${recommendUrl}/api/samSupplierBaseInfoService/saveSupplierBaseInfo`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}

/**
 * @description: 销售情况 查询  GET /supplierSalesSituationService/findSupplierSalesSituationByRecommendDemandId
 * @param {type} 
 * @return {type} 
 */
export async function findSalesSituationById(params) {
    const url = `${recommendUrl}/api/supplierSalesSituationService/findSupplierSalesSituationByRecommendDemandId`;
    return request({
        url,
        method: 'GET',
        params,
    });
}
/**
 * @description: 销售情况 保存
 * @param {type} 
 * @return {type} 
 */
export async function saveSupplierSalesSituation(params) {
    const url = `${recommendUrl}/api/supplierSalesSituationService/saveSupplierSalesSituation`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
/**
 * @description: 公用查询 GET
 * @param {type} 
 * @return {type} 
 */
export async function requestGetApi(params) {
    let requestApi = '';
    switch (params.tabKey) {
        // 研发能力
        case 'researchAbilityTab':
            requestApi = '/rdCapabilityService/findRdCapabilityByRecommendDemandId';
            break;
        // 报价单及成分分析表
        case 'quotationAndGPCATab':
            requestApi = '/costAnalysisService/findCostAnalysisByRecommendDemandId';
            break;
        // 产品有害物质管控
        case 'hdssControllTab':
            requestApi = '/harmfulControlService/findHarmfulControlByRecommendDemandId';
            break;
        default:
            break;
    }
    const url = `${recommendUrl}/api${requestApi}`;
    return request({
        url,
        method: 'GET',
        params,
    });
}
/**
 * @description: 公用 Post 接口保存
 * @param {type} 
 * @return {type} 
 */
export async function requestPostApi(params) {
    let requestApi = '';
    switch (params.tabKey) {
        // 研发能力
        case 'researchAbilityTab':
            requestApi = '/rdCapabilityService/saveRdCapability';
            break;
        // 报价单及成分分析表
        case 'quotationAndGPCATab':
            requestApi = '/costAnalysisService/saveCostAnalysis';
            break;
        // 产品有害物质管控
        case 'hdssControllTab':
            requestApi = '/harmfulControlService/saveHarmfulControl';
            break;
        default:
            break;
    }
    const url = `${recommendUrl}/api${requestApi}`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
