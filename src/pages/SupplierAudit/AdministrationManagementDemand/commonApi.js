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
export const whetherArr = {
  'true' : '是',
  'false' : '否'
}

// 验证结果
export const VerificationResultConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'true',
      name: '是',
    },
    {
      code: 'false',
      name: '否',
    },
  ],
  placeholder: '选择验证结果',
  ...commonProps,
};


// 验证类型
export const AuthenticationTypeArr = {
  'DOC_CHECK' : '文档验证',
  'SCENE_CHECK' : '现场验证'
}

// 验证类型
export const AuthenticationTypeConfig = {
  allowClear: true,
  dataSource: [
    {
      code: 'DOC_CHECK',
      name: '文档验证',
    },
    {
      code: 'SCENE_CHECK',
      name: '现场验证',
    },
  ],
  placeholder: '选择验证类型',
  ...commonProps,
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

// 查看组长意见
export const CheckGroupLeadersOpinion = async (params = {}) => {
  console.log(params)
  const url = `${recommendUrl}/api/reviewImplementManagementService/findLeaderSuggestion`;
  return request({
    url,
    method: 'POST',
    data: params,
  });
};

// 问题管理
export const IssuesManagementApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewProblemService/findProblemList`;
  return request({
    url,
    method: 'GET',
    params
  });
};

// 问题管理保存(供应商)
export const SaveIssuesManagementSupplierApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewProblemService/dealProblem`;
  return request({
    url,
    method: 'POST',
    data: params
  });
};

// 发送问题(需求方)
export const SendProblemApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewProblemService/sendRemind`;
  return request({
    url,
    method: 'GET',
    params
  });
};

// 验证问题
export const validationProblemApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewProblemService/checkProblem`;
  return request({
    url,
    method: 'post',
    data: params
  });
};

// 验证审核意见
export const VerificationAuditOpinionApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewImplementManagementService/checkConfirm`;
  return request({
    url,
    method: 'GET',
    params
  });
};

// 按评审人查看评分
export const ViewScoreByReviewerApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/findForMember`;
  return request({
    url,
    method: 'GET',
    params
  });
};

// 退回
export const SendBackApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewImplementManagementService/insertLeaderSuggestion`;
  return request({
    url,
    method: 'POST',
    data: params
  });
};

// 查看供应商自评
export const ViewVendorSelfRating = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/findForSupplier`;
  return request({
    url,
    method: 'GET',
    params
  });
};


// 自评
export const TheSelfAssessmentApi = async (params = {}) => {
  const url = `${recommendUrl}/api/reviewResultService/findOneForSupplier`;
  return request({
    url,
    method: 'GET',
    params
  });
};
