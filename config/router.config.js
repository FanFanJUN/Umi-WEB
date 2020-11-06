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
    path: '/material',
    component: '../layouts/LoginLayout',
    title: '实物认定',
    routes: [
      { path: '/material/MasterData/index',component: './MaterialCognizance/MasterData',title: '实物认定主数据'},
      { path: '/material/Cognizance/index',component: './MaterialCognizance/Cognizance',title: '实物认定计划'},
      { path: '/material/Cognizance/AdmitEdit/index',component: './MaterialCognizance/Cognizance/AdmitEdit/index',title: '实物认定计划'},
      { path: '/material/Cognizance/ManualEdit/index',component: './MaterialCognizance/Cognizance/ManualEdit/index',title: '手工单创建'},
      { path: '/material/Enforcement/index',component: './MaterialCognizance/Enforcement',title: '实物认定执行'},
      { path: '/material/Enforcement/Edit/index',component: './MaterialCognizance/Enforcement/Edit/index',title: '实物认定执行'}
    ]
  },
  {
    path: '/gradeSystem',
    component: '../layouts/LoginLayout',
    title: '系统打分主数据',
    routes: [
      {
        path: '/gradeSystem/acceptFYP',
        component: './AcceptFYPMain',
        title: '入厂验收批次合格率'
      },
      {
        path: '/gradeSystem/deliveryAnomaly',
        component: './DeliveryAnomaly',
        title: '交货异常事故次数'
      },
      {
        path: '/gradeSystem/businessProblem',
        component: './BusinessProblem',
        title: '商务问题响应'
      },
      {
        path: '/gradeSystem/orderConfirmation',
        component: './OrderConfirmation',
        title: '订单及时确认率'
      },
      {
        path: '/gradeSystem/consignmentOrders',
        component: './ConsignmentOrders',
        title: '寄售订单比例'
      },
      {
        path: '/gradeSystem/timelyDeliveryRate',
        component: './TimelyDeliveryRate',
        title: '交货及时率'
      },
      {
        path: '/gradeSystem/sampleProblemRate',
        component: './SampleProblemRate',
        title: '送样情况'
      },
      {
        path: '/gradeSystem/environmentalProblem',
        component: './EnvironmentalProblem',
        title: '环境问题'
      },
      {
        path: '/gradeSystem/agreementSigned',
        component: './AgreementSigned',
        title: '质量赔偿和环保协议签订'
      },
      {
        path: '/gradeSystem/qualityTechnology',
        component: './QualityTechnology',
        title: '质量、技术方面的协作'
      },
      {
        path: '/gradeSystem/pcnChangeNotInformed',
        component: './PcnChangeNotInformed',
        title: 'PCN变更未告知次数'
      },
      {
        path: '/gradeSystem/qualityProblemComplaints',
        component: './QualityProblemComplaints',
        title: '质量问题投诉'
      },
      {
        path: '/gradeSystem/defectRate',
        component: './DefectRate',
        title: '不良率'
      },
      {
        path: '/gradeSystem/targetDefectRate',
        component: './TargetDefectRate',
        title: '目标不良率'
      },
    ]
  },
  /**供应商审核 */
  {
    path: '/supplierAudit',
    component: '../layouts/LoginLayout',
    title: '供应商审核',
    routes: [
      { path: '/supplierAudit/auditTypeManagement', component: './SupplierAudit/mainData/auditTypeManagement', title: '审核类型管理-主数据' },
      { path: '/supplierAudit/managementAuditMode', component: './SupplierAudit/mainData/managementAuditMode', title: '审核方式管理=主数据' },
      { path: '/supplierAudit/auditCauseManagement', component: './SupplierAudit/mainData/auditCauseManagement', title: '审核原因管理=主数据' },
      { path: '/supplierAudit/auditOrganizationManagement', component: './SupplierAudit/mainData/auditOrganizationManagement', title: '审核组织方式管理-主数据' },
      { path: '/supplierAudit/managementAuditCriteria', component: './SupplierAudit/mainData/managementAuditCriteria', title: '审核准则管理-主数据' },
      { path: '/supplierAudit/AudittypeWithPro', component: './SupplierAudit/mainData/AudittypeWithPro', title: '审核类型默认审核项目-主数据' },
      { path: '/supplierAudit/ConclusionPassed', component: './SupplierAudit/mainData/ConclusionPassed', title: '结论及是否通过-主数据' },
      { path: '/supplierAudit/AwcConf', component: './SupplierAudit/mainData/AwcConf', title: '审核类型、是否通过和结论配置-主数据' },
      { path: '/supplierAudit/PrlConf', component: './SupplierAudit/mainData/PrlConf', title: '百分比、评定等级、风险等级配置-主数据' },
      { path: '/supplierAudit/ReviewCityConf', component: './SupplierAudit/mainData/ReviewCityConf', title: '审核地区城市配置-主数据' },
      { path: '/supplierAudit/AuditRequirementsManagementDetail', component: './SupplierAudit/AuditRequirementsManagementDetail', title: '审核需求管理明细' },
      { path: '/supplierAudit/AuditRequirementsManagement', component: './SupplierAudit/AuditRequirementsManagement', title: '审核需求管理' },

      { path: '/supplierAudit/AuditRequirementsManagementFlow', component: './SupplierAudit/FlowList', title: '审核需求管理流程中' },
      { path: '/supplierAudit/monthAuditInFlow', component: './SupplierAudit/FlowList/monthAuditInFlow', title: '月度审核计划流程中' },
      { path: '/supplierAudit/monthAuditChangeInFlow', component: './SupplierAudit/FlowList/monthAuditChangeInFlow', title: '月度审核计划变更流程中' },

      { path: '/supplierAudit/AuditRequirementsManagementAdd', component: './SupplierAudit/AuditRequirementsManagement/add', title: '审核需求管理新增' },
      { path: '/supplierAudit/AnnualAuditPlan', component: './SupplierAudit/AnnualAuditPlan', title: '年度审核计划管理' },
      { path: '/supplierAudit/AnnualAuditPlanEda', component: './SupplierAudit/AnnualAuditPlan/EdaPage', title: '年度审核计划管理新增' },
      { path: '/supplierAudit/AnnualAuditPlanDetail', component: './SupplierAudit/AnnualAuditPlan/EdaPage', title: '年度审核计划管理明细' },
      { path: '/supplierAudit/MonthAuditPlan', component: './SupplierAudit/MonthAuditPlan', title: '月度审核计划管理' },
      { path: '/supplierAudit/MonthAuditPlanEda', component: './SupplierAudit/MonthAuditPlan/EdaPage', title: '月度审核计划管理新增' },
      { path: '/supplierAudit/detailList', component: './SupplierAudit/MonthAuditPlan/detailList', title: '月度审核计划明细' },
      { path: '/supplierAudit/MonthAuditChangeDetail', component: './SupplierAudit/MonthAuditPlan/component/changeDetail', title: '月度审核计划变更明细' },
    ]
  },
  {
    path: '/pcnModify',
    component: '../layouts/LoginLayout',
    title: 'PCN变更',
    routes: [
      /**PCN采购 */
      { path: '/pcnModify/Purchase/index', component: './PCNModify/Purchase', title: 'PCN变更' },
      { path: '/pcnModify/Purchase/Edit/index', component: './PCNModify/Purchase/Edit/index', title: 'PCN变更单编辑' },
      { path: '/pcnModify/Purchase/Detail/index', component: './PCNModify/Purchase/Detail/index', title: 'PCN变更单明细' },
      { path: '/pcnModify/ApprovePage/PCNVerificationResults', component: './PCNModify/ApprovePage/PCNVerificationResults', title: 'PCN流程变更单实物验证结果' },
      { path: '/pcnModify/ApprovePage/PCNCustomerOpinion', component: './PCNModify/ApprovePage/PCNCustomerOpinion', title: 'PCN流程变更单客户意见' },
      { path: '/pcnModify/ApprovePage/PCNFindingsAudit', component: './PCNModify/ApprovePage/PCNFindingsAudit', title: 'PCN流程变更单审核意见' },
      { path: '/pcnModify/ApprovePage/PCNModifyResult', component: './PCNModify/ApprovePage/PCNModifyResult', title: 'PCN流程变更单变更结果' },
      { path: '/pcnModify/ApprovePage/PCNImplementResult', component: './PCNModify/ApprovePage/PCNImplementResult', title: 'PCN流程变更单执行信息' },
      { path: '/pcnModify/ApprovePage/PCNApproveDetail', component: './PCNModify/ApprovePage/PCNApproveDetail', title: 'PCN流程变更单最终确认' },
      { path: '/pcnModify/ApprovePage/PCNSeewholeDetail', component: './PCNModify/ApprovePage/PCNSeewholeDetail', title: 'PCN流程变更单明细' },
      /**PCN供应商 */
      { path: '/pcnModify/Supplier/index', component: './PCNModify/Supplier', title: 'PCN变更发起供应商' },
      { path: '/pcnModify/Supplier/Create/index', component: './PCNModify/Supplier/Create/index', title: 'PCN变更发起供应商新增' },
      { path: '/pcnModify/Supplier/Edit/index', component: './PCNModify/Supplier/Edit/index', title: 'PCN变更发起供应商编辑' },
      { path: '/pcnModify/Supplier/Detail/index', component: './PCNModify/Supplier/Detail/index', title: 'PCN变更发起供应商明细' },
      /**PCN变更主数据 */
      { path: '/pcnModify/MasterData/index', component: './PCNModify/MasterData', title: 'PCN变更主数据' },
    ]
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
      { path: '/qualitySynergy/DataSharingDetailList', component: './QualitySynergy/TechnicalDataSharing/DataSharingDetailList', title: '技术资料分享明细' },
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
      {
        path: '/review/main',
        component: './ReviewMain',
        title: '评审人配置'
      },
      {
        path: '/supplier/appraise/project',
        component: './SupplierAppraise',
        title: '供应商评价项目'
      },
      {
        path: '/supplier/appraise/project/team/approve', component: './SupplierAppraise/Approve/Team',
        title: '采购小组确认'
      },
      {
        path: '/supplier/appraise/project/leader/approve', component: './SupplierAppraise/Approve/Leader',
        title: '领导确认'
      },
      {
        path: '/supplier/appraise/project/create',
        component: './SupplierAppraise/Create',
        title: '新增供应商评价项目'
      },
      {
        path: '/supplier/appraise/project/editor',
        component: './SupplierAppraise/Editor',
        title: '编辑供应商评价项目'
      },
      {
        path: '/supplier/appraise/project/detail',
        component: './SupplierAppraise/Detail',
        title: '供应商评价项目详情'
      },
      {
        path: '/supplier/appraise/project/allocation',
        component: './SupplierAppraise/Allocation',
        title: '评价项目分配评审人'
      },
      {
        path: '/supplier/appraise/project/manual/evaluate',
        component: './ManualEvaluate/Evaluate',
        title: '评价'
      },
      {
        path: '/supplier/appraise/project/manual/evaluate/detail',
        component: './ManualEvaluate/Detail',
        title: '评价项目明细'
      },
      {
        path: '/supplier/appraise/project/evaluate',
        component: './ManualEvaluate',
        title: '人工评价'
      },
      {
        path: '/supplier/appraise/project/evaluate/approve',
        component: './ManualEvaluate/Approve',
        title: '人工评价审核'
      },
      {
        path: '/supplier/appraise/project/evaluate/approve/editor',
        component: './ManualEvaluate/Approve/Editor',
        title: '人工评价审核编辑'
      },
      {
        path: '/supplier/appraise/project/evaluate/result',
        component: './SupplierAppraise/EvaluateResult',
        title: '评价结果'
      },
      {
        path: '/evaluate/level/main',
        component: './EvaluateLevelMain',
        title: '评定等级'
      },
      {
        path: '/supplier/appraise/project/evaluate/result/score/details',
        component: './ManualEvaluate/ScoreDetails',
        title: '综合得分详情'
      },
      {
        path: '/supplier/appraise/project/evaluate/result/score/details/system',
        component: './ManualEvaluate/ScoreDetails/System',
        title: '系统打分评分项明细'
      },
      {
        path: '/supplier/appraise/project/evaluate/result/score/details/manual',
        component: './ManualEvaluate/ScoreDetails/Manual',
        title: '人工打分评分项明细'
      },
      /**无账号供应商 */
      { path: '/supplier/ImportSupplier/index', component: './ImportSupplier/index', title: '创建无账号供应商' },
      { path: '/supplier/ImportSupplier/create/index', component: './ImportSupplier/create/index', title: '新增无账号供应商' },
      { path: '/supplier/ImportSupplier/Edit/index', component: './ImportSupplier/Edit/index', title: '编辑无账号供应商' },
      { path: '/supplier/ImportSupplier/Detail/index', component: './ImportSupplier/Detail/index', title: '无账号供应商明细' },
      { path: '/supplier/ImportSupplier/ApprovePage/ImportSupplierApproveEdit', component: './ImportSupplier/ApprovePage/ImportSupplierApproveEdit', title: '无账号供应商流程修改' },
      { path: '/supplier/ImportSupplier/ApprovePage/ImportSupplierApprovePage', component: './ImportSupplier/ApprovePage/ImportSupplierApprovePage', title: '无账号供应商流程审核' },
      { path: '/supplier/ImportSupplier/ApprovePage/ImportSupplierApproveDetail', component: './ImportSupplier/ApprovePage/ImportSupplierApproveDetail', title: '无账号供应商流程明细' }
    ],
  }
];
