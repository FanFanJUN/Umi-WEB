/*
 * @Author: Li Cai
 * @LastEditors  : LiCai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-22 10:13:27
 * @LastEditTime : 2020-12-30 11:23:26
 * @Description: 接口 集
 * @FilePath     : /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/service.js
 */
import request from '@/utils/request';
import { baseUrl, gatewayUrl, recommendUrl, smBaseUrl } from '../../../utils/commonUrl';
import { FLOW_HOST } from '../../../utils/constants';

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
        method: 'GET',
        params,
    });
}
// 删除
export async function deleteReviewPlanYear(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanYearService/deleteReviewPlanYear`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}
//提交审核
export async function submitReviewPlanYear(params) {
    const url = `${recommendUrl}/api/reviewPlanYearService/pushTasksToDo`;
    return request({
        url,
        method: 'GET',
        params,
    });
}
// 审核类型
export async function findReviewTypesByCode(params) {
    const url = `${baseUrl}/reviewType/findBySearchPage`;
    return request({
        url,
        method: 'POST',
        data: params,
    });
}
// 终止审批流程
export const endFlow = async (params = {}) => {
    const url = `${gatewayUrl}${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`
    return request({
        url,
        method: 'POST',
        params,
    })
}  
export const ShareStatusProps = {
    allowClear: true,
    dataSource: [
        {
            code: 'DRAFT',
            name: '草稿',
        },
        {
            code: 'EFFECT',
            name: '生效',
        },
    ],
    placeholder: '选择状态',
    reader: {
        name: 'name',
        field: ['code'],
    },
    style: {
        width: '100%',
    },
};

// 下载模板带数据
export async function downLoadTemp(params) {
    const requestUrl = params && params.api;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params.params,
        responseType: 'blob'
    });
}