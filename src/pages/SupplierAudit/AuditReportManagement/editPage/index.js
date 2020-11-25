/**
 * @Description: 审核报告管理表单
 * @Author: M!keW
 * @Date: 2020-11-16
 */

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Spin, message, Affix, Button, Modal } from 'antd';
import * as router from 'react-router-dom';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import {
  findForReportInsert,
  FindOneAuditRequirementsManagement, saveAuditReport,
} from '../../mainData/commomService';
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
import { WorkFlow } from 'suid';
import OpinionModal from '../components/OpinionModal';

const { StartFlow } = WorkFlow;

const AuditReportManagementView = forwardRef(({ isApprove, isApproveDetail, isApproveEdit, purchaseApprove, leaderApprove }, ref) => {
  useImperativeHandle(ref, () => ({
    handleSave,
    saveModalData
  }));
  const { query } = router.useLocation();
  const getBaseInfoFormRef = useRef(null);
  const getModalRef = useRef(null);
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
    businessKey: null,
    userInfo: {},
  });

  useEffect(() => {
    const { id, pageState } = query;
    let state = pageState;
    if (pageState === 'add') {
      getUser();
      findInitOne(id);
      setData((value) => ({ ...value, type: state, isView: false, title: '审核报告管理-新增' }));
    } else if (pageState === 'edit' || isApproveEdit) {
      // findOne(id);
      setData((value) => ({
        ...value,
        type: state,
        isView: false,
        title: `审核报告管理-编辑`,
      }));
    } else if (pageState === 'detail' || isApproveDetail) {
      // findOne(id);
      setData((value) => ({ ...value, type: state, isView: true, title: `审核报告管理-明细` }));
    } else if (purchaseApprove || leaderApprove) {
      // findOne(id);
      setData((value) => ({ ...value, type: state, isView: true, title: `审核报告管理-审批` }));
    }
  }, [query]);

  //新增获取默认值
  const findInitOne = (id) => {
    setData(v => ({ ...v, spinLoading: true }));
    findForReportInsert({
      id,
    }).then(res => {
      if (res.success) {
        setData(v => ({ ...v, editData: res.data, spinLoading: false }));
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

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

  //保存
  const handleSave = async () => {
    let baseInfoVal = await getBaseInfoFormRef.current.getFormValue();
    if (!baseInfoVal) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    data.editData.arAuditReportManagBasicVo = baseInfoVal;
    saveAuditReport(data.editData).then(res => {
      if (res.success) {
        message.success(res.message);
        if (!isApprove) {
          handleBack();
        }
      } else {
        message.error(res.message);
      }
    }).catch(err => message.error(err.message));
  };

  //提交
  const handleBeforeStartFlow = async () => {
    let baseInfoVal = await getBaseInfoFormRef.current.getFormValue();
    if (!baseInfoVal) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    data.editData.arAuditReportManagBasicVo = baseInfoVal;
    return new Promise(function(resolve, reject) {
      saveAuditReport(data.editData).then(res => {
        if (res.success) {
          const data = { businessKey: res.data };
          resolve({
            success: true,
            message: res.message,
            data,
          });
        } else {
          message.error(res.message);
        }
      }).catch(err => reject(err));
    });
  };

  //审批意见
  const showModal = () => {
    getModalRef.current.handleModalVisible(true);
  };

  const saveModalData = async () => {
    let modalData = await getModalRef.current.getFormValue();
    console.log(modalData)
    // saveAuditReport(data.editData).then(res => {
    //   if (res.success) {
    //     message.success(res.message);
    //   } else {
    //     message.error(res.message);
    //   }
    // }).catch(err => message.error(err.message));
  };
  return (
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span className={styles.title}>{data.title}</span>
            {
              data.type !== 'detail' || !isApprove &&
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={() => handleSave()}>暂存</Button>
                <StartFlow
                  className={styles.btn}
                  type='primary'
                  beforeStart={handleBeforeStartFlow}
                  callBack={handleBack}
                  disabled={false}
                  businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewRequirement'
                >
                  {
                    loading => <Button loading={loading} type='primary'>提交</Button>
                  }
                </StartFlow></div>
            }
            {purchaseApprove || leaderApprove ? <Button type='primary' className={styles.btn}
                                                        onClick={() => showModal()}>{purchaseApprove ? '小组意见' : (leaderApprove ? '领导意见' : '')}</Button> : null}
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
            data.editData.sysList || []
          }
        />
        <AuditorInfoFrom
          editData={
            data.editData.reviewTeamGroupBoList || []
          }/>
        <CollaboratorForm
          editData={
            data.editData.coordinationMemberBoList || []
          }
        />
        <AuditPlanForm
          reviewPlanStandardBos={data.editData.reviewPlanStandardBos || []}
          editData={data.editData}/>
        <AuditScoreForm
          editData={
            data.editData.reviewResultForSupplierVos || []
          }/>
        <AuditQuestions
          editData={data.editData.problemVoList || []}/>
        <AuditComments
          editData={data.editData.reviewSuggestionVo || {}}/>
        <OpinionModal
          title={purchaseApprove ? '小组意见' : (leaderApprove ? '领导意见' : '')}
          wrappedComponentRef={getModalRef}/>
      </Spin>
    </div>
  );
});

export default Form.create()(AuditReportManagementView);
