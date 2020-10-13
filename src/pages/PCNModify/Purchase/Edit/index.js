import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix, Tabs } from 'antd';
import { router } from 'dva';
import BaseInfo from '../../supplierRegister/components/BaseInfo'

import ReasonAndStartFlowModal from '../commons/ReasonAndStartFlowModal'
import classnames from 'classnames';
import myContext from '../../supplierRegister/components/ContextName'
import {
    SupplierconfigureDetail,
    SaveSupplierconfigureService
} from '@/services/supplierRegister';
import {
    findByRequestIdForModify,
    TemporarySupplierRegister,
    saveSupplierRegister,
    ValiditySupplierRegister
} from '@/services/SupplierModifyService'
import styles from '../../supplierRegister/components/index.less';
import { closeCurrent, isEmpty } from '../../../utils';
const TabPane = Tabs.TabPane;
function CreateStrategy() {

    const BaseinfoRef = useRef(null);
    const AccountRef = useRef(null);

    const [baseinfo, setbaseinfo] = useState([]);
    const [accountinfo, setaccountinfo] = useState([]);
    const [businesshide, setbusinesshide] = useState([]);
    const [initialValue, setInitialValue] = useState({});
    const [wholeData, setwholeData] = useState([]);
    const [editData, setEditData] = useState([]);
    const [Reasonchange, setReasonchange] = useState(false);
    const [loading, triggerLoading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [configure, setConfigure] = useState([]);
    const [supplierName, setsupplierName] = useState();
    const { query } = router.useLocation();
    // 变更详情
    async function initsupplierDetai() {
        triggerLoading(true);
        let id = query.id;
        const { data, success, message: msg } = await findByRequestIdForModify({ id: id });
        if (success) {
            let suppliertype = data.supplierApplyVo.supplierInfoVo.supplierVo.supplierCategory.id
            setsupplierName(data.supplierApplyVo.supplierInfoVo.supplierVo.name)
            initConfigurationTable(suppliertype)
            setTimeout(() => {
                setInitialValue(data.supplierApplyVo.supplierInfoVo)
                setEditData(data.supplierApplyVo.supplierInfoVo)
                setReasonchange(data.supplierApplyVo)
                setwholeData(data.supplierApplyVo)
                triggerLoading(false);
                if (data.supplierApplyVo.supplierInfoVo.supplierVo.supplierCategoryName === '个人供应商') {
                    if (data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo) {
                        let mobile = data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo.mobile;
                        if (isEmpty(mobile)) {
                            setvisible(true)
                        }
                    }
                    if (data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo === undefined) {
                        setvisible(true)
                    }
                } else {
                    if (data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo) {
                        let mobile = data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo.mobile;
                        let email = data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo.email;
                        if (isEmpty(mobile) || isEmpty(email)) {
                            setvisible(true)
                        }
                    }
                    if (data.supplierApplyVo.supplierInfoVo.supplierVo.accountVo === undefined) {
                        setvisible(true)
                    }
                }
            }, 200);
        } else {
            triggerLoading(false);
            message.error(msg)
        }

    }
    async function initConfigurationTable(typeId) {
        triggerLoading(true);
        let params = { catgroyid: typeId, property: 2 };
        const { data, success, message: msg } = await SaveSupplierconfigureService(params);
        if (success) {
            let datalist = data.configBodyVos;
            setConfigure(datalist)
            triggerLoading(false);
        } else {
            triggerLoading(false);
            message.error(msg)
        }
    }


    // 保存
    async function handleSave() {



    }
    async function createSave(val) {
        let params = { ...wholeData, ...val };
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
    // 获取配置列表项
    useEffect(() => {
        initsupplierDetai(); // 获取详情

    }, []);
    // 返回
    function handleBack() {
        closeCurrent()
    }
    function tabClickHandler(params) {
        //setdefaultActiveKey(params)
    }
    return (
        <Spin spinning={loading} tip='处理中...'>
            <Affix offsetTop={0}>
                <div className={classnames([styles.header, styles.flexBetweenStart])}>
                    <span className={styles.title}>
                        PCN变更方案确认
            </span>
                    <div className={styles.flexCenter}>
                        <Button className={styles.btn} onClick={handleBack}>返回</Button>
                        <Button className={styles.btn} onClick={handleSave}>保存</Button>
                    </div>
                </div>

            </Affix>
            <div>
                {/* <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)}>
                    <TabPane forceRender tab="确认方案" key="1">
                    <OrganizationPage
                        accounts={accounts}
                        wrappedComponentRef={OrganRef}
                    />
                    </TabPane>
                    <TabPane forceRender tab="PCN变更信息" key="2">
                    <PersonalPage 
                        accounts={accounts}
                        wrappedComponentRef={PersonRef}
                    />
                    </TabPane>
                </Tabs> */}
            </div>
            <div className={styles.wrapper}>
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
            </div>
        </Spin>
    )
}

export default CreateStrategy;