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
        let ranksort;
        if (item.smMsgTypeCode === '1') {
          ranksort = 1;
        }else if (item.smMsgTypeCode === '2') {
          ranksort = 2;
        }else if (item.smMsgTypeCode === '3') {
          ranksort = 4;
        }else if (item.smMsgTypeCode === '4') {
          ranksort = 5;
        }else if (item.smMsgTypeCode === '5') {
          ranksort = 5;
        }else if (item.smMsgTypeCode === '6') {
          ranksort = 7;
        }else if (item.smMsgTypeCode === '7') {
          ranksort = 6;
        }else if (item.smMsgTypeCode === '8') {
          ranksort = 3;
        }else if (item.smMsgTypeCode === '9') {
          ranksort = 9;
        }else if (item.smMsgTypeCode === '10') {
          ranksort = 10;
        }else if (item.smMsgTypeCode === '11') {
          ranksort = 11;
        }else if (item.smMsgTypeCode === '12') {
          ranksort = 12;
        }else if (item.smMsgTypeCode === '13') {
          ranksort = 8;
        }
        return {
          fieldCode: item.fieldCode,
          fieldName:item.fieldName,
          operationCode:item.operationCode,
          operationName:item.operationName,
          smMsgTypeCode:Number(ranksort),
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