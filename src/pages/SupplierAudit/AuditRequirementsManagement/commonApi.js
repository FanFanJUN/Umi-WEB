// 结果录入
import { recommendUrl } from '../../../utils/commonUrl';
import request from '../../../utils/request';

const commonProps = {
  reader: {
    name: 'name',
    field: ['code'],
  },
  style: {
    width: '100%',
  },
};

export const OrderSeverityArr = {
  'SERIOUS_NOT_FIT': '严重不符合',
  'GENERALLY_NOT_FIT': '一般不符合',
  'MINOR_NOT_FIT': '轻微不符合',
};

// 严重程度
export const OrderSeverityConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'SERIOUS_NOT_FIT',
      name: '严重不符合',
    },
    {
      code: 'GENERALLY_NOT_FIT',
      name: '一般不符合',
    },
    {
      code: 'MINOR_NOT_FIT',
      name: '轻微不符合',
    },
  ],
  placeholder: '选择严重程度',
  ...commonProps,
};

// 实际打分人员

export const ActualGraderConfig = {
  placeholder: '选择实际打分人员',
  store: {
    type: 'GET',
    autoLoad: false,
    url: `${recommendUrl}/api/reviewImplementManagementService/findAgentUser`,
  },
  remotePaging: true,
  rowKey: 'code',
  reader: {
    field: ['id'],
    name: 'memberName',
    description: 'code',
  },
};

// 结果录入
export const ResultsEntryApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/findOneOverride`;
  return request({
    url,
    method: 'GET',
    params,
  });
};

// 结果录入暂存
export const SaveResultsEntryApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/insertForDraft`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 结果录入提交
export const SubmitResultsEntryApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/insertForCommit`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 撤回单据
export const WithdrawResultsEntryApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewImplementManagementService/withdraw`;
  return request({
    url,
    method: 'GET',
    params,
  });
};
