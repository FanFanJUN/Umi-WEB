import { request } from '@/utils';
import { psBaseUrl } from '@/utils/commonUrl';
function createServiceRequest(option) {
    const {
        path: url,
        method="POST",
        headers,
        params: data
    } = option
    return request({
        url,
        method,
        headers,
        data,
        params: method === 'GET' ? data : null
    })
}

// 获取采购策略列表数据源
export const queryStrategyTableList = params => createServiceRequest({
    path: `${psBaseUrl}/purchaseStrategyHeader/listByPage`,
    params
})

// 删除采购策略
export const removeStrategyTableItem = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/deleteBatch`,
  params
})

// 保存采购策略

export const savePurchaseStrategy = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/saveVo`,
  params
})

// 采购策略保存并提交审核
export const savePurcahseAndApprove = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/saveAndApprove`,
  params
})

// 采购策略行创建
export const strategyTableCreateLine = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyDetail/check`,
  params
})


// 关联创建行附件
export const strategyTableLineRelevanceDocment = (params) => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/submitBusinessInfos`,
  params
})

// 通过ID查询采购策略详情
export const findStrategyDetailById = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/findEditVo`,
  params
})

// 采购策略整单作废/取消作废
export const changeInvalidState = params => createServiceRequest({
  path: `${psBaseUrl}/purchaseStrategyHeader/invalidOrCancel`,
  params
})