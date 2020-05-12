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
  changeLineInvalidState,
  changeEditorAndApprove,
  strategyTableCreateLine,
  saveStrategyTableImportData,
  strategyTableLineRelevanceDocment,
  getPurchaseStrategyChangeVoByFlowId
} from '@/services/strategy';
import moment from 'moment';
import { openNewTab, getUUID, closeCurrent } from '@/utils';
import styles from './index.less';
const { Approve } = WorkFlow;
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
  const { id: businessId, taskId, instanceId } = query;
  const [dataSource, setDataSource] = useState([]);
  const [reasonAttach, setReasonAttach] = useState('');
  const [visible, setVisible] = useState(false);
  const [initValues, setInitValues] = useState({});
  const [loading, triggerLoading] = useState(true);
  const [currentId, setCurrentId] = useState('');
  const [currentCode, setCurrentCode] = useState('');
  const [isInvalid, setIsInvalid] = useState('');
  const files = getFieldValue('changeFiles') || [];
  const allowUpload = files.length !== 1;
  async function initFommFieldsValuesAndTableDataSource() {
    const { id: flowId } = query;
    const { data, success, message: msg } = await getPurchaseStrategyChangeVoByFlowId({ flowId });
    if (success) {
      const {
        id,
        code,
        send,
        state,
        flowId,
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
      const { form: childrenForm } = formRef.current
      const { setFieldsValue } = childrenForm;
      const { setFieldsValue: modifySetFieldsValue } = form;

      const mixinValues = {
        ...initialValues,
        submitName: submitList.map(item => item.userName),
        submitList: submitList.map(item => item.userAccount),
        sendName: sendList.map(item => item.userName),
        sendList: sendList.map(item => item.userAccount),
        purchaseStrategyDate: [moment(purchaseStrategyBegin), moment(purchaseStrategyEnd)]
      }
      const { modifyReason, attachment: reasonAttach } = modifyHeader;

      setReasonAttach(reasonAttach)
      setInitValues({
        attachment
      });
      const addIdList = detailList.map(item => ({
        ...item,
        localId: item.id
      }))
      modifySetFieldsValue({
        reason: modifyReason
      })
      setFieldsValue(mixinValues);
      setDataSource(addIdList);
      setCurrentId(id)
      setCurrentCode(code)
      setIsInvalid(invalid ? '（作废）' : '')
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
    if (!!id) {
      const uuid = utils.getUUID();
      const { success } = await strategyTableLineRelevanceDocment({
        id: uuid,
        docIds: [id]
      })
      params = {
        ...val,
        adjustScopeList: adjustScopeListCode.map((item) => ({ code: item })),
        pricingDateList: pricingDateList.map(item => ({ date: item })),
        // docIds: [id]
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
    const { validateFields } = formRef.current.form;
    const sourceParams = await validateFields().then(r => r)
    const params = await formatSaveParams(sourceParams)
    console.log(changeParams, params)
    const { success, message: msg, data } = await changeEditorAndApprove({ ...params, modifyHeader: changeParams });
    return new Promise((resolve, reject) => {
      if (success) {
        resolve({
          success: true,
          message: msg,
          data: {
            businessKey: data.id
          }
        })
        return
      }
      resolve({
        success: false,
        message: msg
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
  async function formatChangeReasonPamras() {
    const { validateFieldsAndScroll } = form;
    const val = await validateFieldsAndScroll().then(_ => _).catch(err=>null);
    if(!val) return false;
    let params = {}
    const { changeFiles = [] } = val;
    const [fileInfo = {}] = changeFiles;
    const { id = null } = fileInfo;
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
    return params
  }
  function handleComplete(info) {
    const { success, message: msg } = info;
    hideModal()
    if (success) {
      closeCurrent()
      message.success(msg)
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
  // 标的物行作废
  function handleChangeLineInvalidState(id) {
    Modal.confirm({
      title: '变更作废状态',
      content: '是否确定变更作废状态?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const { success, message: msg } = await changeLineInvalidState(id);
        if (success) {
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
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          变更采购策略：{currentCode} {isInvalid}
        </span>
        <div>
          <Button onClick={showModal}>修改变更原因</Button>
        </div>
      </div>
      <Approve
        businessId={businessId}
        taskId={taskId}
        instanceId={instanceId}
        beforeSubmit={handleBeforeStartFlow}
        submitComplete={handleComplete}
      >
        <Spin spinning={loading} tip="处理中...">
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
            onCancel={hideModal}
            okText="提交审核"
            cancelText='取消'
            forceRender
            footer={
              <>
                <Button onClick={hideModal} className={styles.btn}>取消</Button>
                <Button
                  type='primary'
                  className={styles.btn}
                  onClick={hideModal}
                >保存修改</Button>
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
                        attachment={reasonAttach}
                        allowPreview={false}
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
      </Approve>
    </div>
  )
}

export default Form.create()(ChangeStrategy);