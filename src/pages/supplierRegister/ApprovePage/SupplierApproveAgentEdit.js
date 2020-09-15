import React, { forwardRef,useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Form,Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseinfiDetail from '../SupplierDetail/BaseinfiDetail'
import Account from '../components/Account'
import Authorizedclient from '../components/Authorizedclient'
import Businessinfo from '../components/Businessinfo'
import Bank from '../components/Bank'
import SupplyRange from "../components/SupplyRange"
import AgentInfo from '../components/AgentInfo'
import QualificationCommon from '../components/QualificationCommon'
import QualificationProfessional from '../components/QualificationProfessional'
import classnames from 'classnames';
import {
  findApplySupplierInfoVo,
  SaveSupplierconfigureService
} from '@/services/supplierRegister';
import styles from '../components/index.less';
import { closeCurrent } from '../../../utils';
const { create } = Form;
const SupplierAgentRef = forwardRef(({
  isView,
  form,
  wholeData,
  configuredata
}, ref) => {
  useImperativeHandle(ref, () => ({
    saveAgent,
    form
  }));
  const BaseinfoRef = useRef(null);
  const AccountRef = useRef(null);
  const AuthorizeRef = useRef(null);
  const BusinessRef = useRef(null);
  const Bankformef = useRef(null);
  const SupplyRangeRef = useRef(null);
  const Agentformef = useRef(null);
  const QualificationRef = useRef(null);
  const QualispecialRef = useRef(null);
  const [baseinfo, setbaseinfo] = useState([]);
  const [accountinfo, setaccountinfo] = useState([]);
  const [businesshide, setbusinesshide] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  //const [wholeData, setwholeData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [accountVo, setaccountVo] = useState(false);
  const [configure, setConfigure] = useState([ ]);
  useEffect(() => {
    
    setInitialValue(wholeData.supplierInfoVo)
    setEditData(wholeData.supplierInfoVo)
    configurelist(configuredata)
    setConfigure(configuredata)
  }, [wholeData,configuredata])
  // 
  function configurelist(configure) {
    let handlebase = [],handleaccount = [],handbusiness = [];
    configure.map(item => {
      if (item.smMsgTypeCode === '1') {
        handlebase.push({
          title: item.fieldName,
          key: item.fieldCode,
          verifi: item.operationCode
        })
      }
      if (item.smMsgTypeCode === '2') {
        handleaccount.push({
          title: item.fieldName,
          key: item.fieldCode,
          verifi: item.operationCode
        })
      }
      if (item.smMsgTypeCode === '3') {
        handbusiness.push({
          title: item.fieldName,
          key: item.fieldCode,
          verifi: item.operationCode
        })
      }
    })
    setbaseinfo(handlebase)
    setaccountinfo(handleaccount)
    setbusinesshide(handbusiness)
  }
  function saveAgent() {
    const { getAgentform } = Agentformef.current; // 代理商
    let agentVal = getAgentform()
    if (!agentVal) {
      message.error('请将代理商信息填写完全！');
      return false;
    }
    return agentVal;
  }
  return (
    <Spin spinning={loading} tip='处理中...'>

      <div className={styles.wrapper}>        
        {
          configure.map((item, index) => {
            if (item.smMsgTypeCode !== '3' && item.fieldCode === 'name') {
              return (
                <div className={styles.bgw}>
                  <div className={styles.title}>基本信息</div>
                  <div >
                    <BaseinfiDetail
                      editformData={editData}
                      baseinfo={baseinfo}
                      wrappedComponentRef={BaseinfoRef}
                    />
                  </div>
                </div>
              )
            } 
            if (item.operationCode !== '3' && item.fieldCode === 'mobile') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>帐号</div>
                  <div>
                    <Account
                      accountinfo={accountinfo}
                      initialValue={initialValue}
                      editData={editData}
                      wrappedComponentRef={AccountRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'contactVos') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>授权委托人</div>
                  <div>
                    <Authorizedclient
                      initialValue={initialValue}
                      editformData={editData}
                      wrappedComponentRef={AuthorizeRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'businessScope') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>业务信息</div>
                  <div className={styles.content}>
                    <Businessinfo
                      businesshide={businesshide}
                      editformData={editData}
                      wrappedComponentRef={BusinessRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'bankInfoVos') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>银行信息</div>
                  <div>
                    <Bank
                      editData={editData}
                      wrappedComponentRef={Bankformef}
                      isView={true}
                      headerInfo={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'ScopeOfSupply') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>供应范围</div>
                  <div className={styles.content}>
                    <SupplyRange
                      editData={editData}
                      isView={undefined}
                      wrappedComponentRef={SupplyRangeRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'supplierAgents') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>代理商</div>
                  <div>
                    <AgentInfo
                      editData={editData}
                      wrappedComponentRef={Agentformef}
                      agenthead={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'genCertVos') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>供应商通用资质</div>
                  <div>
                    <QualificationCommon
                      editData={editData}
                      wrappedComponentRef={QualificationRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
            if (item.operationCode !== '3' && item.fieldCode === 'proCertVos') {
              return (
                <div className={styles.bgw}>

                  <div className={styles.title}>供应商专用资质</div>
                  <div>
                    <QualificationProfessional
                      wrappedComponentRef={QualispecialRef}
                      isView={true}
                    />
                  </div>
                </div>
              );
            }
          })
        }
      </div>
    </Spin>
  )
})
const CommonForm = create()(SupplierAgentRef)

export default CommonForm