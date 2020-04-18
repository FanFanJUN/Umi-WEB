export const target = 'http://10.4.69.39:8100';

export default {
  '/mocker.api': {
    target: 'http://rap2.taobao.org:38080/app/mock/249238',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/service.api/srm-baf-web' : {
    target: `http://10.4.69.39:8100`,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/service.api/srm-baf-web': '/srm-baf-web'
    }
  },
  '/service.api/srm-ps-web' : {
    target: `http://10.8.4.102:8088`,
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/service.api/srm-ps-web': '/srm-ps-web'
    }
  },
  // '/service.api/': {
  //   target: target,
  //   // target: 'http://10.8.4.102:8088',
  //   changeOrigin: true,
  //   secure: false,
  //   pathRewrite: { '^/service.api': '' },
  // }
};
