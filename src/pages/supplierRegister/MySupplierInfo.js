import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ComboList,ScrollBar } from 'suid';
import { Input, Button, message, Modal,Form } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import * as queryString from "query-string";
import { getSupplierUserMsg} from "@/services/supplierRegister"
function MySupplierInfo() {
    const [loading, triggerLoading] = useState(false);
    useEffect(() => {
        MySupplier();
    }, []);

    async function MySupplier() {
        let afterUrl = queryString.parse(window.location.search);
        let params = {supplierApplyId: afterUrl.id,supplierType: afterUrl.supplierType};
        if (params.supplierApplyId === undefined) {
            triggerLoading(true)
            const { data, success,message: msg} = await getSupplierUserMsg({params});
            if (success) {
                triggerLoading(false)
                let categoryid = data.supplierCategory.id;
                let id = data.id;
                openNewTab(`supplier/supplierRegister/SupplierDetail/index?id=${id}&frameElementId=${categoryid}`, '我的详细信息', false)
                return;
            }else {
                triggerLoading(false)
                message.error(msg)
            }
        }
    }
    return (
        <>
             
            
        </>
    )
}

export default MySupplierInfo
