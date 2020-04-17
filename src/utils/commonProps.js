import { tenderingBidBaseUrl, baseUrl, purchaseApplyBaseUrl } from './commonUrl';
// 采购公司
export const purchaseCompanyProps = {
  store: {
    url: `${baseUrl}/basic/listAllCorporation`,
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '请选择采购公司'
}
// 采购组
export const purchaseGroupProps = {
  store: {
    url: `${baseUrl}/purchaseGroup/listByPage`
  },
  placeholder: '请选择采购组',
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  style: {
    width: '100%'
  }
}

// 专业组
export const majorGroupProps = {
  reader: {
    name: 'name',
    description: 'code',
    field: ['code']
  },
  style: {
    width: '100%'
  },
  store: {
    url: `${tenderingBidBaseUrl}/tendering/getPurchaseDepartments`
  },
  placeholder: "请选择专业组"
}

// 采购组织
export const purchaseOrganizationProps = {
  store: {
    url: `${baseUrl}/purchaseOrg/listByPage`
  },
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 120,
  },
  {
    title: '采购组织名称',
    dataIndex: 'name',
  }],
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '请选择采购组织',
  style: {
    width: '100%'
  }
}

// 币种
export const currencyProps = {
  store: {
    url: `${baseUrl}/supplierRegister/getAllCurrency`
  },
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  placeholder: '请选择币种',
  style: {
    width: '100%'
  }
}
// 采购计划物料类别
export const proPlanMaterialTypeProps = {
  store: {
    url: `${purchaseApplyBaseUrl}/purchaseMaterialCategory/findByPage`,
    type: 'post'
  },
  reader: {
    name: 'purchaseMaterialCategoryName',
    field: ['purchaseMaterialCategoryCode']
  },
  placeholder: "请选择采购计划物料类别",
  style: {
    width: '100%'
  }
}

// 物料级别数据字典
export const materialLevel = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'material_level'
    }
  },
  reader: {
    name: 'name',
    field: ['value']
  },
  placeholder: '请选择物料级别',
  style: {
    width: '100%'
  }
}

// 二次分类物料组数据
export const materialClassProps = {
  store: {
    url: `${baseUrl}/SecondaryClassificationMaterialGroup/listAllGeneralTree`
  },
  reader: {
    name: 'name',
    field: ['code']
  },
  placeholder: '请选择物料分类',
  style: {
    width: '100%'
  }
}

// 公司（适应范围）
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
    url: `${baseUrl}/basic/listAllCorporation`
  },
  reader: {
    name: 'name',
    field: ['code']
    // value: 'code'
  },
  placeholder: '请选择适应范围',
  style: {
    width: '100%'
  }
}

// 采购方式主数据
export const materialClassTypeProps = {
  columns: [
    {
      title: '采购方式',
      dataIndex: 'purchaseWayName'
    }, {
      title: '采购方式代码',
      dataIndex: 'purchaseWayCode'
    }
  ],

  store: {
    url: `${purchaseApplyBaseUrl}/purchaseWay/findByPage`
  },
  reader: {
    name: 'purchaseWayName',
    field: ['purchaseWayCode']
  },
  placeholder: '请选择采购方式',
  style: {
    width: '100%'
  }
}

// 定价频次枚举
export const frequencyProps = {
  options: [
    {
      value: 'Annually',
      label: '年度'
    }, {
      value: 'SemiAnnually',
      label: '半年'
    }, {
      value: 'Quarterly',
      label: '季度'
    }, {
      value: 'Monthly',
      label: '月度'
    }, {
      value: 'TenDays',
      label: '按旬'
    }, {
      value: 'Order',
      label: '按单'
    }, {
      value: 'Demand',
      label: '按需'
    }
  ],
  style: {
    width: '100%'
  },
  placeholder: '选择定价频次'
}

// 价格组成枚举
export const priceCombineProps = {
  options: [
    {
      value: 'CombineModelA',
      label: '组合价格模型（模具、加工费、成本费用）'
    },
    {
      value: 'CombineModelB',
      label: '组合价格模型（加工费、成本费用）'
    },
    {
      value: 'CompositePrice',
      label: '综合价格'
    }
  ],
  style: {
    width: '100%'
  },
  placeholder: '选择价格组成'
}

// 规划供应资源数量枚举

export const planSupplyResourceAmountProps = {
  options: [
    {
      value: 'MainAuxiliaryStandby',
      label: '一主一辅一备'
    },
    {
      value: 'MainAuxiliary',
      label: '一主一辅'
    },
    {
      value: 'Exclusive',
      label: '独家'
    }
  ],
  style: {
    width: '100%'
  },
  placeholder: '选择规划供应资源数量'
}

// 成本目标枚举
export const costTargetProps = {
  options: [
    {
      value: 'DropRatio',
      label: '降比例'
    }, {
      value: 'DropPrice',
      label: '降金额'
    }
  ],
  style: {
    width: '100%'
  },
  placeholder: '选择成本目标'
}

// 生效状态枚举
export const effectStatusProps = {
  options: [
    {
      value: 'Draft',
      label: '草稿'
    },
    {
      value: 'Effective',
      label: '生效'
    }
  ],
  placeholder: '选择生效状态',
  style: {
    width: '100%'
  }
}
