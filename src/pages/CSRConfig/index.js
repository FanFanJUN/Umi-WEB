import { useState, useRef } from 'react';
import styles from './index.less';
import { Header, AutoSizeLayout } from '../../components';
import { Button, Input, Modal, message } from 'antd';
import { ExtTable } from 'suid';
import DataForm from './DataForm';
import { saveCsrConfig, removeCsrConfig } from '../../services/recommend';
import { recommendUrl } from '../../utils/commonUrl';
const { Search } = Input
const AWAIT = timeout => new Promise(resolve => setTimeout(resolve, timeout));
function CSRConfig() {
  const [modalInfo, setModalInfo] = useState({
    visible: false,
    type: 'add'
  });
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [searchValue, setSearchValue] = useState({});
  const formRef = useRef(null);
  const tableRef = useRef(null);
  const left = (
    <>
      <Button className={styles.btn} type='primary' onClick={handleAdd}>新增</Button>
      <Button className={styles.btn} onClick={handleEditor}>编辑</Button>
      <Button className={styles.btn} onClick={handleRemove}>删除</Button>
    </>
  )
  const right = (
    <>
      <Search onSearch={handleQuickSerach} placeholder='项目名称搜索' />
    </>
  )

  const title = modalInfo.type === 'add' ? '新增调查项目' : '编辑调查项目'
  const tableProps = {
    showSearch: false,
    remotePaging: true,
    bordered: true,
    size: 'small',
    checkbox: {
      multiSelect: false
    },
    ellipsis: false,
    rowKey: item => item.id,
    selectedRowKeys: selectedRowKeys,
    allowCancelSelect: true,
    store: {
      url: `${recommendUrl}/api/csrConfigService/findByPage`,
      type: 'POST',
      params: {
        ...searchValue,
        quickSearchProperties: ['item']
      }
    },
    columns: [
      {
        title: '调查项目',
        dataIndex: 'item',
        width: 280
      },
      {
        title: '选项配置',
        dataIndex: 'selectConfigList',
        render(text) {
          return Array.isArray(text) ? text.join('，') : ''
        },
        width: 200
      },
      {
        title: '备注',
        dataIndex: 'remarkConfig',
        render(text) {
          return text ? '有' : '无'
        }
      },
      {
        title: '备注必填选项',
        dataIndex: 'remarkRequiredField'
      },
      {
        title: '附件',
        dataIndex: 'attachmentConfig',
        render(text) {
          return text ? '有' : '无'
        }
      },
      {
        title: '附件必填选项',
        dataIndex: 'attachmentRequiredField'
      },
      {
        title: '类型',
        dataIndex: 'csrConfigEnum',
        render(text) {
          switch (text) {
            case "CSR":
              return '企业社会责任'
            case "PRODUCTION_ENVIRONMENT":
              return '企业生产环境'
          }
        }
      },
      {
        title: '排序号',
        dataIndex: 'rank'
      }
    ]
  }
  function handleAdd() {
    setModalInfo({
      ...modalInfo,
      type: 'add',
      visible: true
    })
  }
  async function handleEditor() {
    setModalInfo({
      type: 'editor',
      visible: true
    })
    await AWAIT(100)
    const [fields] = selectedRows
    formRef.current.setAllFieldsValue(fields)
  }
  function handleRemove() {
    Modal.confirm({
      title: '删除调查项目',
      content: '删除后无法恢复，是否继续？',
      okText: '确定',
      cancelText: '取消',
      onOk:async () => {
        const [id] = selectedRowKeys; 
        const {success, message: msg} = await removeCsrConfig({ id })
        if(success) {
          message.success(msg)
          uploadTable()
          return
        }
        message.error(msg)
      }
    })
  }
  // 快速搜索
  function handleQuickSerach(v) {
    setSearchValue({
      quickSearchValue: v.trim()
    })
    uploadTable()
  }
  async function handleConfirm() {
    const values = await formRef.current.getAllFieldsValue();
    const [id] = selectedRowKeys;
    const params = modalInfo.type === 'add' ? values : { ...values, id }
    const { success, messge: msg } = await saveCsrConfig(params)
    if (success) {
      message.success(msg)
      setModalInfo({
        visible: false,
        type: 'add'
      })
      uploadTable()
      return
    }
    message.error(msg)
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
  // 更新列表
  function uploadTable() {
    cleanSelectedRecord()
    tableRef.current.remoteDataRefresh()
  }
  return (
    <div>
      <Header left={left} right={right} />
      <AutoSizeLayout>
        {
          h => (
            <ExtTable
              height={h}
              ref={tableRef}
              onSelectRow={handleSelectedRows}
              {...tableProps}
            />
          )
        }
      </AutoSizeLayout>

      <Modal
        visible={modalInfo.visible}
        destroyOnClose
        centered
        width={640}
        title={title}
        bodyStyle={{
          height: '60vh',
          overflowY: 'scroll'
        }}
        onCancel={() => setModalInfo({ ...modalInfo, visible: false })}
        onOk={handleConfirm}
      >
        <DataForm wrappedComponentRef={formRef} />
      </Modal>
    </div>
  )
}

export default CSRConfig;