import React, { createRef, useState, useRef, useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import ConfigureForm from '../ConfigureForm'
import ConfigureTable from '../ConfigureTable'
// import CopyTable from '../OtherTable'
import classnames from 'classnames';
import { 
  findSupplierconfigureService ,
  SaveSupplierconfigureService,
  findSupplierconfigureId
} from '@/services/supplierConfig';
import styles from './index.less';
import { closeCurrent } from '../../../utils';
function CreateStrategy() {
  const HeadFormRef = useRef();
  const tabformRef = createRef();
  const [dataSource, setDataSource] = useState([]);
  const [radioSelect, setradioSelect] = useState([]);
  const [fromConfig, setfromConfig] = useState([]);
  const [findData, setfindData] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();
  const { frameElementId, frameElementSrc = "", Opertype = "" } = query;
  async function initConfigurationTable() {
    triggerLoading(true);
    let params = {
      frameElementId: "",
      frameElementSrc: "/",
    }
    const { data, success, message: msg } = await findSupplierconfigureService(params);
    if (success) {
      const {
        rows,
        ...initialValues
      } = data;
      let newsort = [];
      rows.map((item,index) => {
        newsort.push({
          id: item.id,
          creatorName: item.creatorName,
          createdDate: item.createdDate,
          smMsgTypeCode: item.smMsgTypeCode,
          smMsgTypeName:  item.smMsgTypeName,
          fieldCode: item.smFieldCode,
          fieldName: item.smFieldName,
          operationCode: '0',
          operationName: '必输',
          smTableName: item.smTableName,
          smSort: index
        })
      });
      setDataSource([]);
      setDataSource(newsort);
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
  }
  // 编辑配置项
  async function handleEditorLine(val) {
    setDataSource(val);
    const params = val;
    setradioSelect(params)
  }
  // 排序码
  async function handblurcode(val) {
    const params = val;
    setDataSource(params);
    setradioSelect(params)
  }
  // 表头表格舒颜验证并获取值
  async function getFormValueWithoutChecked() {
    const { validateFieldsAndScroll } = tabformRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      const params = val;
      setfromConfig(params)
    })
  }
  // 复制从根据选中的ID查询数据详情
  async function copyEdit(val) {
    let id = val;
    triggerLoading(true);
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
      againimplement(configBodyVos)
      setradioSelect(configBodyVos)
      setFieldsValue(mixinValues);
      setfindData(data);
      triggerLoading(false);
      return
    }
    
    triggerLoading(false);
    message.error(msg)
  }
  // 复制从处理表格数据
  function againimplement(val) {
    setDataSource(val);
  }
  
  // 保存
  async function handleSave() {
    getFormValueWithoutChecked();
    const { validateFieldsAndScroll } = HeadFormRef.current.form;
    let configBodyVos = radioSelect;
    validateFieldsAndScroll(async (err, val) => {
      configBodyVos.map(item=>{
        delete item.id
      })
      let params = {
        ...val,
        configBodyVos
      }
      console.log(params)
      if (!err) {
        triggerLoading(true)
        const { success, message: msg } = await SaveSupplierconfigureService(params)
        triggerLoading(false)
        if (success) {
          closeCurrent()
          return
        }else {
          message.error(msg)
        }
        
      }
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
        wrappedComponentRef={HeadFormRef}
        handcopy={copyEdit}
        type='add'
      />
      <ConfigureTable
        onEditor={handleEditorLine}
        onBlured={handblurcode}
        //oncopy={handcopyRefresh}
        dataSource={dataSource}
        //ref={formRef}
        type="add"
        loading={loading}
        wrappedComponentRef={tabformRef}
      />
    </Spin>
  )
}

export default CreateStrategy;