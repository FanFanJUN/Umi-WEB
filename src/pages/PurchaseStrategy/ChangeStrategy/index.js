import React, { useState, useEffect, useRef } from 'react';
import { router } from 'dva';
import {
  utils
} from 'suid';
import { Button, Modal, message, Spin, Row, Input, Form, Col, Affix } from 'antd';
import ChangeForm from '../ChangeForm';
import StrategyTable from '../StrategyTable';
import { ComboAttachment } from '@/components';
import classnames from 'classnames';
import {
  changeOwnInvalidState,
  changeLineInvalidState,
  findStrategyDetailById,
  changePurchaseAndApprove,
  strategyTableCreateLine,
  saveStrategyTableImportData,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import { StartFlow } from 'seid';
import moment from 'moment';
import { closeCurrent, formatSaveParams } from '../../../utils';
import styles from './index.less';
// const { StartFlow } = WorkFlow;
const formLayout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
}
function ChangeStrategy({
  form
}) {
  const { getFieldDecorator, getFieldValue } = form;
  const formRef = useRef(null);
  const { query } = router.useLocation();
  const { frameElementId = "", frameElementSrc = "" } = query;
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [businessKey, setBusinessKey] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const files = getFieldValue('changeFiles') || [];
  const allowUpload = files.length !== 1;
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
        changeVo,
        creatorId,
        detailList,
        attachment,
        submitList = [],
        sendList = [],
        changeable,
        tenantCode,
        createdDate,
        modifyHeader,
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
        submitList: submitList.map(item => ({ ...item, code: item.userAccount })),
        sendList: sendList.map(item => ({ ...item, code: item.userAccount })),
        purchaseStrategyDateBegin: moment(purchaseStrategyBegin),
        purchaseStrategyDateEnd: moment(purchaseStrategyEnd)
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
      setIsInvalid(invalid)
      triggerLoading(false);
      return
    }
    triggerLoading(false);
    message.error(msg)
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
  // 保存并提交审核
  async function handleBeforeStartFlow() {
    return new Promise(async (resolve, reject) => {
      const changeParams = await formatChangeReasonPamras();
      if (!changeParams) {
        reject(false);
        return
      }
      const { validateFieldsAndScroll } = formRef.current.form;
      const sourceParams = await validateFieldsAndScroll().then(r => r).catch(err => null);
      if (!sourceParams) {
        reject(false)
        return;
      }
      const params = await formatSaveParams(sourceParams, dataSource, currentId);
      const { success, message: msg, data } = await changePurchaseAndApprove({ ...params, modifyHeader: changeParams, invalid: isInvalid });
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
      message.error(msg);
      return
      // reject({
      //   success: false,
      //   message: msg
      // })
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
    const { data, success, message: msg } = await strategyTableCreateLine({ ...params, id: localId });
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
      onOk: () => closeCurrent(),
      okText: '确定返回',
      cancelText: '取消'
    })
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
  function showModal() {
    setVisible(true)
  }
  function hideModal() {
    setVisible(false)
  }
  // 验证变更原因表单并关联变更附件attachment
  function formatChangeReasonPamras() {
    return new Promise((resolve, reject) => {
      const { validateFields } = form;
      validateFields(async (err, val) => {
        if (!err) {
          const { changeFiles = [] } = val;
          const [fileInfo = {}] = changeFiles;
          const { id = null } = fileInfo;
          let params = {}
          const uuid = utils.getUUID()
          if (!!id) {
            const { success } = await strategyTableLineRelevanceDocment({
              id: uuid,
              docIds: [id]
            })
            params = {
              modifyReason: val.reason,
              attachment: success ? uuid : null
            }
          } else {
            params = {
              modifyReason: val.reason
            }
          }
          resolve(params);
        }
        else {
          reject(false)
        }
      })
    })
  }
  function handleComplete(info) {
    closeCurrent()
    // const { success, message: msg } = info;
    // hideModal()
    // if (success) {
    //   closeCurrent()
    //   message.success(msg)
    //   return
    // }
    // message.error(msg)
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
  // 整单作废
  function handleChangeOwnInvalidState() {
    Modal.confirm({
      title: '变更作废状态',
      content: '是否确定变更作废状态?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        setIsInvalid(!isInvalid)
        // const { success, message: msg } = await changeOwnInvalidState(query);
        // if (success) {
        //   message.success(msg)
        //   initFommFieldsValuesAndTableDataSource()
        //   return
        // }
        // message.error(msg)
      }
    })
  }
  // 标的物行作废
  function handleChangeLineInvalidState(query) {
    Modal.confirm({
      title: '变更作废状态',
      content: '是否确定变更作废状态?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const [id] = query.ids;
        const newDataSouce = dataSource.map(item=>{
          if(item.id === id) {
            return {
              ...item,
              invalid: !item.invalid
            }
          }
          return item
        })
        setDataSource(newDataSouce)
        // const { success, message: msg } = await changeLineInvalidState(id);
        // if (success) {
        //   message.success(msg)
        //   initFommFieldsValuesAndTableDataSource()
        //   return
        // }
        // message.error(msg)
      }
    })
  }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <Spin spinning={loading} tip="处理中...">
      <Affix offsetTop={0}>
        <div className={classnames([styles.header, styles.flexBetweenStart])}>
          <span className={styles.title}>
            变更采购策略：{currentCode} {isInvalid ? '（作废）' : ''}
          </span>
          <div className={styles.flexCenter}>
            <Button className={styles.btn} onClick={handleBack}>返回</Button>
            <Button className={styles.btn} onClick={handleChangeOwnInvalidState}>作废/取消作废</Button>
            <Button onClick={showModal} type='primary'>保存并提交审核</Button>
          </div>
        </div>
      </Affix>
      <ChangeForm
        wrappedComponentRef={formRef}
        initialValue={initValues}
        type='change'
      />
      <StrategyTable
        onCreateLine={handleCreateLine}
        onRemove={handleRemoveLines}
        onEditor={handleEditorLine}
        onImportData={handleImportData}
        onInvalidChange={handleChangeLineInvalidState}
        dataSource={dataSource}
        type="change"
        loading={loading}
        headerForm={formRef}
      />
      <Modal
        title='变更原因'
        visible={visible}
        destroyOnClose
        width='70vw'
        onCancel={hideModal}
        okText="提交审核"
        cancelText='取消'
        footer={
          <>
            <Button onClick={hideModal} className={styles.btn}>取消</Button>
            <StartFlow
              style={{ display: 'inline-flex' }}
              preStart={handleBeforeStartFlow}
              callBack={handleComplete}
              originStartTab={{
                title: '采购策略',
                url: frameElementSrc,
                id: frameElementId
              }}
              businessKey={businessKey}
              businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyModifyHeader"
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
          </>
        }
      >
        <Row>
          <Col span={18}>
            <Form.Item label='变更原因' {...formLayout}>
              {
                getFieldDecorator('reason', {
                  rules: [
                    {
                      required: true,
                      message: '请填写变更原因'
                    }
                  ]
                })(<Input.TextArea maxLength={800} />)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item label='附件' {...formLayout}>
              {
                getFieldDecorator('changeFiles')(
                  <ComboAttachment
                    allowPreview={false}
                    maxUploadNum={1}
                    allowUpload={allowUpload}
                    multiple={false}
                  />
                )
              }
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </Spin>
  )
}

export default Form.create()(ChangeStrategy);
