/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Connect: 1981824361@qq.com
 * @Date: 2020-10-27 17:01:47
 * @LastEditTime: 2020-12-08 14:14:35
 * @Description: 参数props
 * @FilePath: /srm-sm-web/src/pages/SupplierAudit/AnnualAuditPlan/propsParams.js
 */
import { baseUrl } from "../../../utils/commonUrl";

const commonProps = {
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%',
  },
  placeholder: '请选择'
};

// 有id的公司列表
export const AllCompanyConfig = {
  placeholder: '选择公司',
  remotePaging: false,
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${baseUrl}/basic/listAllCorporationWithDataAuth`,
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
    autoLoad: true,
  },
  reader: {
    name: 'name',
    field: ['code', 'id']
  },
  placeholder: '请选择申请部门',
  style: {
    width: '100%'
  },
  // treeNodeProps: (node) => {
  //   if (node.nodeLevel === 0) {
  //     return {
  //       selectable: false
  //     }
  //   }
  // }
}
// 审核类型 reviewType
export const reviewTypesProps = {
  store: {
    url: `${baseUrl}/reviewType/findBySearchPageAndFrozenFalse`,
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
  placeholder: '选择审核方式',
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/reviewWay/findBySearchPageAndFrozenFalse`,
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
// 审核组织方式
export const reviewOrganizeProps = {
  placeholder: '选择审核组织形式',
  store: {
    type: 'POST',
    autoLoad: false,
    params:{
      pageInfo:{rows: 15, page: 1},
      filters:[{
        fieldName: "frozen",
        fieldType: "Boolean",
        operator: "EQ",
        value: false
      }]
    },
    url: `${baseUrl}/api/reviewOrganizedWayService/findByPage`,
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

// 区域
export const AreaConfig = {
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['id', 'code'],
    name: 'name',
    description: 'code',
  },
};

// 区域
export const CountryIdConfig = {
  remotePaging: false,
  rowKey: 'code',
  reader: {
    field: ['countryId', 'code'],
    name: 'name',
    description: 'code',
  },
};

// 状态
export const stateProps = {
  allowClear: true,
  dataSource: [
    {
      code: 'DRAFT',
      name: '草稿',
    },
    {
      code: 'EFFECT',
      name: '生效',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
};

// 审批流程状态
export const flowProps = {
  allowClear: true,
  dataSource: [
    {
      code: 'INIT',
      name: '未提交审批',
    },
    {
      code: 'INPROCESS',
      name: '审批中',
    },
    {
      code: 'COMPLETED',
      name: '审批完成',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
}