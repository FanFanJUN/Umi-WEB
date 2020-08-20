import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import ConfigureForm from '../ConfigureForm'
import ConfigureTable from '../ConfigureTable'
import classnames from 'classnames';
import styles from './index.less';
import { findStrategyDetailById } from '@/services/supplierConfig';
import { closeCurrent} from '../../../utils';
function CreateStrategy() {
  const formRef = createRef()
  const tableRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [loading, triggerLoading] = useState(true);
  const { query } = router.useLocation();
  const { frameElementId = "", frameElementSrc = "", Opertype = "" } = query;
  // 获取详情数据
  async function initConfigurationTable() {
    const { data, success, message: msg } = await findStrategyDetailById(query);
    if (success) {
      const {
        detailList,
        ...initialValues
      } = data;
      const { setFieldsValue } = formRef.current.form;
      const mixinValues = {
        ...initialValues
      }
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
  }
  // 编辑配置项
  async function handleEditorLine(val) {
    const params = {
      sendList2: val,
    }
    setDataSource(params)
  }
  // 返回
  function handleBack() {
    closeCurrent()
  }
  // 保存
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      let params = {
        sendList: val,
        sendList2: dataSource
      }
      //setDataSource(params)
      console.log(err)
      console.log(val)
      if (!err) {
        alert(444)
        triggerLoading(true)
      //   const params = await formatSaveParams(val, dataSource);
      //   console.log(params)
      //   // const { success, message: msg } = await savePurcahseAndApprove(params)
      //   // triggerLoading(false)
      //   // if (success) {
      //   //   closeCurrent()
      //   //   return
      //   // }
      //   // message.error(msg)
      }
    })
  }
  useEffect(() => {
    initConfigurationTable()
  }, []);
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            编辑供应商注册信息配置
            </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>
      </Affix>
      <ConfigureForm
        Opertype={Opertype}
        type="editor"
        wrappedComponentRef={formRef}
      />
      <ConfigureTable
        onEditor={handleEditorLine}
        dataSource={dataSource}
        type="editor"
        loading={loading}
        headerForm={formRef}
      />
    </Spin>
  )
}

export default CreateStrategy;