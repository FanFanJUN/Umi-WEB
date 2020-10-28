import { request } from '@/utils';
import { smBaseUrl,baseUrl,gatewayUrl} from '@/utils/commonUrl';
import { BASE_URL,FLOW_HOST,AUTH_SERVER_PATH} from '../utils/constants';
import {convertDataToFormData} from '../utils'
import httpUtils from '../utils/FeatchUtils'
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = smBaseUrl,
    // 处理未按标准post请求处理接收参数的接口
    // 后端获取参数不是从post请求的body中获取，而是从url params中获取参数的接口将hack设置为true
    hack = false
  } = option
  const URI = `${base}${url}`
  return request({
    url: URI,
    method,
    headers,
    data,
    params: method === 'GET' ? data : hack ? data : null
  }).catch(error => {
    return ({
      ...error,
      message: '请求异常，请联系管理员'
    })
  })
}
// 推荐信息
export const RecommendationList = params => createServiceRequest({
  path: '/supplierRecommendRequest/getRecommendInfo',
  params,
  method: 'GET',
  hack: true
})




// 供应商注册字段配置表保存
// export const SaveSupplierRegister = params =>
//   request({
//     url: `${smBaseUrl}/SmSupplierConfig/saveVo`,
//     method: 'POST',
//     data: convertDataToFormData(params),
//     responseType: 'blob'
//   })
// export const SaveSupplierRegister = params => createServiceRequest({
//   path: '/api/SmSupplierConfigService/saveSmSupplierConfig',
//   params
// })
// 供应商注册字段配置表删除
export const DetailSupplierRegister = params =>
  request({
    headers:{'content-type': 'application/json'},
    url: `${smBaseUrl}/api/SmSupplierConfigService/deleteId`,
    data: params,
    method: 'POST',
    //responseType: 'blob'
  })
// 供应商注册配置表字段查询
export const findSupplierconfigureService = params => createServiceRequest({
  path: '/api/SmSupplierConfigService/findByPage',
  params,
})

// 供应商注册配置表ID查询
// export const findSupplierconfigureId = params => createServiceRequest({
//   path: '/api/SmSupplierRegConfigService/findByregConfId',
//   params,
//   hack: true
// })
export const findSupplierconfigureId = params =>
  request({
    headers:{'content-type': 'application/json'},
    url: `${smBaseUrl}/api/SmSupplierRegConfigService/findByRegConfId`,
    data: params,
    method: 'POST',
    //responseType: 'blob'
  })

// 供应商注册配置表字段查询
export const SaveSupplierconfigureService = params => createServiceRequest({
  path: '/api/SmSupplierRegConfigService/findByCateGroyId',
  params,
  hack: true
})
// 获取供应商分类配置
export const Configurationfield = params => createServiceRequest({
  path: '/supplierRecommendRequest/getRecommendInfo',
  params,
  method: 'GET',
  hack: true
})
// 供应商详情
// export const SupplierconfigureDetail = params => createServiceRequest({
//   path: '/api/SmSupplierRegConfigService/saveRegConfigVo',
//   params,
// })
export const SupplierconfigureDetail = params =>
  request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierRecommendRequest/findBySupplierId`,
    params,
    method: 'POST',
    //responseType: 'blob'
  })
// //中国省份
// export const listChineseProvinces = () => {
//   return request({
//     url: `${baseUrl}/supplierRegister/listChineseProvinces`,
//     method: 'POST',
//   })
// };
// //市
// export const listCityByProvince = (params) => {
//   return request({
//     headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//     url: `${baseUrl}/supplierRegister/listCityByProvince`,
//     params,
//     method: 'POST',
//   })
// };
// //县
// export const listAreaByCity = (params) => {
//   return request({
//     headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//     url: `${baseUrl}/supplierRegister/listCityByProvince`,
//     params,
//     method: 'POST',
//   })
// };
//中国省份
export const listChineseProvinces = () => {
  return httpUtils.post(`${BASE_URL}/srm-baf-web/supplierRegister/listChineseProvinces`);
};
//市
export const listCityByProvince = (params) => {
  return httpUtils.post(`${BASE_URL}/srm-baf-web/supplierRegister/listCityByProvince`, params);
};
//县
export const listAreaByCity = (params) => {
  return httpUtils.post(`${BASE_URL}/srm-baf-web/supplierRegister/listCityByProvince`, params);
};
// 币种  
export const getAllCurrencyWithoutAuth = () => {
  return request({
    url: `${baseUrl}/supplierRegister/getAllCurrency`,
    method: 'POST',
  })
}
// 泛虹公司
export const getAllCorporation = () => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${baseUrl}/basic/listAllCorporation`,
    method: 'POST',
    //params:{'Q_EQ_frozen__bool': '0'}
  })
}
//物料分类树
export const listAllGeneralTree = (params) => {
  //return httpUtils.post(baseUrl + '/supplierRegister/listAllGeneralTree', params, true);

  return request({
    url: `${baseUrl}/supplierRegister/listAllGeneralTree`,
    method: 'POST',
    data: params
  })
};
//供應商名称重复检查
export const checkSupplierName = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierRegister/checkSupplierName`,
    params,
    method: 'POST',
  })
};

export const getBankcodelist = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${baseUrl}/supplierRegister/getDataItemsFromValueCode`,
    params,
    method: 'POST',
  })
};
//获得中国ID
export const getCNCountryIdInfo = params => createServiceRequest({
  path: '/supplierRegister/getCNCountryId',
  params,
  method: 'GET',
})
// 银行国家
export const getAccesstocountries = (params) => {
  return request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${baseUrl}/supplierRegister/listAllCountry`,
    params,
    method: 'POST',
  })
};
//绑定附件
export const getRelationDocId = params => {
  // path: '/supplierRegister/getRelationDocId',
  // params
  return request({
    //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierRegister/getRelationDocId`,
    data: convertDataToFormData(params),
    method: 'POST',
  })
}
// 银行保存

