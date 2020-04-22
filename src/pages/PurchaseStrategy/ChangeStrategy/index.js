import React, { useState, useEffect, useRef } from 'react';
import { router } from 'dva';
import {
  utils,
  WorkFlow
} from 'suid';
import { Button, Modal, message, Spin, Row, Input, Form, Col } from 'antd';
import ChangeForm from '../ChangeForm';
import StrategyTable from '../StrategyTable';
import { ComboAttachment } from '@/components';
import classnames from 'classnames';
import {
  changeOwnInvalidState,
  changeLineInvalidState,
  findStrategyDetailById,
  savePurcahseAndApprove,
  strategyTableCreateLine,
  saveStrategyTableImportData,
  strategyTableLineRelevanceDocment
} from '@/services/strategy';
import moment from 'moment';
import { openNewTab } from '@/utils';
import styles from './index.less';
const { StartFlow } = WorkFlow;
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
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [currentId, setCurrentId] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isInvalid, setIsInvalid] = useState({ name: '', state: false });
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
      const { form: childrenForm } = formRef.current
      const { setFieldsValue } = childrenForm
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
  // 保存并提交审核
  async function handleBeforeStartFlow() {
    const changeParams = await formatChangeReasonPamras();
    if (!changeParams) return
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
              reason: val.reason,
              attachment: success ? uuid : null
            }
          } else {
            params = {
              reason: val.reason
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
  function handleComplete() {
    openNewTab('purchase/strategy', '采购策略', true)
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
    }
  }
  // 整单作废
  function handleChangeOwnInvalidState() {
    Modal.confirm({
      title: '整单作废',
      content: '是否确定作废?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await changeOwnInvalidState(query);
        if(success) {
          message.success(msg)
          initFommFieldsValuesAndTableDataSource()
          return
        }
        message.error(msg)
      }
    })
  }
  // 标的物行作废
  function handleChangeLineInvalidState(id) {
    Modal.confirm({
      title: '整单作废',
      content: '是否确定作废?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await changeLineInvalidState(id);
        if(success) {
          message.success(msg)
          initFommFieldsValuesAndTableDataSource()
          return
        }
        message.error(msg)
      }
    })
  }
  useEffect(() => {
    initFommFieldsValuesAndTableDataSource()
  }, [])
  return (
    <Spin spinning={loading} tip="处理中...">
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          变更采购策略：{currentCode} {isInvalid.name}
        </span>
        <div>
          <Button className={styles.btn} onClick={handleBack}>返回</Button>
          <Button className={styles.btn} onClick={handleChangeOwnInvalidState}>作废/取消作废</Button>
          <Button onClick={showModal} type='primary'>保存并提交审核</Button>
        </div>
      </div>
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
      />
      <Modal
        title='变更原因'
        visible={visible}
        width='70vw'
        onOk={handleBeforeStartFlow}
        onCancel={hideModal}
        okText="提交审核"
        cancelText='取消'
        footer={
          <>
            <Button onClick={hideModal}>取消</Button>
            <StartFlow
              style={{ display: 'inline-flex' }}
              beforeStart={handleBeforeStartFlow}
              startComplete={handleComplete}
              businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyFlow"
              typeId='94B53F78-7E24-11EA-A0BD-0242C0A8441A'
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
                })(<Input.TextArea />)
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
                    allowDownload={false}
                    maxUploadNum={1}
                    allowUpload={allowUpload}
                    serviceHost='/edm-service'
                    uploadUrl='upload'
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
