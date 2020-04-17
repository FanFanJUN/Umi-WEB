import React, { createRef, useState, useEffect } from 'react';
import { connect, router } from 'dva';
import { utils } from 'suid';
import { Button, Modal, message, Spin } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  savePurchaseStrategy,
  findStrategyDetailById,
  strategyTableCreateLine,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import moment from 'moment';
import styles from './index.less';
function StrategyDetail() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [ currentId, setCurrentId ] = useState("")
  async function initFommFieldsValuesAndTableDataSource() {
    const { data, success, message: msg } = await findStrategyDetailById(query);
    if (success) {
      const {
        id,
        code,
        send,
        state,
        header,
        submit,
        invalid,
        sendList,
        changeVo,
        creatorId,
        detailList,
        submitList,
        attachment,
        changeable,
        tenantCode,
        createdDate,
        lastEditorId,
        approvalState,
        lastEditorName,
        lastEditedDate,
        creatorAccount,
        lastEditorAccount,
        purchaseStrategyEnd,
        purchaseStrategyBegin,
        ...initialValues
      } = data;
      const { form } = formRef.current
      const { setFieldsValue } = form
      const mixinValues = {
        ...initialValues,
        submitName: submitList.map(item => item.userName),
        submitList: submitList.map(item => item.userAccount),
        sendName: sendList.map(item => item.userName),
        sendList: sendList.map(item => item.userAccount),
        purchaseStrategyDate: [moment(purchaseStrategyBegin), moment(purchaseStrategyEnd)]
      }
      setInitValues({
        attachment
      });
      const addIdList = detailList.map(item => ({
        ...item,
        localId: item.id
      }))
      setFieldsValue(mixinValues);
      setDataSource(addIdList);
      setCurrentId(id)
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
  }
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      if(!err) {
        triggerLoading(true)
        const {
          purchaseStrategyDate,
          files,
          sendList: sList,
          submitList: smList,
          ...otherData
        } = val;
        let params = {}
        if(!!files) {
          const filesIds = files.map((item)=> {
            const [res] = item.response;
            const { id = null } = res;
            return id
          }).filter(_=>_);
          const headerUUID = utils.getUUID();
          const { success: ses } = await  strategyTableLineRelevanceDocment({
            id: headerUUID,
            docIds: filesIds
          })
          params = {
            attachment: ses? headerUUID : null
          }
        }

        const [begin, end] = purchaseStrategyDate;
        const purchaseStrategyBegin = begin.format('YYYY-MM-DD HH:mm:ss')
        const purchaseStrategyEnd = end.format('YYYY-MM-DD HH:mm:ss')
        const accoutList = sList.map((item)=>({
          userAccount: item
        }))
        const smAccountList = smList.map(item=>({ userAccount: item }))
        params = {
          ...params,
          ...otherData,
          sendList: accoutList,
          submitList: smAccountList,
          purchaseStrategyBegin,
          purchaseStrategyEnd,
          detailList: dataSource.map((item, key)=>({ ...item, lineNo: key + 1 })),
          id: currentId
        }
        const { success, data, message: msg, other } = await savePurchaseStrategy(params)
        triggerLoading(false)
        // 处理保存成功后的逻辑
        console.log(success, msg, data, other)
      }
    })
  }
  async function handleCreateLine(val, hide) {
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { response = [] } = fileInfo;
    const [attachment = {}] = response;
    const { id = null } = attachment;
    let params = {}
    const uuid = utils.getUUID()
    if (!!id) {
      const { success } = await strategyTableLineRelevanceDocment({
        id: uuid,
        docIds: [id]
      })
      params = {
        ...val,
        adjustScopeList: adjustScopeListCode.map((item) => ({ code: item })),
        pricingDateList: pricingDateList.map(item => ({ date: item })),
        attachment: success ? uuid : null
      }
    } else {
      params = {
        ...val,
        adjustScopeList: adjustScopeListCode.map((item) => ({ code: item })),
        pricingDateList: pricingDateList.map(item => ({ date: item })),
      }
    }
    const { data, success, message: msg } = await strategyTableCreateLine(params);
    if (success) {
      const newSource = [...dataSource, data].map((item, key) => ({
        ...item,
        localId: !!item.id ? item.id : `${key}-dataSource`
      }));
      setDataSource(newSource)
      message.success(msg)
      hide()
      return
    }
    message.error(msg)
  }
  async function handleEditorLine(val, keys, hide) {
    triggerLoading(true)
    const [localId] = keys;
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { response = [] } = fileInfo;
    const [attachment = {}] = response;
    const { id = null } = attachment;
    let params = {}
    const uuid = utils.getUUID()
    if (!!id) {
      const { success } = await strategyTableLineRelevanceDocment({
        id: uuid,
        docIds: [id]
      })
      params = {
        ...val,
        adjustScopeList: adjustScopeListCode.map((item) => ({ code: item })),
        pricingDateList: pricingDateList.map(item => ({ date: item })),
        attachment: success ? uuid : null
      }
    } else {
      params = {
        ...val,
        adjustScopeList: adjustScopeListCode.map((item) => ({ code: item })),
        pricingDateList: pricingDateList.map(item => ({ date: item })),
      }
    }
    const { data, success, message: msg } = await strategyTableCreateLine(params);
    if (success) {
      const newSource = dataSource.map((item, key) => {
        if (item.localId === localId) {
          return {
            ...data,
            localId: !!data.id ? data.id : `${key}-dataSource`
          }
        }
        return {
          ...item,
          localId: !!item.id ? item.id : `${key}-dataSource`
        }
      });
      triggerLoading(false)
      setDataSource(newSource)
      message.success(msg)
      hide()
      return
    }
    triggerLoading(false)
    message.error(msg)
  }
  function handleBack() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => console.log('ok'),
      okText: '确定返回',
      cancelText: '取消'
    })
  }
  // 删除行数据
  function handleRemoveLines(rowKeys = [], rows) {
    const filterDataSource = dataSource.map(item => {
      let { localId } = item;
      let isMatch = rowKeys.find(i => i === localId);
      if (!!isMatch) {
        return null
      }
      return item
    }).filter(_ => _)
    setDataSource(filterDataSource);
  }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <Spin spinning={loading} tip="处理中...">
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          编辑采购策略
        </span>
        <div>
          <Button className={styles.btn} onClick={handleBack}>返回</Button>
          <Button className={styles.btn} onClick={handleSave}>保存</Button>
          <Button type='primary' className={styles.btn}>保存并提交审核</Button>
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
        initialValue={initValues}
        type='editor'
      />
      <StrategyTable
        onCreateLine={handleCreateLine}
        onRemove={handleRemoveLines}
        onEditor={handleEditorLine}
        dataSource={dataSource}
        type="editor"
        loading={loading}
      />
    </Spin>
  )
}

export default connect(({ purchaseStrategy }) => ({ state: purchaseStrategy }))(StrategyDetail);