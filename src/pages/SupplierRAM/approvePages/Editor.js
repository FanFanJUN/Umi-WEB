import {
  useEffect,
  useRef,
  useState
} from 'react';
import { message, Spin } from 'antd';
import CommonForm from '../CommonForm';
import { useLocation } from 'dva/router';
import {
  saveRecommendAccess,
  queryRecommendAccess
} from '../../../services/ram';
import { WorkFlow } from 'suid';
import { closeCurrent, checkToken } from '../../../utils';
const { Approve } = WorkFlow;
function Editor() {
  const [loading, toggleLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const commonFormRef = useRef(null);
  const { query } = useLocation();
  const { id = null, taskId = null, instanceId = null } = query;
  function handleComplete(info) {
    const { success, message: msg } = info;
    if (success) {
      closeCurrent()
      message.success(msg);
      return;
    }
    message.error(msg);
  }
  async function beforeSubmit() {
    const value = await commonFormRef.current.getFormValue();
    const { success, message: msg } = await saveRecommendAccess({
      ...value,
      id
    });
    return new Promise((resolve) => {
      resolve({
        success,
        message: msg,
        data: {
          businessKey: id,
        },
      });
    });
  }
  useEffect(() => {
    checkToken(query, setIsReady)
  }, [])
  useEffect(() => {
    async function initialCreateRAMData() {
      toggleLoading(true)
      const { success, data, message: msg } = await queryRecommendAccess({ recommendAccessId: id })
      toggleLoading(false)
      if (success) {
        commonFormRef.current.setFormValue(data)
        return
      }
      message.error(msg)
    }
    if (isReady) {
      initialCreateRAMData()
    }
  }, [isReady])
  return (
    <Approve
      flowMapUrl="flow-web/design/showLook"
      businessId={id}
      instanceId={instanceId}
      taskId={taskId}
      beforeSubmit={beforeSubmit}
      submitComplete={handleComplete}
    >
      <Spin spinning={loading}>
        <CommonForm
          wrappedComponentRef={commonFormRef}
          type='editor'
        />
      </Spin>
    </Approve>
  )
}

export default Editor;