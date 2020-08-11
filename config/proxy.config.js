export const localTarget = 'http://10.8.4.121:8088';
export const onLineTarget = 'http://tecmp.changhong.com';

export default {
  '/service.api/srm-ps-web': {
    target: onLineTarget,
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/srm-ps-web': '/srm-ps-web' },
  },
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
    target: 'https://decmp.changhong.com/api-gateway/edm-service',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/edm-service': '' },
  },
  '/service.api/flow-service': {
    target: 'https://decmp.changhong.com/api-gateway/flow-service',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/edm-service': '' },
  }
};
