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
        path: '/purchase/strategy',
        component: './PurchaseStrategy',
        title: "采购策略"
      },
      {
        path: '/purchase/strategy/detail',
        component: './PurchaseStrategy/DetailStrategy',
        title: "策略详情"
      },
      {
        path: '/purchase/strategy/create',
        component: './PurchaseStrategy/CreateStrategy',
        title: "新增策略"
      },
      {
        path: '/purchase/strategy/editor',
        component: './PurchaseStrategy/EditorStrategy',
        title: '编辑策略'
      },
      {
        path: '/purchase/strategy/change',
        component: './PurchaseStrategy/ChangeStrategy',
        title: '变更采购策略'
      },
      {
        path: '/purchase/strategy/change/history',
        component: './PurchaseStrategy/ChangeStrategyHistory',
        title: '采购策略变更历史'
      },
      {
        path: '/purchase/strategy/approve',
        component: './PurchaseStrategy/ApprovePage',
        title: '采购策略审批流程'
      },
      {
        path: '/purcahse/strategy/approve/editor',
        component: './PurchaseStrategy/ApprovePage/Editor',
        title: '采购策略审批编辑'
      },
      {
        path: '/purchase/strategy/approve/change',
        component: './PurchaseStrategy/ApprovePage/Change',
        title: '采购策略变更流程'
      },
      {
        path: '/purchase/strategy/approve/change/editor',
        component: './PurchaseStrategy/ApprovePage/ChangeEditor',
        title: '采购策略变更编辑'
      },
      {
        path: '/purchase/strategy/execute',
        component: './PurchaseStrategyExecute',
        title: '采购策略执行明细'
      },
      {
        path: '/purchase/strategy/approve/detail',
        component: './PurchaseStrategy/ApprovePage/Detail',
        title: '采购策略审批明细'
      }
    ],
  }
];

