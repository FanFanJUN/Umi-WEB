import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Form, Row, Input, Col, DatePicker, Radio } from 'antd';
import { utils, ComboList, ComboTree } from 'suid';
import DynamicForm from './DynamicForm'
import {orgnazationProps} from '@/utils/commonProps'
import styles from './index.less';
const { Item, create } = Form;
const { storage } = utils
const rule = name => [{ required: true, message: `请输入${name}` }];
let data = {
	"configCode": "THN-001-001",
	"supplierCategoryId": "1E2C3776-83CD-11EA-AE9C-0242C0A84404",
	"supplierCategoryCode": "0101",
	"supplierCategoryName": "泛虹制造商",
	"configProperty": "1",
	"configCreate": "1",
	"configChange": "0",
	"configDetail": "0",
	"creatorName": "智能制造管理员",
	"createdDate": "2020-08-27 17:16:36",
	"configBodyVos": [{
		"fieldCode": "englishAddress",
		"fieldName": "供应商英文地址",
		"operationCode": "3",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "2",
		"id": "01979F2D-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "postcode",
		"fieldName": "邮政编码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "4",
		"id": "01979F2E-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "belongGroupName",
		"fieldName": "所属集团",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "5",
		"id": "01979F2F-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "fax",
		"fieldName": "传真",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "6",
		"id": "01979F30-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "dbCode",
		"fieldName": "邓白氏码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "7",
		"id": "01979F31-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "name",
		"fieldName": "供应商名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "8",
		"id": "01979F32-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "customsEnterprisesEreditStatusValue",
		"fieldName": "海关企业信用状况",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "9",
		"id": "01979F33-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "abbreviation",
		"fieldName": "简称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "10",
		"id": "01979F34-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "companyCode",
		"fieldName": "拟合作公司代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "12",
		"id": "0197C645-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "telephone",
		"fieldName": "联系电话",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "13",
		"id": "0197C646-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "companyName",
		"fieldName": "拟合作公司名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "15",
		"id": "0197C647-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "registerProvinceId",
		"fieldName": "办公地址(省)",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "16",
		"id": "0197C648-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "creditCode",
		"fieldName": "统一社会信用代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "17",
		"id": "0197C649-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "street",
		"fieldName": "地址",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "19",
		"id": "0197ED5A-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "enterpriseWebsite",
		"fieldName": "企业网址",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "20",
		"id": "0197ED5B-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "supplierCategoryId",
		"fieldName": "供应商分类ID",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "21",
		"id": "0197ED5C-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "belongIndustry",
		"fieldName": "业务标的物代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "22",
		"id": "0197ED5D-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "legalPerson",
		"fieldName": "法人姓名",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "23",
		"id": "0197ED5E-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "bukrCode",
		"fieldName": "泛虹公司代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "24",
		"id": "0198146F-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "bukrName",
		"fieldName": "泛虹公司名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "26",
		"id": "01981470-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "supplierCategoryName",
		"fieldName": "供应商分类名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "27",
		"id": "01981471-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "qualificationType",
		"fieldName": "注册登记证书",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "28",
		"id": "01981472-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "countryCode",
		"fieldName": "国家代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "29",
		"id": "01981473-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "workCode",
		"fieldName": "泛虹工厂代码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "30",
		"id": "01981474-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "enterprisePropertyId",
		"fieldName": "企业性质ID",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "31",
		"id": "01981475-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "belongIndustryName",
		"fieldName": "业务标的物名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "32",
		"id": "01981476-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "workName",
		"fieldName": "泛虹工厂名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "34",
		"id": "01983B87-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "enterprisePropertyName",
		"fieldName": "企业性质名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "35",
		"id": "01983B88-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "qualificationType",
		"fieldName": "授权委托书",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "36",
		"id": "01983B89-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "qualificationType",
		"fieldName": "入网须知",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "37",
		"id": "01983B8A-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "countryName",
		"fieldName": "国家名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "38",
		"id": "01983B8B-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "taxpayersCategoryId",
		"fieldName": "纳税人类别ID",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "39",
		"id": "01983B8C-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "customsAeoCode",
		"fieldName": "海关AEO编码",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "41",
		"id": "0198629D-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "englishName",
		"fieldName": "供应商英文名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "43",
		"id": "0198629E-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "regFund",
		"fieldName": "注册资金",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "44",
		"id": "0198629F-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "taxpayersCategoryName",
		"fieldName": "纳税人类别名称",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "45",
		"id": "019862A0-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "registerProvinceCode",
		"fieldName": "注册地址(省)",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "1",
		"smMsgTypeName": "基本信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "46",
		"id": "019862A1-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "group_status_information",
		"fieldName": "集团状态信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "10",
		"smMsgTypeName": "集团状态信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "18",
		"id": "019862A2-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "supplierFinanceViews",
		"fieldName": "公司采购组织信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "11",
		"smMsgTypeName": "公司采购组织信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "33",
		"id": "019862A3-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "supplierAgents",
		"fieldName": "代理商",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "12",
		"smMsgTypeName": "代理商信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "42",
		"id": "019862A4-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "proCertVos",
		"fieldName": "专用资质信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "13",
		"smMsgTypeName": "专用资质信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "14",
		"id": "019862A5-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "accountVo",
		"fieldName": "账号信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "2",
		"smMsgTypeName": "账号信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "25",
		"id": "019862A6-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "supplierRecentIncomes",
		"fieldName": "业务信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "3",
		"smMsgTypeName": "业务信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "3",
		"id": "019862A7-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "ScopeOfSupply",
		"fieldName": "供应范围",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "4",
		"smMsgTypeName": "供货信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "47",
		"id": "019862A8-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "genCertVos",
		"fieldName": "通用资质信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "6",
		"smMsgTypeName": "通用资质信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "8",
		"id": "019862A9-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "contactVos",
		"fieldName": "授权委托人",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "7",
		"smMsgTypeName": "授权委托人信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "40",
		"id": "019862AA-E846-11EA-9486-0242C0A8440C"
	}, {
		"fieldCode": "bankInfoVos",
		"fieldName": "银行信息",
		"operationCode": "0",
		"operationName": "必输",
		"smMsgTypeCode": "8",
		"smMsgTypeName": "银行信息",
		"regConfigId": "0191ABBC-E846-11EA-9486-0242C0A8440C",
		"smSort": "11",
		"id": "019862AB-E846-11EA-9486-0242C0A8440C"
	}],
	"id": "0191ABBC-E846-11EA-9486-0242C0A8440C"
}
let baseinfo = [];
data.configBodyVos.map(item => {
  if (item.smMsgTypeCode === '1') {
    baseinfo.push({
      title: item.fieldName,
      key: item.fieldCode,
      rules: item.operationCode
    })
  }
})
console.log(baseinfo)
const fieldsList = baseinfo
// const fieldsList = [
//   {
//     title: '单号',
//     key: "Q_EQ_docNumber",
//     props: {
//       placeholder: '输入单号查询'
//     },
//     rules: true
//   },
//   {
//     title: '推荐部门',
//     key: 'Q_EQ_orgCode',
//     type: 'list',
//     props: orgnazationProps
//   },
//   {
//     title: '单号',
//     key: "Q_EQ_docNumber",
//     type: 'select',
//     props: {
//       placeholder: '输入单号查询'
//     }
//   },
//   {
//     title: '单号',
//     key: "Q_EQ_docNumber",
//     type: 'rangePicker',
//     props: {
//       placeholder: '输入单号查询222'
//     }
//   },
// ];
const FormRef = forwardRef(({
  form,
  type = "add",
  initialValue = {},
  onChangeMaterialLevel = () => null
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
  const [createName, setCreateName] = useState("");
  const pcc = getFieldValue('purchaseCompanyCode');
  const { attachment = null } = initialValue;
  const treeNodeProps = (node) => {
    if (node.nodeLevel === 1) {
      return {
        selectable: false
      }
    }
  }
  useEffect(() => {
    // const { userName, userId, mobile } = storage.sessionStorage.get("Authorization");
    // setFieldsValue({
    //   phone: mobile
    // })
    // setCreateName(userName)
  }, [])
  function onSubmit() {

  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.bgw}>
        <div className={styles.title}>基本信息</div>
        <div className={styles.content}>
        <DynamicForm
            formItems={fieldsList}
        />
        </div>
      </div>
      <div className={styles.bgw}>

        <div className={styles.title}>帐号</div>
        <div className={styles.content}>
        </div>
      </div>
    </div>
  )
}
)
const CommonForm = create()(FormRef)

export default CommonForm