import { smBaseUrl, baseUrl } from '../../utils/commonUrl';
import request from '../../utils/request';
import React from 'react';

const commonProps = {
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%',
  },
};


// BU与公司采购组织对应关系新增
export async function AddBUCompanyOrganizationRelation(params) {
  const url = `${baseUrl}/buCompanyPurchasingOrganization/addBuCompanyPurchasingOrganization`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// BU与公司采购组织对应关系冻结解冻
export async function FrostBUCompanyOrganizationRelation(params) {
  const url = `${baseUrl}/buCompanyPurchasingOrganization/frozen`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// BU与公司采购组织对应关系删除
export async function DeleteBUCompanyOrganizationRelation(params) {
  const url = `${baseUrl}/buCompanyPurchasingOrganization/whetherDelete`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资适用范围删除
export async function DeleteLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/delete`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物资适用范围新增编辑
export async function AddAndEditLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/addLimitMaterialUnitScopeData`;
  return request({
    url,
    method: 'post',
    params: params,
  });
}


// 限用物资适用范围冻结解冻
export async function FrostLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/frozen`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物资清单编辑
export async function EditTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/update_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资清单删除
export async function DeleteTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/delete_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资清单解冻冻结
export async function FrostTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/batchWhetherFrozen`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资清单批导验证
export async function JudgeTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/importExcel`;
  console.log();
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 限用物资清单批导验证
export async function SaveTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/add_limitSubstanceListDataList `;
  console.log();
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 限用物资清单新增
export async function AddTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/add_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资基本单位新增和编辑
export async function AddAndEditBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/addLimitMaterialUnitData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物资基本单位冻结
export async function FrostBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/frozen`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物资基本单位删除
export async function DeleteBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/delete`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 物料代码列表
export const MaterialConfig = {
  remotePaging: true,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/materialSrm/listByPage`,
  },
  rowKey: 'materialCode',
  reader: {
    field: ['id', 'materialDesc', 'materialGroupCode', 'materialGroupDesc', 'materialGroupId'],
    name: 'materialCode',
    description: 'materialDesc',
  },
};

// 组织列表
export const OrganizationByCompanyCodeConfig = {
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

// 文件类别列表
export const CorporationListConfig = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/technicalDataCategory/find_by_page_all`,
  },
  rowKey: 'fileCategoryCode',
  reader: {
    field: ['fileCategoryCode', 'id'],
    name: 'fileCategoryName',
    description: 'fileCategoryCode',
  },
};

// 公司列表
export const CompanyConfig = {
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

// BU列表
export const BUConfig = {
  remotePaging: true,
  store: {
    params: {
      dictTypeCode: 'BU',
    },
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
  },
  rowKey: 'value',
  reader: {
    field: ['value', 'id'],
    name: 'name',
    description: 'value',
  },
};

// 基本单位列表
export const BasicUnitList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/limitMaterialUnitData/findBySearchPage`,
  },
  rowKey: 'basicUnitCode',
  reader: {
    name: 'basicUnitName',
    description: 'basicUnitCode',
    field: ['basicUnitId', 'basicUnitName']
  },
};
// 限用物资列表
export const limitMaterialList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/limitSubstanceListData/find_by_page_all`,
  },
  rowKey: 'limitMaterialCode',
  reader: {
    name: 'limitMaterialCode',
    field: ['id', 'limitMaterialName', 'casNo'],
    description: 'limitMaterialName',
  },
  placeholder: '选择限用物资列表'
};

// 适用范围
export const limitScopeList = {
  remotePaging: true,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/LimitMaterialUnitScopeData/findBySearchPage`,
  },
  rowKey: 'scopeCode',
  reader: {
    name: 'scopeName',
    field: ['id', 'scopeCode'],
    description: 'scopeCode',
  },
  placeholder: '选择适用范围'
};

// 物料代码
export const materialCode = {
  store: {
    url: `${smBaseUrl}/api/supplierService/findByPage`,
    params: {
      Q_EQ_frozen__Boolean: false,
      filters: [
        {
          fieldName: 'supplierStatus',
          fieldType: 'Integer',
          operator: 'EQ',
          value: 0,
        },
        {
          fieldName: 'code',
          fieldType: 'String',
          operator: 'EQ',
          value: 'NONULL',
        },
      ],
    },
    type: 'post',
  },
  style: {
    width: '100%',
  },
  reader: {
    name: 'code',
    field: ['name', 'id'],
    description: 'name',
  },
  remotePaging: true,
  placeholder: '选择供应商',
};

// 状态
export const statusProps = {
  dataSource: [
    {
      code: 'INIT',
      name: '草稿',
    },
    {
      code: 'INPROCESS',
      name: '生效',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
};

// 分配供应商状态
export const distributionProps = {
  dataSource: [
    {
      code: 'INIT',
      name: '已分配',
    },
    {
      code: 'INPROCESS',
      name: '未分配',
    },
  ],
  placeholder: '选择分配供应商状态',
  ...commonProps,
};
//   物料标记状态
export const materialStatus = {
  dataSource: [
    {
      code: 'INIT',
      name: '存在符合的供应商',
    },
    {
      code: 'INPROCESS',
      name: '不存在符合的供应商',
    },
  ],
  placeholder: '选择物料标记状态',
  ...commonProps,
};
// 物料标记状态
export const PDMStatus = {
  dataSource: [
    {
      code: 'INIT',
      name: '同步成功',
    },
    {
      code: 'INPROCESS',
      name: '同步失败',
    },
  ],
  placeholder: '选择物料标记状态',
  ...commonProps,
};
