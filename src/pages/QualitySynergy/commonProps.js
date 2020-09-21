import { smBaseUrl, baseUrl, recommendUrl, basicServiceUrl } from '../../utils/commonUrl';
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
  placeholder: '请选择'
};

// 技术资料状态
export const ShareStatusProps = {
  allowClear: true,
  dataSource: [
    {
      code: '草稿',
      name: '草稿',
    },
    {
      code: '生效',
      name: '生效',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
};

// 技术资料下载状态
export const ShareDownloadStatus = {
  allowClear: true,
  dataSource: [
    {
      code: '已下载',
      name: '已下载',
    },
    {
      code: '未下载',
      name: '未下载',
    },
  ],
  placeholder: '选择下载状态',
  ...commonProps,
};

// 技术资料分配供应商状态
export const ShareDistributionProps = {
  allowClear: true,
  dataSource: [
    {
      code: '已分配',
      name: '已分配',
    },
    {
      code: '未分配',
      name: '未分配',
    },
  ],
  placeholder: '选择分配供应商状态',
  ...commonProps,
};

// 生成随机数
export const getRandom = num => {
  return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1));
};

// 判断解冻按钮是否禁用
export const judgeButtonDisabled = (value) => {
  if (value?.length !== 0) {
    const frozen = value[0].frozen
    return !value.every(item => {
      return item.frozen === frozen
    });
  }
};

// 判断
export const judge = (arr, key, value = undefined) => {
  if (value !== undefined) {
    if (arr?.length > 0) {
      return arr.every(item => item[key] === value);
    } else {
      return true;
    }
  } else {
    if (arr?.length > 0) {
      return arr.every(item => item[key] !== '');
    } else {
      return true;
    }
  }
};

export const generateLineNumber = (index) => {
  return (index < 10 ? '00' + index * 10 : index < 100 ? '0' + index * 10 : index * 10).toString()
}

// 根据id改变下载状态
export const UpdateShareDownLoadState = async params => {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/updateDownLoadState`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

// 根据buCode和物料组代码查战略采购code和name
export const FindTacticByBuCodeAndGroupCode = async params => {
  const url = `${baseUrl}/bmBuContact/findByBuCodeAndMaterialGroupCode`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}


// 根据分享需求号获取供应商
export const FindSupplierByDemandNumber = async params => {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/findSupplier`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 分配供应商保存按钮
export const DistributionSupplierSave = async params => {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/allocationSupplier`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 技术资料分享撤回
export async function RecallDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/revoke`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

//技术资料分享战略指派
export async function StrategyAssignedDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/designateStrategy`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

//技术资料分享提交
export async function SubmitDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/submit`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

//技术资料分享删除
export async function DeleteDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/delete`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
}

//技术资料分享编辑
export async function UpdateDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/update`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}


//技术资料分享新增
export async function AddDataSharingList(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/insert`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}


//业务模块对业务单元查询单条数据
export async function DataSharingFindOne(params) {
  const url = `${recommendUrl}/api/epTechnicalShareDemandService/findOne`;
  return request({
    url,
    method: 'GET',
    params,
  });
}

//业务模块对业务单元删除
export async function DeleteBusinessUnitToBUt(params) {
  const url = `${baseUrl}/bmBuContact/whetherDelete`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

//业务模块对业务单元解冻冻结
export async function FrozenBusinessUnitToBUt(params) {
  const url = `${baseUrl}/bmBuContact/frozen`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

//业务模块对业务单元新增
export async function AddBusinessUnitToBUt(params) {
  const url = `${baseUrl}/bmBuContact/addBuCompanyPurchasingOrganization`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

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

// 限用物质适用范围删除
export async function DeleteLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/delete`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物质适用范围新增编辑
export async function AddAndEditLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/addLimitMaterialUnitScopeData`;
  return request({
    url,
    method: 'post',
    params: params,
  });
}


// 限用物质适用范围冻结解冻
export async function FrostLimitSuppliesScope(params) {
  const url = `${baseUrl}/LimitMaterialUnitScopeData/frozen`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物质清单编辑
export async function EditTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/update_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物质清单删除
export async function DeleteTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/delete_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物质清单解冻冻结
export async function FrostTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/batchWhetherFrozen`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物质清单批导验证
export async function JudgeTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/importExcel`;
  console.log();
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 限用物质清单批导验证
export async function SaveTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/add_limitSubstanceListDataList `;
  console.log();
  return request({
    url,
    method: 'POST',
    data: params,
  });
}

// 限用物质清单新增
export async function AddTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/add_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物质基本单位新增和编辑
export async function AddAndEditBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/addLimitMaterialUnitData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 限用物质基本单位冻结
export async function FrostBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/frozen`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 限用物质基本单位删除
export async function DeleteBasicMaterials(params) {
  const url = `${baseUrl}/limitMaterialUnitData/delete`;
  return request({
    url,
    method: 'get',
    params: params,
  });
}

// 战略采购列表
export const StrategicPurchaseConfig = {
  allowClear: true,
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/purchaseGroup/findByPagesAll`,
  },
  rowKey: 'name',
  reader: {
    name: 'code',
    field: ['id', 'name'],
    description: 'name',
  },
  placeholder: '选择战略采购',
  style: {
    width: '100%',
  },
};

