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
    title:'供应商注册',
    routes: [

      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
      {
        path: '/supplier',
        //component: '../layouts/AuthLayout',
        title: '供应商注册配置表',
        routes: [
          {
            path: '/supplier/configure',
            component: './SupplierConfigure',
            title: "供应商注册配置表"
          },
          {
            path: '/supplier/configure/create',
            component: './SupplierConfigure/CreateConfigure',
            title: "供应商注册配置表新增"
          },
          {
            path: '/supplier/configure/edit',
            component: './SupplierConfigure/EditConfigure',
            title: "供应商注册配置表编辑"
          },
          {
            path: '/supplier/configure/detail',
            component: './SupplierConfigure/DetailConfigure',
            title: "供应商注册配置表明细"
          },
        ]
      },
      {
        path: '/register',
        //component: '../layouts/BlankLayout.js',
        title: '注册字段配置表',
        routes:[
          {
            path: '/register/field',
            component: './RegisterField',
            title: "供应商注册字段配置表"
          },
        ]
      }
      /* add Example
      {
        path: '/path',
        component: './Page',
        title: "**页面"
      }
      */
    ],
  }
];

