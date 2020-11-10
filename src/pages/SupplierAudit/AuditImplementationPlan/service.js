/*
 * @Author: your name
 * @Date: 2020-11-09 09:32:51
 * @LastEditTime: 2020-11-09 09:33:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\service.js
 */
import request from '@/utils/request';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';

// 月度计划-删除
export async function deletePlanMonth(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthService/deleteReviewPlanMonth`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}