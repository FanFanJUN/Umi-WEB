import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import BaseinfiDetail from '../../supplierRegister/SupplierDetail/BaseinfiDetail'
import Account from '../../supplierRegister/components/Account'
import Authorizedclient from '../../supplierRegister/components/Authorizedclient'
import Businessinfo from '../../supplierRegister/components/Businessinfo'
import Bank from '../../supplierRegister/components/Bank'
import SupplyRange from "../../supplierRegister/components/SupplyRange"
import AgentInfo from '../../supplierRegister/components/AgentInfo'
import QualificationCommon from '../../supplierRegister/components/QualificationCommon'
import QualificationProfessional from '../../supplierRegister/components/QualificationProfessional'
import StatusInfor from '../../supplierRegister/components/StatusInfor'
import PurchaseInfor from '../../supplierRegister/components/PurchaseInfor'
import classnames from 'classnames';
import {
  findSupplierconfigureId,
  SupplierconfigureDetail,
  SaveSupplierconfigureService
} from '@/services/supplierRegister';
import styles from '../../supplierRegister/components/index.less';
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
  const [editData, setEditData] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [configure, setConfigure] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const [wholeData, setwholeData] = useState([]);
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  let typeId = query.frameElementId;
  async function initsupplierDetai() {
    triggerLoading(true);
    const { data, success, message: msg } = await SupplierconfigureDetail({ supplierId: query.supplierId });
    if (success) {
      let suppliertype = data.supplierInfoVo.supplierVo.supplierCategory.id
      initConfigurationTable(suppliertype);
      setInitialValue(data.supplierInfoVo)
      setEditData(data.supplierInfoVo)
      setwholeData(data)
      triggerLoading(false);
    } else {
      triggerLoading(false);
      message.error(msg)
    }
  }
  async function initConfigurationTable(typeId) {
    //triggerLoading(true);
    let params = { catgroyid: typeId, property: 1 }
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
    //initsupplierDetai(); // 供应商详情
    // 详情

    // setbaseinfo(handlebase)
    // setaccountinfo(handleaccount)
    // setEditData(detail.supplierInfoVo)
    // setInitialValue(detail.supplierInfoVo)
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

  // 获取配置列表项
  useEffect(() => {
    initsupplierDetai()
  }, []);
  // 返回
  function handleBack() {
    closeCurrent()
  }
  return (
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
                    isView={true}
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
                    isView={true}
                    headerInfo={true}
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
  )
}

export default CreateStrategy;