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
  saveRecommendAccess,
  queryRecommendAccess
} from '../../../services/ram';
import { WorkFlow } from 'suid';
import { closeCurrent } from '../../../utils';
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
  const recommendColumns = [
    {
      title: '公司代码',
      dataIndex: 'corporationCode'
    },
    {
      title: '公司名称',
      dataIndex: 'corporationName',
      width: 200
    },
    {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode'
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      width: 200
    },
    {
      title: '认定类型',
      dataIndex: 'identifyTypeName',
      width: 200
    },
    {
      title: '是否准入',
      dataIndex: 'access',
      render(text, record, index) {
        return getFieldDecorator(`access_${index}`)(
          <Radio.Group>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        )
      }
    },
    {
      title: '是否实物认定',
      dataIndex: 'objectRecognition',
      render(text) {
        const isBoolean = typeof text === 'boolean';
        if (isBoolean) {
          return !!text ? '是' : '否'
        }
        return '未选择'
      }
    },
    {
      title: '是否信任',
      dataIndex: 'trust',
      render(text = null) {
        const isBoolean = typeof text === 'boolean';
        if (isBoolean) {
          return !!text ? '是' : '否'
        }
        return '未选择'
      }
    }
  ];
  const { getFieldDecorator, validateFieldsAndScroll } = form;
  const [loading, toggleLoading] = useState(false);
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
    initialCreateRAMData()
  }, [])
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
          type='create'
          columns={recommendColumns}
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