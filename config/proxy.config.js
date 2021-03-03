export const localTarget = 'http://decmp.changhong.com'; // 开发访问地址
export const onLineTarget = 'https://tecmp.changhong.com'; // 测试访问地址 更换请更换下面的变量
// export const onLineTarget = 'http://10.9.37.193:8087'; // 本地测试

export default {
  '/service.api': {
    target: onLineTarget,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api': '' },
  },
  '/api-gateway': {
    target: `${onLineTarget}/api-gateway`,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/api-gateway': '' }
  },
  '/service.api/edm-service': {
    target: `${onLineTarget}/api-gateway/edm-service`,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/edm-service': '' },
  },
  '/service.api/flow-service': {
    target: `${onLineTarget}/api-gateway/flow-service`,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/edm-service': '' },
  }
};
