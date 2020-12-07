import { baseUrl, basicServiceUrl, gatewayUrl, recommendUrl, smBaseUrl } from '../../../utils/commonUrl';
import request from '../../../utils/request';
import { FLOW_HOST } from '../../../utils/constants';
import { ComboTree } from 'suid';
import React from 'react';
/**
 * 判断为空
 */
export const isEmpty = (value) => {
  return (value === null || value === undefined || value === '' || value === 'null' || value === 'NULL' || value === 'NAN');
};

/**不超过200位有空格、可换行**/
export const length_200_n = (rule, value, callback) => {
  isEmpty(value) && (value = '');
  value.length < 201 ? callback() : callback('');
};

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

export const stateConfig = {
  'DRAFT': '草稿',
  'EFFECT': '生效',
  'CHANGING': '变更中',
};

export const flowStatusConfig = {
  'INIT': '未进入流程',
  'INPROCESS': '流程中',
  'COMPLETED': '流程处理完成',
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
};

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
};

export const RoleArr = {
  'GROUP_LEADER': '组长',
  'MEMBER': '成员',
};

export const PersonnelTypeArr = {
  'INTERNAL_USERS': '内部用户',
  'EXTERNAL_USERS': '外部用户',
};

// 人员类型
export const PersonnelTypeConfig = {
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
};

// 评价体系
export const EvaluationSystemConfig = {
  ///api/supplierEvlSystemService/findTreeByCorpCode
  // https://tecmp.changhong.com/srm-baf-web/supplierEvlSystem/findTreeByBusinessUnitId?businessUnitId=60B62845-9EF8-11EA-AD0D-0242C0A8440B
  store: {
    type: 'GET',
    url: `${recommendUrl}/api/reviewEvlSystemService/findEvlSystem`,
  },
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
  placeholder: '选择审核体系',
  style: {
    width: '100%',
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel !== 0) {
      return {
        selectable: false,
      };
    }
  },
};

// 获取评价体系
export const GetEvaluationSystem = (params={}) => {
  const url =`${recommendUrl}/api/reviewEvlSystemService/findEvlSystem`
  return request({
    url,
    method: 'GET',
    params
  });
};

// 区域
export const AreaConfig = {
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['id'],
    name: 'name',
    description: 'code',
  },
};

// 区域
export const CountryIdConfig = {
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['countryId'],
    name: 'name',
    description: 'code',
  },
};

// 正常供应商
export const NormalSupplierConfig = {
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};

export const supplierStrategyName = {
  'QUALIFIED_SUPPLIER': '合格供应商名录',
  'NORMAL_SUPPLIER': '正常供应商',
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
};

// 根据部门查员工
export const UserByDepartmentConfig = {
  placeholder: '选择员工编号',
  remotePaging: true,
  rowKey: 'code',
  reader: {
    name: 'code',
    description: 'userName',
    field: ['code', 'id'],
  },
};
// 根据部门查员工-取name
export const UserByDepartmentNameConfig = {
  placeholder: '选择审核小组组长',
  remotePaging: true,
  rowKey: 'userName',
  reader: {
    name: 'userName',
    description: 'code',
    field: ['code', 'id', 'mobile'],
  },
};

// 高级查询采购组织数据
export const HeightSearchApplyOrganizationProps = {
  allowClear: true,
  store: {
    url: `${baseUrl}/basic/listAllOrgnazationWithDataAuth`,
    autoLoad: true,
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
  //   if (node.nodeLevel === 0) {
  //     return {
  //       selectable: false,
  //     };
  //   }
  // },
};

// 采购组织数据
export const ApplyOrganizationProps = {
  allowClear: true,
  store: {
    url: `${baseUrl}/basic/listAllOrgnazationWithDataAuth`,
    autoLoad: true,
  },
  rowKey: 'code',
  reader: {
    name: 'name',
    field: ['code', 'id'],
  },
  placeholder: '请选择申请部门',
  style: {
    width: '100%',
  },
  // treeNodeProps: (node) => {
  //   if (node.nodeLevel === 0) {
  //     return {
  //       selectable: false,
  //     };
  //   }
  // },
};

// 二次分类物料组数据
export const materialClassProps = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`,
    params: { Q_EQ_frozen__Boolean: false },
  },
  reader: {
    name: 'showName',
    field: ['code'],
  },
  placeholder: '请选择物料分类',
  style: {
    width: '100%',
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false,
      };
    }
  },
};
// 物料分类-code
export const materialCodeProps = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`,
    params: { Q_EQ_frozen__Boolean: false },
  },
  reader: {
    name: 'code',
  },
  placeholder: '请选择物料分类',
  style: {
    width: '100%',
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false,
      };
    }
  },
};

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
  allowClear: true,
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
  allowClear: true,
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

