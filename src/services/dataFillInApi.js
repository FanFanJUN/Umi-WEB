/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-09-14 10:40:21
 * @LastEditTime: 2020-09-14 14:20:14
 * @Description: 资料填报Api接口
 * @FilePath: /srm-sm-web/src/services/dataFillInApi.js
 */
import { supplierManagerBaseUrl, baseUrl } from '../utils/commonUrl';
import request from '../utils/request';


/**
 * @description: 基本情况 查询 
 * @param {type} 
 * @return {type} 
 */
export async function findrBaseInfoById(params) {
    const url = `${supplierManagerBaseUrl}/samSupplierBaseInfoService/findSupplierBaseInfoByRecommendDemandId`;
    return request({
        url,
        method: 'GET',
        data: params,
    });
}

/**
 * @description: 基本情况 保存
 * @param {type} 
 * @return {type} 
 */
export async function saveBaseInfo(params) {
    const url = `${supplierManagerBaseUrl}/samSupplierBaseInfoService/saveSupplierBaseInfo`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}