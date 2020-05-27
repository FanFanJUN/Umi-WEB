import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { WorkFlow, utils } from 'suid';
import { Button, Modal, message, Spin } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  savePurchaseStrategy,
  strategyTableCreateLine,
  saveStrategyTableImportData,
  getPurchaseStrategyVoByFlowId,
  strategyTableLineRelevanceDocment,
} from '../../../services/strategy';
import { closeCurrent } from '@/utils';
import moment from 'moment';
import styles from './index.less';
const { Approve } = WorkFlow;
function ApproveEditor() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [currentId, setCurrentId] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const { id: businessId, taskId, instanceId } = query;
  async function initFommFieldsValuesAndTableDataSource() {
    const { id: flowId } = query;
    const { data, success, message: msg } = await getPurchaseStrategyVoByFlowId({ id: flowId });
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
      const { setFieldsValue } = formRef.current.form;
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

      setCurrentId(id)
      setFieldsValue(mixinValues);
      setDataSource(detailList);
      triggerLoading(false);
      return
    }
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
  // 标的物行创建
  async function handleCreateLine(val, hide) {
    const params = await formatLineParams(val);
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
  // 标的物行编辑
  async function handleEditorLine(val, keys, hide) {
    triggerLoading(true)
    const params = await formatLineParams(val);
    const [localId] = keys;
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
  // 编辑时更改物料级别
  function handleChangeMaterialLevel() {
    Modal.confirm({
      title: '更改物料分类级别',
      content: '更改物料分类级别将清空当前所有物料分类行，确定要更改物料级别？',
      onOk: () => {
        setDataSource([])
      },
      onCancel: () => initFommFieldsValuesAndTableDataSource(),
      okText: '确定',
      cancelText: '取消'
    })
  }
  // 格式化保存Vo表单参数
  async function formatSaveParams(val) {
    let params = {}
    const {
      purchaseStrategyDate,
      files,
      sendList: sList,
      submitList: smList,
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
      detailList: dataSource.map((item, key) => ({ ...item, lineNo: key + 1 })),
      id: currentId
    }
    return params;
  }
  // 格式化标的物保存参数
  async function formatLineParams(val) {
    const { files = [], pricingDateList = [], adjustScopeListCode = [] } = val;
    const [fileInfo = {}] = files;
    const { id = null } = fileInfo;
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
    return params;
  }
  // 保存变更
  async function handleBeforeStartFlow() {
    return new Promise((resolve, reject) => {
      const { validateFieldsAndScroll } = formRef.current.form;
      validateFieldsAndScroll(async (err, val) => {
        if (!err) {
          triggerLoading(true)
          const params = await formatSaveParams(val)
          const { success, message: msg, } = await savePurchaseStrategy(params);
          triggerLoading(false)
          if (success) {
            resolve({
              success,
              message: msg
            })
            message.success(msg)
            return
          }
          message.error(msg)
          reject(false)
        } else {
          reject(false)
        }
      })
    })
  }
  function handleClose() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => closeCurrent(),
      okText: '确定返回',
      cancelText: '取消'
    })
  }
  function handleSubmitComplete(res) {
    const { success } = res;
    if (success) {
      closeCurrent()
    }
  }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          采购策略审批
          </span>
        <div>
          <Button className={styles.btn} onClick={handleClose}>关闭</Button>
        </div>
      </div>
      <Approve
        businessId={businessId}
        taskId={taskId}
        instanceId={instanceId}
        submitComplete={handleSubmitComplete}
        beforeSubmit={handleBeforeStartFlow}
      >
        <Spin spinning={loading}>
          <StrategyForm
            wrappedComponentRef={formRef}
            initialValue={initValues}
            type='editor'
          />
          <StrategyTable
            dataSource={dataSource}
            type="editor"
            onCreateLine={handleCreateLine}
            onRemove={handleRemoveLines}
            onEditor={handleEditorLine}
            onImportData={handleImportData}
          />
        </Spin>
      </Approve>
    </div>
  )
}

export default ApproveEditor;