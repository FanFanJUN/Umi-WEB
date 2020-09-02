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
    path: '/qualitySynergy',
    component: '../layouts/LoginLayout',
    title: '环保材料',
    routes: [
      { path: '/qualitySynergy/EPMaterial', component: './QualitySynergy/EPMaterial/MaterialManagement', title: '填报环保资料物料' },
      { path: '/qualitySynergy/EPMaterial/editForm', component: './QualitySynergy/EPMaterial/MaterialManagement/editForm', title: '填报环保资料物料-新增' },
      { path: '/qualitySynergy/EPMaterial/detailForm', component: './QualitySynergy/EPMaterial/MaterialManagement/detailForm', title: '填报环保资料物料-明细' },
      { path: '/qualitySynergy/EPMaterial/suppliersToFill', component: './QualitySynergy/EPMaterial/SuppliersToFill', title: '环保资料填报' },
      { path: '/qualitySynergy/EPMaterial/suppliersFillForm', component: './QualitySynergy/EPMaterial/SuppliersToFill/editForm', title: '环保资料填报-填报页面' },
    ]
  },
  {
    path: '/',
    component: '../layouts/AuthLayout',
    title: '供应商注册',
    routes: [

      { path: '/', redirect: '/dashboard' },
      { path: '/dashboard', component: './Dashboard' },
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
      {
        path: '/supplier/register/field',
        component: './RegisterField',
        title: "供应商注册字段配置表"
      },
      { path: '/supplier/purchase/accounting', component: './Supplier', title: '供应商采购会计视图变更' },
      { path: '/supplier/purchase/accounting/create', component: './Supplier/Create', title: '新增供应商采购会计视图变更' },
      { path: '/supplier/purchase/accounting/editor', component: './Supplier/Editor', title: '编辑供应商采购会计视图变更' },
      { path: '/supplier/purchase/accounting/detail', component: './Supplier/Detail', title: '供应商采购会计视图变更明细' },
      { path: '/supplier/purchase/accounting/approve', component: './Supplier/ApprovePage', title: '供应商采购会计视图变更审批' },
      { path: '/supplier/purchase/accounting/approve/editor', component: './Supplier/ApprovePage/Editor', title: '供应商采购会计视图变更编辑' },
      /**供应商注册 */
      { path: '/supplier/supplierRegister/SupplierRegisterListView', component: './supplierRegister/SupplierRegisterListView', title: '供应商注册' },
      { path: '/supplier/supplierRegister/SupplierEdit/index', component: './supplierRegister/SupplierEdit', title: '供应商编辑' },
      /* add Example
      {
        path: '/path',
        component: './Page',
        title: "**页面"
      }
      */
    ],
  },
  
];

