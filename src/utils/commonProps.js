import { smBaseUrl, baseUrl ,supplierManagerBaseUrl} from './commonUrl';

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

// 审核状态枚举
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
  placeholder: '选择审核状态',
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
    field: ['code'],
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