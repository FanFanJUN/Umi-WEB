import request from '@/utils/request';
import { baseUrl, smBaseUrl } from '@/utils/commonUrl';

// 合格供应商名录
export async function getSupplierSupplyList(params) {
    const requestUrl = `${smBaseUrl}/supplierSupplyList/listPageVo`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}