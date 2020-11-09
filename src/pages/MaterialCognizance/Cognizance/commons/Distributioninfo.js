import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';


const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
const ModifyinfoRef = forwardRef(({
  form,
  editformData = [],
  headerInfo,
  modifytype,
  isEdit
}, ref) => {
  useImperativeHandle(ref, () => ({
    getmodifyform,
    form
  }));
  const tabformRef = useRef(null)
  const ModifyfromRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [visible, setVisible] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState(false);
  const [showAttach, triggerShowAttach] = useState(false);
  const [loading, triggerLoading] = useState(false);
  const [attachId, setAttachId] = useState('')
  const [title, setTitle] = useState('新增变更详情');
  useEffect(() => {
    hanldModify(editformData)
  }, [editformData])

  const columns = [
    {
      title: '认定阶段',
      dataIndex: 'smChangeValue',
      align: 'center',
      width: 180
    },
    {
      title: '认定任务',
      dataIndex: 'smChangeDescriptionBefore',
      align: 'center',
      width: 220,
    },
    {
      title: '任务类型',
      dataIndex: 'smChangeDescriptionAfter',
      align: 'center',
      width: 220,
    },
    {
      title: '排序号',
      align: 'center',
      dataIndex: 'smChangeReason',
      width: 220,
    },
    {
      title: '执行责任人',
      align: 'center',
      dataIndex: 'smChangeProve',
      width: 220,
    },
    {
      title: '执行部门',
      dataIndex: 'attachmentId',
      align: 'center',
      width: 90
    },
    {
        title: '计划完成天数',
        align: 'center',
        dataIndex: 'smChangeProve',
        width: 220,
    },
    {
        title: '备注',
        dataIndex: 'attachmentId',
        align: 'center',
        width: 90
    }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;
  //变更类型
  //const contype = isEmpty(modifytype);
  // 编辑处理数据
  function hanldModify(val) {
    keys ++ ;
    let newsdata = [];
    val.map((item, index) => {
      newsdata.push({
          ...item,
          key: keys ++ 
      })
      setDataSource(newsdata);
    })
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);
     
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
  }
  // 新增
  function showModal() {
    // if (isEmpty(modifytype)) {
    //   message.error('请先选择变更类型')
    //   return false
    // }else {
    //   setTitle('新增变更详情')
    //   setVisible(true)
    //   setModalType(false)
    //   uploadTable()
    // }
    setTitle('新增分配计划详情')
      setVisible(true)
      setModalType(false)
      uploadTable()
  }
  // 编辑
  function handleEdit() {
    setTitle('编辑分配计划详情')
    setVisible(true)
    setModalType(true)
    const [row] = selectedRows;
    setInitialValue({ ...row })

  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    tabformRef.current.manualSelectedRows();
  }
  // 取消编辑或新增
  function handleCancel() {
    //const { resetFields } = commonFormRef.current.form;
    //resetFields()
    setVisible(false)
    uploadTable()
  }
  // 新增或编辑保存
  function handleSubmit(val) {
    let newsdata = [];
    if (!modalType) {
      [...newsdata] = dataSource;
      newsdata.push({
          ...val,
          key: keys ++ 
      })
      setDataSource(newsdata);
    }else {
      dataSource.map((item, index) => {
        if (item.key === val.key) {
          const copyData = dataSource.slice(0)
          copyData[index] = val;
          setDataSource(copyData)
          setRows(copyData)
        }
      })
    }
    hideModal()
    uploadTable()
  }
  // 关闭弹窗
  function hideModal() {
    setVisible(false)
    setInitialValue({})
  }
  function hideAttach() {
    setAttachId('')
    triggerShowAttach(false)
  }
  // 删除
  async function handleRemove() {
    const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
    keys--;
    setDataSource(filterData)
  }
  
  // 获取表单值
  function getmodifyform() {
    const changeinfor = tabformRef.current.data;
    if (!changeinfor || changeinfor.length === 0) {
      return false;
    }
    return changeinfor;
  }

  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={() => handleEdit()} disabled={empty} >编辑</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty} onClick={handleRemove}>删除</AuthButton>
      }
    </>
  );
  return (
    <>
      <Header  style={{ display: headerInfo === true ? 'none' : 'block',color: 'red' }}
        left={ headerInfo ? '' : headerleft}
        advanced={false}
        extra={false}
      />
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.key}
            checkbox={{
              multiSelect: false
            }}
            pagination={{
              hideOnSinglePage: true,
              disabled: false,
              pageSize: 100,
            }}
            allowCancelSelect={true}
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            saveData={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
            //{...dataSource}
          />
        }
      </AutoSizeLayout>
      <div>
        <ModifyForm
          visible={visible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          type={modalType}
          dataSource={initialValue}
          title={title}
          wrappedComponentRef={ModifyfromRef}
          modifytype={modifytype}
          loading={loading}
          destroyOnClose
        />
        <Modal
          visible={showAttach}
          onCancel={hideAttach}
          footer={
            <Button type='ghost' onClick={hideAttach}>关闭</Button>
          }
        ></Modal>
      </div>
    </>
  )
}
)
const CommonForm = create()(ModifyinfoRef)

export default CommonForm