// 行政区域-获取市
export const provinceConfig = {
  placeholder: '选择城市',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${gatewayUrl}${basicServiceUrl}/region/findByPage`,
    params: {
      filters: [{ fieldName: 'nodeLevel', fieldType: 'Integer', operator: 'EQ', value: 2 }],
    },
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['id', 'code', 'codePath', 'namePath'],
    name: 'name',
    description: 'code',
  },
};

// 根据审核类型查询审核原因
export const DocumentAuditCauseManagementByReviewTypeConfig = {
  placeholder: '选择审核原因',
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};
// 单据审核原因
export const DocumentAuditCauseManagementConfig = {
  placeholder: '选择审核原因',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/api/reviewReasonService/findAllUnfrozen`,
  },
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};
// 月度计划-从年度审核计划-新增
export const reviewPlanYearConfig = {
  placeholder: '选择年度审核计划',
  store: {
    type: 'POST',
    autoLoad: false,
    params: {
      state: 'EFFECT',
    },
    url: `${recommendUrl}/api/reviewPlanYearService/findByPage`,
  },
  remotePaging: true,
  rowKey: 'reviewPlanYearCode',
  reader: {
    field: ['reviewPlanYearCode', 'id'],
    name: 'reviewPlanYearName',
    description: 'reviewPlanYearCode',
  },
};

// 审核实施计划-从月度审核计划-新增
export const reviewPlanMonthConfig = {
  placeholder: '选择月度审核计划',
  store: {
    type: 'POST',
    autoLoad: false,
    params: {
      state: 'EFFECT',
      flowStatus: 'COMPLETED',
    },
    url: `${recommendUrl}/api//reviewPlanMonthService/findByPage`,
  },
  remotePaging: true,
  rowKey: 'reviewPlanMonthCode',
  reader: {
    name: 'reviewPlanMonthName',
    field: ['reviewPlanMonthCode'],
    description: 'reviewPlanMonthCode',
  },
};

// 根据类型查审核原因
export const AuditCauseManagementByReviewTypeCodeConfig = {
  allowClear: true,
  placeholder: '选择审核原因',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/api/reviewReasonService/findByReviewTypeCode`,
  },
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
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
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 有id的公司列表
export const AllCompanyConfig = {
  allowClear: true,
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/basic/listAllCorporationWithDataAuth`,
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
  allowClear: true,
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/basic/listAllCorporationWithDataAuth`,
  },
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};
// 审核需求号
export const reviewRequirementConfig = {
  placeholder: '选择审核需求号',
  remotePaging: false,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${recommendUrl}/api/reviewRequirementService/findByPage`,
  },
  rowKey: 'reviewRequirementCode',
  reader: {
    name: 'reviewRequirementCode',
    description: 'reviewRequirementName',
  },
};

// 审核类型-含code,name,id
export const AuditTypeAllConfig = {
  placeholder: '选择审核类型',
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

// 审核类型未冻结
export const AuditTypeManagementUnfrozenConfig = {
  allowClear: true,
  placeholder: '选择审核类型',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}//api/reviewTypeService/findAllUnfrozen`,
  },
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};
// 审核类型
export const AuditTypeManagementConfig = {
  allowClear: true,
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

// 审核类型-未冻结
export const AuditTypeManagementNoFrozenConfig = {
  allowClear: true,
  placeholder: '选择审核类型',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewType/findBySearchPageAndFrozenFalse`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code'],
    name: 'name',
    description: 'code',
  },
};

// 结论及是否通过
export const conclusionAndWeatherPassConfig = {
  placeholder: '选择结论及是否通过',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/api/conclusionAndWhetherPassService/findAllUnfrozen`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['code', 'id', 'whetherPass'],
    name: 'name',
    description: 'code',
  },
};

