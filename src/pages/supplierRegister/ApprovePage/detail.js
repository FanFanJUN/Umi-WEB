import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,ScrollBar } from 'suid';
import { router } from 'dva';
import { message} from 'antd';
import SupplierApproveDetail from './SupplierApproveDetail'
import {
    findApplySupplierInfoVo,
    SaveSupplierconfigureService
  } from '@/services/supplierRegister';
  import { closeCurrent } from '../../../utils/index';
function SupplierApproveInfo() {
    const saveformRef = useRef(null)
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    const [loading, triggerLoading] = useState(false);
    const [wholeData, setwholeData] = useState([]);
    const [configuredata, setconfigurelist] = useState([]);
    useEffect(() => {
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
    return (
        <SupplierApproveDetail
            wholeData={wholeData}
            configuredata={configuredata}
        />
    )
}

export default SupplierApproveInfo
