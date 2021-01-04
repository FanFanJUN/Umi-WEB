import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
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
import ReasonAndStartFlowModal from '../commons/ReasonAndStartFlowModal'
import classnames from 'classnames';
import myContext from '../../supplierRegister/components/ContextName'
import {
  SaveSupplierconfigureService,
  SupplierconfigureDetail
} from '@/services/supplierRegister';
import {
  TemporarySupplierRegister,
  checkExistUnfinishedValidity,
  saveSupplierRegister,
  ValiditySupplierRegister
} from '@/services/SupplierModifyService'
import styles from '../../supplierRegister/components/index.less';
import { closeCurrent, isEmpty } from '../../../utils';

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
  const getModelRef = useRef(null)
  const [baseinfo, setbaseinfo] = useState([]);
  const [accountinfo, setaccountinfo] = useState([]);
  const [businesshide, setbusinesshide] = useState([]);
  const [wholeData, setwholeData] = useState([]);
  const [editData, setEditData] = useState([]);
  const [againdata, setAgaindata] = useState({});
  const [loading, triggerLoading] = useState(false);
  const [visible, setvisible] = useState(false);
  const [configure, setConfigure] = useState([]);
  const [supplierName, setsupplierName] = useState();
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  let typeId = query.frameElementId;
  // 获取配置列表项
  useEffect(() => {
    initsupplierDetai(); // 详情

  }, []);
  async function initsupplierDetai() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await SupplierconfigureDetail({ supplierId: id });
    if (success) {
      let suppliertype = data.supplierInfoVo.supplierVo.supplierCategory.id
      setsupplierName(data.supplierInfoVo.supplierVo.name)
      initConfigurationTable(suppliertype)
      setEditData(data.supplierInfoVo)
      setwholeData(data)
      setAgaindata(againdata)
      triggerLoading(false);
      if (data.supplierInfoVo.supplierVo.supplierCategoryName === '个人供应商') {
        let mobile = data.supplierInfoVo.supplierVo.accountVo.mobile;
        if (isEmpty(mobile)) {
          setvisible(true)
        }
        if (data.supplierInfoVo.supplierVo.accountVo === undefined) {
          setvisible(true)
        }
      } else {
        if (data.supplierInfoVo.supplierVo.accountVo) {
          let mobile = data.supplierInfoVo.supplierVo.accountVo.mobile;
          let email = data.supplierInfoVo.supplierVo.accountVo.email;
          if (isEmpty(mobile) || isEmpty(email)) {
            setvisible(true)
          }
        }
        if (data.supplierInfoVo.supplierVo.accountVo === undefined) {
          setvisible(true)
        }
      }
    } else {
      triggerLoading(false);
      message.error(msg)
    }
  }
  // 配置表
  async function initConfigurationTable(typeId) {
    triggerLoading(true);
    let params = { catgroyid: typeId, property: 2 };
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
    for (let item of configure) {
      if (item.operationCode !== '3' && item.fieldCode === 'name') {
        const { getTemporaryBaseInfo } = BaseinfoRef.current; // 基本信息
        baseVal = getTemporaryBaseInfo();

      }
      if (item.operationCode !== '3' && item.fieldCode === 'mobile') {
        //accountVal = ObtainAccount();
        const { getAccountinfo } = AccountRef.current; //帐号
        accountVal = getAccountinfo();
        if (!accountVal) {
          message.error('请将供应商账号信息填写完全！');
          return false;
        }
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
    }
    let enclosurelist = [], basedata, baseexten, accountData,
      automaticdata, automaticincome, automThreeYear, rangeValinfo, othersatt = [];
    if (baseVal && baseVal.supplierVo) {
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
    } else {
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
    if (againdata) {
      againdata.supplierInfoVo = supplierInfoVo;
    }
    //console.log(againdata)
    //如果为新增  拼加一个供应商ID在头上
    againdata.supplierId = againdata.supplierId || query.id;
    againdata.supplierInfoVo.supplierVo.id = editData.supplierVo.id
    againdata.companyCode = supplierInfoVo.supplierVo.companyCode;
    againdata.companyName = supplierInfoVo.supplierVo.companyName;
    againdata.saveStatus = '0';
    let saveData = { ...againdata };
    triggerLoading(true)
    const { success, message: msg } = await TemporarySupplierRegister(saveData);
    if (success) {
      message.success('保存成功');
      triggerLoading(false)
      closeCurrent()
      return
    } else {
      message.error(msg);
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
      }
    }

    let enclosurelist = [], basedata, accountData, baseexten, automaticdata, automaticincome,
      automThreeYear, rangeValinfo, othersatt = [];
    if (baseVal && baseVal.supplierVo) {
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
    } else {
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
    if (againdata) {
      againdata.supplierInfoVo = supplierInfoVo;
    }
    //如果为新增  拼加一个供应商ID在头上
    againdata.supplierId = againdata.supplierId || query.id;
    againdata.saveStatus = '1';
    againdata.companyCode = supplierInfoVo.supplierVo.companyCode;
    againdata.companyName = supplierInfoVo.supplierVo.companyName;
    againdata.supplierInfoVo.supplierVo.id = editData.supplierVo.id
    //let saveData = {...againdata};
    setAgaindata(againdata)
    // 变更保存效验
    const { success, message: msg } = await ValiditySupplierRegister(againdata);
    if (success) {
      getModelRef.current.handleModalVisible(true);
    } else {
      message.error(msg);
    }


  }
  async function createSave(val) {
    triggerLoading(true)
    let params = { ...againdata, ...val };
    const { success, message: msg } = await TemporarySupplierRegister(params);
    if (success) {
      message.success(msg);
      triggerLoading(false)
      closeCurrent()
      return
    } else {
      message.error(msg);
    }
    triggerLoading(false)
  }
  function setSuppliername(name) {
    setsupplierName(name)
  }
  // 返回
  function handleBack() {
    closeCurrent()
  }
  // 切换配置
  function ficationtype(id) {
    initConfigurationTable(id);
  }
  function handleOk() {
    setvisible(false)
  }
  function handleCancel() {
    setvisible(false)
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            供应商变更新增变更单
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
                      editformData={editData}
                      wholeData={wholeData}
                      wrappedComponentRef={BaseinfoRef}
                      onClickfication={ficationtype}
                      change={true}
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
        <ReasonAndStartFlowModal
          editData={editData}
          disabled={true}
          ReaModelOk={createSave}
          wrappedComponentRef={getModelRef}
        />
        <Modal
          title="提示"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>请先到供应商账号的个人设置中绑定手机和邮箱，再变更其他信息，否则无法保存变更信息</p>
        </Modal>
      </div>
    </Spin>
  )
}

export default CreateStrategy;