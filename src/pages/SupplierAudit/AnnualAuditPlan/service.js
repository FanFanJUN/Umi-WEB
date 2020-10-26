/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-22 10:13:27
 * @LastEditTime: 2020-10-22 10:19:30
 * @Description: 接口 集
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/service.js
 */
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