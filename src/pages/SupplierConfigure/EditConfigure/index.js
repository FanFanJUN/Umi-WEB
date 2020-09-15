import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import ConfigureForm from '../ConfigureForm'
import ConfigureTable from '../ConfigureTable'
import classnames from 'classnames';
import styles from './index.less';
import { findSupplierconfigureId,SaveSupplierconfigureService } from '../../../services/supplierConfig';
import { closeCurrent} from '../../../utils';
function CreateStrategy() {
  const HeadFormRef = useRef()
  const tabformRef = createRef();
  const sortRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [radioSelect, setradioSelect] = useState([]);
  const [findData, setfindData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();
  const { frameElementId = "", frameElementSrc = "", Opertype = "" } = query;
  // 获取详情数据
  async function initConfigurationTable() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await findSupplierconfigureId(id);
    if (success) {
      const {
        configBodyVos,
        ...initialValues
      } = data;
      const { setFieldsValue } = HeadFormRef.current.form;
      const mixinValues = {
        ...initialValues
      }
      setFieldsValue(mixinValues);
      setDataSource(configBodyVos);
      setradioSelect(configBodyVos);
      setfindData(data);
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
  // 编辑配置项
  async function handleEditorLine(val) {
    console.log(val)
    setDataSource(val);
    const params = val;
    setradioSelect(params)
  }
   // 排序码
   async function handblurcode(val) {
    const params = val;
    setDataSource([]);
    triggerLoading(true);
    setTimeout(function() {
      setDataSource(params);
      setradioSelect(params)
      triggerLoading(false);
    },100)
  }
  function getFormValueWithoutChecked() {
    const { validateFieldsAndScroll } = tabformRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      console.log(val)
      //setheadfrom(val)
      //findData(...val)
    })
  }
  function isEmpty(val) {
    return val === undefined || val === null || val === '' || val === "" || (typeof val === 'string' && val.trim() === '' || val.length === 0)
  }
  // 保存
  async function handleSave() {
    const { validateFieldsAndScroll } = HeadFormRef.current.form;
    //let configBodyVos;
    //const {sortTable} = 
    let configBodyVos = tabformRef.current.sortTable();
    // if (isEmpty(radioSelect)) {
    //   configBodyVos = dataSource
    // }else {
    //   configBodyVos = radioSelect
    // }
    console.log(configBodyVos)
    validateFieldsAndScroll(async (err, val) => {
      // findData.configBodyVos = configBodyVos;
      // if (!err) {
      //   triggerLoading(true)
      //   const { success, message: msg } = await SaveSupplierconfigureService(findData)
      //   triggerLoading(false)
      //   if (success) {
      //     closeCurrent()
      //     return
      //   }
      //   message.error(msg)
      // }
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
        wrappedComponentRef={HeadFormRef}
      />
      <ConfigureTable
        onEditor={handleEditorLine}
        onBlured={handblurcode}
        dataSource={dataSource}
        ref={sortRef}
        type="editor"
        loading={loading}
        wrappedComponentRef={tabformRef}
      />
    </Spin>
  )
}

export default CreateStrategy;