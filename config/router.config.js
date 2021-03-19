/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-08 14:14:55
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-19 09:40:00
 * @Description  : 路由配置
 * @FilePath     : /Umi-WEB/config/router.config.js
 */
export default [
  {
    path: '/user',
    component: '../layouts/LoginLayout',
    title: '用户登录',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { title: '登录', path: '/user/login', component: './Login' },
    ],
  },
  {
    path: '/hooks',
    component: '../layouts/AuthLayout',
    title: 'React Hooks',
    routes: [
      {
        path: '/hooks/useState',
        component: './Hooks/useState',
        title: "useState"
      },
      {
        path: '/hooks/useEffect',
        component: './Hooks/useEffect',
        title: "useEffect"
      },
    ]
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    routes: [

      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
    ],
  },
];
