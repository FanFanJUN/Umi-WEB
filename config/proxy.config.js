export default {
  '/mocker.api': {
    target: 'http://rap2.taobao.org:38080/app/mock/249238',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/service.api': {
    target: 'http://10.4.69.39:8100',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api': '' },
  },
};
