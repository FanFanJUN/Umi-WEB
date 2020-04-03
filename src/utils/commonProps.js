import { tenderingBidBaseUrl, baseUrl } from './commonUrl';
// 采购公司
export const purchaseCompanyProps = {
  store: {
    url: `${baseUrl}/basic/listAllCorporation`,
  },
  style: {
    width: '100%'
  },
  columns: [{
    title: '公司代码',
    dataIndex: 'code',
    align: 'center'
  },
  {
    title: '公司名称',
    dataIndex: 'name',
    align: 'center'
  }],
  reader: {
    name: 'name',
    description: 'code'
  },
  placeholder: '请选择采购公司'
}
// 采购组
export const purchaseGroupProps = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
    width: 70,
  },
  {
    title: '采购组名称',
    dataIndex: 'name',
  }],
  store: {
    url: `${baseUrl}/purchaseGroup/listByPage`
  },
  placeholder: '请选择采购组',
  reader: {
    name: 'name'
  },
  style: {
    width: '100%'
  },
  width: 500
}

// 专业组
export const majorGroupProps = {
  columns: [{
    title: '代码',
    dataIndex: 'code',
  }, {
    title: '名称',
    dataIndex: 'name',
  }],
  reader: {
    name: 'name'
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
    url: `${baseUrl}/supplierRegister/getAllCurrency`
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
    name: 'name'
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
  columns: [
    {
      title: '币种代码',
      dataIndex: 'code',
      width: 120,
    }, {
      title: '币种名称',
      dataIndex: 'name',
    }
  ],
  reader: {
    name: 'name'
  },
  placeholder: '请选择币种',
  style: {
    width: '100%'
  }
}
// 采购物料类别
export const purchaseMaterialProps = {
  store: {
    url: `${baseUrl}/srmCommon/listMatCategory`
  },
  reader: {
    name: 'value'
  },
  placeholder: "请选择采购物料类别",
  style: {
    width: '100%'
  }
}