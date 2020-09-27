import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { message} from 'antd';
import { router } from 'dva';
import SupplierApproveAgentEdit from './SupplierApproveAgentEdit'
import { closeCurrent,checkToken } from '../../../utils/index';
import {
    findApplySupplierInfoVo,
    SaveSupplierconfigureService,
    saveLietInFlow
  } from '@/services/supplierRegister';
function SupplierApproveInfo() {
    const AgentformRef = useRef(null)
    const { query } = router.useLocation();
    const [loading, triggerLoading] = useState(false);
    const [wholeData, setwholeData] = useState([]);
    const [configuredata, setconfigurelist] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { id, taskId, instanceId } = query;
    
    useEffect(() => {
        // 供应商详情
        async function initsupplierDetai() {
            triggerLoading(true);
            let id = query.id;
            const { data, success, message: msg } = await findApplySupplierInfoVo({supplierApplyId:id});
            if (success) {
                let suppliertype = data.supplierInfoVo.supplierVo.supplierCategory.id
                initConfigurationTable(suppliertype)
                setwholeData(data)
                triggerLoading(false);
            }else {
              triggerLoading(false);
              message.error(msg)
            }
          }
          initsupplierDetai(); 
          checkToken(query, setIsReady);
    }, []);
    // 类型配置表
    async function initConfigurationTable(typeId) {
        triggerLoading(true);
        let params = {catgroyid:typeId,property:1};
        const { data, success, message: msg } = await SaveSupplierconfigureService(params);
          if (success) {
            let datalist  = data.configBodyVos;
            triggerLoading(false);
            setconfigurelist(datalist)
          }else {
            triggerLoading(false);
            message.error(msg)
          }
        
      }
    const handleSave = async (approved) => {
      triggerLoading(true)
      configuredata.map((item, index) => {
        if (item.operationCode !== '3' && item.fieldCode === 'supplierAgents') {
          const { saveAgent } = AgentformRef.current;
          let agentVal = saveAgent()
          if (wholeData) {
              wholeData.supplierInfoVo.supplierAgents = agentVal;
          }
        }
      })
      
      let saveData = wholeData;
      const { success, message: msg } = await saveLietInFlow({supplierApplyJson: JSON.stringify(saveData)})
      triggerLoading(false)
      return new Promise((resolve, reject) => {
          if (success) {
              resolve({
              success,
              message: msg
              })
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
                <SupplierApproveAgentEdit
                    wrappedComponentRef={AgentformRef}
                    wholeData={wholeData}
                    configuredata={configuredata}
                    //ref={tableRef}
                />
            </WorkFlow.Approve>
          ) : null}
        </>
        
    )
}

export default SupplierApproveInfo
