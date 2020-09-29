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
      { path: '/qualitySynergy/EPMaterial', component: './QualitySynergy/EPMaterial/MaterialManagement', title: '环保资料物料' },
      { path: '/qualitySynergy/EPMaterial/editForm', component: './QualitySynergy/EPMaterial/MaterialManagement/editForm', title: '环保资料物料-新增' },
      { path: '/qualitySynergy/EPMaterial/detailForm', component: './QualitySynergy/EPMaterial/MaterialManagement/detailForm', title: '环保资料物料-明细' },
      { path: '/qualitySynergy/EPMaterial/suppliersToFill', component: './QualitySynergy/EPMaterial/SuppliersToFill', title: '环保资料填报' },
      { path: '/qualitySynergy/EPMaterial/suppliersFillForm', component: './QualitySynergy/EPMaterial/SuppliersToFill/editForm', title: '环保资料填报-填报页面' },
      { path: '/qualitySynergy/DataSharingList', component: './QualitySynergy/TechnicalDataSharing/DataSharingList', title: '技术资料分享' },
      { path: '/qualitySynergy/DataSharingAdd', component: './QualitySynergy/TechnicalDataSharing/DataSharingList/edit', title: '技术资料分享-新增' },
      { path: '/qualitySynergy/TechnicalInformationDownload', component: './QualitySynergy/TechnicalInformationDownload', title: '技术资料下载' },
      { path: '/qualitySynergy/UseMaterialList', component: './QualitySynergy/mainData/UseMaterialList', title: '限用物质清单-主数据' },
      { path: '/qualitySynergy/EnvironmentalProtectionStandard', component: './QualitySynergy/mainData/EnvironmentalProtectionStandard', title: '环保标准-主数据' },
      { path: '/qualitySynergy/LimitSuppliesScope', component: './QualitySynergy/mainData/LimitSuppliesScope', title: '限用物质适用范围-主数据' },
      { path: '/qualitySynergy/BUCompanyOrganizationRelation', component: './QualitySynergy/mainData/BUCompanyOrganizationRelation', title: '业务单元与公司采购组织对应关系-主数据' },
      { path: '/qualitySynergy/LimitSuppliesBasicUnit', component: './QualitySynergy/mainData/LimitSuppliesBasicUnit', title: '限用物质基本单位-主数据' },
      { path: '/qualitySynergy/TechnicalDataFileTypes', component: './QualitySynergy/mainData/TechnicalDataFileTypes', title: '技术资料文件类别-主数据' },
      { path: '/qualitySynergy/ExemptionClause', component: './QualitySynergy/mainData/ExemptionClause', title: '豁免条款-主数据' },
      { path: '/qualitySynergy/LimitMaterial', component: './QualitySynergy/mainData/LimitMaterial', title: '环保标准限用物质对应关系-主数据' },
      { path: '/qualitySynergy/BusinessUnitToBU', component: './QualitySynergy/mainData/BusinessUnitToBU', title: '业务模块对业务单元主数据-主数据' },
      { path: '/qualitySynergy/BU', component: './QualitySynergy/mainData/BU', title: '业务单元主数据-主数据' },
      { path: '/qualitySynergy/EPStatement', component: './QualitySynergy/mainData/EPStatement', title: '环保数据字典表' },

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
      { path: '/supplier/supplierRegister/SupplierDetail/index', component: './supplierRegister/SupplierDetail', title: '供应商明细' },
      { path: '/supplier/supplierRegister/ApprovePage/SupplierRegisterApproveEdit', component: './supplierRegister/ApprovePage/index', title: '供应商注册修改审核' },
      { path: '/supplier/supplierRegister/ApprovePage/SupplierRegisterApprovePage', component: './supplierRegister/ApprovePage/indexpage', title: '供应商注册审核' },
      { path: '/supplier/supplierRegister/ApprovePage/SupplierRegisterApproveAgentEdit', component: './supplierRegister/ApprovePage/agentpage', title: '供应商注册代理商修改' },
      { path: '/supplier/supplierRegister/ApprovePage/SupplierRegisterApproveDetail', component: './supplierRegister/ApprovePage/detail', title: '供应商注册明细' },
      /**供应商变更 */
      { path: '/supplier/supplierModify/index', component: './supplierModify/index', title: '供应商变更' },
      { path: '/supplier/supplierModify/create/index', component: './supplierModify/create/index', title: '供应商变更新建变更单' },
      { path: '/supplier/supplierModify/Edit/index', component: './supplierModify/Edit/index', title: '供应商变更编辑' },
      { path: '/supplier/supplierModify/details/index', component: './supplierModify/details/index', title: '供应商变更明细' },
      { path: '/supplier/supplierModify/ApprovePage/SupplierModifyApproveEdit', component: './supplierModify/ApprovePage/indexEdit', title: '供应商变更修改审核' },
      { path: '/supplier/supplierModify/ApprovePage/SupplierModifyApprovePage', component: './supplierModify/ApprovePage/indexpage', title: '供应商变更审核' },
      { path: '/supplier/supplierModify/ApprovePage/SupplierModifyApproveAgentEdit', component: './supplierModify/ApprovePage/indexAgentEdit', title: '供应商变更代理商审核' },
      { path: '/supplier/supplierModify/ApprovePage/SupplierModifyApproveDetail', component: './supplierModify/ApprovePage/indexDetail', title: '供应商变更流程明细' },
      /**供应商自主注册 */
      { path: '/supplier/selfRegister/index', component: './selfRegister/index', title: '供应商自主注册' },
      /**我的注册信息 */
      { path: '/supplier/selfRegister/OutSideRegisterListView', component: './selfRegister/OutSideRegisterListView', title: '我的注册信息' },
      /**我的详细信息 */
      { path: '/supplier/supplierRegister/MySupplierInfo', component: './supplierRegister/MySupplierInfo', title: '我的详细信息' },
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
        component: './SupplierRecommendDemand/CreateRecommendDemand',
        title: '新增供应商推荐需求'
      },
      {
        path: '/supplier/recommend/demand/editor',
        component: './SupplierRecommendDemand/EditorRecommendDemand',
        title: '编辑供应商推荐需求'
      },
      {
        path: '/supplier/recommend/fillIn/data',
        component: './SupplierRecommendDemand/RecommendData',
        title: '推荐资料填报'
      },
      {
        path: '/supplier/suvery/information',
        component: './SupplierRecommendDemand/RecommendDataTable',
        title: '供应商调查信息'
      },
      {
        path: '/supplier/recommend/fillIn/infomation/confirm',
        component: './SupplierRecommendDemand/FillInInfomationConfirm',
        title: '填报信息确认'
      },
      {
        path: '/supplier/recommend/review/team/confirm',
        component: './SupplierRecommendDemand/ReviewTeamConfirm',
        title: '评审小组确定'
      },
      {
        path: '/supplier/recommend/review/mark',
        component: './SupplierRecommendDemand/ReviewMark',
        title: '评审打分'
      },
      {
        path: '/supplier/recommend/team/filter/opinion',
        component: './SupplierRecommendDemand/FilterOpinion',
        title: '评审小组筛选意见'
      },
      //  企业社会责任调查表选项主数据
      {
        path: '/csr/config',
        component: './CSRConfig',
        title: '企业社会责任'
      },
       /**无账号供应商 */
      { path: '/supplier/ImportSupplier/index', component: './ImportSupplier/index', title: '创建无账号供应商' },
      { path: '/supplier/ImportSupplier/create/index', component: './ImportSupplier/create/index', title: '新增无账号供应商' },
      { path: '/supplier/ImportSupplier/Edit/index', component: './ImportSupplier/Edit/index', title: '编辑无账号供应商' },
    ],
  },
];

