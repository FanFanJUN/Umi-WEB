import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix, Tabs } from 'antd';
import { WorkFlow} from 'suid';
import { router } from 'dva';
import PCNModifyDetail from '../Purchase/commons/PCNModifyDetail' 
import Confirmation from '../Purchase/commons/Confirmation' 
import Executioninfor from '../Purchase/commons/Executioninfor'
import { closeCurrent, isEmpty ,checkToken} from '../../../utils';
import styles from '../Purchase/index.less';
import {findPCNSupplierId,saveApproveExecutorVo} from '../../../services/pcnModifyService'
const TabPane = Tabs.TabPane;
function CreateStrategy() {
    const getpcnModifyRef = useRef(null);
    const getconfirmFromRef = useRef(null);
    const getExecutioninfor = useRef(null);
    const [loading, triggerLoading] = useState(false);
    const [visible, setvisible] = useState(false);
    const [editData, setEditData] = useState([]);
    const [materielid, setMaterielID] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const { query } = router.useLocation();
    const { id, taskId, instanceId } = query;
    // 获取配置列表项
    useEffect(() => {
        async function init() {
            await checkToken(query, setIsReady);
                initsupplierDetai(); 
            }
        init()
    }, []);
    // 变更详情
    async function initsupplierDetai() {
        triggerLoading(true);
        let id = query.id;
        const { data, success, message: msg } = await findPCNSupplierId({pcnTitleId:id});
        if (success) {
            setEditData(data)
            let id = data.smPcnAnalysisVos[0].materielCategoryCode
            setMaterielID(id)
            triggerLoading(false);
        } else {
            triggerLoading(false);
            message.error(msg)
        }
    }
    const handleSave = async (approved) => {
        const {getImplementInfo} = getExecutioninfor.current;
        let implementdata = getImplementInfo()
        console.log(implementdata)
        if (!implementdata) {
          return false
        }else {
          triggerLoading(true)
          const { success, message: msg } = await saveApproveExecutorVo(implementdata)
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
    function tabClickHandler(params) {
        //setdefaultActiveKey(params)
    }
    return (
        <>
            {isReady ? (<WorkFlow.Approve
                businessId={id}
                taskId={taskId}
                instanceId={instanceId}
                flowMapUrl="flow-web/design/showLook"
                submitComplete={handleSubmitComplete}
                beforeSubmit={handleSave}
                >
                    <Spin spinning={loading} tip='处理中...'>
                        <div className={styles.wrapper}>
                            <Tabs className="tabstext" onTabClick={(params)=>tabClickHandler(params)} style={{ background: '#fff' }}>
                                <TabPane forceRender tab="PCN变更单" key="1">
                                    <PCNModifyDetail
                                        editData={editData}
                                        wrappedComponentRef={getpcnModifyRef}
                                        result={true}
                                        isView={true}
                                    />
                                </TabPane>
                                <TabPane forceRender tab="执行信息" key="5">
                                    <Executioninfor
                                        editData={editData}
                                        wrappedComponentRef={getExecutioninfor}
                                        headerInfo={false}
                                        isView={false}
                                        materielid={materielid}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Spin>
                </WorkFlow.Approve>
            ) : null
            
            }
        </>
    )
}

export default CreateStrategy;