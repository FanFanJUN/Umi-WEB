/**
 * @Description: 审核报告流程页面
 * @Author: M!keW
 * @Date: 2020-11-25
 */
import React, { useEffect, useRef, useState } from 'react';
import AuditReportManagementView from '../editPage';
import { checkToken } from '../../../../utils';
import * as router from 'react-router-dom';

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
    <>{isReady ? <AuditReportManagementView
      isApprove
      isApproveDetail
    /> : null}</>
  );

};

export default ApproveDetailPage;
