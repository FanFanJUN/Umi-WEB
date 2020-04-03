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
    path: '/',
    component: '../layouts/AuthLayout',
    title: '业务页面',
    routes: [

      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: "/moduleName/demo",
        name: "moduleName",
        component: "./Demo",
        title: 'demo',
      },
      {
        path: '/purchase/strategy',
        component: './PurchaseStrategy',
        title: "采购策略"
      },
      {
        path: '/purchase/strategy/detail',
        component: './PurchaseStrateGy/StrategyDetail',
        title: "策略详情"
      }
    ],
  }
];

