export const localTarget = 'http://decmp.changhong.com';
export const onLineTarget = 'https://tecmp.changhong.com';

export default {
  '/service.api': {
    target: localTarget,
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
