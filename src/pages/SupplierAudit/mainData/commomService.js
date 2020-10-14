import { baseUrl } from '../../../utils/commonUrl';
import request from '../../../utils/request';

// 审核类型
export const AuditTypeManagementConfig = {
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewType/findBySearchPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

//审核准则管理冻结解冻
export const ManagementAuditCriteriaFrozen = async (params) => {
  const url = `${baseUrl}/reviewStandard/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核准则管理新增
export const ManagementAuditCriteriaAdd = async (params) => {
  const url = `${baseUrl}/reviewStandard/addReviewStandard `;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

//审核组织方式管理冻结解冻
export const AuditOrganizationManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewOrganizedWay/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核组织方式管理新增
export const AuditOrganizationManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewOrganizedWay/addReviewOrganizedWay`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 审核原因管理冻结解冻
export const AuditCauseManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewReason/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核原因管理新增
export const AuditCauseManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewReason/addReviewReason`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 审核类型管理新增
export const AuditTypeManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewType/addReviewType`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 审核类型管理冻结解冻
export const AuditTypeManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewType/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核方式管理新增
export const ManagementAuditModeAdd = async (params) => {
  const url = `${baseUrl}/reviewWay/addReviewWay`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 审核方式管理冻结解冻
export const ManagementAuditModeFrozen = async (params) => {
  const url = `${baseUrl}/reviewWay/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核方式管理删除
export const ManagementAuditModeDelete = async (params) => {
  const url = `${baseUrl}/reviewWay/delete`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}
