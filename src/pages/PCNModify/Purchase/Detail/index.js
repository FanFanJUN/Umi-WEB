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
import { findPCNSupplierId } from '../../../../services/pcnModifyService'
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
    const [loading, triggerLoading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [editData, setEditData] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    // 
    useEffect(() => {
        initsupplierDetai();
    }, []);
    // 变更详情
    async function initsupplierDetai() {
        triggerLoading(true);
        let id = query.id;
        const { data, success, message: msg } = await findPCNSupplierId({ pcnTitleId: id });
        if (success) {
            setEditData(data)
            triggerLoading(false);
        } else {
            triggerLoading(false);
            message.error(msg)
        }

    }

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
                <Tabs className="tabstext" onTabClick={(params) => tabClickHandler(params)} style={{ background: '#fff' }}>
                    <TabPane forceRender tab="PCN变更单" key="1">
                        <PCNModifyDetail
                            editData={editData}
                            wrappedComponentRef={getpcnModifyRef}
                            isView={true}
                            result={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="确认方案" key="2">
                        <Confirmation
                            editData={editData}
                            wrappedComponentRef={getconfirmFromRef}
                            isView={true}
                            headerInfo={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="实物认定结果" key="3">
                        <ResultsIdenDetail
                            editData={editData}
                            wrappedComponentRef={getResultsIden}
                            isView={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="客户意见" key="4">
                        <CustomerOpinionDetail
                            editData={editData}
                            wrappedComponentRef={getCustomerOpin}
                            isView={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="审核结果" key="5">
                        <ToexamineDetail
                            editData={editData}
                            wrappedComponentRef={getToexamine}
                            isView={true}
                        />
                    </TabPane>
                    <TabPane forceRender tab="执行信息" key="6">
                        <Executioninfor
                            editData={editData}
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