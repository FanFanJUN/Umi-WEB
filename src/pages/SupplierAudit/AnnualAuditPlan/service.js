/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-22 10:13:27
 * @LastEditTime: 2020-10-28 15:49:45
 * @Description: 接口 集
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/service.js
 */
import request from '@/utils/request';
import { recommendUrl, smBaseUrl } from '@/utils/commonUrl';

// 合格供应商名录
export async function getSupplierSupplyList(params) {
    const requestUrl = `${smBaseUrl}/supplierSupplyList/listPageVo`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 新增 编辑
export async function reviewPlanYearAp(params) {
    const url = params && params.type === 'add' ? '/reviewPlanYearService/addReviewPlanYear' : '/reviewPlanYearService/updateReviewPlanYear'
    const requestUrl = `${recommendUrl}/api${url}`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}
// 明细查询
export async function findDetailedById(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanYearService/findDetailedById`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}
// 删除
export async function deleteReviewPlanYear(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanYearService/deleteReviewPlanYear`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
// 头行组合数据明细查询分页：reviewPlanYearService/findDetailedReviewPlanYearAndLine 参数和我发给你的那个分页的一样