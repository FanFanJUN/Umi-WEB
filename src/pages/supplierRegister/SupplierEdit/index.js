import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseInfo from '../components/BaseInfo'
import Account from '../components/Account'
import Authorizedclient from '../components/Authorizedclient'
import Businessinfo from '../components/Businessinfo'
import Bank from '../components/Bank'
import SupplyRange from "../components/SupplyRange"
import AgentInfo from '../components/AgentInfo'
import QualificationCommon from '../components/QualificationCommon'
import QualificationProfessional from '../components/QualificationProfessional'
import classnames from 'classnames';
import myContext from '../components/ContextName'
import {
  findSupplierconfigureId,
  TemporarySupplierRegister,
  SupplierconfigureDetail,
  saveSupplierRegister,
  SaveSupplierconfigureService
} from '@/services/supplierRegister';
import { offlistChineseProvinces, offlistCityByProvince, offlistAreaByCity } from "../../../services/supplierConfig"
import styles from '../components/index.less';
import { closeCurrent } from '../../../utils';
import { openNewTab, getFrameElement } from '@/utils';
import queryString from "query-string";
function CreateStrategy() {
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
  const [wholeData, setwholeData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [accountVo, setaccountVo] = useState(false);
  const [configure, setConfigure] = useState([]);
  const [supplierName, setsupplierName] = useState();
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  let typeId = query.frameElementId;
  let urlParams = queryString.parse(window.location.search);
    // 获取配置列表项
    useEffect(() => {
      initsupplierDetai(); //详情
    }, []);
  // 详情
  async function initsupplierDetai() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await SupplierconfigureDetail({ supplierId: id });
    if (success) {
      let suppliertype = data.supplierInfoVo.supplierVo.supplierCategory.id
      setsupplierName(data.supplierInfoVo.supplierVo.name)
      initConfigurationTable(suppliertype)
      setTimeout(() => {
        
        setEditData(data.supplierInfoVo)
        setwholeData(data)
        triggerLoading(false);
      }, 100);
      setInitialValue(data.supplierInfoVo)
    } else {
      triggerLoading(false);
      message.error(msg)
    }
  }
  // 配置
  async function initConfigurationTable(typeId) {
   triggerLoading(true);
    let params = { catgroyid: typeId, property: 1 };
    const { data, success, message: msg } = await SaveSupplierconfigureService(params);
    if (success) {
      let datalist = data.configBodyVos;
      setConfigure(datalist)
      triggerLoading(false);
      configurelist(datalist)
    } else {
      triggerLoading(false);
      message.error(msg)
    }
  }
  function configurelist(configure) {
    let handlebase = [], handleaccount = [], handbusiness = [];
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
  // 暂存
  async function handleTemporary() {
    let baseVal, accountVal, authorizedClientVal, businessInfoVal, bankVal,
      rangeVal, agentVal, qualifications, proCertVos;
    configure.map(item => {
      if (item.operationCode !== '3' && item.fieldCode === 'name') {
        const { getTemporaryBaseInfo } = BaseinfoRef.current; // 基本信息
        baseVal = getTemporaryBaseInfo();

      } else if (item.operationCode !== '3' && item.fieldCode === 'mobile') {
        accountVal = ObtainAccount();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'contactVos') {
        authorizedClientVal = ObtainAuthor();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'businessScope') {
        businessInfoVal = ObtainBusines()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'bankInfoVos') {
        bankVal = ObtainBank()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'enterpriseProfile') {
        rangeVal = ObtianSupply();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'supplierAgents') {
        agentVal = ObtionAgent();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'genCertVos') {
        qualifications = ObtionqualificationsInfo()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'proCertVos') {
        proCertVos = ObtionpurposeTemporary() || '';
      }
    })
    let enclosurelist = [], basedata, baseexten, accountData,
      automaticdata, automaticincome, automThreeYear, rangeValinfo,othersatt=[];
    if (baseVal && baseVal.supplierVo) {
      baseVal.supplierVo.id = wholeData.supplierInfoVo.supplierVo.id;
      baseVal.extendVo.id = wholeData.supplierInfoVo.extendVo.id;
      basedata = baseVal.supplierVo
    }
    if (baseVal && baseVal.extendVo) {
      baseexten = baseVal.extendVo
    }
    if (baseVal && baseVal.genCertVos) {
      enclosurelist.push(...baseVal.genCertVos)
      othersatt = enclosurelist
    }
    if (accountVal && accountVal.supplierVo) {
      accountData = accountVal.supplierVo
    }
    if (qualifications) {
      enclosurelist = [...othersatt, ...qualifications.proCertVos];
    }else {
      enclosurelist = othersatt
    }
    if (businessInfoVal && businessInfoVal.supplierVo) {
      automaticdata = businessInfoVal.supplierVo
    }
    console.log(businessInfoVal)
    if (businessInfoVal && businessInfoVal.supplierRecentIncomes) {
      automaticincome = businessInfoVal.supplierRecentIncomes
    }
    if (businessInfoVal && businessInfoVal.extendVo) {
      automThreeYear = businessInfoVal.extendVo
    }
    if (rangeVal && rangeVal.extendVo) {
      rangeValinfo = rangeVal.extendVo
    }

    let supplierInfoVo = {
      supplierVo: { ...basedata, ...accountData, ...automaticdata },
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
        if (baseVal.supplierVo.companyName === baseVal.supplierVo.companyCode) {
          wholeData.companyName = wholeData.companyName
        } else {
          wholeData.companyName = baseVal.supplierVo.companyName
        }

      }
    }
    if (wholeData) {
      wholeData.supplierInfoVo = supplierInfoVo;
    }
    let saveData = wholeData;
    triggerLoading(true)
    const { success, message: msg } = await TemporarySupplierRegister(saveData);
    if (success) {
      message.success('保存成功');
      triggerLoading(false)
      banckjudge()
      return
    }else {
      message.success(msg);
    }
    triggerLoading(false)
  }
  // 帐号暂存
  function ObtainAccount() {
    const { getAccountinfo } = AccountRef.current; //帐号
    const accountVal = getAccountinfo();
    if (!accountVal) {
      message.error('请将供应商账号信息填写完全！');
      return false;
    }
    return accountVal;
  }
  //  // 授权委托人
  function ObtainAuthor() {
    const { authorTemporary } = AuthorizeRef.current;
    const authorizedClientVal = authorTemporary();
    return authorizedClientVal;
  }

  // 业务信息
  function ObtainBusines() {
    const { businerTemporary } = BusinessRef.current; //业务信息
    const businessInfoVal = businerTemporary();
    return businessInfoVal;
  }

  // 银行
  function ObtainBank() {
    const { bankTemporary } = Bankformef.current; //银行信息
    const bankVal = bankTemporary()
    return bankVal;
  }

  // //供应商范围
  function ObtianSupply() {
    const { SupplierTemporary } = SupplyRangeRef.current; //供应商范围
    const rangeVal = SupplierTemporary()
    return rangeVal;
  }
  // 代理商
  function ObtionAgent() {
    const { agentTemporary } = Agentformef.current; // 代理商
    const agentVal = agentTemporary()
    return agentVal;
  }
  // 通用资质
  function ObtionqualificationsInfo() {
    const { qualicaTemporary } = QualificationRef.current; // 通用资质
    let qualifications = qualicaTemporary()
    return qualifications;
  }
  // 专用资质
  function ObtionpurposeTemporary() {
    const { purposeTemporary } = QualispecialRef.current; // 专用资质
    let proCertVos = purposeTemporary() || [];
    return proCertVos;
  }

  // 保存
  async function handleSave() {
    //triggerLoading(true)
    let baseVal, accountVal, authorizedClientVal, businessInfoVal, bankVal, rangeVal,
      agentVal, qualifications, proCertVos;
    for (let item of configure) {
      if (item.operationCode !== '3' && item.fieldCode === 'name') {
        const { getBaseInfo } = BaseinfoRef.current; // 基本信息
        baseVal = getBaseInfo();
        if (!baseVal) {
          message.error('请将供应商基本信息填写完全！');
          return false;
        }
      } else if (item.operationCode !== '3' && item.fieldCode === 'mobile') {
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
        if (!proCertVos) {
          message.error('请将专用资质信息填写完全！');
          return false;
        }
      }
    }
    let enclosurelist = [], basedata, accountData, baseexten, automaticdata, automaticincome,
      automThreeYear, rangeValinfo,othersatt = [];
    if (baseVal && baseVal.supplierVo) {
      baseVal.supplierVo.id = wholeData.supplierInfoVo.supplierVo.id;
      baseVal.extendVo.id = wholeData.supplierInfoVo.extendVo.id;
      basedata = baseVal.supplierVo
    }
    if (baseVal && baseVal.extendVo) {
      baseexten = baseVal.extendVo
    }
    if (baseVal && baseVal.genCertVos) {
      enclosurelist.push(...baseVal.genCertVos)
      othersatt = enclosurelist
    }
    if (accountVal && accountVal.supplierVo) {
      accountData = accountVal.supplierVo
    }
    if (qualifications) {
      enclosurelist = [...othersatt, ...qualifications.proCertVos];
    }else {
      enclosurelist = othersatt
    }
    if (businessInfoVal && businessInfoVal.supplierVo) {
      automaticdata = businessInfoVal.supplierVo
    }
    if (businessInfoVal && businessInfoVal.supplierRecentIncomes) {
      automaticincome = businessInfoVal.supplierRecentIncomes
    }
    if (businessInfoVal && businessInfoVal.extendVo) {
      automThreeYear = businessInfoVal.extendVo
    }
    if (rangeVal && rangeVal.extendVo) {
      rangeValinfo = rangeVal.extendVo
    }
    let supplierInfoVo = {
      supplierVo: { ...basedata, ...accountData, ...automaticdata },
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
        if (baseVal.supplierVo.companyName === baseVal.supplierVo.companyCode) {
          wholeData.companyName = wholeData.companyName
        } else {
          wholeData.companyName = baseVal.supplierVo.companyName
        }

      }
    }

    if (wholeData) {
      wholeData.supplierInfoVo = supplierInfoVo;
    }
    console.log(wholeData)
    let saveData = wholeData;
    triggerLoading(true)
    const { success, message: msg } = await saveSupplierRegister(saveData);
    if (success) {
      message.success(msg);
      triggerLoading(false)
      banckjudge()
      return
    } else {
      message.error(msg);
    }
    triggerLoading(false)
  }
  function ficationtype(id) {
    initConfigurationTable(id);
  }
  function setSuppliername(name) {
    setsupplierName(name)
  }
  // 返回
  function handleBack() {
    banckjudge()
  }
  function banckjudge() {
    let afterUrl = queryString.parse(window.location.search);
    if (urlParams.isOutside) {
      openNewTab("supplier/selfRegister/OutSideRegisterListView", '我的注册信息', true, afterUrl.frameId);
    }else {
      closeCurrent()
    }
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            供应商编辑
            </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleTemporary}>暂存</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>

      </Affix>

      <div className={styles.wrapper}>
        {
          configure.map((item, index) => {
            if (item.smMsgTypeCode !== '3' && item.fieldCode === 'name') {
              return (
                <div className={styles.bgw}>
                  <div className={styles.title}>基本信息</div>
                  <div >
                    <BaseInfo
                      Dyformname={setSuppliername}
                      baseinfo={baseinfo}
                      initialValues={editData}
                      editformData={editData}
                      wholeData={wholeData}
                      wrappedComponentRef={BaseinfoRef}
                      onClickfication={ficationtype}
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
                    <myContext.Provider value={supplierName}>
                      <Bank
                        editData={editData}
                        wrappedComponentRef={Bankformef}
                      />
                  </myContext.Provider>
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
}

export default CreateStrategy;