// 物料组列表
export const MaterialGroupConfig = {
  remotePaging: true,
  allowClear: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/materialgroup/findByPage`,
  },
  rowKey: 'materialGroupCode',
  reader: {
    field: ['id', 'materialGroupDesc'],
    name: 'materialGroupCode',
    description: 'materialGroupDesc',
  },
  placeholder: '选择物料组',
  style: {
    width: '100%',
  },
};

// 战略采购列表
export const StrategicPurchasingAll = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/purchaseGroup/findByPagesAll`,
  },
  style: {
    width: '100%',
  },
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
  placeholder: '选择物料代码',
};

// 物料代码列表
export const MaterialConfig = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/materialSrm/findByPage`,
  },
  allowClear: true,
  style: {
    width: '100%',
  },
  rowKey: 'materialCode',
  reader: {
    field: ['id', 'materialDesc', 'materialGroupCode', 'materialGroupDesc', 'materialGroupId'],
    name: 'materialCode',
    description: 'materialDesc',
  },
  placeholder: '选择物料代码',
};
// 物料代码列表--携带有环保标准，战略采购数据
export const MaterialAllConfig = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/api/epDemandSupplierService/findByList`,
  },
  style: {
    width: '100%',
  },
  rowKey: 'materialCode',
  reader: {
    field: ['id', 'materialDesc', 'materialGroupCode', 'materialGroupDesc', 'materialGroupId'],
    name: 'materialCode',
    description: 'materialDesc',
  },
  placeholder: '选择物料代码',
};
// 物料代码列表--填报环保资料物料-新增标的物
export const MaterialFindByPage = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${recommendUrl}/api/epDemandService/findByList`,
    params: {
      quickSearchProperties: []
    }
  },
  rowKey: 'materialCode',
  reader: {
    field: ['id', 'materialDesc', 'materialGroupCode', 'materialGroupDesc', 'materialGroupId'],
    name: 'materialCode',
    description: 'materialDesc',
  },
  placeholder: '选择物料代码',
  style: {
    width: '100%',
  },
};

// 物料代码
export const materialCode = {
  store: {
    url: `${smBaseUrl}/api/supplierService/findByPage`,
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

// 组织列表
export const OrganizationByCompanyCodeConfig = {
  remotePaging: true,
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

// 业务单元模块列表
export const BUModelConfig = {
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/businessUnit/findAllPage`,
  },
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
  style: {
    width: '100%',
  },
  placeholder: '选择业务单元模块',
};

// BU列表未冻结高级查询
export const BUConfigNoFrostHighSearch = {
  allowClear: true,
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    field: ['buCode', 'id'],
    name: 'buCode',
    description: 'buName',
  },
  style: {
    width: '100%',
  },
  placeholder: '选择业务单元',
};

