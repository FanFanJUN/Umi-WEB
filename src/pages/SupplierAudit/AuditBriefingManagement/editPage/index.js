/**
 * @Description: 审核简报表单
 * @Author: M!keW
 * @Date: 2020-11-26
 */

import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { Form, Spin, message, Affix, Button } from 'antd';
import * as router from 'react-router-dom';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import {
  findBriefingVoById,
  findForBriefingInsert,
  saveAuditBriefing,
} from '../../mainData/commomService';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import { WorkFlow } from 'suid';
import BaseInfoForm from '../components/BaseInfoForm';
import PeriodForm from '../components/PeriodForm';
import TotalInfoForm from '../components/TotalInfoForm';
import ThisPeriodForm from '../components/ThisPeriodForm';
import NextPeriodForm from '../components/NextPeriodForm';


const { StartFlow } = WorkFlow;

const AuditBriefingManagementView = forwardRef(({ isApprove, isApproveDetail, isApproveEdit, purchaseApprove, leaderApprove }, ref) => {
  useImperativeHandle(ref, () => ({
    handleSave,
    handleBeforeStartFlow,
    getAllData,
  }));
  const { query } = router.useLocation();
  const getBaseInfoFormRef = useRef(null);
  const getThisPeriodFormRef = useRef(null);
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
    code: '',
  });

  useEffect(() => {
    const { id, pageState } = query;
    let state = pageState;
    if (pageState === 'add') {
      getUser();
      findInitOne(id);
      setData((value) => ({ ...value, type: 'add', isView: false, title: '审核简报-新增' }));
    } else if (pageState === 'edit' || isApproveEdit) {
      findOne(id, false);
      setData((value) => ({
        ...value,
        type: state,
        isView: false,
        title: `审核简报-编辑`,
      }));
    } else if (pageState === 'detail' || isApproveDetail) {
      findOne(id, true);
      setData((value) => ({ ...value, type: 'detail', isView: true, title: `审核简报-明细` }));
    }
  }, [query]);

  //新增获取默认值
  const findInitOne = (id) => {
    setData(v => ({ ...v, spinLoading: true }));
    findForBriefingInsert({
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
  const findOne = (id, showCode) => {
    setData(v => ({ ...v, spinLoading: true }));
    findBriefingVoById({
      id,
    }).then(res => {
      if (res.success) {
        if (showCode) {
          setData(v => ({ ...v, editData: res.data, spinLoading: false, code: ':' + res.data.auditReportManagCode }));
        } else {
          setData(v => ({ ...v, editData: res.data, spinLoading: false }));
        }
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

  const getAllData = async () => {
    let baseInfoVal = await getBaseInfoFormRef.current.getFormValue();
    if (!baseInfoVal) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    let thisPeriodInfoVal = await getThisPeriodFormRef.current.getFormValue();
    data.editData = Object.assign(data.editData, baseInfoVal, thisPeriodInfoVal);
    return data.editData;
  };

  //保存
  const handleSave = async () => {
    let baseInfoVal = await getBaseInfoFormRef.current.getFormValue();
    if (!baseInfoVal) {
      message.error('请将基本信息填写完全！');
      return false;
    }
    let thisPeriodInfoVal = await getThisPeriodFormRef.current.getFormValue();
    data.editData = Object.assign(data.editData, baseInfoVal, thisPeriodInfoVal);
    saveAuditBriefing(data.editData).then(res => {
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
      return false;
    }
    let thisPeriodInfoVal = await getThisPeriodFormRef.current.getFormValue();
    data.editData = Object.assign(data.editData, baseInfoVal, thisPeriodInfoVal);
    return new Promise(function(resolve, reject) {
      saveAuditBriefing(data.editData).then(res => {
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


  return (
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span className={styles.title}>{data.title + '' + data.code}</span>
            {
              isApprove ? null : (data.type !== 'detail') &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Button className={styles.btn} onClick={handleBack}>返回</Button>
                  <Button className={styles.btn} onClick={() => handleSave()}>暂存</Button>
                  <StartFlow
                    className={styles.btn}
                    type='primary'
                    beforeStart={handleBeforeStartFlow}
                    startComplete={handleBack}
                    onCancel={handleBack}
                    disabled={false}
                    businessModelCode='com.ecmp.srm.sam.entity.ab.AbAuditBriefingManage'
                  >
                    {
                      loading => <Button loading={loading} type='primary'>提交</Button>
                    }
                  </StartFlow></div>
            }
          </div>
        </Affix>
        <BaseInfoForm
          editData={data.editData || {}}
          userInfo={data.userInfo}
          type={data.type}
          isView={data.isView}
          wrappedComponentRef={getBaseInfoFormRef}/>
        <PeriodForm
          editData={data.editData}/>
        <TotalInfoForm
          editData={data.editData}/>
        <ThisPeriodForm
          isView={data.isView}
          type={data.type}
          wrappedComponentRef={getThisPeriodFormRef}
          editData={data.editData}/>
        <NextPeriodForm
          editData={data.editData}/>
      </Spin>
    </div>
  );
});

export default Form.create()(AuditBriefingManagementView);
