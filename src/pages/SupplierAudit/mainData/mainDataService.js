/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-14 11:02:45
 * @LastEditTime: 2020-10-22 10:16:52
 * @Description: 主数据接口
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/mainData/mainDataService.js
 */
import request from '@/utils/request';
import { baseUrl } from '@/utils/commonUrl';

// 主数据接口 新增/编辑 请求公用Post
export async function requestPostApi(params) {
    let url = '';
    switch (params.key) {
        // 结论是否通过
        case 'ConclusionPassed':
            url = '/conclusionAndWhetherPass/addConclusionAndWhetherPass';
            break;
        // 默认审核项目
        case 'AudittypeWithPro':
            url = '/defaultProjectStandard/addDefaultProjectStandard';
            break;
        // 审核类型、是否通过和结论配置
        case 'AwcConf':
            url = '/reviewTypeConclusionWhetherPassConfigure/addReviewTypeConclusionWhetherPassConfigure';
            break;
        // 评定等级
        case 'PrlConf':
            url = '/reviewPerformanceConfigure/addReviewPerformanceConfigure';
            break;
        // 审核区域 左table
        case 'LeftReviewCityConf':
            url = '/reviewArea/addReviewArea';
            break;
        // 审核区域 右table
        case 'RightReviewCityConf':
            url = '/reviewCity/addReviewCity';
            break;
        default:
            break;
    }
    const requestUrl = `${baseUrl}${url}`;
    return request({
        url: requestUrl,
        method: 'POST',
        data: params,
    });
}

// 主数据接口 冻结/解冻 请求公用Post
export async function requestGetFrozenApi(params) {
    let url = '';
    switch (params.key) {
        // 结论是否通过
        case 'ConclusionPassed':
            url = '/conclusionAndWhetherPass/frozen';
            break;
        // 默认审核项目
        case 'AudittypeWithPro':
            url = '/defaultProjectStandard/frozen';
            break;
        // 审核类型、是否通过和结论配置
        case 'AwcConf':
            url = '/reviewTypeConclusionWhetherPassConfigure/frozen';
            break;
        // 百分比、评定等级、风险等级配置
        case 'PrlConf':
            url = '/reviewPerformanceConfigure/frozen';
            break;

        default:
            break;
    }
    const requestUrl = `${baseUrl}${url}`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
// 删除
export async function requestDelApi(params) {
    let url = '';
    switch (params.key) {
        // 结论是否通过
        case 'ConclusionPassed':
            url = '/conclusionAndWhetherPass/delete';
            break;
        // 默认审核项目
        case 'AudittypeWithPro':
            url = '/defaultProjectStandard/delete';
            break;
        // 审核区域 左table
        case 'LeftReviewCityConf':
            url = '/reviewArea/delete';
            break;
        // 审核区域 右table
        case 'RightReviewCityConf':
            url = '/reviewCity/delete';
            break;
        default:
            break;
    }
    const requestUrl = `${baseUrl}${url}`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}