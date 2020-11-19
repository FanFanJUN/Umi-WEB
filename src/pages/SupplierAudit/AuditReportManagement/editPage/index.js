/**
 * @Description: 审核报告管理表单
 * @Author: M!keW
 * @Date: 2020-11-16
 */

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Spin, message, Affix, Button } from 'antd';
import { recommendUrl } from '@/utils/commonUrl';
import { openNewTab } from '@/utils';
import * as router from 'react-router-dom';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import { FindOneAuditRequirementsManagement } from '../../mainData/commomService';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import BaseInfoForm from '../components/BaseInfoForm';
import AuditInfoForm from '../components/AuditInfoForm';
import AuditScopeForm from '../components/AuditScopeForm';
import AuditorInfoFrom from '../components/AuditorInfoForm';
import CollaboratorForm from '../components/CollaboratorForm';
import AuditPlanForm from '../components/AuditPlanForm';
import AuditScoreForm from '../components/AuditScoreForm';
import AuditQuestions from '../components/AuditQuestions';
import AuditComments from '../components/AuditComments';

const auditReportManagementView = forwardRef(({}, ref) => {
  useImperativeHandle(ref, () => ({}));
  const { query } = router.useLocation();
  const getBaseInfoFormRef = useRef(null);
  const getUser = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userMobile = getMobile();
    setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
  };
  const [data, setData] = useState({
    editData: {},
    spinLoading: false,
    isView: false,
    loading: false,
    type: 'add',
    title: '',
    userInfo: {},
  });

  useEffect(() => {
    const { id, pageState } = query;
    let state = pageState;
    switch (state) {
      case 'add':
        getUser();
        setData((value) => ({ ...value, type: state, isView: false, title: '审核报告管理-新增' }));
        break;
      case 'edit':
        findOne(id);
        setData((value) => ({
          ...value,
          type: state,
          isView: false,
          title: `审核需求管理-编辑`,
        }));
        break;
      case 'detail':
        findOne(id);
        setData((value) => ({ ...value, type: state, isView: true, title: `审核需求管理-明细` }));
        break;
    }
  }, []);

  //获取值
  const findOne = (id) => {
    setData(v => ({ ...v, spinLoading: true }));
    FindOneAuditRequirementsManagement({
      id,
    }).then(res => {
      if (res.success) {
        setData(v => ({ ...v, editData: res.data, spinLoading: false }));
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

  //返回
  const handleBack = () => {
    setData(v => ({ ...v, loading: false }));
    closeCurrent();
  };

  const handleSave = async () => {
    let baseInfoVal = getBaseInfoFormRef.current.getFormValue();
    if (!baseInfoVal) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    console.log(baseInfoVal);
  };

  return (
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span className={styles.title}>{data.title}</span>
            {
              data.type !== 'detail' &&
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={() => handleSave('save')}>暂存</Button>
                <Button className={styles.btn} type={'primary'} onClick={() => handleSave('submit')}>提交</Button>
              </div>
            }
          </div>
        </Affix>
        <BaseInfoForm
          editData={data.editData}
          userInfo={data.userInfo}
          type={data.type}
          isView={data.isView}
          wrappedComponentRef={getBaseInfoFormRef}
        />
        <AuditInfoForm
          editData={data.editData}
        />
        <AuditScopeForm
          editData={
            ['0-1-0', '0-0-1']
          }
        />
        <AuditorInfoFrom
          editData={
            [{
              id: '1',
              reviewGroup: 'A',
              rank: '1',
              groupLeader: 'zz',
              groupData: [{ id: '001', memberName: '姓名1', employeeNo: '编号1', checkId: ['0-1-0', '0-0-1'] }, {
                id: '002',
                memberName: '姓名2',
                employeeNo: '编号2',
              }],
            },
              {
                id: '2',
                reviewGroup: 'B',
                rank: '2',
                groupLeader: 'yy',
                groupData: [{ id: '003', memberName: '姓名3', employeeNo: '编号3' }, {
                  id: '004',
                  memberName: '姓名4',
                  employeeNo: '编号4',
                }],
              }]
          }/>
        <CollaboratorForm
          editData={[]}
        />
        <AuditPlanForm
          editData={data.editData}/>
        <AuditScoreForm
          editData={[]}/>
        <AuditQuestions
          editData={[]}/>
        <AuditComments
          editData={data.editData}/>
      </Spin>
    </div>
  );
});

export default Form.create()(auditReportManagementView);
