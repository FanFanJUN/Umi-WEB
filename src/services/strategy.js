import { request } from '@/utils';

function createServiceRequest(option) {
    const {
        path,
        method="POST",
        headers,
        params: data
    } = option
    const url = path
    return request({
        url,
        method,
        headers,
        data,
        params: data
    })
}

// 获取采购策略列表数据源
export const queryStrategyTableList = (params) => createServiceRequest({
    path: "/purchaseStrategyHeader/listByPage",
    params
})