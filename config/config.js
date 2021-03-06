/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2020-12-14 22:46:34
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 13:45:33
 * @Description  : TODO
 * @FilePath     : /Umi-WEB/config/config.js
 */
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
  history: 'browser',
  treeShaking: true,
  ignoreMomentLocale: true,
  targets: { ie: 11 },
  // base: `${base}/`,
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
    basePath: `/`,
  },
  chainWebpack: webpackPlugin,
  // cssLoaderOptions: {
  //   modules: true,
  //   getLocalIdent: (context, localIdentName, localName) => {
  //     if (
  //       context.resourcePath.includes('node_modules') ||
  //       context.resourcePath.includes('ant.design.pro.less') ||
  //       context.resourcePath.includes('global.less')
  //     ) {
  //       return localName;
  //     }
  //     const match = context.resourcePath.match(/src(.*)/);
  //     if (match && match[1]) {
  //       const antdProPath = match[1].replace('.less', '');
  //       const arr = slash(antdProPath)
  //         .split('/')
  //         .map(a => a.replace(/([A-Z])/g, '-$1'))
  //         .map(a => a.toLowerCase());
  //       return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
  //     }
  //     return localName;
  //   },
  // },
};
