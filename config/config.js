import path, { resolve } from 'path';
import webpackPlugin from './plugin.config';
import pageRoutes from './router.config';
import proxy from './proxy.config';
import themeConfig from './theme.config';

const appConfigPath = path.join(__dirname, '../public/app.config.json');
const pkg = path.join(__dirname, '../package.json');
const { base } = require(appConfigPath);
const { name, title } = require(pkg);

export default {
  history: 'hash',
  treeShaking: true,
  ignoreMomentLocale: true,
  targets: { ie: 11 },
  base: `${base}/`,
  publicPath: `${base}/`,
  mountElementId: name,
  hash: true,
  plugins: [
    ['@umijs/plugin-qiankun'],
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        dynamicImport: {
          webpackChunkName: true,
          loadingComponent: './components/Loader',
        },
        title,
        dll: {
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es'],
          exclude: ['@umijs/plugin-qiankun'],
        },
        pwa:
          process.env.NODE_ENV === 'production'
            ? {
              workboxPluginMode: 'InjectManifest',
              workboxOptions: {
                importWorkboxFrom: 'local',
              },
            }
            : false,
        locale: {
          enable: true,
          default: 'zh-CN',
          baseNavigator: false,
          antd: true,
        },
      },
    ],
  ],
  routes: pageRoutes,
  proxy,
  theme: themeConfig(),
  alias: {
    '@': resolve(__dirname, './src'),
  },
  define: {
    'process.env.MOCK': process.env.MOCK,
  },
  extraBabelPlugins: [
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
    [
      'import',
      {
        libraryName: 'suid',
        libraryDirectory: 'es',
        style: true,
      },
      'suid',
    ],
  ],
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
};
