import { smBaseUrl, baseUrl, recommendUrl, basicServiceUrl } from '../../utils/commonUrl';
import request from '../../utils/request';
import React from 'react';
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
// PCN变更主数据
export const PCNMasterdatalist = {
  store: {
    url: `${smBaseUrl}/pubController/findDataDictionaryItemListByTypeCode?typeCode=PCNBGLX`,
    type: 'POST'
  },
  reader: {
    name: 'name',
    field: ['value'],
    description: 'value'
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
// 变更信息
export const ChangecontentList = {
  store: {
    url: `${smBaseUrl}/api/smPcnChangesService/findByPage`,
    type: 'POST'
  },
  reader: {
    name: 'changeContent'
  },
  // remotePaging: true,
  placeholder: '选择变更内容'
}
// 是否安规件
export const Safetyregulationslist = {
  allowClear: true,
  dataSource: [
    {
      code: '是',
      name: '是',
    },
    {
      code: '否',
      name: '否',
    },
  ],
  placeholder: '选择单安规件',
  ...commonProps,
}
// 战略采购
export const Strategicprocurementlist = {
  store: {
    url: `${baseUrl}/purchaseGroup/findByPagesAll`,
    type: 'POST'
  },
  reader: {
    name: 'code',
    field: ['name'],
    description: 'name'
  },
  // remotePaging: true,
  placeholder: '选择变更类型'
}
// 供应商单据状态
export const SupplierBilltypeList = {
  allowClear: true,
  dataSource: [
    {
      code: '草稿',
      name: '草稿',
    },
    {
      code: '已提交',
      name: '已提交',
    },
  ],
  placeholder: '选择单据状态',
  ...commonProps,
}
// 单据状态
export const BilltypeList = {
  allowClear: true,
  dataSource: [
    {
      code: '草稿',
      name: '草稿',
    },
    {
      code: '验证中',
      name: '验证中',
    },
    {
      code: '变更不通过',
      name: '变更不通过',
    },
    {
      code: '变更通过',
      name: '变更通过',
    },
    {
      code: '变更完成',
      name: '变更完成',
    }
  ],
  placeholder: '选择单据状态',
  ...commonProps,
}
// 审核状态
export const ToexamineList = {
  allowClear: true,
  dataSource: [
    {
      code: '未提交审核',
      name: '未提交审核',
    },
    {
      code: '审核中',
      name: '审核中',
    },
    {
      code: '已审核',
      name: '已审核',
    }
  ],
  placeholder: '选择审核状态',
  ...commonProps,
}
// 战略采购列表
export const StrategicPurchaseConfig = {
  allowClear: true,
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/purchaseGroup/findByPagesAll`,
  },
  rowKey: 'name',
  reader: {
    name: 'code',
    field: ['id', 'name'],
    description: 'name',
  },
  placeholder: '选择战略采购',
  style: {
    width: '100%',
  },
};
// 战略采购列表
export const StrategicForName = {
  ...StrategicPurchaseConfig,
  reader: {
    name: 'name',
    field: ['id', 'code'],
    description: 'code',
  },
};