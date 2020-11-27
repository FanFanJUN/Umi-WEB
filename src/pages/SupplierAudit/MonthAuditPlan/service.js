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
// 月度计划-变更-获取百更明细
export async function findHistoryPageByChangId(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthChangeService/findHistoryPageByChangId`;
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
        method: 'POST',
        data: params,
    });
}

const commonProps = {
    reader: {
        name: 'name',
        field: ['code'],
    },
    style: {
        width: '100%',
    },
};

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
        {
            code: 'CHANGING',
            name: '变更中',
        },
    ],
    placeholder: '选择状态',
    ...commonProps,
};

// 审批流程
export const flowProps = {
    allowClear: true,
    dataSource: [
        {
            code: 'INIT',
            name: '未进入流程',
        },
        {
            code: 'INPROCESS',
            name: '流程中',
        },
        {
            code: 'COMPLETED',
            name: '流程处理完成',
        },
    ],
    placeholder: '选择审批状态',
    ...commonProps,
}

// 采购组织数据
export const ApplyOrganizationProps = {
    store: {
        url: `${baseUrl}/basic/listAllOrgnazationWithDataAuth`,
    },
    rowKey: 'code',
    reader: {
        name: 'name',
        field: ['code'],
    },
    placeholder: '请选择申请部门',
    style: {
        width: '100%',
    },
    // treeNodeProps: (node) => {
    //     if (node.nodeLevel === 0) {
    //         return {
    //             selectable: false,
    //         };
    //     }
    // },
};

// 获取有权限的准入推荐号
export const findRecommendAccessByDataAuth = {
    placeholder: '选择准入推荐号',
    store: {
      type: 'POST',
      autoLoad: false,
      url: `${recommendUrl}/api/recommendAccessService/findRecommendAccessByDataAuth`,
    },
    remotePaging: true,
    rowKey: 'code',
    reader: {
      field: ['code'],
      name: 'name',
      description: 'code',
    },
  };