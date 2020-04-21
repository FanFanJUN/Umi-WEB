import React, { createRef, useState, useEffect } from 'react';
import { router } from 'dva';
import { utils, WorkFlow } from 'suid';
import { Button, Modal, message, Spin } from 'antd';
import StrategyForm from '../StrategyForm';
import StrategyTable from '../StrategyTable';
import classnames from 'classnames';
import {
  savePurchaseStrategy,
  findStrategyDetailById,
  savePurcahseAndApprove,
  strategyTableCreateLine,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import moment from 'moment';
import { openNewTab } from '@/utils';
import { psBaseUrl } from '@/utils/commonUrl';
import styles from './index.less';
const { StartFlow } = WorkFlow;
function StrategyDetail() {
  const formRef = createRef();
  const { query } = router.useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [currentId, setCurrentId] = useState("");
  const [isInvalid, setIsInvalid] = useState({ name: '', state: false });
  const [currentCode, setCurrentCode] = useState('');
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
      setCurrentCode(code)
      setIsInvalid({ name: invalid ? '（作废）' : '', state: invalid })
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
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
      detailList: dataSource.map((item, key) => ({ ...item, lineNo: key + 1 })),
      id: currentId
    }
    return params;
  }
  // 格式化标的物保存参数
  async function formatLineParams(val) {
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
    return params;
  }
  // 保存
  async function handleSave() {
    const { validateFieldsAndScroll } = formRef.current.form;
    validateFieldsAndScroll(async (err, val) => {
      if (!err) {
        triggerLoading(true)
        const params = await formatSaveParams(val)
        const { success, message: msg, } = await savePurchaseStrategy(params);
        triggerLoading(false)
        if (success) {
          openNewTab('purchase/strategy', '采购策略', true)
          return
        }
        message.error(msg)
      }
    })
  }
  // 保存并提交审核
  async function handleBeforeStartFlow() {
    return new Promise((resolve, reject) => {
      const { validateFieldsAndScroll } = formRef.current.form;
      validateFieldsAndScroll(async (err, val) => {
        if (!err) {
          const params = await formatSaveParams(val);
          const { success, message: msg, data } = await savePurcahseAndApprove(params);
          if (success) {
            resolve({
              success: true,
              message: msg,
              data: {
                businessKey: data.id
              }
            })
            // return
          }
          reject(false)
        }
      })
    })
  }
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
  function handleBack() {
    Modal.confirm({
      title: '返回提示',
      content: '未保存的内容会全部丢失，确认已经保存或者不需要保存吗？',
      onOk: () => openNewTab('purchase/strategy', '采购策略', true),
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
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <Spin spinning={loading} tip="处理中...">
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          编辑采购策略: {currentCode} {isInvalid.name}
        </span>
        <div>
          <Button className={styles.btn} onClick={handleBack}>返回</Button>
          <Button className={styles.btn} onClick={handleSave}>保存</Button>
          <StartFlow
            style={{ display: 'inline-flex' }}
            beforeStart={handleBeforeStartFlow}
            businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyFlow"
            // store={{
            //   // baseUrl: "",
            //   url: `${psBaseUrl}/purchaseStrategyFlow/startFlow`,
            //   type: 'GET'
            // }}
          >
            {
              (loading) => {
                return (
                  <Button
                    type='primary'
                    className={styles.btn}
                    loading={loading}
                  >保存并提交审核</Button>
                )
              }
            }
          </StartFlow>
        </div>
      </div>
      <StrategyForm
        wrappedComponentRef={formRef}
        initialValue={initValues}
        onChangeMaterialLevel={handleChangeMaterialLevel}
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

export default StrategyDetail;