// export const saveBankVo = (params) => {
//   return request({
//     headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
//     url: `${baseUrl}/supplierRegister/listAllCountry`,
//     params,
//     method: 'POST',
//   })
// };
export const saveBankVo = params => createServiceRequest({
  path: '/api/SmSupplierConfigService/saveSmSupplierConfig',
  params
})
//代理名称
export const findCodeByName = params => createServiceRequest({
  path: '/supplier/findByName',
  params,
  hack: true
})
// 注册暂存
export const TemporarySupplierRegister = params => createServiceRequest({
  path: '/api/supplierSelfService/tempStorageSupplier',
  params
})
// 注册保存
export const saveSupplierRegister = params => createServiceRequest({
  path: '/api/supplierSelfService/saveSelfSupplier',
  params
})
// 终止审批流程
export const stopApproveingOrder = params =>createServiceRequest({
  path: `${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`,
  params,
  base: gatewayUrl,
  hack: true
})
// 老的泛虹公司
export async function oddgetAllCorporation(params = {}) {
  return httpUtils.post(`${BASE_URL}/srm-baf-web/basic/listAllCorporation`);
}
// 供应商公司查询工厂
export const getCompanyFactory = (params = {}) => {
  return httpUtils.post(`/srm-baf-web/factory/findByCorporationCode`,params)
}
//查询供应商
export const getNormalSuppliers = (params = {}) => {
  return httpUtils.post(`/srm-baf-web/supplier/findNormalSuppliers`, params,true);
};
///审批流程根据id查信息
export const findApplySupplierInfoVo = params =>
  request({
    headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierApply/getApplySupplierInfoVo`,
    params,
    method: 'POST',
    //responseType: 'blob'
  })
 // 审批供应商流程保存
 export const saveLietInFlow = params => {
   return request({
    //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    url: `${smBaseUrl}/supplierAgent/saveAgentInFlow`,
    data: convertDataToFormData(params),
    method: 'POST',
  })
}
// 供应商修改保存
export const saveSupplierApply = params => {
  return request({
   //headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
   url: `${smBaseUrl}/supplierApply/saveOtherSupplier`,
   data: convertDataToFormData(params),
   method: 'POST',
 })
}
// 保存自主注册账号信息
export const saveRegistVo = params => {
  return request({
   url: `${smBaseUrl}/supplierSelf/saveRegistVo`,
   data: convertDataToFormData(params),
   method: 'POST',
 })
}
// 统一社会信用代码重复检查
export const checkCreditCode = params => createServiceRequest({
  path: '/supplierRegister/checkCreditCode',
  params,
  hack: true
})
// 注册账号重复效验
export const checkAccount = params => createServiceRequest({
  path: '/supplierRegister/findByAccountAndTenantCode',
  params,
  hack: true
})

//银联号
export const listUnionPayCode = (params) => {
  return httpUtils.get(`/srm-baf-web/supplierRegister/getBankNoByPage`, params);
};

// 获取登录信息

export const getSupplierUserMsg = params => createServiceRequest({
  path: '/supplier/getSupplierUserMsg',
  params
})
// 获取图形验证码

export const getImgUrl = params => {
  return request({
    url: `${gatewayUrl}${AUTH_SERVER_PATH}/userAuth/verifyCode`,
    data: convertDataToFormData(params),
    method: 'POST',
  })
}

// 自主注册邮箱验证码
export const UnifiedcheckCheckEmail = params => createServiceRequest({
  path: '/supplierSelf/CheckEmail',
  params,
  hack: true
})
// export const UnifiedcheckCheckEmail = params => {
//   return request({
//    url: `/api-gateway/basic-service/userExt/portalAuthCode`,
//    params,
//    method: 'POST',
//  })
// }