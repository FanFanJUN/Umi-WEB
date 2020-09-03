import { smBaseUrl, baseUrl } from '../../utils/commonUrl';
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
};

// 限用物资清单编辑
export async function EditTheListOfRestrictedMaterials(params) {
  const url = `${baseUrl}/limitSubstanceListData/update_limitSubstanceListData`;
  return request({
    url,
    method: 'POST',
    params: params,
  });
}

// 基本单位列表
export const BasicUnitList = {
  remotePaging: true,
  store: {
    type: 'POST',
    params: {
      quickSearch: '',
    },
    autoLoad: false,
    url: `${baseUrl}/limitMaterialUnitData/findBySearchPage`,
  },
  rowKey: 'name',
  reader: { name: item => `${item.name}-${item.remark}` },
};

// 物料代码
export const materialCode = {
  store: {
    url: `${smBaseUrl}/api/supplierService/findByPage`,
    params: {
      Q_EQ_frozen__Boolean: false,
      filters: [
        {
          fieldName: 'supplierStatus',
          fieldType: 'Integer',
          operator: 'EQ',
          value: 0,
        },
        {
          fieldName: 'code',
          fieldType: 'String',
          operator: 'EQ',
          value: 'NONULL',
        },
      ],
    },
    type: 'post',
  },
  style: {
    width: '100%',
  },
  reader: {
    name: 'code',
    field: ['name', 'id'],
    description: 'name',
  },
  remotePaging: true,
  placeholder: '选择供应商',
};

// 状态
export const statusProps = {
  dataSource: [
    {
      code: 'INIT',
      name: '草稿',
    },
    {
      code: 'INPROCESS',
      name: '生效',
    },
  ],
  placeholder: '选择状态',
  ...commonProps,
};

// 分配供应商状态
export const distributionProps = {
  dataSource: [
    {
      code: 'INIT',
      name: '已分配',
    },
    {
      code: 'INPROCESS',
      name: '未分配',
    },
  ],
  placeholder: '选择分配供应商状态',
  ...commonProps,
};
//   物料标记状态
export const materialStatus = {
  dataSource: [
    {
      code: 'INIT',
      name: '存在符合的供应商',
    },
    {
      code: 'INPROCESS',
      name: '不存在符合的供应商',
    },
  ],
  placeholder: '选择物料标记状态',
  ...commonProps,
};
// 物料标记状态
export const PDMStatus = {
  dataSource: [
    {
      code: 'INIT',
      name: '同步成功',
    },
    {
      code: 'INPROCESS',
      name: '同步失败',
    },
  ],
  placeholder: '选择物料标记状态',
  ...commonProps,
};
