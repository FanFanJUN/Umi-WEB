import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { router } from 'dva';
import { message,Tabs} from 'antd';
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
  import { closeCurrent,checkToken} from '../../../utils/index';
  import styles from '../index.less';
  const TabPane = Tabs.TabPane;
  let senddata;
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
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        async function init() {
            await checkToken(query, setIsReady);
            initsupplierDetai(); 
        }
        init();
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
            senddata = JSON.stringify(data.supplierApplyVo)
            console.log(senddata)
        } else {
            triggerLoading(false);
            message.error(msg)
        }
    }
    // 类型配置表
    async function initConfigurationTable(typeId) {
        triggerLoading(true);
        let params = { catgroyid: typeId, property: 3 };
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
    const handleSave = async (approved) => {
        triggerLoading(true)
        let params = JSON.parse(senddata)
        console.log(params)
        const { success, message: msg } = await TemporarySupplierRegister(params)
        triggerLoading(false)
        return new Promise((resolve, reject) => {
            if (success) {
                resolve({success, message: msg})
                message.success(msg)
                return;
            }
            reject(false)
            message.error(msg)
        })
    }
    function handleSubmitComplete(res) {
        const { success } = res;
        if (success) {
          closeCurrent();
        }
      }
    return (
        <>
            {isReady ? (
                <WorkFlow.Approve
                    businessId={id}
                    taskId={taskId}
                    instanceId={instanceId}
                    flowMapUrl="flow-web/design/showLook"
                    submitComplete={handleSubmitComplete}
                    beforeSubmit={handleSave}
                    >
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
                </WorkFlow.Approve>
            ): null}
        </>
    )
}

export default SupplierApproveInfo
