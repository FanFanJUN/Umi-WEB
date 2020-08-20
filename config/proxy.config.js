export const localTarget = 'http://10.8.4.121:8088';
export const onLineTarget = 'https://tecmp.changhong.com';

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
