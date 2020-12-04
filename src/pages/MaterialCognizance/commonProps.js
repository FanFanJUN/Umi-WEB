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

// 认定阶段主数据
export const IdentifiedPhaselist = {
  store: {
    url: `${smBaseUrl}/pubController/findDataDictionaryItemListByTypeCode?typeCode=identified_phase`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
    description: 'value'
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
export const IdentifiedTasklist = {
  store: {
    url: `${smBaseUrl}/pubController/findDataDictionaryItemListByTypeCode?typeCode=identified_task`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
    description: 'value'
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
// 认定类型
export const CognizanceTypelist = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode?dictTypeCode=identified_type`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}

// 认定物料类别

export const MaterielCognlist = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode?dictTypeCode=identified_material_category`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
//任务类型
export const Tasktypelist = {
  store: {
    url: `${smBaseUrl}/pubController/findDataDictionaryItemListByTypeCode?typeCode=identefied_task_type`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
// 认定阶段
export const Identification = {
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['id', 'stageCode',],
    name: 'identificationStage',
  },
};

// 认定任务
export const Identificationtask = {
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['taskCode',],
    name: 'taskDesc',
  },
};
export const UserByDepartmentConfig = {
  placeholder: '选择员工编号',
  remotePaging: true,
  rowKey: 'code',
  reader: {
    name: 'code',
    description: 'userName',
    field: ["code", "id"]
  },
};

// 组织机构
export const OrganizationList = {
  store: {
    url: `/api-gateway/basic-service/organization/findAllAuthTreeEntityData`,
    type: 'GET'
  },
  reader: {
    name: 'name',
    field: ['id'],
  },
  // remotePaging: true,
  placeholder: '请选择制定计划部门'
}
// 制定人
export const MakerList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `/api-gateway/basic-service/employee/findByUserQueryParam`,
    params: {
      includeFrozen: false,
      includeSubNode: false,
      quickSearchProperties: ['code', 'user.userName'],
      organizationId: '',
      sortOrders: [{ property: 'code', direction: 'ASC' }],
    }
  },
  rowKey: 'userName',
  reader: {
    name: 'userName',
    field: ['id'],
    description: 'code',
  },
  placeholder: '请选择制定人'
}
//公司
export const Jurisdictionjurisdiction = {
  store: {
    url: `/api-gateway/basic-service/corporation/findAllAuthEntityData`,
    type: 'GET'
  },
  reader: {
    name: 'name',
    field: ['id'],
  },
  // remotePaging: true,
  placeholder: '请选择公司名称'
}

// 物料
export const Materieljurisdiction = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`,
    type: 'GET'
  },
  reader: {
    name: 'name',
    field: ['id'],
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    } else if (node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  },
  // remotePaging: true,
  placeholder: '请选择物料分类'
}
// 单据类型
export const BilltypeList = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '1',
      name: '从准入单创建',
    },
    {
      code: '0',
      name: '手工创建',
    },
  ],
  reader: {
    name: 'name',
    field: ['code'],
  },
  placeholder: '请选择单据类型',
}
// 计划状态
export const PlantypeList = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '草稿',
    },
    {
      code: '1',
      name: '已发布',
    },
    {
      code: '2',
      name: '取消发布',
    },
    {
      code: '3',
      name: '已终止',
    },
    {
      code: '4',
      name: '已完成',
    }
  ],
  reader: {
    name: 'name',
    field: ['code'],
  },
  placeholder: '请选择计划状态',
}

// 认定结果
export const Identificationresults = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '不合格',
    },
    {
      code: '1',
      name: '合格',
    },
  ],
  reader: {
    name: 'name',
    field: ['code'],
  },
  placeholder: '请选择认定结果',
}
// 计划详情责任人

export const PersonliableList = {
  placeholder: '选择责任人',
  remotePaging: true,
  rowKey: 'userName',
  reader: {
    name: 'userName',
    description: 'code',
    field: ["id"]
  },
};
// 预警状态
export const Earlywarninglist = {
  allowClear: true,
  showSearch: false,
  dataSource: [
    {
      code: '0',
      name: '未报警',
    },
    {
      code: '1',
      name: '报警',
    },
  ],
  placeholder: '选择预警状态',
  ...commonProps,
}
// 物料
export const MaterieljurisdictionCode = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`,
    type: 'GET'
  },
  reader: {
    name: 'name',
    field: ['code'],
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    } else if (node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  },
  // remotePaging: true,
  placeholder: '请选择物料分类'
}
//公司
export const JurisdictionjurisdictionCode = {
  store: {
    url: `/api-gateway/basic-service/corporation/findAllAuthEntityData`,
    type: 'GET'
  },
  reader: {
    name: 'name',
    field: ['code'],
  },
  // remotePaging: true,
  placeholder: '请选择公司名称'
}