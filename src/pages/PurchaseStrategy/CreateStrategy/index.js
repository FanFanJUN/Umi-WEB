import React, { createRef, useState } from 'react';
import { Button, Modal, message, Spin } from 'antd';
import { utils } from 'suid';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  savePurchaseStrategy,
  strategyTableCreateLine,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import { openNewTab } from '@/utils';
import styles from './index.less';
function CreateStrategy() {
  const formRef = createRef()
  const [dataSource, setDataSource] = useState([]);
  const [loading, triggerLoading] = useState(false);
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      if (!err) {
        triggerLoading(true)
        const {
          purchaseStrategyDate,
          files,
          sendList: sList,
          submitList: smList = [],
          ...otherData
        } = val;
        let params = {}
        if (!!files) {
          const filesIds = files.map((item) => {
            const [res] = item.response;
            const { id = null } = res;
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
          userAccount: item
        }))
        const smAccountList = smList.map(item => ({ userAccount: item }))
        params = {
          ...params,
          ...otherData,
          sendList: accoutList,
          submitList: smAccountList,
          purchaseStrategyBegin,
          purchaseStrategyEnd,
          detailList: dataSource.map((item, key) => ({ ...item, lineNo: key + 1 }))
        }
        const { success, message: msg } = await savePurchaseStrategy(params)
        triggerLoading(false)
        if (success) {
          openNewTab('purchase/strategy', '采购策略', true)
          return
        }
        message.error(msg)
        // console.log(success, msg, data, other)
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
  async function handleEditorLine(val, keys, hide) {
    const [localId] = keys;
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { response = [] } = fileInfo;
    const [attachment = {}] = response;
    const { id = null } = attachment;
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
  function handleBack() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => {
        openNewTab('purchase/strategy', '采购策略', true)
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
          <Button type='primary' className={styles.btn}>保存并提交审核</Button>
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
      />
      <StrategyTable
        onCreateLine={handleCreateLine}
        onRemove={handleRemoveLines}
        onEditor={handleEditorLine}
        loading={loading}
        dataSource={dataSource}
      />
    </Spin>
  )
}

export default CreateStrategy;