// 终止审批流程
export const EndFlow = async (params = {}) => {
  const url = `${gatewayUrl}${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`;
  return request({
    url,
    method: 'POST',
    params,
  });
};

// 审核需求管理delete
export const DeleteAuditRequirementsManagement = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewRequirementService/delete`;
  return request({
    url,
    method: 'DELETE',
    data: params,
  });
};

// 获取供应商联系人 /supplierContactService/findBySupplierId
export const GetSupplierContact = async (params = {}) => {
  const url = `${smBaseUrl}/api/supplierContactService/findBySupplierId`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核需求管理update
export const UpdateAuditRequirementsManagement = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewRequirementService/update`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核需求管理findOne
export const FindOneAuditRequirementsManagement = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewRequirementService/findOneOverride`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核需求管理新增
export const AddAuditRequirementsManagement = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewRequirementService/insert`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 获取默认审核体系
export const GetDefaultSystem = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewEvlSystemService/findDefaultEvlSystem`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 根据用户id查电话
export const GetUserTelByUserId = async (params = {}) => {
  const url = `${gatewayUrl}${basicServiceUrl}/userProfile/findByUserId`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核类型所有
export const GetAllAuditType = async (params) => {
  const url = `${recommendUrl}/common/findAllReviewType`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

//审核准则管理冻结解冻
export const ManagementAuditCriteriaFrozen = async (params) => {
  const url = `${baseUrl}/reviewStandard/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核准则管理新增
export const ManagementAuditCriteriaAdd = async (params) => {
  const url = `${baseUrl}/reviewStandard/addReviewStandard `;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

//审核组织方式管理冻结解冻
export const AuditOrganizationManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewOrganizedWay/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核组织方式管理新增
export const AuditOrganizationManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewOrganizedWay/addReviewOrganizedWay`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核原因管理冻结解冻
export const AuditCauseManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewReason/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核原因管理新增
export const AuditCauseManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewReason/addReviewReason`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核类型管理所有
export const AuditTypeManagementAll = async (params) => {
  const url = `${baseUrl}/reviewType/findAll`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核类型管理新增
export const AuditTypeManagementAdd = async (params) => {
  const url = `${baseUrl}/reviewType/addReviewType`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核类型管理冻结解冻
export const AuditTypeManagementFrozen = async (params) => {
  const url = `${baseUrl}/reviewType/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核方式管理新增
export const ManagementAuditModeAdd = async (params) => {
  const url = `${baseUrl}/reviewWay/addReviewWay`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核方式管理冻结解冻
export const ManagementAuditModeFrozen = async (params) => {
  const url = `${baseUrl}/reviewWay/frozen`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核方式管理删除
export const ManagementAuditModeDelete = async (params) => {
  const url = `${baseUrl}/reviewWay/delete`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 获取审核准则-未冻结
export async function reviewStandard(params) {
  const requestUrl = `${baseUrl}/api/reviewStandardService/findAllUnfrozen`;
  return request({
    url: requestUrl,
    method: 'GET',
  });
}

// 审核报告管理新增获取默认值
export const findForReportInsert = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewPlanMonthLineService/findForReportInsert`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核报告管理保存
export const saveAuditReport = async (params) => {
  const url = `${recommendUrl}/api/arAuditReportManagService/saveVo`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 审核报告管理findOne
export const findVoById = async (params = {}) => {
  const url = `${recommendUrl}/api/arAuditReportManagService/findVoById`;
  return request({
    url,
    method: 'GET',
    params: params,
  });
};

// 审核报告delete
export const deleteReportById = async (params = {}) => {
  const url = `${recommendUrl}/api/arAuditReportManagService/deleteReportById`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
};

// 小组保存
export const savePurchasingTeamOpinion = async (params) => {
  const url = `${recommendUrl}/api/arAuditReportManagService/savePurchasingTeamOpinion`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 领导保存
export const saveLeaderDecision = async (params) => {
  const url = `${recommendUrl}/api/arAuditReportManagService/saveLeaderDecision`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};
