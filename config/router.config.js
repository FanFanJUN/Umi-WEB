/*
 * @Author       : LiCai
 * @connect      : 1981824361@qq.com
 * @Date         : 2021-03-08 14:14:55
 * @LastEditors  : LiCai
 * @LastEditTime : 2021-03-24 17:00:27
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
      {
        path: '/hooks/test1',
        component: './Hooks/useEffect/test1',
        title: "useEffect测试"
      },
      {
        path: '/hooks/useEffectTest2',
        component: './Hooks/useEffect/test2',
        title: "useEffect测试2"
      },
      {
        path: '/hooks/useContext',
        component: './Hooks/useContext',
        title: "useContext测试"
      },
      {
        path: '/hooks/useContext2',
        component: './Hooks/useContext/test1',
        title: "useContext测试2"
      },
      {
        path: '/hooks/useReducer',
        component: './Hooks/useReducer',
        title: "useReducer测试"
      },
      {
        path: '/hooks/useReducerTest1',
        component: './Hooks/useReducer/Test',
        title: "useReducer复杂实例"
      },
      {
        path: '/hooks/useMemo',
        component: './Hooks/useMemo',
        title: "useMemo"
      },
    ]
  },
  {
    path: '/comps',
    component: '../layouts/AuthLayout',
    title: '组件测试',
    routes: [
      {
        path: '/comps/virtable',
        component: './TestComps/test1',
        title: "虚表"
      },
      {
        path: '/comps/DragModal',
        component: './TestComps/ModalDrag',
        title: "可拖拽Modal"
      },
      {
        path: '/comps/DragModal2',
        component: './TestComps/ModalDrag/test1',
        title: "可拖拽Modal2"
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
