import request from '@/utils/request';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';

// 前端模糊查询
export const fuzzySearch = (data, value, key = undefined) => {
  const arr = [];
  if (data && data instanceof Array) {
    if (key && key instanceof Array) {
      data.forEach(v => {
        key.forEach(i => {
          if (v[i].indexOf(value) >= 0) {
            if (!arr.some(s => s.id === v.id)) {
              arr.push(v);
            }
          }
        });
      });
    } else {
      data.forEach(v => {
        if (v['id'].indexOf(value) >= 0) {
          arr.push(v);
        }
      });
    }
  }
  return arr;
};

// 从审核需求新增-确定
export async function findRequirementLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findRequirementLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}
// 从年度计划新增-确定
export async function findYearLineLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findYearLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 从准入推荐新增-确定
export async function findAccessLineLine(params) {
    const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findAccessLine`;
    return request({
        url: requestUrl,
        method: 'GET',
        params,
    });
}

// 从PCN单据新增新增-确定
export async function findPCNBillsLine(params) {
  const requestUrl = `${recommendUrl}/api/reviewPlanMonthLineService/findPcnLine`;
  return request({
    url: requestUrl,
    method: 'POST',
    data: params,
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
    allowClear: true,
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
    remotePaging: false,
    rowKey: 'businessCode',
    reader: {
        field: ['id'],
        name: 'name',
    },
};

// 审核原因
export const AuditCauseManagementConfig = {
    allowClear: true,
    placeholder: '选择审核原因',
    store: {
        type: 'POST',
        autoLoad: false,
        url: `${baseUrl}/reviewReason/findBySearchPage`,
    },
    remotePaging: true,
    rowKey: 'code',
    reader: {
        field: ['id', 'code'],
        name: 'name',
        description: 'code',
    },
    columns: [
        {
            title: '代码',
            width: 80,
            dataIndex: 'code',
        },
        {
            title: '名称',
            width: 200,
            dataIndex: 'name',
        },
    ],
};
