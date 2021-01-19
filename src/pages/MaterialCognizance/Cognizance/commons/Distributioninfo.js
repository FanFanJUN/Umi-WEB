import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import styles from '../index.less';
import { map } from 'lodash';
import { QueryMasterdata, TaskqueryMasterdata } from '../../../../services/MaterialService'

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
  isAdd
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
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState(false);
  const [showAttach, triggerShowAttach] = useState(false);
  const [attachId, setAttachId] = useState('1')
  const [title, setTitle] = useState('新增变更详情');
  const empty = selectRowKeys.length === 0;
  const [signleRow = {}] = selectedRows;
  const { defaultRequired: defaultype, executionStatus: implement } = signleRow;
  // 认定方案
  const isdelete = defaultype === 1;
  // 执行状态
  const isimple = implement === 0;
  useEffect(() => {
    hanldcreate()
  }, [])

  useEffect(() => {
    hanldModify(editformData)
  }, [editformData])
  const columns = [
    {
      title: '认定阶段',
      dataIndex: 'stageName',
      align: 'center',
      width: 160
    },
    {
      title: '认定任务',
      dataIndex: 'taskName',
      align: 'center',
      width: 160,
    },
    {
      title: '任务类型',
      dataIndex: 'taskTypeName',
      align: 'center',
      width: 160,
    },
    {
      title: '排序号',
      align: 'center',
      dataIndex: 'sort',
      width: 100,
    },
    {
      title: '执行状态',
      align: 'center',
      dataIndex: 'executionStatus',
      width: 100,
      render: function (text, record, row) {
        if (text === 0) {
          return <div>未发布</div>;
        } else if (text === 1) {
          return <div className="successColor">执行中</div>;
        } else if (text === 2) {
          return <div className="successColor">已执行</div>;
        }
      },
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
      width: 160
    },
    {
      title: '计划完成天数',
      align: 'center',
      dataIndex: 'writeDay',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      width: 200
    }
  ].map(_ => ({ ..._, align: 'center' }))

  async function hanldcreate() {
    if (isAdd) {
      let params = {}
      const { data, success, message: msg } = await QueryMasterdata(params);
      if (success) {
        data.rows.map(item => {
          if (item.identificationStage === "认定方案") {
            handleTask(item)
          }
        })
        return
      }
    }

  }
  async function handleTask(val) {
    const { data, success, message: msg } = await TaskqueryMasterdata({ stageId: val.id });
    if (success) {
      let defaulted = [{
        key: keys,
        stageName: val.identificationStage,
        stageCode: val.stageCode,
        stageSort: val.changeSort,
        stageId: val.id,
        taskName: data[0].taskDesc,
        taskCode: data[0].taskCode,
        taskTypeName: '判断型任务',
        taskTypeCode: '01',
        sort: 1,
        executionStatus: 0,
        defaultRequired: data[0].defaultRequired
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
    setInitialValue({})
  }
  // 新增
  function showModal() {
    setTitle('新增分配计划详情')
    setModalType(false)
    setAttachId(1)
    ModifyfromRef.current.handleModalVisible(true)
    uploadTable()
  }
  // 编辑
  function handleEdit() {
    setInitialValue('')
    setTitle('编辑分配计划详情')
    setModalType(true)
    setAttachId(2)
    const [row] = selectedRows;
    setInitialValue({ ...row })
    ModifyfromRef.current.handleModalVisible(true)
  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    tabformRef.current.remoteDataRefresh()
    tabformRef.current.manualSelectedRows();
  }
  // 取消编辑或新增
  function handleCancel() {
    setVisible(false)
    uploadTable()
  }
  // 新增或编辑保存
  function handleSubmit(val) {
    let newsdata = [];
    [...newsdata] = dataSource;
    if (newsdata.length > 0) {
      for (let item of newsdata) {
        if (item.stageCode === val.stageCode && item.taskCode === val.taskCode && !modalType) {
          message.error('当前数据已存在，请重新新增！')
          return false;
        }
      }
      if (!modalType) {
        keys = keys + 1;
        newsdata.push({
          ...val,
          key: keys,
          executionStatus: 0,
        })
        setDataSource(newsdata);
      } else {
        dataSource.map((item, index) => {
          if (item.key === val.key) {
            const copyData = dataSource.slice(0)
            copyData[index] = val;
            setDataSource(copyData)
            //setRows(copyData)
          }
        })
      }
      hideModal()
      uploadTable()
    }
  }
  // 关闭弹窗
  function hideModal() {
    ModifyfromRef.current.handleModalVisible(false)
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
        changeinfor[0].executiveDepartmentName === undefined && changeinfor[0].writeDay === undefined) {
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
        <AuthButton className={styles.btn} disabled={empty || !isimple} onClick={() => handleEdit()}>编辑</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty || isdelete || !isimple} onClick={handleRemove}>删除</AuthButton>
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
            ellipsis={false}
            saveData={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
          //{...dataSource}
          />
        }
      </AutoSizeLayout>
      {/* <ModifyForm
        onCancel={handleCancel}
        onOk={handleSubmit}
        type={modalType}
        attachId={attachId}
        editData={selectedRows}
        title={title}
        wrappedComponentRef={ModifyfromRef}
        destroyOnClose
      /> */}
      <ModifyForm
        type={modalType}
        attachId={attachId}
        editData={initialValue}
        seltaskid={initialValue.stageId}
        title={title}
        onOk={handleSubmit}
        wrappedComponentRef={ModifyfromRef}
      />
    </>
  )
})
const CommonForm = create()(ModifyinfoRef)

export default CommonForm