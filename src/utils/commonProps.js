import { smBaseUrl, baseUrl ,supplierManagerBaseUrl} from './commonUrl';

// 认定物料类别数据字典
export const fimlyMaterialClassifyProps = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'identified_material_category'
    },
    type: 'get'
  },
  style: { width: '100%' },
  reader: {
    name: 'name',
    field: ['value'],
    description: 'name'
  },
  remotePaging: true,
  placeholder: '选择认定物料类别'
}
// 认定类型数据字典
export const thatTypeProps = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'identified_type'
    },
    type: 'get'
  },
  style: { width: 300 },
  reader: {
    name: 'name',
    field: ['name', 'value'],
    description: 'name'
  },
  // remotePaging: true,
  placeholder: '选择认定类型'
}

// 供应商
export const supplierProps = {
  store: {
    url: `${smBaseUrl}/api/supplierService/findByPage`,
    params: {
      Q_EQ_frozen__Boolean: false,
      filters: [
        {
          fieldName: 'supplierStatus',
          fieldType: 'Integer',
          operator: 'EQ',
          value: 0
        },
        {
          fieldName: 'code',
          fieldType: 'String',
          operator: 'EQ',
          value: 'NONULL'
        }
      ]
    },
    type: 'post'
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'code',
    field: ['name', 'id'],
    description: 'name'
  },
  remotePaging: true,
  placeholder: '选择供应商'
}

// 供应商不筛选code为空数据

export const supplierProps_no_filter = {
  store: {
    url: `${smBaseUrl}/api/supplierService/findByPage`,
    params: {
      Q_EQ_frozen__Boolean: false,
      filters: [
        {
          fieldName: 'supplierStatus',
          fieldType: 'Integer',
          operator: 'EQ',
          value: 0
        }
      ]
    },
    type: 'post'
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
    field: ['id'],
    description: 'id'
  },
  remotePaging: true,
  placeholder: '选择供应商'
}

// 组织机构
export const orgnazationProps = {
  store: {
    url: `${baseUrl}/basic/listAllOrgnazation`,
    type: 'GET'
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
    field: ['code']
  },
  placeholder: '选择申请部门'
}

// 原厂数据主数据
export const originFactoryProps = {
  store: {
    url: `${smBaseUrl}/api/supplierAgentService/findListBySupplierId`,
    type: 'GET'
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
    field: ['code'],
    data: 'data'
  },
  placeholder: '选择原厂'
}

// 币种
export const currencyProps = {
  store: {
    url: `${baseUrl}/currency/listByPage`,
    params: {
      Q_EQ_frozen__bool: 0
    }
  },
  remotePaging: true,
  style: {
    width: '100%'
  },
  reader: {
    name: 'code',
    description: 'name'
  },
  width: 220
}

// 付款条件
export const paymentProps = {
  store: {
    url: `${baseUrl}/conPaymentCondition/listAll`,
    type: 'GET',
    params: {
      Q_EQ_frozen__bool: 0
    }
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'code',
    description: 'name'
  },
  width: 220
}

// 方案组
export const dictProps = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    type: 'GET',
    params: {
      Q_EQ_frozen__bool: 0,
      dictTypeCode: 'program_group'
    }
  },
  style: {
    width: '100%'
  },
  width: 220,
  reader: {
    name: 'name',
    description: 'value'
  }
}

// 审批状态枚举
export const flowStatusProps = {
  dataSource: [
    {
      code: 'INIT',
      name: '未提交审核'
    },
    {
      code: 'INPROCESS',
      name: '审核中'
    },
    {
      code: 'INIT',
      name: '审核完成'
    },
  ],
  reader: {
    name: 'name',
    field: ['code']
  },
  placeholder: '选择审批状态',
  style: {
    width: '100%'
  }
}

// 单据状态枚举
export const statusProps = {
  dataSource: [
    {
      code: 'Draft',
      name: '草稿'
    },
    {
      code: 'Effective',
      name: '生效'
    },
    {
      code: 'Changing',
      name: '变更中'
    }
  ],
  reader: {
    name: 'name',
    field: ['code']
  },
  style: {
    width: '100%'
  }
}
// // 生效状态枚举
// export const effectStatusProps = {
//   dataSource: [
//     {
//       code: 'Draft',
//       name: '草稿'
//     },
//     {
//       code: 'Effective',
//       name: '生效'
//     },
//     {
//       code: 'Changing',
//       name: '变更中'
//     }
//   ],
//   reader: {
//     name: 'name',
//     field: ['code']
//   },
//   placeholder: '选择生效状态',
//   style: {
//     width: '100%'
//   }
// }

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

// 公司主数据
export const corporationProps = {
  columns: [
    {
      title: '公司名称',
      dataIndex: 'name'
    }, {
      title: '公司代码',
      dataIndex: 'code'
    }
  ],
  store: {
    url: `${baseUrl}/basic/listAllCorporation`,
    params: { Q_EQ_frozen__Boolean: false }
  },
  reader: {
    name: 'name',
    field: ['code']
    // value: 'code'
  },
  style: {
    width: '100%'
  }
}

// 供应商分类
export const purchaseCompanyProps = {
  store: {
    url: `${supplierManagerBaseUrl}/supplierRegister/findCategorysBySccw`, 
    params: { status: '国内' }
  },
  reader: {
    name: 'name',
    field: ['code','id'],
    description: ['code']
  },
  placeholder: '请选择供应商分类'
}
// 供应商分类枚举
export const Fieldclassification = {
  store: {
    url: `${supplierManagerBaseUrl}/SmSupplierConfig/findVoTypeFig`, 
    type: 'post'
  },
  reader:{
    name: 'name',
    field: ['rank'],
    description: 'rank'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择供应商分类'
}
// 供应商配置表复制从
export const FieldconfigureList = {
  store: {
    url: `${supplierManagerBaseUrl}/api/SmSupplierRegConfigService/findByProperty`, 
    type: 'post'
  },
  reader:{
    name: item => `${item.configCode}-${item.supplierCategoryName}`,
    field: ['supplierCategoryCode'],
    description: 'supplierCategoryCode'
  },
  style: {
    width: '67%'
  }
}

// 评价体系主数据
export const evaluateSystemProps = {
  store: {
    url: `${baseUrl}/api/supplierEvlSystemService/findTreeByBusinessUnitId`, 
    type: 'post'
  },
  reader:{
    name: 'name',
    field: ['id'],
    description: 'id'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择评价体系'
}