import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { router } from 'dva';
import { message,Tabs} from 'antd';
import ModifyHistoryDetail from '../commons/ModifyHistoryDetail'
import ModifyEditInfo from '../commons/ModifyEditInfo'
import {
    findByRequestIdForModify,
    findSupplierModifyHistroyList
  } from '@/services/SupplierModifyService'
  import {
    SaveSupplierconfigureService
  } from '@/services/supplierRegister';
  import { closeCurrent } from '../../../utils/index';
  import styles from '../index.less';
  const TabPane = Tabs.TabPane;
function SupplierApproveInfo() {
    const saveformRef = useRef(null)
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    const [loading, triggerLoading] = useState(false);
    const [wholeData, setwholeData] = useState([]);
    const [configuredata, setconfigurelist] = useState([]);
    const [initialValue, setInitialValue] = useState({});
    const [editData, setEditData] = useState([]);
    useEffect(() => {
        initsupplierDetai(); 
    }, []);
    // 供应商变更详情
    async function initsupplierDetai() {
        // triggerLoading(true);
        // const { data, success, message: msg } = await findByRequestIdForModify({ id: query.id });
        // if (success) {
        //   setInitialValue(data.supplierApplyVo)
        //   setEditData(data.supplierApplyVo)
        //   triggerLoading(false);
        // }else {
        //   triggerLoading(false);
        //   message.error(msg)
        // }
        let datails= {
            "modifyReason": "123ces ",
            "supplierApplyVo": {
                "id": "A381517E-A96A-11EA-A303-0242C0A8440C",
                "docNumber": "OCA-2020-0000115",
                "flowStatus": "INPROCESS",
                "flowStatusRemark": "流程中",
                "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                "supplierName": "测试代理商200608-3",
                "orgCode": "12001082",
                "orgId": "39EC5DE5-94FD-11EA-9F68-5AA023055645",
                "orgName": "供应商管理组",
                "orgPath": "/四川长虹电子控股集团有限公司/供应链平台/采购供应链中心/采购管理部/供应商管理组",
                "supplierInFlowStatus": "NotInFlow",
                "supplierInFlowStatusRemark": "不在流程中",
                "supplierInfoVo": {
                    "supplierVo": {
                        "id": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "backupId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C",
                        "name": "测试代理商200608-3",
                        "supplierType": "DomesticSup",
                        "supplierTypeRemark": "大陆地区供应商",
                        "hasBeRecommend": false,
                        "abbreviation": "测试六十八",
                        "countryCode": "63B12BFE-636A-11EA-993B-0242C0A84411",
                        "countryName": "中国",
                        "registerProvinceName": "四川",
                        "registerRegionCode": "EF6538C2-A182-11EA-9483-0242C0A8440C",
                        "registerRegionName": " 绵阳市",
                        "registerDistrictCode": "DB26AAE1-A188-11EA-A379-80A58951E645",
                        "registerDistrictName": "   涪城区",
                        "registerStreet": "思明区白鹭洲路197-199号14G室",
                        "frozen": false,
                        "supplierStatus": "Normal",
                        "supplierStatusRemark": "正常",
                        "supplierInFlowStatus": "NotInFlow",
                        "supplierInFlowStatusRemark": "不在流程中",
                        "rank": 0,
                        "creditCode": "93AAA203CCQ331ALLJ",
                        "isBidProxy": 0,
                        "supplierCategoryId": "A1CCCF9E-83CD-11EA-AE9C-0242C0A84404",
                        "supplierCategoryName": "服务商",
                        "supplierCategory": {
                            "id": "A1CCCF9E-83CD-11EA-AE9C-0242C0A84404",
                            "code": "0203",
                            "name": "服务商",
                            "rank": 3,
                            "parentId": "E6CE05B4-83CC-11EA-AE9C-0242C0A84404",
                            "nodeLevel": 2,
                            "codePath": "|2|1|0203",
                            "namePath": "/外部单位/大陆地区/服务商",
                            "tenantCode": "10000028"
                        },
                        "enterprisePropertyId": "F5EB0FCC-8916-11EA-B220-0242C0A84407",
                        "enterprisePropertyName": "其他",
                        "enterpriseProperty": {
                            "id": "F5EB0FCC-8916-11EA-B220-0242C0A84407",
                            "code": "900",
                            "name": "其他",
                            "frozen": false,
                            "rank": 0,
                            "tenantCode": "10000028"
                        },
                        "taxpayersCategoryId": "492B73CA-78CB-11EA-920B-0242C0A84416",
                        "taxpayersCategoryName": "一般纳税人",
                        "taxpayersCategory": {
                            "id": "492B73CA-78CB-11EA-920B-0242C0A84416",
                            "code": "00002",
                            "name": "一般纳税人",
                            "frozen": true,
                            "rank": 0,
                            "tenantCode": "10000028"
                        },
                        "belongGroupName": "企业集团",
                        "belongIndustry": "02",
                        "belongIndustryName": "林业",
                        "enterpriseProfile": "2017年5月15成立，属于批发和零售业。纺织品、针织品及原料批发;建材批发;五金产品批发;电气设备批发;其他机械设备及电子产品批发;汽车零配件批发;其他化工产品批发(不含危险化学品和监控化学品);收购农副产品(不含粮食与种子);机械设备仓储服务;其他仓储业(不含需经许可审批的项目);非金属矿及制品批发(不含危险化学品和监控化学品);金属及金属矿批发(不含危险化学品和监控化学品);其他未列明批发业(不含需经许可审批的经营项目);",
                        "businessScope": "纺织品、针织品及原料批发;建材批发;五金产品批发;电气设备批发;其他机械设备及电子产品批发;汽车零配件批发;其他化工产品批发(不含危险化学品和监控化学品);收购农副产品(不含粮食与种子);机械设备仓储服务;其他仓储业(不含需经许可审批的项目);非金属矿及制品批发(不含危险化学品和监控化学品);金属及金属矿批发(不含危险化学品和监控化学品);其他未列明批发业(不含需经许可审批的经营项目);经营各类商品和技术的进出口(不另附进出口商品目录),但国家限定公司经营或禁止进出口的商品及技术除外。",
                        "postcode": "361000",
                        "telephone": "18121894758",
                        "email": "33333@qq.com",
                        "fax": "134988",
                        "generalCertRefId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "accountVo": {
                            "mobile": "18121894758",
                            "email": "33333@qq.com"
                        },
                        "customsAeoCode": "4495439503534",
                        "customsEnterprisesEreditStatusValue": "SeniorCertified",
                        "customsEnterprisesEreditStatusName": "高级认证企业",
                        "mobile": "18121894758"
                    },
                    "extendVo": {
                        "backupsId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C",
                        "id": "A40B4210-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "supplierInFlowStatus": "NotInFlow",
                        "supplierInFlowStatusRemark": "不在流程中",
                        "legalPerson": "王达新",
                        "registerProvinceName": "四川",
                        "registerRegionId": "EF6538C2-A182-11EA-9483-0242C0A8440C",
                        "registerRegionName": " 绵阳市",
                        "registerDistrictId": "DB26AAE1-A188-11EA-A379-80A58951E645",
                        "registerDistrictName": "   涪城区",
                        "registerStreet": "思明区白鹭洲路197-199号14G室",
                        "regFund": 1000.0,
                        "currencyId": "B1FEB780-7FC0-11EA-A0A6-0242C0A84415",
                        "currencyName": "人民币",
                        "currency": {
                            "id": "B1FEB780-7FC0-11EA-A0A6-0242C0A84415",
                            "code": "RMB",
                            "name": "人民币",
                            "tenantCode": "10000028",
                            "rank": 1,
                            "frozen": false
                        },
                        "officeProvinceName": "四川",
                        "officeRegionId": "EF6538C2-A182-11EA-9483-0242C0A8440C",
                        "officeRegionName": " 绵阳市",
                        "officeDistrictId": "DB26AAE1-A188-11EA-A379-80A58951E645",
                        "officeDistrictName": "   涪城区",
                        "officeStreet": "思明区白鹭洲路197-199号14G室",
                        "matCatIds": ["AA03706C-969F-11EA-A93C-0242C0A84414", "0273CA99-96A3-11EA-A93C-0242C0A84414",
                            "2E111AEB-96A3-11EA-A93C-0242C0A84414"
                        ],
                        "supplyScopeVos": [{
                            "id": "A4085BDD-A96A-11EA-A303-0242C0A8440C",
                            "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                            "materielCategoryId": "AA03706C-969F-11EA-A93C-0242C0A84414",
                            "backupsId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C"
                        }, {
                            "id": "A40882EE-A96A-11EA-A303-0242C0A8440C",
                            "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                            "materielCategoryId": "0273CA99-96A3-11EA-A93C-0242C0A84414",
                            "backupsId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C"
                        }, {
                            "id": "A408A9FF-A96A-11EA-A303-0242C0A8440C",
                            "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                            "materielCategoryId": "2E111AEB-96A3-11EA-A93C-0242C0A84414",
                            "backupsId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C"
                        }],
                        "materielCategories": [null, null, null],
                        "supplyScopeRemark": "工业原盐、电石",
                        "searchCondition": "测试六十八",
                        "enterpriseWebsite": "www.163.com",
                        "majorCustomersVos": [{
                            "majorCustomers": "客户"
                        }],
                        "majorCustomersList": "客户"
                    },
                    "bankInfoVos": [{
                        "id": "A40D64F1-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "backupsId": "A3E6CA13-A96A-11EA-A303-0242C0A8440C",
                        "supplierInFlowStatus": "NotInFlow",
                        "supplierInFlowStatusRemark": "不在流程中",
                        "countryId": "63B12BFE-636A-11EA-993B-0242C0A84411",
                        "countryName": "中国",
                        "provinceId": "555B7A0C-A182-11EA-9483-0242C0A8440C",
                        "provinceName": "福建",
                        "regionId": "",
                        "regionName": "厦门",
                        "paymentId": "E8E269CB-9035-11EA-AD41-0242C0A84418",
                        "paymentCode": "01",
                        "paymentName": "现金",
                        "payment": {
                            "id": "E8E269CB-9035-11EA-AD41-0242C0A84418",
                            "name": "现金",
                            "code": "01",
                            "rank": 1,
                            "frozen": false,
                            "tenantCode": "10000028"
                        },
                        "bankCode": "BOC",
                        "bankOwner": "福建钰汇成贸易有限公司",
                        "bankAccount": "424774039782",
                        "unionpayCode": "104393044005",
                        "bankName": "中国银行股份有限公司厦门开元支行",
                        "bankAddress": "厦门市",
                        "bankNo": "01104393044005",
                        "openingPermitId": "85dd6335-b7c0-4a07-bd95-f6e656652560",
                        "openingPermit": ["02A93403A95C11EABB910242C0A8441D"]
                    }],
                    "contactVos": [{
                        "id": "A418FDB2-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "name": "张三",
                        "mobile": "18121894758",
                        "telephone": "18121894758",
                        "position": "001",
                        "email": "9999994@qq.com",
                        "positionName": "总经理",
                        "idNo": "465454645646456000",
                        "tenantCode": "10000028"
                    }],
                    "genCertVos": [{
                        "id": "A3EE9247-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "营业执照",
                        "certificateNo": "无",
                        "institution": "无",
                        "startDate": "2020-06-01",
                        "endDate": "2021-06-08",
                        "attachments": ["DCEF4E19A95B11EABB910242C0A8441D"],
                        "lineCode": "00010",
                        "key": "00010"
                    }, {
                        "id": "A3F32628-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "法人身份证明书",
                        "certificateNo": "无",
                        "institution": "无",
                        "startDate": "2020-06-01",
                        "endDate": "2021-06-08",
                        "attachments": ["E2ADA45BA95B11EABB910242C0A8441D"],
                        "lineCode": "00020",
                        "key": "00020"
                    }, {
                        "id": "A3F71DC9-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "法定代表人授权委托书",
                        "certificateNo": "无",
                        "institution": "无",
                        "startDate": "2020-06-01",
                        "endDate": "2021-06-08",
                        "attachments": ["E7923C6DA95B11EABB910242C0A8441D"],
                        "lineCode": "00030",
                        "key": "00030"
                    }, {
                        "id": "A3FBD8BA-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "公司印鉴信息",
                        "certificateNo": "无",
                        "institution": "无",
                        "startDate": "2020-06-01",
                        "endDate": "2021-06-08",
                        "attachments": ["ECD6F5DFA95B11EABB910242C0A8441D"],
                        "lineCode": "00040",
                        "key": "00040"
                    }, {
                        "id": "A3FFA94B-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "审计报告或财务报表",
                        "certificateNo": "无",
                        "institution": "无",
                        "startDate": "2020-06-01",
                        "endDate": "2021-06-01",
                        "attachments": ["F2608081A95B11EABB910242C0A8441D"],
                        "lineCode": "00050",
                        "key": "00050"
                    }, {
                        "id": "A403A0EC-A96A-11EA-A303-0242C0A8440C",
                        "refId": "345d2c1a-a1db-4302-85bf-1b45124beecc",
                        "qualificationType": "入网须知",
                        "attachments": ["ABBC3E27A95B11EABB910242C0A8441D"]
                    }],
                    "supplierRecentIncomes": [{
                        "id": "A3EB36E4-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "particularYear": "2020",
                        "operatingVolume": 1.0,
                        "tenantCode": "10000028",
                        "key": "2020"
                    }, {
                        "id": "A3EB8505-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "particularYear": "2019",
                        "operatingVolume": 1.0,
                        "tenantCode": "10000028",
                        "key": "2019"
                    }, {
                        "id": "A3EBAC16-A96A-11EA-A303-0242C0A8440C",
                        "supplierId": "9F50B01E-A959-11EA-84D9-0242C0A8440C",
                        "particularYear": "2018",
                        "operatingVolume": 1.0,
                        "tenantCode": "10000028",
                        "key": "2018"
                    }]
                },
                "createdDate": "2020-06-08 17:30:06",
                "creatorName": "智能制造管理员",
                "modifyReason": "123ces "
            }
        }
        setInitialValue(datails.supplierApplyVo)
        setEditData(datails.supplierApplyVo)
        setwholeData(datails.supplierApplyVo)
        initConfigurationTable()
    }
    // 类型配置表
    async function initConfigurationTable(typeId) {
        // triggerLoading(true);
        // let params = {catgroyid:typeId,property:1};
        // const { data, success, message: msg } = await SaveSupplierconfigureService(params);
        //   if (success) {
        //     let datalist  = data.configBodyVos;
        //     triggerLoading(false);
        //     setconfigurelist(datalist)
        //   }else {
        //     triggerLoading(false);
        //     message.error(msg)
        //   }
        let data = {
            "configCode": "test322",
            "supplierCategoryId": "9C2A65CD-83CD-11EA-AE9C-0242C0A84404",
            "supplierCategoryCode": "0202",
            "supplierCategoryName": "代理商",
            "configProperty": "1",
            "configCreate": "1",
            "configChange": "0",
            "configDetail": "0",
            "creatorName": "智能制造管理员",
            "createdDate": "2020-09-07 09:01:55",
            "configBodyVos": [{
                "fieldCode": "name",
                "fieldName": "供应商名称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "1",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B2D-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "enterpriseProfile",
                "fieldName": "企业简介",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "3",
                "smMsgTypeName": "业务信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "2",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B2E-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "englishAddress",
                "fieldName": "供应商英文地址",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "3",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B2F-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "postcode",
                "fieldName": "邮政编码",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "4",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B30-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "belongGroupName",
                "fieldName": "所属集团",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "5",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B31-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "businessScope",
                "fieldName": "经营范围",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "3",
                "smMsgTypeName": "业务信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "6",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B32-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "fax",
                "fieldName": "传真",
                "operationCode": "1",
                "operationName": "选输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "7",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B33-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "dbCode",
                "fieldName": "邓白氏码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "8",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B34-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "mobile",
                "fieldName": "手机",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "2",
                "smMsgTypeName": "账号信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "9",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9031B35-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "genCertVos",
                "fieldName": "通用资质信息",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "6",
                "smMsgTypeName": "通用资质信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "10",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9034246-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "email",
                "fieldName": "邮箱",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "2",
                "smMsgTypeName": "账号信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "11",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9034247-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "customsEnterprisesEreditStatusValue",
                "fieldName": "海关企业信用状况",
                "operationCode": "1",
                "operationName": "选输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "12",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9034248-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "abbreviation",
                "fieldName": "简称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "13",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9034249-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "bankInfoVos",
                "fieldName": "银行信息",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "8",
                "smMsgTypeName": "银行信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "14",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903424A-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "companyCode",
                "fieldName": "拟合作公司代码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "15",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903424B-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "telephone",
                "fieldName": "联系电话",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "16",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903424C-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "proCertVos",
                "fieldName": "专用资质信息",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "13",
                "smMsgTypeName": "专用资质信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "17",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903424D-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "majorCustomersVos",
                "fieldName": "主要客户",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "3",
                "smMsgTypeName": "业务信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "18",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903424E-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "companyName",
                "fieldName": "拟合作公司名称",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "19",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903695F-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "registerProvinceId",
                "fieldName": "办公地址(省)",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "20",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036960-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "creditCode",
                "fieldName": "统一社会信用代码",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "21",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036961-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "group_status_information",
                "fieldName": "集团状态信息",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "10",
                "smMsgTypeName": "集团状态信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "22",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036962-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "street",
                "fieldName": "地址",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "23",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036963-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "supplierRecentIncomes",
                "fieldName": "近三年收入",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "3",
                "smMsgTypeName": "业务信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "24",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036964-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "enterpriseWebsite",
                "fieldName": "企业网址",
                "operationCode": "1",
                "operationName": "选输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "25",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036965-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "supplierCategoryId",
                "fieldName": "供应商分类ID",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "26",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036966-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "belongIndustry",
                "fieldName": "业务标的物代码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "27",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036967-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "legalPerson",
                "fieldName": "法人姓名",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "28",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036968-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "bukrCode",
                "fieldName": "泛虹公司代码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "29",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9036969-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "bukrName",
                "fieldName": "泛虹公司名称",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "30",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903696A-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "supplierCategoryName",
                "fieldName": "供应商分类名称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "31",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903696B-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "qualificationTypeReg",
                "fieldName": "注册登记证书",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "32",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903696C-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "countryCode",
                "fieldName": "国家代码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "33",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903696D-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "workCode",
                "fieldName": "泛虹工厂代码",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "34",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903907E-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "enterprisePropertyId",
                "fieldName": "企业性质ID",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "35",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903907F-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "belongIndustryName",
                "fieldName": "业务标的物名称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "36",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039080-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "supplierFinanceViews",
                "fieldName": "公司采购组织信息",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "11",
                "smMsgTypeName": "公司采购组织信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "37",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039081-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "workName",
                "fieldName": "泛虹工厂名称",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "38",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039082-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "enterprisePropertyName",
                "fieldName": "企业性质名称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "39",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039083-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "qualificationTypeGrant",
                "fieldName": "授权委托书",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "40",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039084-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "qualificationTypeNetWork",
                "fieldName": "入网须知",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "41",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039085-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "countryName",
                "fieldName": "国家名称",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "42",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039086-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "taxpayersCategoryId",
                "fieldName": "纳税人类别ID",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "43",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039087-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "contactVos",
                "fieldName": "授权委托人",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "7",
                "smMsgTypeName": "授权委托人信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "44",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039088-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "customsAeoCode",
                "fieldName": "海关AEO编码",
                "operationCode": "1",
                "operationName": "选输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "45",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B9039089-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "supplierAgents",
                "fieldName": "代理商",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "12",
                "smMsgTypeName": "代理商信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "46",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903908A-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "englishName",
                "fieldName": "供应商英文名称",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "47",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903908B-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "regFund",
                "fieldName": "注册资金",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "48",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903908C-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "taxpayersCategoryName",
                "fieldName": "纳税人类别名称",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "49",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903908D-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "registerProvinceCode",
                "fieldName": "注册地址(省)",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "1",
                "smMsgTypeName": "基本信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "50",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B903B79E-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "ScopeOfSupply",
                "fieldName": "供应范围",
                "operationCode": "0",
                "operationName": "必输",
                "smMsgTypeCode": "4",
                "smMsgTypeName": "供货信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "51",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B90F9E7F-F0A5-11EA-BD09-0242C0A8440C"
            }, {
                "fieldCode": "account",
                "fieldName": "账号",
                "operationCode": "3",
                "operationName": "不显示",
                "smMsgTypeCode": "2",
                "smMsgTypeName": "账号信息",
                "regConfigId": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C",
                "smSort": "52",
                "smFieldTypeCode": null,
                "smFieldTypeName": null,
                "id": "B90F9E80-F0A5-11EA-BD09-0242C0A8440C"
            }],
            "id": "B8FD4ECC-F0A5-11EA-BD09-0242C0A8440C"
        }
        setconfigurelist(data.configBodyVos)
      }
      const handleSave = async (approved) => {
        if (approved.approved === false) {
          closeCurrent();
        }else {
            triggerLoading(true)
            const { handleSave } = saveformRef.current;
            let saveData = handleSave()
            console.log(saveData)
            // const { success, message: msg } = await saveSupplierRegister(saveData)
            // triggerLoading(false)
            // return new Promise((resolve, reject) => {
            //     if (success) {
            //         resolve({
            //         success,
            //         message: msg
            //         })
            //         message.success(msg)
            //         return;
            //     }
            //     reject(false)
            //     message.error(msg)
            // })
        }
    }
    function handleSubmitComplete(res) {
        const { success } = res;
        if (success) {
          closeCurrent();
        }
      }
    return (
        <WorkFlow.Approve
            businessId={id}
            taskId={taskId}
            instanceId={instanceId}
            flowMapUrl="flow-web/design/showLook"
            submitComplete={handleSubmitComplete}
            beforeSubmit={handleSave}
            >
            <div className={styles.wrapper}>
                <Tabs className={styles.tabcolor}>
                    <TabPane forceRender tab="变更列表" key="1">
                    <ModifyHistoryDetail
                        editData={editData}
                        //lineDataSource={lineDataSource}
                        />
                    </TabPane>
                    <TabPane forceRender tab="基本信息" key="2">
                        <ModifyEditInfo  
                            wholeData={wholeData}
                            configuredata={configuredata}
                            wrappedComponentRef={saveformRef}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </WorkFlow.Approve>
    )
}

export default SupplierApproveInfo
