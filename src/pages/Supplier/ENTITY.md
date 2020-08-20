### 头实体清单
/**
  * 租户代码
  */
@Column(name = "tenant_code")
private String tenantCode;
/**
  * 单号
  */
@Column(name = "doc_number")
private String docNumber;
/**
  * 供应商id
  */
@Column(name = "supplier_id")
private String supplierId;

@Column(name = "supplier_code")
private String supplierCode;
/**
  * 变更说明
  */
@Column(name = "reason")
private String reason;
/**
  * 组织机构代码
  */
@Column(name = "org_code")
private String orgCode;
/**
  * 组织机构id
  */
@Column(name = "org_id")
private String orgId;
/**
  * 组织机构名称
  */
@Column(name = "org_name")
private String orgName;
/**
  * 组织机构路径
  */
@Column(name = "org_path")
private String orgPath;
/**
  * 工作说明
  */
@Column(name = "work_caption")
private String workCaption;
/**
  * 流程状态
  */
@Column(name = "flow_status")
private FlowStatus flowStatus;
/**
  * 供应商名称
  */
@Column(name = "supplier_name")
private String supplierName;

/**
  * 财务视图变更行项
  */
@Transient
private List<SupplierFinanceViewModifyLine> supplierFinanceViewModifyLines;

/**
  * 采购会计视图变更历史
  */
@Transient
private List<SupplierFinanceViewModifyHistory> supplierFinanceViewModifyHistories;

### 行实体清单
 /**
  * 单号
  */
@Column(name = "doc_number")
private String docNumber;
/**
  * 采购会计视图ID
  */
@Column(name = "supplier_finance_view_id")
private String supplierFinanceViewId;
/**
  * 公司名称
  */
@Column(name = "corporation_name")
private String corporationName;
/**
  * 采购组织代码
  */
@Column(name = "purchase_org_code")
private String purchaseOrgCode;
/**
  * 采购组织名称
  */
@Column(name = "purchase_org_name")
private String purchaseOrgName;
/**
  * 公司代码
  */
@Column(name = "corporation_code")
private String corporationCode;
/**
  * 付款条件代码
  */
@EntityChangeComp(name = "付款条件代码")
@Column(name = "payment_term_code")
private String paymentTermCode;
/**
  * 付款条件
  */
@EntityChangeComp(name = "付款条件描述")
@Column(name = "payment_term")
private String paymentTerm;
/**
  * 方案组代码
  */
@EntityChangeComp(name = "方案组代码")
@Column(name = "scheme_group_code")
private String schemeGroupCode;
/**
  * 方案组
  */
@EntityChangeComp(name = "方案组描述")
@Column(name = "scheme_group")
private String schemeGroup;
/**
  * 币种代码
  */
@EntityChangeComp(name = "币种代码")
@Column(name = "currency_code")
private String currencyCode;
/**
  * 币种名称
  */
@EntityChangeComp(name = "币种名称")
@Column(name = "currency_name")
private String currencyName;

### 变更历史实体清单
/**
  * 公司代码
  */
@Column(name = "corporation_code")
private String corporationCode;
/**
  * 公司名称
  */
@Column(name = "corporation_name")
private String corporationName;
/**
  * 采购组织代码
  */
@Column(name = "purchase_org_code")
private String purchaseOrgCode;
/**
  * 采购组织名称
  */
@Column(name = "purchase_org_name")
private String purchaseOrgName;

@Column(name = "target")
private String target;

@Column(name = "change_before")
private String changeBefore;

@Column(name = "change_later")
private String changeLater;
