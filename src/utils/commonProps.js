import { purchaseApplyBaseUrl, baseUrl, psBaseUrl, commonsUrl } from './commonUrl';
// 采购公司
export const purchaseCompanyProps = {
  store: {
    url: `${baseUrl}/basic/listAllCorporation`,
    params: { Q_EQ_frozen__Boolean: false }
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
    url: `${baseUrl}/purchaseGroup/listByPageWithDataAuth`,
    params: { Q_EQ_frozen__Boolean: false }
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
    url: `${psBaseUrl}/purchaseStrategyHeader/listPurchaseDepartmentByPage`,
    params: { Q_EQ_frozen__Boolean: false }
  },
  placeholder: "请选择专业组"
}

// 采购组织
export const purchaseOrganizationProps = {
  store: {
    url: `${baseUrl}/purchaseOrg/listByPageWithDataAuth`,
    params: { Q_EQ_frozen__Boolean: 0, S_Code:"desc" }
  },
  remotePaging: true,
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
    url: `${commonsUrl}/currency/findByPage`,
    params: {
      filters: [
        {
          fieldName: 'frozen',
          value: false,
          operator: 'EQ'
        }
      ]
    },
    type: 'post'
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
    url: `${psBaseUrl}/purchaseStrategyHeader/listPurchaseMaterialCategoryByPage`,
    type: 'post',
    params: { Q_EQ_frozen__Boolean: false }
  },
  reader: {
    name: 'purchaseMaterialCategoryName',
    field: ['purchaseMaterialCategoryCode'],
    childKey: 'childrenList'
  },
  placeholder: "请选择采购计划物料类别",
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if(node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  }
}

// 物料级别数据字典
export const materialLevel = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'material_level',
      Q_EQ_frozen__Boolean: false
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
    if(node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }
  }
}

// 公司（需求公司）
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
  placeholder: '请选择需求公司',
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
    url: `${psBaseUrl}/purchaseStrategyHeader/listPurchaseWayByPage`,
    params: { Q_EQ_frozen__Boolean: false }
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
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'pricing_frequency',
      Q_EQ_frozen__Boolean: false
    }
  },
  // dataSource: [
  //   {
  //     code: 'Annually',
  //     name: '年度'
  //   }, {
  //     code: 'SemiAnnually',
  //     name: '半年'
  //   }, {
  //     code: 'Quarterly',
  //     name: '季度'
  //   }, {
  //     code: 'Monthly',
  //     name: '月度'
  //   }, {
  //     code: 'TenDays',
  //     name: '按旬'
  //   }, {
  //     code: 'Order',
  //     name: '按单'
  //   }, {
  //     code: 'Demand',
  //     name: '按需'
  //   }
  // ],
  style: {
    width: '100%'
  },
  placeholder: '选择定价频次',
  reader: {
    name: 'name',
    field: ['value']
  }
}

// 价格组成枚举
export const priceCombineProps = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'priceComposition',
      Q_EQ_frozen__Boolean: false
    }
  },
  reader: {
    name: 'name',
    field: ['value']
  },
  style: {
    width: '100%'
  },
  placeholder: '选择价格组成'
}

// 规划供应资源数量主数据

export const planSupplyResourceAmountProps = {
  store: {
    url: `${purchaseApplyBaseUrl}/supplierResourceType/findByPageNotFrozen?page=1&rows=15&Q_EQ_frozen__bool=0`,
    params: { Q_EQ_frozen__Boolean: false }
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
    field: ['code']
  },
  placeholder: '选择规划供应资源数量'
}

// 成本目标枚举
export const costTargetProps = {
  dataSource: [
    {
      code: 'DropRatio',
      name: '降幅比例'
    }, {
      code: 'DropPrice',
      name: '降幅金额'
    }
  ],
  reader: {
    name: 'name',
    field: ['code']
  },
  style: {
    width: '100%'
  },
  placeholder: '选择成本目标'
}

// 生效状态枚举
export const effectStatusProps = {
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
  placeholder: '选择生效状态',
  style: {
    width: '100%'
  }
}
