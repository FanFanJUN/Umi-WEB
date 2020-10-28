import request from '@/utils/request';
import { recommendUrl } from '@/utils/commonUrl';

// 审核需求新增-确定
export async function findRequirementLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findRequirementLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}