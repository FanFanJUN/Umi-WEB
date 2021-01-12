/**
 * @Description: 审核简报流程页面
 * @Author: M!keW
 * @Date: 2020-12-04
 */
import React, { useEffect, useRef, useState } from 'react';
import AuditBriefingManagementView from '../editPage';
import { checkToken } from '../../../../utils';
import * as router from 'react-router-dom';
import AuditReportManagementView from '../../AuditReportManagement/editPage';

const ApproveDetailPage = () => {
  const { query } = router.useLocation();
  const [isReady, setIsReady] = useState(false);
  // 获取配置列表项
  useEffect(() => {
    async function init() {
      await checkToken(query, setIsReady);
    }
    init();
  }, []);
  return (
    <>{isReady ? <AuditBriefingManagementView
      isApprove
      isApproveDetail
    />: null}</>
  );

};

export default ApproveDetailPage;
