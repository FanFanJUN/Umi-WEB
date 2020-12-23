import { smBaseUrl, baseUrl, recommendUrl, basicServiceUrl } from '../../utils/commonUrl';
import request from '../../utils/request';
import React from 'react';

// 业务单元下拉选择
export const buList = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    name: 'buCode',
    field: ['id'],
    description: 'buName',
  },
  placeholder: '选择业务单元',
};
// 同步PLM状态
export const PLMSynchronList = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '未同步',
    },
    {
      code: '1',
      name: '同步成功',
    },
    {
      code: '2',
      name: '同步失败',
    }
  ],
  reader: {
    name: 'name',
    field: ['code'],
  },
  placeholder: '请选择同步PLM状态',
}
// 状态
export const PLMType = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '有效',
    },
    {
      code: '1',
      name: '冻结',
    }
  ],
  reader: {
    name: 'name',
  },
  placeholder: '请选择状态',
}
// 合格通知单
export const qualifiedList = {
  remotePaging: true,
  store: {
    params: {
      valid: 1,
    },
    type: 'GET',
    autoLoad: false,
    url: `${smBaseUrl}/supplierSupplyList/listPageVo`,
  },
  rowKey: 'supplier.code',
  reader: {
    name: 'supplier.code',
    field: ['supplier.id'],
    description: 'supplier.name',
  },
  placeholder: '选择供应商',
};
// 高级查询业务单元下拉选择
export const buListCode = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    name: 'buCode',
    field: ['buCode'],
    description: 'buName',
  },
  placeholder: '选择业务单元',
};
// 高级查询
export const buListName = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${baseUrl}/bu/findPage`,
  },
  rowKey: 'buCode',
  reader: {
    name: 'buName',
    field: ['buName'],
    description: 'buCode',
  },
  placeholder: '选择业务单元',
};
// 高级查询供应商
export const qualifiedListName = {
  remotePaging: true,
  store: {
    type: 'POST',
    autoLoad: false,
    url: `${smBaseUrl}/supplierSupplyList/listPageVo?valid=1`,
  },
  rowKey: 'supplier.code',
  reader: {
    name: 'supplier.code',
    field: ['supplier.code'],
    description: 'supplier.name',
  },
  placeholder: '选择供应商',
};
// 重发状态
export const Retransmission = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '未重发',
    },
    {
      code: '1',
      name: '已重发',
    }
  ],
  reader: {
    name: 'name',
  },
  placeholder: '请选择状态',
}
// 请求状态
export const requestStart = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '成功',
    },
    {
      code: '1',
      name: '失败',
    }
  ],
  reader: {
    name: 'name',
  },
  placeholder: '请选择状态',
}
// 高级查询同步PLM状态
export const seniorplmType = {
  showSearch: false,
  allowClear: true,
  dataSource: [
    {
      code: '0',
      name: '有效',
    },
    {
      code: '1',
      name: '冻结',
    }
  ],
  reader: {
    name: 'name',
    field: ['code'],
  },
  placeholder: '请选择状态',
}