import { request, constants } from "../utils";
import { gatewayUrl } from '../utils/commonUrl';
const { AUTH_SERVER_PATH } = constants;
const { FLOW_HOST } = constants;
function createServiceRequest(option) {
  const {
    path: url,
    method = "POST",
    headers,
    params: data,
    base = psBaseUrl,
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
      message: '请求异常，请联系管理员',
      ...error,
    })
  })
}
/** 登录*/
export async function login(params) {
  const url = `${gatewayUrl}${AUTH_SERVER_PATH}/userAuth/login`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    params: params,
  });
}

/** 退出*/
export async function logout(params) {
  const url = `${AUTH_SERVER_PATH}/userAuth/logout`;
  return request({
    url,
    method: "POST",
    headers: {
      needToken: false,
    },
    data: params,
  });
}

/** 终止审批流程 */
export const stopApprove = params => createServiceRequest({
  path: `${FLOW_HOST}/flowInstance/checkAndEndByBusinessId`,
  params,
  base: gatewayUrl,
  hack: true
})
