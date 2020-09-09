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
      { path: '/qualitySynergy/DataSharingList', component: './QualitySynergy/TechnicalDataSharing/DataSharingList', title: '技术资料分享' },
      { path: '/qualitySynergy/DataSharingAdd', component: './QualitySynergy/TechnicalDataSharing/DataSharingList/edit', title: '技术资料分享-新增' },
      { path: '/qualitySynergy/TechnicalInformationDownload', component: './QualitySynergy/TechnicalInformationDownload', title: '技术资料下载'},
      { path: '/qualitySynergy/UseMaterialList', component: './QualitySynergy/mainData/UseMaterialList', title: '限用物资清单-主数据' },
      { path: '/qualitySynergy/EnvironmentalProtectionStandard', component: './QualitySynergy/mainData/EnvironmentalProtectionStandard', title: '环保标准-主数据' },
      { path: '/qualitySynergy/LimitSuppliesScope', component: './QualitySynergy/mainData/LimitSuppliesScope', title: '限用物资适用范围-主数据' },
      { path: '/qualitySynergy/BUCompanyOrganizationRelation', component: './QualitySynergy/mainData/BUCompanyOrganizationRelation', title: 'BU与公司采购组织对应关系-主数据' },
      { path: '/qualitySynergy/LimitSuppliesBasicUnit', component: './QualitySynergy/mainData/LimitSuppliesBasicUnit', title: '限用物资基本单位-主数据' },
      { path: '/qualitySynergy/TechnicalDataFileTypes', component: './QualitySynergy/mainData/TechnicalDataFileTypes', title: '技术资料文件类别-主数据'},
      { path: '/qualitySynergy/ExemptionClause', component: './QualitySynergy/mainData/ExemptionClause', title: '豁免条款-主数据'},
      { path: '/qualitySynergy/LimitMaterial', component: './QualitySynergy/mainData/LimitMaterial', title: '环保标准限用物质对应关系-主数据'},
      { path: '/qualitySynergy/BusinessUnitToBU', component: './QualitySynergy/mainData/BusinessUnitToBU', title: '业务模块对业务单元-主数据'},

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
     {
       path: '/supplier/recommend/demand',
       component: './SupplierRecommendDemand',
       title: '供应商推荐需求管理'
     },
     {
       path: '/supplier/recommend/demand/create',
       component: './SupplierRecommendDemand/RecommendDemand',
       title: '供应商推荐需求'
     },
     {
       path: '/supplier/recommend/data',
       component: './SupplierRecommendDemand/RecommendData',
       title: '供应商推荐资料'
     }
    ],
  },

];

