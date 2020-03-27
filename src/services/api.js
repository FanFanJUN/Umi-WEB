import { request, constants } from "@/utils";

const { AUTH_SERVER_PATH } = constants;

/** 登录*/
export async function login(params) {
  const url = `${AUTH_SERVER_PATH}/userAuth/login`;
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

