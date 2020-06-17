import React, { createRef, useState } from 'react';
import { Button, Modal, message, Spin } from 'antd';
import { utils, WorkFlow } from 'suid';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  savePurcahseAndApprove,
  strategyTableCreateLine,
  saveStrategyTableImportData,
  validateStrategyTableImportData,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import { StartFlow } from 'seid';
import { closeCurrent } from '../../../utils';
import styles from './index.less';
// const { StartFlow } = WorkFlow;
function CreateStrategy() {
  const formRef = createRef()
  const [dataSource, setDataSource] = useState([]);
  const [businessKey, setBusinessKey] = useState('');
  const [loading, triggerLoading] = useState(false);
  // 格式化vo参数
  async function formatSaveParams(val) {
    let params = {}
    const {
      purchaseStrategyDate,
      files,
      sendList: sList = [],
      submitList: smList = [],
      ...otherData
    } = val;
    if (!!files) {
      const filesIds = files.map((item) => {
        const { id = null } = item;
        return id
      }).filter(_ => _);
      const headerUUID = utils.getUUID();
      const { success: ses } = await strategyTableLineRelevanceDocment({
        id: headerUUID,
        docIds: filesIds
      })
      params = {
        attachment: ses ? headerUUID : null
      }
    }
    const [begin, end] = purchaseStrategyDate;
    const purchaseStrategyBegin = begin.format('YYYY-MM-DD HH:mm:ss')
    const purchaseStrategyEnd = end.format('YYYY-MM-DD HH:mm:ss')
    const accoutList = sList.map((item) => ({
      userAccount: item.code
    }))
    const smAccountList = smList.map(item => ({ userAccount: item.code }))
    params = {
      ...params,
      ...otherData,
      sendList: accoutList,
      submitList: smAccountList,
      purchaseStrategyBegin,
      purchaseStrategyEnd,
      detailList: dataSource.map((item, key) => ({ ...item, lineNo: key + 1 }))
    }
    return params;
  }
  // 保存
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      if (!err) {
        triggerLoading(true)
        const params = await formatSaveParams(val);
        const { success, message: msg } = await savePurcahseAndApprove(params)
        triggerLoading(false)
        if (success) {
          closeCurrent()
          return
        }
        message.error(msg)
      }
    })
  }
  // 保存并提交审核
  async function handleBeforeStartFlow() {
    const len = dataSource.length;
    return new Promise((resolve, reject) => {
      const { validateFieldsAndScroll } = formRef.current.form;
      validateFieldsAndScroll(async (err, val) => {
        if (!err && dataSource.length !== 0) {
          const params = await formatSaveParams(val);
          const { success, message: msg, data } = await savePurcahseAndApprove(params);
          if (success) {
            // resolve({
            //   success: true,
            //   message: msg,
            //   data: {
            //     businessKey: data.flowId
            //   }
            // })
            setBusinessKey(data.flowId)
            resolve(data.flowId)
            return
          }
          message.error(msg)
          // reject({
          //   success: false,
          //   message: msg
          // })
        } else {
          // reject({
          //   success: false,
          //   message: len === 0 ? '标的物不能为空' : '请完善采购策略基本信息'
          // })
          message.error(len === 0 ? '标的物不能为空' : '请完善采购策略基本信息')
        }
      })
    })
  }
  // 采购策略行创建
  async function handleCreateLine(val, hide) {
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { id = null } = fileInfo;
    let params = {}
    const uuid = utils.getUUID()
    triggerLoading(true)
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
      triggerLoading(false)
      return
    }
    triggerLoading(false)
    message.error(msg)
  }
  // 批量导入
  async function handleImportData(items) {
    triggerLoading(true)
    const { success, data, message: msg } = await saveStrategyTableImportData({ ios: items });
    triggerLoading(false)
    if (success) {
      const newSource = [...dataSource, ...data].map((item, key) => ({
        ...item,
        localId: !!item.id ? item.id : `${key}-dataSource`
      }));
      setDataSource(newSource)
      message.success(msg)
      return
    }
    message.error(msg)
  }
  async function handleEditorLine(val, keys, hide) {
    const [localId] = keys;
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { id = null } = fileInfo;
    let params = {}
    const uuid = utils.getUUID()
    triggerLoading(true)
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
      setDataSource(newSource)
      message.success(msg)
      triggerLoading(false)
      hide()
      return
    }
    triggerLoading(false)
    message.error(msg)
  }
  // 删除行数据
  function handleRemoveLines(rowKeys = []) {
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
  function handleComplete(info) {
      closeCurrent()
    // const { success, message: msg } = info
    // if (success) {
    //   message.success(msg)
    //   closeCurrent()
    //   return
    // }
    // message.error(msg)
  }
  function handleBack() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => {
        closeCurrent()
      },
      okText: '确定返回',
      cancelText: '取消'
    })
  }
  return (
    <Spin spinning={loading} tip='处理中...'>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          新增采购策略
        </span>
        <div>
          <Button className={styles.btn} onClick={handleBack}>返回</Button>
          <Button className={styles.btn} onClick={handleSave}>保存</Button>
          <StartFlow
            style={{ display: 'inline-flex' }}
            preStart={handleBeforeStartFlow}
            callBack={handleComplete}
            businessKey={businessKey}
            businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyHeader"
            butTitle="保存并提交审核"
          >
            保存并提交审核
            {/* {
              (loading) => {
                return (
                  <Button
                    type='primary'
                    className={styles.btn}
                    loading={loading}
                  >保存并提交审核</Button>
                )
              }
            } */}
          </StartFlow>
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
      />
      <StrategyTable
        onCreateLine={handleCreateLine}
        onRemove={handleRemoveLines}
        onEditor={handleEditorLine}
        onImportData={handleImportData}
        loading={loading}
        dataSource={dataSource}
        headerForm={formRef}
      />
    </Spin>
  )
}

export default CreateStrategy;