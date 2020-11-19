/*
 * @Author: your name
 * @Date: 2020-11-09 09:32:51
 * @LastEditTime: 2020-11-19 19:19:13
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

// 审核实施计划-新增
export async function addReviewImplementPlan(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/addReviewImplementPlan`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 审核实施计划-编辑
export async function updateReviewImplementPlan(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/updateReviewImplementPlan`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 审核实施计划-变更
export async function changeReviewImplementPlanInsert(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanChangeService/insert`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 审核实施计划-删除
export async function deleteReviewImplementPlan(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/deleteReviewImplementPlan`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 审核实施计划-获取明细
export async function findDetailsByReviewImplementPlanId(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/findDetailsByReviewImplementPlanId`;
    return request({
        url: requestUrl,
        method: 'get',
        params: params,
    });
}

// 审核实施计划-变更组长
export async function changeTeamLeader(params) {
    const requestUrl = `${recommendUrl}/api/reviewImplementPlanService/changeTeamLeader`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}