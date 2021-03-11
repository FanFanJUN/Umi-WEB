import {
  useEffect,
  useRef,
  useState
} from 'react';
import { message, Form, Radio, Spin } from 'antd';
import CommonForm from '../CommonForm';
import styles from '../index.less';
import { useLocation } from 'dva/router';
import {
  updateNeedExamine,
  queryRecommendAccess
} from '../../../services/ram';
import { WorkFlow } from 'suid';
import { closeCurrent, checkToken } from '../../../utils';
const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 12
  }
};
const { Approve } = WorkFlow;
const { Item: FormItem, create } = Form;
function WhetherCheck({
  form
}) {
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [loading, toggleLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const commonFormRef = useRef(null);
  const { query } = useLocation();
  const { id = null, taskId = null, instanceId = null } = query;
  async function beforeSubmit() {
    const v = await validateFieldsAndScroll()
    const { success, message: msg } = await updateNeedExamine({
      ...v,
      recommendAccessId: id
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
  function handleComplete(info) {
    const { success, message: msg } = info;
    if (success) {
      closeCurrent()
      message.success(msg);
      return;
    }
    message.error(msg);
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
          type='detail'
          hasNeedExamine={false}
        />
        <div
          className={styles.commonTitle}
        >供应商审核确认</div>
        <Form>
          <FormItem label='是否需要供应商审核' {...formLayout}>
            {
              getFieldDecorator('needExamine', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否需要供应商审核'
                  }
                ]
              })(
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              )
            }
          </FormItem>
        </Form>
      </Spin>
    </Approve>
  )
}

export default create()(WhetherCheck);