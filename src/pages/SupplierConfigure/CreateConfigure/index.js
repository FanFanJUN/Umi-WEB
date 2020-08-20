import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import ConfigureForm from '../ConfigureForm'
import ConfigureTable from '../ConfigureTable'
import classnames from 'classnames';
import { findStrategyDetailById } from '@/services/supplierConfig';
import styles from './index.less';
function CreateStrategy() {
  const formRef = createRef()
  const tableRef = useRef(null);
  const [dataSource, setDataSource] = useState([]);
  const [radioSelect, setradioSelect] = useState([]);
  const [loading, triggerLoading] = useState(true);
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  async function initConfigurationTable() {
    triggerLoading(true);
    let params = {
      frameElementId: "",
      frameElementSrc: "/",
      id: "d81194cc-c2cd-4f63-8ba3-667b23e503c8"
    }
    const { data, success, message: msg } = await findStrategyDetailById(params);
    if (success) {
      const {
        detailList,
        ...initialValues
      } = data;
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
    setradioSelect(params)
  }

  // 保存
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      let params = {
        sendList: val,
        sendList2: radioSelect
      }
      //setDataSource(params)
      console.log(err)
      console.log(params)
      // if (!err) {
      //   triggerLoading(true)
      //   const params = await formatSaveParams(val, dataSource);
      //   console.log(params)
      //   // const { success, message: msg } = await savePurcahseAndApprove(params)
      //   // triggerLoading(false)
      //   // if (success) {
      //   //   closeCurrent()
      //   //   return
      //   // }
      //   // message.error(msg)
      // }
    })
  }
  // 获取配置列表项
  useEffect(() => {
    initConfigurationTable()
  }, []);
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            新增供应商注册信息配置
            </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} >返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div>
        </div>
      </Affix>
      <ConfigureForm
        Opertype={Opertype}
        wrappedComponentRef={formRef}
        type="add"
      />
      <ConfigureTable
        onEditor={handleEditorLine}
        dataSource={dataSource}
        ref={formRef}
        loading={loading}
      />
    </Spin>
  )
}

export default CreateStrategy;