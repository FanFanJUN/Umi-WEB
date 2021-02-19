import {
  useEffect,
  useRef,
  useState
} from 'react';
import { message, Affix, Button, Spin } from 'antd';
import CommonForm from './CommonForm';
import styles from './index.less';
import { useLocation } from 'dva/router';
import {
  queryRecommendAccessFromRecommendDemand,
  saveRecommendAccess
} from '../../services/ram';
import { closeCurrent } from '../../utils';
function Create() {
  const columns = [
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
  ]
  const [loading, toggleLoading] = useState(false);
  const commonFormRef = useRef(null);
  const { query } = useLocation();
  const { recommendDemandIds = '' } = query;
  async function handleSave() {
    const value = await commonFormRef.current.getFormValue();
    toggleLoading(true)
    const { success, message: msg } = await saveRecommendAccess(value);
    toggleLoading(false)
    if (success) {
      message.success(msg)
      closeCurrent()
      return
    }
    message.error(msg)
  }
  useEffect(() => {
    async function initialCreateRAMData() {
      console.log(recommendDemandIds)
      const formatIds = recommendDemandIds.split(',');
      const { success, data, message: msg } = await queryRecommendAccessFromRecommendDemand(formatIds)
      if (success) {
        commonFormRef.current.setFormValue(data)
        return
      }
      message.error(msg)
    }
    initialCreateRAMData()
  }, [])
  return (
    <Spin spinning={loading}>
      <Affix>
        <div className={styles.affixHeader}>
          <div className={styles.fbc}>
            <span className={styles.title}>新增推荐准入</span>
            <div className={styles.fec}>
              <Button className={styles.btn} onClick={closeCurrent}>返回</Button>
              <Button
                className={styles.btn}
                type='primary'
                onClick={handleSave}
                disabled={loading}
              >保存</Button>
            </div>
          </div>
        </div>
      </Affix>
      <CommonForm
        wrappedComponentRef={commonFormRef}
        type='create'
        columns = {columns}
      />
    </Spin>
  )
}

export default Create;