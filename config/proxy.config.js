export default {
  '/mocker.api': {
    target: 'http://10.4.32.53:7300/mock/5e0c81854987bb28481c8f55/mocker',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/mocker.api': '' },
  },
  '/service.api': {
    target: 'http://10.4.69.39:8100/api-gateway',
    // target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/service.api': '' },
  },
};
