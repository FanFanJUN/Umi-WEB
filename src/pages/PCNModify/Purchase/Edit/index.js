import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix, Tabs } from 'antd';
import { router } from 'dva';
import Confirmation from '../commons/Confirmation' 
import PCNModify from '../commons/PCNModify'
import classnames from 'classnames';
import {findPCNSupplierId,savePurchaseVo} from '../../../../services/pcnModifyService'
import styles from '../index.less';
import { closeCurrent, isEmpty } from '../../../../utils';
const TabPane = Tabs.TabPane;
function CreateStrategy() {

    const getconfirmFromRef = useRef(null);
    const getpcnModifyRef = useRef(null);
    const [loading, triggerLoading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [editData, setEditData] = useState([]);
    const { query } = router.useLocation();
    useEffect(() => {
        infoPCNdetails()

    }, []);
    // 详情
    async function infoPCNdetails() {
        triggerLoading(true);
        let id = query.id;
        const { data, success, message: msg } = await findPCNSupplierId({pcnTitleId:id});
        if (success) {
            setEditData(data)
            triggerLoading(false);
            return
        }
        triggerLoading(false);
        message.error(msg) 
        
    }

    // 保存
    async function handleSave() {
        const {getBaseInfo} = getconfirmFromRef.current
        let modifydata = getBaseInfo();
        //console.log(JSON.stringify(modifydata))
        //let params = {...editData.smPcnConfirmPlanVo, ...modifydata}
        triggerLoading(true)
        const {success, message: msg } = await savePurchaseVo(modifydata)
        if (success) {
            triggerLoading(false)
            closeCurrent()
        } else {
            triggerLoading(false)
            message.error(msg);
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
                    <span className={styles.title}>PCN变更方案确认</span>
                    <div className={styles.flexCenter}>
                        <Button className={styles.btn} onClick={handleBack}>返回</Button>
                        <Button className={styles.btn} onClick={handleSave}>保存</Button>
                    </div>
                </div>

            </Affix>
            <div className={styles.wrapper}>
                <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)} style={{ background: '#fff' }}>
                    <TabPane forceRender tab="确认方案" key="1">
                        <Confirmation
                            editData={editData}
                            wrappedComponentRef={getconfirmFromRef}
                        />
                    </TabPane>
                    <TabPane forceRender tab="PCN变更信息" key="2">
                        <PCNModify
                            editData={editData} 
                            wrappedComponentRef={getpcnModifyRef}
                        />
                    </TabPane>
                </Tabs>
            </div>
        </Spin>
    )
}

export default CreateStrategy;