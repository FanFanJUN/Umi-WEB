import React, { forwardRef,useImperativeHandle, useState, useRef, useEffect } from 'react';
import { Form,Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../../supplierRegister/components/BaseInfo'
import Account from '../../supplierRegister/components/Account'
import Authorizedclient from '../../supplierRegister/components/Authorizedclient'
import Businessinfo from '../../supplierRegister/components/Businessinfo'
import Bank from '../../supplierRegister/components/Bank'
import SupplyRange from "../../supplierRegister/components/SupplyRange"
import AgentInfo from '../../supplierRegister/components/AgentInfo'
import QualificationCommon from '../../supplierRegister/components/QualificationCommon'
import QualificationProfessional from '../../supplierRegister/components/QualificationProfessional'
import classnames from 'classnames';

import styles from '../../supplierRegister/components/index.less';
import { closeCurrent } from '../../../utils';
const { create } = Form;
const SupplierEditRef = forwardRef(({
  isView,
  form,
  wholeData,
  configuredata
}, ref) => {
  useImperativeHandle(ref, () => ({
    handleSave,
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
      if (item.smMsgTypeCode === '5') {
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
  // 保存
  function handleSave() {
    let baseVal,accountVal,authorizedClientVal,businessInfoVal,bankVal,rangeVal,
    agentVal,qualifications,proCertVos;
    for(let item of configure){
      if (item.operationCode !== '3' && item.fieldCode === 'name') {
        const { getBaseInfo } = BaseinfoRef.current; // 基本信息
        baseVal = getBaseInfo();
        if (!baseVal) {
          message.error('请将供应商基本信息填写完全！');
          return false;
        }
      }else if (item.operationCode !== '3' && item.fieldCode === 'mobile') {
        const { getAccountinfo } = AccountRef.current; //帐号
        accountVal = getAccountinfo();
        if (!accountVal) {
          message.error('请将供应商账号信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'contactVos') {
        const { getAuthorfrom } = AuthorizeRef.current; // 授权委托人
        authorizedClientVal = getAuthorfrom();
        if (!authorizedClientVal) {
          message.error('请将授权委托人信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'businessScope') {
        const { getALLbusinCheck } = BusinessRef.current; //业务信息
        businessInfoVal = getALLbusinCheck();
        if (!businessInfoVal) {
          message.error('请将业务信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'bankInfoVos') {
        const { getbankform } = Bankformef.current; //银行信息
        bankVal = getbankform()
        if (!bankVal) {
          message.error('请将银行相关信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'ScopeOfSupply') {
        const { getSupplierRange } = SupplyRangeRef.current; //供应商范围
        rangeVal = getSupplierRange()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'supplierAgents') {
        const { getAgentform } = Agentformef.current; // 代理商
        agentVal = getAgentform()
        if (!agentVal) {
          message.error('请将代理商信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'genCertVos') {
        const { getqualificationsInfo } = QualificationRef.current; // 通用资质
        qualifications = getqualificationsInfo()
        if (!qualifications) {
          message.error('请将通用资质信息填写完全！');
          return false;
        }
      }
      if (item.operationCode !== '3' && item.fieldCode === 'proCertVos') {
        const { getspecialpurpose } = QualispecialRef.current; // 专用资质
        proCertVos = getspecialpurpose() || [];
      }
    }
    let enclosurelist = [],basedata,accountData,baseexten,automaticdata,automaticincome,
    automThreeYear,rangeValinfo;
    if (baseVal && baseVal.supplierVo) {
      baseVal.supplierVo.id = editData.supplierVo.id;
      baseVal.extendVo.id = editData.extendVo.id;
      basedata = baseVal.supplierVo
    }
    if (baseVal && baseVal.extendVo) {
      baseexten = baseVal.extendVo
    }
    if (baseVal && baseVal.genCertVos) {
      enclosurelist= {...enclosurelist,...baseVal.genCertVos[0]}
    }
    if (accountVal && accountVal.supplierVo) {
      accountData = accountVal.supplierVo
    }
    if (qualifications) {
      enclosurelist = [enclosurelist, ...qualifications.proCertVos];
    }
    if (businessInfoVal && businessInfoVal.supplierVo) {
      automaticdata = businessInfoVal.supplierVo
    }
    if (businessInfoVal&&businessInfoVal.supplierRecentIncomes) {
      automaticincome = businessInfoVal.supplierRecentIncomes
    }
    if (businessInfoVal &&businessInfoVal.extendVo) {
      automThreeYear = businessInfoVal.extendVo
    }
    if (rangeVal && rangeVal.extendVo) {
      rangeValinfo = rangeVal.extendVo
    }
    let supplierInfoVo = {
      supplierVo: { ...basedata, ...accountData ,...automaticdata},
      extendVo: { ...baseexten, ...automThreeYear, ...rangeValinfo },
      contactVos: authorizedClientVal,
      genCertVos: enclosurelist,
      bankInfoVos: bankVal,
      supplierRecentIncomes: automaticincome,
      supplierAgents: agentVal,
      proCertVos: proCertVos ? proCertVos.proCertVos : ''
    }
    if (baseVal) {
      if (baseVal.supplierVo.companyCode) {
        wholeData.companyCode = baseVal.supplierVo.companyCode
        wholeData.companyName = baseVal.supplierVo.companyName
      }
    }
    
    if (wholeData) {
      wholeData.supplierInfoVo = supplierInfoVo;
    }
    return wholeData;
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
                    <BaseInfo
                      baseinfo={baseinfo}
                      initialValues={editData}
                      editformData={editData}
                      wrappedComponentRef={BaseinfoRef}
                      approve={true}
                      change={true}
                      wholeData={wholeData}
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
                      isView={false}
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
                      isView={false}
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
                      isView={false}
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
                      isView={false}
                      headerInfo={false}
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
                      isView={false}
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
                      agenthead={false}
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
                      isView={false}
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
                      editData={editData}
                      wrappedComponentRef={QualispecialRef}
                      isView={false}
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
const CommonForm = create()(SupplierEditRef)

export default CommonForm