import React, { createRef, useState,useRef,useEffect } from 'react';
import { Button, Modal, message, Spin, Affix } from 'antd';
import { router } from 'dva';
import ConfigureForm from '../ConfigureForm'
import ConfigureTable from '../ConfigureTable'
import classnames from 'classnames';
import styles from './index.less';
import { findSupplierconfigureId } from '../../../services/supplierConfig';
function CreateStrategy() {
  const HeadFormRef = useRef()
  const tabformRef = createRef();
  const [dataSource, setDataSource] = useState([]);
  const [loading, triggerLoading] = useState(false);
  const { query } = router.useLocation();
  const { frameElementId = "", frameElementSrc = "" ,Opertype = ""} = query;
  // 详情
  async function initConfigurationTable() {
    triggerLoading(true);
    let id = query.id;
    const { data, success, message: msg } = await findSupplierconfigureId(id);
    if (success) {
      let sortdata = data.configBodyVos.map(item => {
        return {
          fieldCode: item.fieldCode,
          fieldName:item.fieldName,
          operationCode:item.operationCode,
          operationName:item.operationName,
          smMsgTypeCode:Number(item.smMsgTypeCode),
          smMsgTypeName:item.smMsgTypeName,
          regConfigId:item.regConfigId,
          id:item.id,
          smSort: Number(item.smSort)
        }
      })
      data.configBodyVos = sortdata;
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
        triggerLoading(false);
        return
      }
      triggerLoading(false);
      message.error(msg)
  }

  useEffect(() => {
    initConfigurationTable() 
  }, []);
  return (
    <Spin spinning={loading} tip='处理中...'>
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            供应商注册信息配置明细
            </span>
          {/* <div className={styles.flexCenter}>
            <Button className={styles.btn} >返回</Button>
            <Button className={styles.btn} onClick={handleSave}>保存</Button>
          </div> */}
        </div>
      </Affix>
      <ConfigureForm
        Opertype={Opertype}
        wrappedComponentRef={HeadFormRef}
        type="detail"
      />
      <ConfigureTable
        dataSource={dataSource}
        type="detail"
        loading={loading}
        wrappedComponentRef={tabformRef}
      /> 
    </Spin>
  )
}

export default CreateStrategy;