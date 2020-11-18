import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
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
  isEdit,
  isView
}, ref) => {
  useImperativeHandle(ref, () => ({
    displanfrom,
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
  const empty = selectRowKeys.length === 0;
  const [signleRow = {}] = selectedRows;
  const { key: defaultype } = signleRow;
  const isdelete = defaultype === 1;
  useEffect(() => {
    hanldcreate()
  }, [])

  useEffect(() => {
    hanldModify(editformData)
  }, [editformData])
  // 明细表格
  let columnsdetail = [];
  if (isView) {
    columnsdetail.push(
      {
        title: '计划时间',
        dataIndex: 'smChangeValue',
        align: 'center',
        width: 180
      },
      {
        title: '是否超期',
        dataIndex: 'smChangeDescriptionBefore',
        align: 'center',
        width: 220,
      },
      {
        title: '是否催办',
        dataIndex: 'smChangeDescriptionAfter',
        align: 'center',
        width: 220,
      },
    );
  }
  let columnsother = [];
  if (!isView) {
    columnsdetail.push(
      {
        title: '计划完成天数',
        align: 'center',
        dataIndex: 'planDay',
        width: 220,
      },
    );
  }
  const columns = [
    {
      title: '认定阶段',
      dataIndex: 'stageName',
      align: 'center',
      width: 180
    },
    {
      title: '认定任务',
      dataIndex: 'taskName',
      align: 'center',
      width: 220,
    },
    {
      title: '任务类型',
      dataIndex: 'taskTypeName',
      align: 'center',
      width: 220,
    },
    {
      title: '排序号',
      align: 'center',
      dataIndex: 'sort',
      width: 100,
    },
    {
      title: '执行责任人',
      align: 'center',
      dataIndex: 'responsiblePartyName',
      width: 160,
    },
    {
      title: '执行部门',
      dataIndex: 'executiveDepartmentName',
      align: 'center',
      width: 200
    },
    ...columnsother,
    ...columnsdetail,
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 300
    }
  ].map(_ => ({ ..._, align: 'center' }))

  async function hanldcreate() {
    if (isEdit) {
      let defaulted = [{
        key: keys,
        stageName: '认定方案',
        stageCode: '04',
        taskName: '制定认定方案',
        taskCode: '00',
        taskTypeName: '判断型任务',
        taskTypeCode: '01',
        sort: 1,
        executionStatus: 0
      }];
      setDataSource(defaulted);
    }
  }
  async function hanldModify(val) {
    if (isEdit && val.length !== 0) {
      let newsdata = [];
      val.map((item, index) => {
        newsdata.push({
          ...item,
          key: keys++
        })
        setDataSource(newsdata);
      })
    }
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
    [...newsdata] = dataSource;
    if (newsdata.length > 0) {
      newsdata.map(item => {
        if (item.stageCode === val.stageCode && item.taskCode === val.taskCode && !modalType) {
          message.error('当前数据已存在，请重新新增！')
          return false;
        } else {
          if (!modalType) {
            console.log(keys)
            newsdata.push({
              ...val,
              key: keys + 1
            })
            setDataSource(newsdata);
          } else {
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
      })

    }
  }
  // 关闭弹窗
  function hideModal() {
    setVisible(false)
    setInitialValue({})
  }
  // 删除
  async function handleRemove() {
    const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
    keys--;
    setDataSource(filterData)
  }

  // 获取表单值
  function displanfrom() {
    const changeinfor = tabformRef.current.data;
    if (changeinfor.length > 0) {
      if (changeinfor[0].key === 1 && changeinfor[0].responsiblePartyName === undefined &&
        changeinfor[0].executiveDepartmentName === undefined && changeinfor[0].planDay === undefined) {
        return false;
      } else {
        let newdata = [];
        changeinfor.map(item => {
          newdata.push({
            responsiblePartyId: item.responsiblePartyId[0],
            ...item
          })
        })
        return newdata;
      }

    }
  }

  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty} onClick={() => handleEdit()}>编辑</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty || isdelete} onClick={handleRemove}>删除</AuthButton>
      }
    </>
  );
  return (
    <>
      <Header style={{ display: headerInfo === true ? 'none' : 'block', color: 'red' }}
        left={headerInfo ? '' : headerleft}
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
          onCancel={handleCancel}
          footer={
            <Button type='ghost' onClick={handleCancel}>关闭</Button>
          }
        ></Modal>
      </div>
    </>
  )
}
)
const CommonForm = create()(ModifyinfoRef)

export default CommonForm