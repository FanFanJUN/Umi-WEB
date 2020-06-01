import React, { useState, useRef } from 'react';
import { message, Modal, Button } from 'antd';
import { ExtTable, ExtModal, WorkFlow } from 'suid';
import { router } from 'dva';
import { psBaseUrl } from '@/utils/commonUrl';
import { closeCurrent } from '@/utils';
import { removePurchaseStrategyChangeHistory } from '@/services/strategy';
import { ComboAttachment } from '@/components';
import classnames from 'classnames';
import styles from './index.less';
const { StartFlow, FlowHistory } = WorkFlow;
const detailColumn = [
  {
    title: '操作内容',
    dataIndex: 'operation'
  },
  {
    title: '对象',
    dataIndex: 'target'
  },
  {
    title: '变更字段',
    dataIndex: 'changeField'
  },
  {
    title: '更改前',
    dataIndex: 'changeBefore'
  },
  {
    title: '更改后',
    dataIndex: 'changeLater'
  }
]
function ChangeStrategyHistory() {
  const { query } = router.useLocation();
  const tableRef = useRef(null);
  const [checkId, setCheckId] = useState('');
  const [visible, triggerVisible] = useState(false);
  const [attachId, setAttachId] = useState('');
  const [historyVisible,triggerHistoryVisible] = useState(false);
  const [showAttach, triggerShowAttach] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const multiple = selectedRowKeys.length > 1;
  const empty = selectedRowKeys.length === 0;
  const [signleRow = {}] = selectedRows;
  const { flowStatus = "", flowId='' } = signleRow;
  const disableSubmit = flowStatus !== 'INIT'
  const LEFT = (
    <>
      <Button type='primary' disabled={multiple || empty} className={styles.btn} onClick={showHistory}>审核历史</Button>
      <StartFlow
        beforeStart={handleBeforeStartFlow}
        startComplete={handleComplete}
        style={{ display: 'inline-flex' }}
        businessModelCode="com.ecmp.srm.ps.entity.PurchaseStrategyModifyHeader"
      >
        {
          (loading) => {
            return (
              <Button
                className={styles.btn}
                loading={loading}
                disabled={multiple || empty || disableSubmit} className={styles.btn}
              >提交审核</Button>
            )
          }
        }
      </StartFlow>
      <Button onClick={handleRemove} disabled={multiple || empty} >删除</Button>
    </>
  )
  const tableProps = {
    store: {
      url: `${psBaseUrl}/purchaseStrategyModifyHeader/listByPage`,
      params: {
        Q_EQ_purchaseStrategyCode: query.code ? query.code : ''
      }
    },
    onSelectRow: handleSelectedRows,
    selectedRowKeys: selectedRowKeys,
    ellipsis: false,
    checkbox: {
      multiSelect: false
    },
    columns: [
      {
        title: '变更单号',
        dataIndex: 'purchaseStrategyCode'
      },
      {
        title: '流程状态',
        dataIndex: 'flowStatus',
        render(text) {
          switch (text) {
            case 'INIT':
              return '初始化状态'
            case 'INPROCESS':
              return '流程中'
            case 'COMPLETED':
              return '流程处理完成'
            default:
              return '未知状态'
          }
        }
      },
      {
        title: '变更原因',
        dataIndex: 'modifyReason'
      },
      {
        title: '附件',
        dataIndex: 'attachment',
        render(text) {
          return !!text ? <Button onClick={() => {
            setAttachId(text)
            triggerShowAttach(true)
          }}>查看附件</Button> : '无'
        }
      },
      {
        title: '变更人',
        dataIndex: 'lastEditorName'
      },
      {
        title: '变更时间',
        dataIndex: 'lastEditedDate'
      },
      {
        title: '变更明细',
        dataIndex: 'id',
        render(text) {
          return (
            <Button type='primary' onClick={() => showChangeDetail(text)}>查看明细</Button>
          )
        }
      }
    ],
    toolBar: {
      left: LEFT
    }
  }
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  function handleComplete() {
    uploadTable()
  }
  async function showChangeDetail(id) {
    setCheckId(id)
    triggerVisible(true)
  }
  function showHistory() {
    triggerHistoryVisible(true)
  }
  function hideHistory() {
    triggerHistoryVisible(false)
  }
  function hideModal() {
    triggerVisible(false)
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
  }
  function handleClose() {
    closeCurrent()
  }
  // 启动审核流程
  function handleBeforeStartFlow() {
    const [item] = selectedRows;
    const { flowId } = item;
    return new Promise(async (resolve, reject) => {
      resolve({
        success: true,
        message: 'success',
        data: {
          businessKey: flowId
        }
      })
      reject(false)
    })
  }
  // 删除变更历史
  function handleRemove() {
    Modal.confirm({
      title: '删除变更历史',
      content: '删除后无法恢复,是否继续?',
      onOk: async () => {
        const [item] = selectedRows;
        const { id } = item;
        message.loading()
        const { success, message: msg } = await removePurchaseStrategyChangeHistory(({ id }))
        message.destroy()
        if (success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      },
      okText: '确定',
      cancelText: '取消'
    })
  }
  return (
    <div>
      <div className={classnames([styles.header, styles.flexBetweenStart])}>
        <span className={styles.title}>
          采购策略变更历史
          </span>
        <div>
          <Button className={styles.btn} onClick={handleClose}>关闭</Button>
        </div>
      </div>
      <ExtTable {...tableProps} showSearch={false}
        ref={tableRef} />
      <ExtModal
        visible={visible}
        footer={null}
        width={`80vw`}
        onCancel={hideModal}
        destroyOnClose
        title={
          <>
            <span>变更明细</span>
          </>
        }
      >
        <ExtTable
          store={{
            url: `${psBaseUrl}/PurchaseStrategyModifyHistory/listByPage`,
            params: {
              Q_EQ_changeHistoryId: checkId
            }
          }}
          showSearch={false}
          columns={detailColumn}
        />
      </ExtModal>
      <ExtModal
        visible={showAttach}
        footer={null}
        destroyOnClose
        onCancel={hideAttach}
      >
        <ComboAttachment
          allowPreview={false}
          maxUploadNum={1}
          allowUpload={false}
          serviceHost='/edm-service'
          uploadUrl='upload'
          attachment={attachId}
          multiple={false}
          customBatchDownloadFileName={true}
        />
      </ExtModal>
      <ExtModal
        visible={historyVisible}
        footer={null}
        destroyOnClose
        onCancel={hideHistory}
      >
        <FlowHistory businessId={flowId} flowMapUrl='flow-web/design/showLook'/>
      </ExtModal>
    </div>
  )
}

export default ChangeStrategyHistory;