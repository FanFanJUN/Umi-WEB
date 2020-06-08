export const localTarget = 'http://10.8.4.121:8088';
export const onLineTarget = 'http://decmp.changhong.com';

export default {
  '/mocker.api': {
    target: 'http://rap2.taobao.org:38080/app/mock/249238',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  // '/service.api/srm-baf-web' : {
  //   target: `http://10.4.69.39:8100`,
  //   changeOrigin: true,
  //   secure: false,
  //   pathRewrite: {
  //     '^/service.api/srm-baf-web': '/srm-baf-web'
  //   }
  // },
  // '/service.api/srm-ps-web' : {
  //   target: `http://10.8.4.102:8088`,
  //   changeOrigin: true,
  //   secure: false,
  //   pathRewrite: {
  //     '^/service.api/srm-ps-web': '/srm-ps-web'
  //   }
  // },
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
  '/service.api/edm-service': {
    target: 'https://decmp.changhong.com/api-gateway/edm-service',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api/edm-service': '' },
  }
};
