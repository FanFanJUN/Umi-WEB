import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { router } from 'dva';
import { message, Tabs } from 'antd';
import ModifyHistoryDetail from '../commons/ModifyHistoryDetail'
import ModifyInfo from '../details/ModifyInfo'
import {
    findByRequestIdForModify,
    findSupplierModifyHistroyList,
    TemporarySupplierRegister
} from '@/services/SupplierModifyService'
import {
    SaveSupplierconfigureService
} from '@/services/supplierRegister';
import { closeCurrent } from '../../../utils/index';
import styles from '../index.less';
const TabPane = Tabs.TabPane;
function SupplierApproveInfo() {
    const saveformRef = useRef(null)
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    const [loading, triggerLoading] = useState(false);
    const [wholeData, setwholeData] = useState([]);
    const [configuredata, setconfigurelist] = useState([]);
    const [initialValue, setInitialValue] = useState({});
    const [editData, setEditData] = useState([]);
    const [saveData, setSaveData] = useState([]);
    useEffect(() => {
        initsupplierDetai();
    }, []);
    // 供应商变更详情
    async function initsupplierDetai() {
        triggerLoading(true);
        const { data, success, message: msg } = await findByRequestIdForModify({ id: query.id });
        if (success) {
            let suppliertype = data.supplierApplyVo.supplierInfoVo.supplierVo.supplierCategory.id
            initConfigurationTable(suppliertype)
            setInitialValue(data.supplierApplyVo.supplierInfoVo)
            setEditData(data.supplierApplyVo.supplierInfoVo)
            setwholeData(data.supplierApplyVo)
            setSaveData(data)
            triggerLoading(false);
        } else {
            triggerLoading(false);
            message.error(msg)
        }
    }
    // 类型配置表
    async function initConfigurationTable(typeId) {
        triggerLoading(true);
        let params = { catgroyid: typeId, property: 1 };
        const { data, success, message: msg } = await SaveSupplierconfigureService(params);
        if (success) {
            let datalist = data.configBodyVos;
            triggerLoading(false);
            setconfigurelist(datalist)
        } else {
            triggerLoading(false);
            message.error(msg)
        }
    }
    return (
        <div className={styles.wrapper}>
            <Tabs className={styles.tabcolor}>
                <TabPane forceRender tab="变更列表" key="1">
                    <ModifyHistoryDetail
                        editData={wholeData}
                    //lineDataSource={lineDataSource}
                    />
                </TabPane>
                <TabPane forceRender tab="基本信息" key="2">
                    <ModifyInfo
                        wholeData={wholeData}
                        configuredata={configuredata}
                        wrappedComponentRef={saveformRef}
                    />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default SupplierApproveInfo
