/*
 * @Author: your name
 * @Date: 2020-11-09 09:32:51
 * @LastEditTime: 2020-11-16 17:10:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \srm-sm-web\src\pages\SupplierAudit\AuditImplementationPlan\service.js
 */
import request from '@/utils/request';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';
//新增-获取初始数据
export async function mergeContent(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/mergeContent`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 审核实施计划-删除
export async function deletePlanMonth(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/mergeContent`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