// BU列表未冻结
export const BUConfigNoFrost = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    field: ['buCode', 'id'],
    name: 'buName',
    description: 'buCode',
  },
  style: {
    width: '100%',
  },
  placeholder: '选择业务单元',
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
  style: {
    width: '100%',
  },
  placeholder: '选择业务单元',
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
    name: 'basicUnitCode',
    description: 'basicUnitCode',
    field: ['basicUnitId', 'basicUnitName'],
  },
  style: {
    width: '100%',
  },
};
// 限用物质列表-非冻结
export const limitMaterialList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/limitSubstanceListData/find_by_page`,
  },
  rowKey: 'limitMaterialCode',
  reader: {
    name: 'limitMaterialCode',
    field: ['id', 'limitMaterialName', 'casNo'],
    description: 'limitMaterialName',
  },
  placeholder: '选择限用物质列表',
};
// 限用物质列表-查询是否测试记录表中检查项为是的数据
export const findByIsRecordCheckListTrue = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/limitSubstanceListData/findByIsRecordCheckListTrue`,
  },
  rowKey: 'limitMaterialCode',
  reader: {
    name: 'limitMaterialName',
    field: ['id', 'limitMaterialCode', 'casNo'],
    description: 'limitMaterialCode',
  },
  placeholder: '选择限用物质列表',
};

// 适用范围-非冻结
export const limitScopeList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/LimitMaterialUnitScopeData/findAllFrozenFalseAndWhetherDeleteFalse`,
    params: {
      quickSearchProperties: [],
    },
  },
  rowKey: 'scopeCode',
  reader: {
    name: 'scopeName',
    field: ['id', 'scopeCode'],
    description: 'scopeCode',
  },
  placeholder: '选择适用范围',
};
// 豁免条款-下拉
export const exemptionClauseDataList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/exemptionClauseData/findByPage`,
    params: {
      quickSearchProperties: [],
    },
  },
  rowKey: 'exemptionClauseCode',
  reader: {
    name: 'exemptionClauseMaterialName',
    field: ['id', 'exemptionClauseCode'],
    description: 'exemptionClauseCode',
  },
  placeholder: '选择豁免条款',
};
// 状态
export const statusProps = {
  dataSource: [
    {
      code: 'DRAFT',
      name: '草稿',
    },
    {
      code: 'EFFECT',
      name: '生效',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
};

// 分配供应商状态
export const DownloadStatus = {
  dataSource: [
    {
      code: '已下载',
      name: '已下载',
    },
    {
      code: '未下载',
      name: '未下载',
    },
  ],
  placeholder: '选择下载状态',
  ...commonProps,
};

// 分配供应商状态
export const distributionProps = {
  dataSource: [
    {
      code: 'ALLOT_END',
      name: '已分配',
    },
    {
      code: 'ALLOT_NOT',
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
      code: 'EXIST_CONFORM_SUPPLIER',
      name: '存在符合的供应商',
    },
    {
      code: 'DIS_EXIST_CONFORM_SUPPLIER',
      name: '不存在符合的供应商',
    },
  ],
  placeholder: '选择物料标记状态',
  ...commonProps,
};
// 同步PDM状态
export const PDMStatus = {
  dataSource: [
    {
      code: 'SYNC_SUCCESS',
      name: '同步成功',
    },
    {
      code: 'SYNC_FAILURE',
      name: '同步失败',
    },
  ],
  placeholder: '选择同步PDM状态',
  ...commonProps,
};
// 是否需要填报
export const needToFillList = {
  dataSource: [
    { code: 'true', name: '是', },
    { code: 'false', name: '否', },
  ],
  ...commonProps,
};
// 填报状态
export const fillStatusList = {
  dataSource: [
    { code: 'NOTCOMPLETED', name: '未填报', },
    { code: 'COMPLETED', name: '已填报', }
  ],
  ...commonProps,
};
// 业务单元下拉选择
export const buList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    name: 'buCodeAndName',
    field: ['buName', 'id', 'buCode'],
    description: 'buName',
  },
  placeholder: '选择业务单元',
};
// 组织机构人员下拉列表
export const allPersonList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `/api-gateway/basic-service/employee/findByUserQueryParam`,
    params: {
      includeFrozen: false,
      includeSubNode: true,
      quickSearchProperties: ["code", "user.userName"],
      sortOrders: [{ property: "code", direction: "ASC" }]
    }
  },
  rowKey: 'code',
  reader: {
    name: 'userName',
    field: ['id', 'code'],
    description: 'code',
  },
  placeholder: '选择环保管理人员',
};
// 环保资料填报-列表-复制-物料代码
export const findMaterialCode = {
  remotePaging: true,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${recommendUrl}/api/epDataFillService/findMaterialCode`,
    params: {
    }
  },
  rowKey: 'code',
  reader: {
    name: 'userName',
    field: ['id', 'code'],
    description: 'code',
  },
  placeholder: '选择物料代码',
};
