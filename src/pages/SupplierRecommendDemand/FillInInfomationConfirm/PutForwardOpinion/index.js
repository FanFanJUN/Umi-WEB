import { useState, useRef } from 'react';
import styles from './index.less';
import { ExtTable } from 'suid';
import { Button, Modal, Input, Form, message } from 'antd';
import moment from 'moment';
import { Header, AutoSizeLayout } from '../../../../components'
import { router } from 'dva';
import { saveOpinion, removeOpinion, submitOpinion } from '../../../../services/recommend';
const { useLocation } = router;
const { TextArea } = Input;

function PutForwardOpinion({
  form
}) {
  const { query } = useLocation();
  const tabRef = useRef(null);
  const [confirmLoading, toggleConfirmLoading] = useState(false)
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [singleRow={}] = selectedRows;
  const isSubmit = singleRow.status
  // 未选中数据状态
  const empty = selectedRowKeys.length === 0;
  const tableProps = {
    store: {
      url: '/srm-sam-service/api/fillingOpinionService/findByPage',
      params: {
        filters: [
          {
            fieldName: 'recommendDemandId',
            operator: 'EQ',
            value: query.id
          }
        ]
      },
      type: 'POST'
    },
    columns: [
      {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          return text ? '已提交' : '草稿'
        }
      },
      {
        title: '意见',
        dataIndex: 'opinion'
      },
      {
        title: '提交时间',
        dataIndex: 'submitTime',
        render(text) {
          return !!text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null
        },
        width: 200
      }
    ],
    checkbox: {
      multiSelect: false
    },
    remotePaging: true,
    allowCancelSelect: true,
    ellipsis: false,
    selectedRowKeys: selectedRowKeys,
    onSelectRow: handleSelectedRows,
    rowKey: (item) => item.id
  }
  const left = (
    <>
      <Button className={styles.btn} type='primary' onClick={() => setVisible(true)}>新增</Button>
      <Button className={styles.btn} disabled={empty || isSubmit} onClick={handleReomve}>删除</Button>
      <Button className={styles.btn} disabled={empty || isSubmit} onClick={handleSubmit}>提交</Button>
    </>
  )

  async function handleCreate() {
    const values = await form.validateFieldsAndScroll()
    toggleConfirmLoading(true)
    const { success, message: msg } = await saveOpinion({
      ...values,
      recommendDemandId: query.id
    })
    toggleConfirmLoading(false)
    if (success) {
      message.success(msg)
      setVisible(false)
      cleanSelectedRecord()
      tabRef.current.remoteDataRefresh()
      return
    }
    message.error(msg)
  }
  function handleReomve() {
    Modal.confirm({
      title: '删除意见',
      content: '确定要删除当前所选意见？',
      onOk: async () => {
        const [id] = selectedRowKeys;
        const { success, message: msg } = await removeOpinion({id});
        if (success) {
          message.success(msg);
          cleanSelectedRecord();
          tabRef.current.remoteDataRefresh();
          return
        }
        message.error(msg)
      },
      okText: '确定',
      cancelText: '取消'
    })
  }
  function handleSubmit() {
    Modal.confirm({
      title: '提交意见',
      content: '确定要提交当前所选意见？',
      onOk: async () => {
        const [opinionId] = selectedRowKeys;
        const { success, message: msg } = await submitOpinion({ opinionId });
        if (success) {
          message.success(msg);
          cleanSelectedRecord();
          tabRef.current.remoteDataRefresh();
          return
        }
        message.error(msg)
      },
      okText: '确定',
      cancelText: '取消'
    })
  }
  // 记录列表选中项
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([])
    setRows([])
  }
  return (
    <div>
      <div className={styles.commonTitle}>提出意见</div>
      <Header
        left={left}
      ></Header>
      <AutoSizeLayout>
        {
          h =>
            <ExtTable
              height={h}
              showSearch={false}
              {...tableProps}
              ref={tabRef}
            />
        }
      </AutoSizeLayout>
      <Modal
        visible={visible}
        confirmLoading={confirmLoading}
        title='新增意见'
        onOk={handleCreate}
        onCancel={() => setVisible(false)}
        destroyOnClose
        maskClosable={false}
      >
        <Form>
          <Form.Item>
            {
              form.getFieldDecorator('opinion', {
                rules: [
                  {
                    required: true,
                    message: '意见内容不能为空'
                  }
                ]
              })(
                <TextArea rows={6} maxLength={500} />
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Form.create()(PutForwardOpinion);