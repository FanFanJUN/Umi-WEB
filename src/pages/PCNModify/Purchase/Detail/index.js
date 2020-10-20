import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix, Tabs } from 'antd';
import { router } from 'dva';
import PCNModifyDetail from '../commons/PCNModifyDetail' 
import Confirmation from '../commons/Confirmation' 
import ResultsIdenDetail from '../commons/ResultsIdenDetail'
import CustomerOpinionDetail from '../commons/CustomerOpinionDetail'
import ToexamineDetail from '../commons/ToexamineDetail'
import Executioninfor from '../commons/Executioninfor'
import classnames from 'classnames';
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
import styles from '../index.less';
import { closeCurrent, isEmpty } from '../../../../utils';
const TabPane = Tabs.TabPane;
function CreateStrategy() {
    const getpcnModifyRef = useRef(null);
    const getconfirmFromRef = useRef(null);
    const getResultsIden = useRef(null);
    const getCustomerOpin = useRef(null);
    const getToexamine = useRef(null);
    const getExecutioninfor = useRef(null)
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
        //initsupplierDetai(); // 获取详情

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
                    <span className={styles.title}>PCN变更单明细</span>
                    <div className={styles.flexCenter}>
                        <Button className={styles.btn} onClick={handleBack}>返回</Button>
                    </div>
                </div>

            </Affix>
            <div className={styles.wrapper}>
                <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)} style={{ background: '#fff' }}>
                    <TabPane forceRender tab="PCN变更单" key="1">
                        <PCNModifyDetail
                            wrappedComponentRef={getpcnModifyRef}
                        />
                    </TabPane>
                    <TabPane forceRender tab="确认方案" key="2">
                        <Confirmation
                            wrappedComponentRef={getconfirmFromRef}
                            isView={true}
                            headerInfo={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="验证结果" key="3">
                        <ResultsIdenDetail
                            wrappedComponentRef={getResultsIden}
                        />
                    </TabPane>
                    <TabPane forceRender tab="客户意见" key="4">
                        <CustomerOpinionDetail
                            wrappedComponentRef={getCustomerOpin}
                        />
                    </TabPane>
                    <TabPane forceRender tab="审核结果" key="5">
                        <ToexamineDetail
                            wrappedComponentRef={getToexamine}
                        />
                    </TabPane>
                    <TabPane forceRender tab="执行信息" key="6">
                        <Executioninfor
                            wrappedComponentRef={getExecutioninfor}
                            headerInfo={true}
                            isView={true}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
    )
}

export default CreateStrategy;