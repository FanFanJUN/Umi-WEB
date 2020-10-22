import { smBaseUrl, baseUrl, supplierManagerBaseUrl } from './commonUrl';
import {
  listChineseProvinces,
  listCityByProvince,
  listAreaByCity,
  getAllCurrencyWithoutAuth,
  getAccesstocountries,
  oddgetAllCorporation,
  getCompanyFactory,
  getNormalSuppliers,
  listUnionPayCode
} from '../services/supplierRegister'
import { searchListByKey } from '../components/utils/CommonUtils';
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
    description: 'value'
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
    description: 'value'
  },
  // remotePaging: true,
  placeholder: '选择认定类型'
}

// 处理建议
export const dealAdviceProps = {
  store: {
    url: `${baseUrl}/dataDictionaryItem/getDictByTypeCode`,
    params: {
      dictTypeCode: 'supplier_deal_advice'
    },
    type: 'get'
  },
  reader: {
    name: 'name',
    field: ['value']
  },
  placeholder: '请选择处理建议'
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
    field: ['id', 'code'],
    description: 'code'
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
    url: `${smBaseUrl}/api/supplierAgentService/findBySupplierIdBackList`,
    type: 'GET'
  },
  style: {
    width: '100%'
  },
  reader: {
    name: 'originalCompanyName',
    field: ['originalCode']
  },
  placeholder: '选择原厂'
}

