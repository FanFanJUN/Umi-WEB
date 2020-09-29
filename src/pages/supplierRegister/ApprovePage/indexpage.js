import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { router } from 'dva';
import { message} from 'antd';
import SupplierApprovePage from './SupplierApprovePage'
import { closeCurrent ,checkToken} from '../../../utils/index';
import {
    findApplySupplierInfoVo,
    SaveSupplierconfigureService,
    saveSupplierRegister
  } from '@/services/supplierRegister';
function SupplierApproveInfo() {
    const saveformRef = useRef(null)
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    const [loading, triggerLoading] = useState(false);
    const [wholeData, setwholeData] = useState([]);
    const [configuredata, setconfigurelist] = useState([]);
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
      async function init() {
        await checkToken(query, setIsReady);
        initsupplierDetai(); 
      }
      init()
      
    }, []);
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
    //initsupplierDetai();
    // 类型配置表
    async function initConfigurationTable(typeId) {
      triggerLoading(true);
      let params = {catgroyid:typeId,property:3};
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
      // let saveData = wholeData
      // console.log(JSON.stringify(saveData))
      triggerLoading(true)
      let saveData = wholeData
      const { success, message: msg } = await saveSupplierRegister(saveData)
      if (success) {
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
              //beforeSubmit={handleSave}
              >
              <SupplierApprovePage
                  wholeData={wholeData}
                  configuredata={configuredata}
                  wrappedComponentRef={saveformRef}
              />
          </WorkFlow.Approve>
        ) : null}
      </>
        
    )
}

export default SupplierApproveInfo
