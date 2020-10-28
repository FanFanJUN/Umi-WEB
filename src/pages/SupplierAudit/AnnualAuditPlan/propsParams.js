/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-27 17:01:47
 * @LastEditTime: 2020-10-28 11:14:32
 * @Description: 参数props
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/propsParams.js
 */
import { baseUrl } from "../../../utils/commonUrl";

// 有id的公司列表
export const AllCompanyConfig = {
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/buCompanyPurchasingOrganization/findCompany`,
  },
  rowKey: 'code',
  reader: {
    field: ['code', 'id'],
    name: 'name',
    description: 'code',
  },
};
// 采购组织数据
export const ApplyOrganizationProps = {
  store: {
    url: `${baseUrl}/basic/listAllOrgnazationWithDataAuth`,
  },
  reader: {
    name: 'name',
    field: ['code', 'id']
  },
  placeholder: '请选择申请部门',
  style: {
    width: '100%'
  },
  treeNodeProps: (node) => {
    if (node.nodeLevel === 0) {
      return {
        selectable: false
      }
    }
  }
}
// 审核类型 reviewType
export const reviewTypesProps = {
  store: {
    url: `${baseUrl}/reviewType/findBySearchPage`,
    type: 'POST'
  },
  remotePaging: true,
  columns: [
    {
      title: '代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  reader: {
    name: 'name',
    field: ['id', 'code'],
  },
  rowKey: 'id',
  placeholder: '请选择审核类型',
  style: {
    width: '100%'
  },
};
// 审核原因
export const reviewReasonsProps = {
  placeholder: '选择审核原因',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewReason/findBySearchPage`,
  },
  remotePaging: true,
  columns: [
    {
      title: '代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  rowKey: 'code',
  reader: {
    field: ['id', 'code'],
    name: 'name',
    description: 'code',
  },
};

// 审核方式
export const reviewWaysProps = {
  placeholder: '选择审核原因',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewWay/findBySearchPage`,
  },
  remotePaging: true,
  columns: [
    {
      title: '代码',
      width: 80,
      dataIndex: 'code',
    },
    {
      title: '名称',
      width: 200,
      dataIndex: 'name',
    },
  ],
  rowKey: 'code',
  reader: {
    field: ['id', 'code'],
    name: 'name',
    description: 'code',
  },
}; 