// 币种
export const currencyProps = {
  store: {
    url: `${baseUrl}/currency/listByPage`,
    params: {
      Q_EQ_frozen__bool: 0
    },
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
// 币种列表
export const currencyTableProps = {
  rowKey: 'id',
  store: {
    url: `${baseUrl}/api/currencyService/findByPage`,
    autoLoad: false,
    params: {
      Q_EQ_frozen__bool: 0
    },
    type: 'POST'
  },
  searchProperties: ['code', 'name'],
  columns: [
    {
      title: '币种代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '币种名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  style: {
    width: '100%'
  },
  reader: {
    name: 'name',
  },
  // height: 150,
  width: 220,
  remotePaging: true,
  searchPlaceHolder: '请输入查询关键字',
  name: 'currencyName'
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


// 评价期间类型枚举
export const evlPeriodEmu = [
  {
    value: 'YEAR',
    label: '年度'
  },
  {
    value: 'QUARTER',
    label: '季度'
  },
  {
    value: 'MONTH',
    label: '月度'
  }
];

// 评价层级枚举
export const evlLevelEmu = [
  {
    value: 'BG',
    label: '业务板块层级'
  },
  {
    value: 'BU',
    label: '业务单元层级'
  },
  {
    value: 'CORP_AND_PURCHASE_ORG',
    label: '公司和采购组织层级'
  }
]


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
      code: 'COMPLETE',
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
// 评价项目单据状态枚举
export const evlStatusProps = {
  dataSource: [
    {
      code: 'DRAFT',
      name: '草稿'
    },
    {
      code: 'UNDER_EVALUATION',
      name: '评价中'
    },
    {
      code: 'EVALUATION_COMPLETED',
      name: '评价完成'
    },
    {
      code: 'RESULTS_GENERATED',
      name: '已生成结果'
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

// 评价期间类型高级查询配置
export const evlEmu = {
  dataSource: [
    {
      code: 'YEAR',
      name: '年度'
    },
    {
      code: 'QUARTER',
      name: '季度'
    },
    {
      code: 'MONTH',
      name: '月度'
    }
  ],
  reader: {
    name: 'name',
    field: ['code']
  },
  placeholder: '选择评价期间类型',
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
    field: ['code', 'id'],
    description: 'code'
  },
  placeholder: '请选择供应商分类'
}
// 供应商分类枚举
export const Fieldclassification = {
  store: {
    url: `${supplierManagerBaseUrl}/SmSupplierConfig/findVoTypeFig`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['value', 'rank'],
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
  reader: {
    name: item => `${item.configCode}-${item.supplierCategoryName}`,
    field: ['supplierCategoryCode'],
    description: 'supplierCategoryCode'
  },
  style: {
    width: '100%'
  }
}

// 评价体系主数据
export const evaluateSystemProps = {
  store: {
    url: `${baseUrl}/api/supplierEvlSystemService/findTreeByBusinessUnitId`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['id'],
    description: 'code'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择评价体系'
}
//海关信用状况
export const customsEnterpriseAll = {
  store: {
    url: `${baseUrl}/bafWithoutAuth/listCustomsEnterprisesEreditStatus`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['value']
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择供海关信用状况'
}

// 业务单元主数据
export const businessMainProps = {
  store: {
    url: `${baseUrl}/api/buService/findAll`,
    type: 'get'
  },
  reader: {
    name: 'buName',
    field: ['buCode']
  },
  style: {
    width: '100%'
  }
}

// 业务板块主数据
export const businessUnitMainProps = {
  store: {
    url: `${baseUrl}/api/businessUnitService/findAll`,
    type: 'get'
  },
  reader: {
    name: 'businessUnit',
    field: ['code']
  },
  style: {
    width: '100%'
  }
}

// 业务标的物
export const industryConfig = {
  store: {
    url: `${baseUrl}/supplierRegister/getDataItemsFromValueCode?code=category_id&Q_EQ_frozen__bool=0`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['value'],
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择业务标的物'
}
// 企业性质
export const enterprisePropertyConfig = {
  store: {
    url: `${baseUrl}/supplierRegister/listAllEnterpriseProperty`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['id']
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择企业性质'
}
//纳税人类别
export const listAllTaxpayersCategory = {
  store: {
    url: `${baseUrl}/supplierRegister/listAllTaxpayersCategory`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['id'],
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择企业性质'
}
//国内省份
export const chineseProvinceTableConfig = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  }, {
    title: '名称',
    dataIndex: 'name',
    width: 200,
  }],
  dataService: listChineseProvinces,
  service: listChineseProvinces,
  searchService: (param1, param2) => searchListByKey(param1, param2, ['code', 'name']),
  key: 'id',
  text: 'name',
}

//省
export const provinceListConfig = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  }, {
    title: '名称',
    dataIndex: 'name',
  }],
  service: (params) => listChineseProvinces(params),
  searchService: (params) => listChineseProvinces(params),
  params: { countryId: 'countryId' },
  key: 'id',
  text: 'name',
};
// //国内城市
export const cityListConfig = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  }, {
    title: '名称',
    dataIndex: 'name',
  }],
  service: (params) => listCityByProvince(params),
  searchService: (params) => listCityByProvince(params),
  params: { provinceId: 'registerProvinceId' },
  key: 'id',
  text: 'name',
}

// 区县
export const areaListConfig = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  }, {
    title: '名称',
    dataIndex: 'name',
  }],
  service: (params) => listAreaByCity(params),
  searchService: (params) => listAreaByCity(params),
  params: { provinceId: 'Q_EQ_supplierExtend&registerRegionId' },
  key: 'id',
  text: 'name',
};
//币种
export const currencyListConfigWithoutAuth = {
  service: getAllCurrencyWithoutAuth,
  key: 'id',
  text: 'name',
  style: {
    width: '100%'
  },
};
// 泛虹公司
export const corporationSupplierConfig = {
  store: {
    autoLoad: true,
    url: `${baseUrl}/basic/listAllCorporation?Q_EQ_frozen__bool=0`,
    type: 'post'
  },
  columns: [
    {
      title: '公司代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '公司名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择泛虹公司'
};
// 泛虹工厂
export const companyOrgConfigByCode = {
  store: {
    autoLoad: true,
    url: `${baseUrl}/factory/findByCorporationCode?Q_EQ_frozen__bool=0`,
    type: 'post'
  },
  // cascadeParams:{
  //   corporationCode: 'A000'
  // },
  columns: [
    {
      title: '工厂代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '工厂名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择泛虹工厂'
}
// 老泛虹公司
export const oddcorporationSupplierConfig = {
  columns: [{
    title: '公司代码',
    dataIndex: 'code',
    width: 70,
  },
  {
    title: '公司名称',
    dataIndex: 'name',
  }],
  dataService: oddgetAllCorporation,
  service: oddgetAllCorporation,
  searchService: (param1, param2, param3) => param3 ? searchListByKey(param1, param2, param3) : searchListByKey(param1, param2, ['code', 'name']),
  key: 'code',
  text: 'name',
};
//供应商注册 根据公司code查询工厂
export const oddcompanyOrgConfigByCode = {
  columns: [
    {
      title: '工厂代码',
      dataIndex: 'code',
      width: 100,
    },
    {
      title: '工厂名称',
      dataIndex: 'name',
      width: 200,
    }
  ],
  dataService: (params) => getCompanyFactory(params),
  service: (params) => getCompanyFactory(params),
  searchService: (param1, param2, param3) => param3 ? searchListByKey(param1, param2, param3) : searchListByKey(param1, param2, ['code', 'name']),
  key: 'code',
  text: 'name',
};
// 国家
export const countryListConfig = {
  store: {
    url: `${baseUrl}/supplierRegister/listAllCountry`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['id'],
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择国家'
}

//银行国家
export const BankCountryListConfig = {
  service: getAccesstocountries,
  key: 'id',
  text: 'name',
};
//职务类别
export const listPositionConfig = {
  store: {
    url: `${baseUrl}/srmCommon/listPosition`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['value'],
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择职务类别'
}
// 银行编码
export const BankcodeConfigTable = {
  store: {
    autoLoad: true,
    url: `${baseUrl}/supplierRegister/getDataItemsFromValueCode?code=BANK_CODE&Q_EQ_frozen__bool=0`,
    type: 'post'
  },
  columns: [
    {
      title: '代码',
      width: 80,
      dataIndex: 'value',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  reader: {
    name: 'name',
    field: ['value'],
    description: 'code'
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择银行编码'
}
//银联号
export const unionPayCodeConfig = {
  store: {
    autoLoad: true,
    url: `${baseUrl}/supplierRegister/getBankNoByPage?Q_EQ_frozen__bool=0`,
    type: 'GET'
  },
  columns: [
    {
      title: '代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  remotePaging: true,
  reader: {
    name: 'name',
    field: ['code'],
    description: 'code'
  },
  style: {
    width: '100%'
  },
  // remotePaging: true,
  // rowKey: 'code',
  // reader: {
  //   field: ['code'],
  //   name: 'name',
  //   description: 'code',
  // },
}
// 银行控制
export const paymentTypeConfig = {
  store: {
    url: `${baseUrl}/supplierRegister/getPaymentPage?Q_EQ_frozen__bool=0&S_code=desc`,
    type: 'post'
  },
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%'
  },
  placeholder: '请选择银行控制代码'
}
// 注册流程供应商
//供应商
export const SupplierConfigWithName = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  },
  {
    title: '供应商名称',
    dataIndex: 'name',
    width: 500,
  }],
  dataService: getNormalSuppliers,
  service: getNormalSuppliers,
  searchService: (param1, param2) => searchListByKey(param1, param2, ['name', 'code']),
  key: 'name',
  text: 'name',
};
// 注册供应商分类
export const purchaseCompanyPropsreg = {
  store: {
    url: `${supplierManagerBaseUrl}/supplierRegister/getSupplierCategoryTree`,
  },
  reader: {
    name: 'name',
    field: ['id'],
    description: ['code']
  },
  placeholder: '请选择供应商分类',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }else if (node.nodeLevel === 1 && node.code === '1' || node.nodeLevel === 1 && node.code === '2' ) {
      return {
        selectable: false
      }
    }
  }
}
// 联行号
export const oddunionPayCodeConfig = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
  }, {
    title: '名称',
    dataIndex: 'name',
  }],
  dataService: listUnionPayCode,
  key: 'code',
  text: 'code',
};
// 无账号供应商
export const corporationConfigShowName = {
  columns: [{
      title: '公司代码',
      dataIndex: 'code',
      width: 70,
  },
      {
          title: '公司名称',
          dataIndex: 'name',
      }],
  dataService: oddgetAllCorporation,
  service: oddgetAllCorporation,
  searchService: (param1, param2, param3) => param3 ? searchListByKey(param1, param2, param3) : searchListByKey(param1, param2, ['code', 'name']),
  key: 'id',
  text: 'name',
};

// 组织成为供应商分类
// 注册供应商分类
export const organpurchaseCompanyPropsreg = {
  store: {
    url: `${supplierManagerBaseUrl}/supplierRegister/getSupplierCategoryNotOneTree`, 
  },
  reader: {
    name: 'name',
    field: ['id'],
    description: ['code']
  },
  placeholder: '请选择供应商分类',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }else if (node.nodeLevel === 1 && node.code === '1' || node.nodeLevel === 1 && node.code === '2' ) {
      return {
        selectable: false
      }
    }
  }
}