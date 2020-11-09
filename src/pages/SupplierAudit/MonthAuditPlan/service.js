import request from '@/utils/request';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';

// 审核需求新增-确定
export async function findRequirementLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findRequirementLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
// 年度计划新增-确定
export async function findYearLineLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findYearLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 新增月度计划-保存
export async function insertMonthBo(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthService/insert`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}
// 获取部门
export async function listAllOrgnazationWithDataAuth(params) {
    const requestUrl = `${baseUrl}/basic/listAllOrgnazationWithDataAuth`;
    return request({
        url: requestUrl,
        method: 'GET',
    });
}

// 月度计划-明细
export async function findOneOverride(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthService/findOneOverride`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 月度计划-编辑-保存
export async function upDateMonthBo(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthService/update`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 月度计划-变更-提交
export async function insertChangeMonthBo(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthChangeService/insert`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 月度计划-变更-提交
export async function findHistoryPageByChangId(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthChangeService/findHistoryPageByChangId`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}
// 月度计划-变更-变更信息
export async function findReasonByChangId(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthChangeService/findReasonByChangId`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
// 月度计划-变更-删除
export async function deleteChangeById(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthChangeService/deleteById`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 月度计划-删除
export async function deletePlanMonth(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthService/deleteReviewPlanMonth`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}