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
import {
  findSupplierconfigureId,
  TemporarySupplierRegister,
  SupplierconfigureDetail,
  saveSupplierRegister,
  SaveSupplierconfigureService
} from '@/services/supplierRegister';
import {offlistChineseProvinces,offlistCityByProvince,offlistAreaByCity } from "../../../services/supplierConfig"
import styles from '../components/index.less';
import { closeCurrent } from '../../../utils';

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

  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  let typeId = query.frameElementId;
  async function initConfigurationTable() {
    triggerLoading(true);
    let params = {catgroyid:typeId,property:1};
    const { data, success, message: msg } = await SaveSupplierconfigureService(params);
      if (success) {
        let datalist  = data.configBodyVos;
        setConfigure(datalist)
        triggerLoading(false);
        configurelist(datalist)
      }else {
        triggerLoading(false);
        message.error(msg)
      }
      
    initsupplierDetai(); // 供应商详情
    // 详情
    async function initsupplierDetai() {
      triggerLoading(true);
      let id = query.id;
      const { data, success, message: msg } = await SupplierconfigureDetail({ supplierId: id });
      if (success) {
        setInitialValue(data.supplierInfoVo)
        setEditData(data.supplierInfoVo)
        setwholeData(data)
        triggerLoading(false);
      }else {
        triggerLoading(false);
        message.error(msg)
      }
    }
  }
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
  // 暂存
  async function handleTemporary() {
    const { getTemporaryBaseInfo } = BaseinfoRef.current; // 基本信息
    let baseVal = getTemporaryBaseInfo();
    //let accountVal = ObtainAccount();
    let authorizedClientVal,businessInfoVal,bankVal,
    rangeVal,agentVal,qualifications,proCertVos;
    configure.map(item => {
      if (item.operationCode !== '3' && item.fieldCode === 'contactVos') {
        authorizedClientVal = ObtainAuthor();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'supplierRecentIncomes') {
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
    let enclosurelist = [],automaticdata,automaticincome,automThreeYear,rangeValinfo;
    if (baseVal && baseVal.genCertVos) {
      enclosurelist= {...enclosurelist,...baseVal.genCertVos[0]}
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
      supplierVo: { ...baseVal.supplierVo, ...automaticdata},
      extendVo: { ...baseVal.extendVo, ...automThreeYear, ...rangeValinfo },
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
    let saveData = wholeData;
    triggerLoading(true)
    const { success, message: msg } = await TemporarySupplierRegister(saveData);
    if (success) {
      message.success('保存成功');
      triggerLoading(false)
      closeCurrent()
      return
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
  // 帐号保存表单
  function saveAccount() {
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
  function saveAuthor() {
    const { getAuthorfrom } = AuthorizeRef.current; // 授权委托人
    const authorizedClientVal = getAuthorfrom();
    if (!authorizedClientVal) {
      message.error('请将授权委托人信息填写完全！');
      return false;
    }
    return authorizedClientVal;
  }
  // 业务信息
  function ObtainBusines() {
    const { businerTemporary } = BusinessRef.current; //业务信息
    const businessInfoVal = businerTemporary();
    return businessInfoVal;
  }
  function saveBusines() {
    const { getALLbusinCheck } = BusinessRef.current; //业务信息
    const businessInfoVal = getALLbusinCheck();
    if (!businessInfoVal) {
      message.error('请将业务信息填写完全！');
      return false;
    }
    return businessInfoVal;
  }
  // 银行
  function ObtainBank() {
    const { bankTemporary } = Bankformef.current; //银行信息
    const bankVal = bankTemporary()
    return bankVal;
  }
  function saveBank() {
    const { getbankform } = Bankformef.current; //银行信息
    const bankVal = getbankform()
    if (!bankVal) {
      message.error('请将银行相关信息填写完全！');
      return false;
    }
    return bankVal;
  }
  // //供应商范围
  function ObtianSupply() {
    const { SupplierTemporary } = SupplyRangeRef.current; //供应商范围
    const rangeVal = SupplierTemporary()
    return rangeVal;
  }
  function saveSupply() {
    const { getSupplierRange } = SupplyRangeRef.current; //供应商范围
    const rangeVal = getSupplierRange()
    return rangeVal;
  }
  // 代理商
  function ObtionAgent() {
    const { agentTemporary } = Agentformef.current; // 代理商
    const agentVal = agentTemporary()
    return agentVal;
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
  // 通用资质
  function ObtionqualificationsInfo() {
    const { qualicaTemporary } = QualificationRef.current; // 通用资质
    let qualifications = qualicaTemporary()
    return qualifications;
  }
  function savequalificationsInfo() {
    const { getqualificationsInfo } = QualificationRef.current; // 通用资质
    let qualifications = getqualificationsInfo()
    if (!qualifications) {
      message.error('请将通用资质信息填写完全！');
      return false;
    }
    return qualifications;
  }
  // 专用资质
  function ObtionpurposeTemporary() {
    const { purposeTemporary } = QualispecialRef.current; // 专用资质
    let proCertVos = purposeTemporary() || [];
    return proCertVos;
  }
  function savespecialpurpose() {
    const { getspecialpurpose } = QualispecialRef.current; // 专用资质
    let proCertVos = getspecialpurpose() || [];
    return proCertVos;
  }
  // 保存
  async function handleSave() {
    const { getBaseInfo } = BaseinfoRef.current; // 基本信息
    const baseVal = getBaseInfo();
    if (!baseVal) {
      message.error('请将供应商基本信息填写完全！');
      return false;
    }
    let accountVal = saveAccount();
    let authorizedClientVal,businessInfoVal,bankVal,rangeVal,
    agentVal,qualifications,proCertVos;
    configure.map(item => {
      if (item.operationCode !== '3' && item.fieldCode === 'contactVos') {
        authorizedClientVal = saveAuthor()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'supplierRecentIncomes') {
        businessInfoVal = saveBusines()
      } 
      if (item.operationCode !== '3' && item.fieldCode === 'bankInfoVos') {
        bankVal = saveBank() 
      }
      if (item.operationCode !== '3' && item.fieldCode === 'ScopeOfSupply') {
        rangeVal = saveSupply()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'supplierAgents') {
        agentVal = saveAgent()
      }
      if (item.operationCode !== '3' && item.fieldCode === 'genCertVos') {
        qualifications = savequalificationsInfo();
      }
      if (item.operationCode !== '3' && item.fieldCode === 'proCertVos') {
        proCertVos = savespecialpurpose()
      }
    })
   
    let enclosurelist = [],automaticdata,automaticincome,automThreeYear,rangeValinfo;
    if (baseVal && baseVal.genCertVos) {
      enclosurelist= {...enclosurelist,...baseVal.genCertVos[0]}
    }
    if (qualifications) {
      enclosurelist = [enclosurelist, ...qualifications.proCertVos];
    }
    console.log(enclosurelist)
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
      supplierVo: { ...baseVal.supplierVo, ...accountVal.supplierVo ,...automaticdata},
      extendVo: { ...baseVal.extendVo, ...automThreeYear, ...rangeValinfo },
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
    let saveData = wholeData;
    console.log(saveData)
    triggerLoading(true)
    const { success, message: msg } = await saveSupplierRegister(saveData);
    if (success) {
      message.success(msg);
      triggerLoading(false)
      closeCurrent()
      return
    }else {
      message.error(msg);
    }
    triggerLoading(false)
  }
  function ficationtype(id){
    typeId = id;
    initConfigurationTable();
  }
  // 获取配置列表项
  useEffect(() => {
    initConfigurationTable(); // 获取配置

  }, []);
  // 返回
  function handleBack() {
    closeCurrent()
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
                    <Bank
                      editData={editData}
                      wrappedComponentRef={Bankformef}
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