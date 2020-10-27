import { baseUrl, basicServiceUrl, gatewayUrl, recommendUrl, smBaseUrl } from '../../../utils/commonUrl';
import request from '../../../utils/request';

export const duplicateRemoval = (arr, key) => {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i][key] === arr[j][key]) {
        arr.splice(j, 1);
        //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
        j--;
      }
    }
  }
  return arr;  //去重后返回的数组
};

const commonProps = {
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%',
  },
};

// 角色
export const RoleConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'GROUP_LEADER',
      name: '组长',
    },
    {
      code: 'MEMBER',
      name: '成员',
    },
  ],
  placeholder: '选择角色',
  ...commonProps,
}

// 国家
export const TypeConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'INTERNAL_USERS',
      name: '内部用户',
    },
    {
      code: 'EXTERNAL_USERS',
      name: '外部用户',
    },
  ],
  placeholder: '选择人员类型',
  ...commonProps,
}


// 人员类型
export const PersonnelTypeConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'INTERNAL_USERS',
      name: '内部用户',
    },
    {
      code: 'EXTERNAL_USERS',
      name: '外部用户',
    },
  ],
  placeholder: '选择人员类型',
  ...commonProps,
}

// 评价体系
export const EvaluationSystemConfig = {
  ///api/supplierEvlSystemService/findTreeByCorpCode
  // https://tecmp.changhong.com/srm-baf-web/supplierEvlSystem/findTreeByBusinessUnitId?businessUnitId=60B62845-9EF8-11EA-AD0D-0242C0A8440B
  store: {
    type: 'POST',
    url: `${baseUrl}/supplierEvlSystem/findTreeByBusinessUnitId`,
  },
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
  placeholder: '选择审核体系',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.children.length === 0) {
      return {
        selectable: false
      }
    }
  }
};

// 区域
export const AreaConfig = {
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['id'],
    name: 'name',
    description: 'code',
  },
};

// 区域
export const CountryIdConfig = {
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['countryId'],
    name: 'name',
    description: 'code',
  },
};

// 正常供应商
export const NormalSupplierConfig = {
  placeholder: '选择正常供应商',
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

// 供应商选择策略
export const SelectionStrategyConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'QUALIFIED_SUPPLIER',
      name: '合格供应商名录',
    },
    {
      code: 'NORMAL_SUPPLIER',
      name: '正常供应商',
    },
  ],
  placeholder: '选择供应商选择策略',
  ...commonProps,
}

// 根据部门查员工
export const UserByDepartmentConfig = {
  placeholder: '选择员工编号',
  remotePaging: true,
  rowKey: 'code',
  reader: {
    name: 'code',
    description: 'userName',
  },
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
    type: 'POST',
    autoLoad: false,
    url: `${recommendUrl}/common/pagePurchaseOrg`,
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
    type: 'POST',
    autoLoad: false,
    url: `${recommendUrl}/common/pagePurchaseOrg`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 供应商
export const SupplierConfig = {
  placeholder: '选择供应商',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${recommendUrl}/common/pageSupplier`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 单据审核原因
export const DocumentAuditCauseManagementConfig = {
  placeholder: '选择审核原因',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewReason/findBySearchPage`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
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

// 获取供应商联系人 /supplierContactService/findBySupplierId
export const GetSupplierContact = async (params={}) => {
  const url = `${recommendUrl}/supplierContactService/findBySupplierId`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 获取默认审核体系
export const GetDefaultSystem = async (params={}) => {
  const url = `${recommendUrl}/api/reviewEvlSystemService/findDefaultEvlSystem`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 根据用户id查电话
export const GetUserTelByUserId = async (params={}) => {
  const url = `${gatewayUrl}${basicServiceUrl}/userProfile/findByUserId`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 审核类型所有
export const GetAllAuditType = async (params) => {
  const url = `${recommendUrl}/common/findAllReviewType`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

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

// 审核类型管理所有
export const AuditTypeManagementAll = async (params) => {
  const url = `${baseUrl}/reviewType/findAll`;
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
