import React, { useEffect, useRef, useState } from 'react';
import { Affix, Button, message, Modal, Spin } from 'antd';
import classnames from 'classnames';
import styles from '../../../Supplier/Editor/index.less';
import { closeCurrent, getMobile, getUserId, getUserName } from '../../../../utils';
import BaseInfo from './BaseInfo';
import { router } from 'dva';
import IntendedAuditInformation from './IntendedAuditInformation';
import {
  AddAuditRequirementsManagement,
  FindOneAuditRequirementsManagement,
  GetAllAuditType, UpdateAuditRequirementsManagement,
} from '../../mainData/commomService';
import { WorkFlow } from 'suid';

const { StartFlow } = WorkFlow;

const Index = (props) => {
  const baseInfoRef = useRef(null);

  const intendedAuditInformationRef = useRef(null);

  const { query } = router.useLocation();

  const [applyCorporationCode, setApplyCorporationCode] = useState('');

  const [companyCode, setCompanyCode] = useState('');

  const [organizationCode, setOrganizationCode] = useState();

  const [deleteLine, setDeleteLine] = useState([]);

  const [data, setData] = useState({
    lineBoList: [],
    editData: {},
    allAuditType: [],
    spinLoading: false,
    isView: false,
    loading: false,
    type: 'add',
    title: '',
    userInfo: {},
  });

  useEffect(() => {
    // 获取所有审核类型
    getAuditType();
    const { id, pageState } = query;
    let state = pageState
    if (props.isInFlow) {
      state = 'detail'
    }
    switch (state) {
      case 'add':
        getUser();
        setData((value) => ({ ...value, type: state, isView: false, title: '审核需求管理-新增' }));
        break;
      case 'edit':
        findOne(id);
        setData((value) => ({
          ...value,
          type: state,
          isView: false,
          title: `审核需求管理-编辑 ${id}`,
        }));
        break;
      case 'detail':
        findOne(id);
        setData((value) => ({ ...value, type: state, isView: true, title: `审核需求管理-明细 ${id}` }));
        break;
    }
  }, []);

  const findOne = (id) => {
    setData(v => ({ ...v, spinLoading: true }));
    FindOneAuditRequirementsManagement({
      reviewRequirementCode: id,
    }).then(res => {
      if (res.success) {
        setCompanyCode(res.data.applyCorporationCode);
        setOrganizationCode(res.data.purchaseOrgCode);
        setData(v => ({ ...v, editData: res.data, lineBoList: res.data.lineBoList, spinLoading: false }));
      } else {
        message.error(res.message);
      }
      console.log(res);
    });
  };

  const getAuditType = () => {
    GetAllAuditType().then(res => {
      if (res.success) {
        setData(v => ({ ...v, allAuditType: res.data }));
      } else {
        message.error('获取审核类型失败');
      }
    });
  };

  const getUser = () => {
    const userId = getUserId();
    const userName = getUserName();
    const userMobile = getMobile();
    setData((v) => ({ ...v, userInfo: { userName, userId, userMobile } }));
  };

  const handleBack = () => {
    setData(v => ({ ...v, loading: false }));
    // openNewTab(`qualitySynergy/DataSharingList`, '技术资料分享需求列表', true);
    closeCurrent();
  };

  const handleSave = async () => {
    let insertData = await baseInfoRef.current.getBaseInfoData((err, values) => {
      if (!err) {
        return values;
      }
    });
    const lineBoList = await intendedAuditInformationRef.current.getDataSource();
    const deleteArr = await intendedAuditInformationRef.current.getDeleteArr();
    if (lineBoList && lineBoList.length !== 0) {
      insertData.lineBoList = [...lineBoList, ...deleteLine];
      Modal.confirm({
        title: '是否确认暂存该数据!',
        onOk: () => {
          if (data.type === 'add') {
            AddAuditRequirementsManagement(insertData).then(res => {
              if (res.success) {
                message.success(res.message);
                // handleBack();
              } else {
                message.error(res.message);
              }
            }).catch(err => message.error(err.message));
          } else {
            let updateData = Object.assign(data.editData, insertData);
            updateData.deleteList = deleteArr;
            UpdateAuditRequirementsManagement(updateData).then(res => {
              if (res.success) {
                message.success(res.message);
                // handleBack();
              } else {
                message.error(res.message);
              }
            }).catch(err => message.error(err.message));
          }
        },
        okText: '确定',
        cancelText: '取消',
      });
    } else {
      message.error('请至少添加一条拟审核信息!');
    }
    // console.log(baseInfoData)
  };

  const handleBeforeStartFlow = async () => {
    console.log('触发');
    let insertData = await baseInfoRef.current.getBaseInfoData((err, values) => {
      if (!err) {
        return values;
      }
    });
    const lineBoList = await intendedAuditInformationRef.current.getDataSource();
    const deleteArr = await intendedAuditInformationRef.current.getDeleteArr();
    insertData.lineBoList = [...lineBoList, ...deleteLine];
    if (data.type === 'add') {
      return new Promise(function(resolve, reject) {
        AddAuditRequirementsManagement(insertData).then(res => {
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
    } else {
      let updateData = Object.assign(data.editData, insertData);
      updateData.deleteList = deleteArr;
      return new Promise(function(resolve, reject) {
        UpdateAuditRequirementsManagement(updateData).then(res => {
          if (res.success) {
            console.log(insertData, 'insertData')
            const data = { businessKey: updateData.id };
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
    }

  };

  const handleComplete = () => {
    handleBack();
  };

  return (
    <div>
      <Spin spinning={data.spinLoading}>
        <Affix>
          <div className={classnames(styles.fbc, styles.affixHeader)}>
            <span>{data.title}</span>
            {
              data.type !== 'detail' && <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button className={styles.btn} onClick={handleBack}>返回</Button>
                <Button className={styles.btn} onClick={() => handleSave('add')}>暂存</Button>
                <StartFlow
                  className={styles.btn}
                  type='primary'
                  beforeStart={handleBeforeStartFlow}
                  callBack={handleComplete}
                  disabled={false}
                  businessModelCode='com.ecmp.srm.sam.entity.sr.ReviewRequirement'
                >
                  {
                    loading => <Button loading={loading} type='primary'>提交</Button>
                  }
                </StartFlow>
              </div>
            }
          </div>
        </Affix>
        <BaseInfo
          editData={data.editData}
          setCompanyCode={setCompanyCode}
          setOrganizationCode={setOrganizationCode}
          wrappedComponentRef={baseInfoRef}
          userInfo={data.userInfo}
          type={data.type}
          setApplyCorporationCode={setApplyCorporationCode}
          isView={data.isView}
        />
        <IntendedAuditInformation
          setDeleteLine={setDeleteLine}
          deleteLine={deleteLine}
          editData={data.lineBoList}
          companyCode={companyCode}
          wrappedComponentRef={intendedAuditInformationRef}
          organizationCode={organizationCode}
          allAuditType={data.allAuditType}
          applyCorporationCode={applyCorporationCode}
          type={data.type}
          isView={data.isView}
        />
      </Spin>
    </div>
  );

};

export default Index;
