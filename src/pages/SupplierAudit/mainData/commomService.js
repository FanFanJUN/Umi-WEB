import { baseUrl } from '../../../utils/commonUrl';
import request from '../../../utils/request';

const commonProps = {
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%',
  },
};

// 供应商选择策略
export const SelectionStrategyConfig = {
  allowClear: true,
  dataSource: [
    {
      code: '合格供应商名录',
      name: '合格供应商名录',
    },
    {
      code: '正常供应商',
      name: '正常供应商',
    },
  ],
  placeholder: '选择供应商选择策略',
  ...commonProps,
}

// 采购组织数据
export const ApplyOrganizationProps = {
  store: {
    url: `${baseUrl}/basic/listAllOrgnazationWithDataAuth`,
  },
  reader: {
    name: 'name',
    field: ['code', 'id']
  },
  placeholder: '请选择申请部门',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }
  }
}

// 二次分类物料组数据
export const materialClassProps = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`,
    params: { Q_EQ_frozen__Boolean: false }
  },
  reader: {
    name: 'showName',
    field: ['code']
  },
  placeholder: '请选择物料分类',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }
  }
}

// 有id的采购组织
export const AllFindByFiltersConfig = {
  placeholder: '选择采购组织',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/purchaseOrg/listByPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

// 采购组织
export const FindByFiltersConfig = {
  placeholder: '选择采购组织',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/purchaseOrg/listByPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 审核原因
export const AuditCauseManagementConfig = {
  placeholder: '选择审核原因',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewReason/findBySearchPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 有id的公司列表
export const AllCompanyConfig = {
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/buCompanyPurchasingOrganization/findCompany`,
  },
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

// 公司列表
export const CompanyConfig = {
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/buCompanyPurchasingOrganization/findCompany`,
  },
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 审核类型
export const AuditTypeManagementConfig = {
  placeholder: '选择审核类型',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewType/findBySearchPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
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
