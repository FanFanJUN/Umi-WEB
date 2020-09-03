import { smBaseUrl, baseUrl } from '../utils/commonUrl';
import request from '../utils/request';


// 豁免条款-新增/编辑
export async function exemptionClauseDataInsert(params) {
    const url = `${baseUrl}/exemptionClauseData/insert`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}

// 豁免条款-删除
export async function exemptionClauseDataDelete(params) {
    const url = `${baseUrl}/exemptionClauseData/delete`;
    return request({
        url,
        method: 'POST',
        params: params,
    });
}