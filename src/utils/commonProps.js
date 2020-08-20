import { purchaseApplyBaseUrl, baseUrl, psBaseUrl, commonsUrl,supplierManagerBaseUrl } from './commonUrl';
import {getSupplierCategoryTree} from '../services/supplierConfig'
// 供应商分类
export const purchaseCompanyProps = {
  store: {
    url: `${supplierManagerBaseUrl}/supplierRegister/findCategorysBySccw`, 
    //url: `${supplierManagerBaseUrl}/supplierRegister/getSupplierCategoryTree`,
    // url: `${baseUrl}/purchaseGroup/listByPageWithDataAuth`,
    // arams: { Q_EQ_frozen__Boolean: false }
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

