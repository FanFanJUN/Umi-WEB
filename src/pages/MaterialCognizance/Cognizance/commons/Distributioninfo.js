import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
import ModifyForm from './ModifyForm';
import AutoSizeLayout from '../../../../components/AutoSizeLayout';
import StageModle from './StageModle'
import DeleteModle from './DeleteModle'
import styles from '../index.less';
import { map } from 'lodash';
import { QueryMasterdata, TaskqueryMasterdata } from '../../../../services/MaterialService'
const { create } = Form;
const confirm = Modal.confirm;
const { authAction, storage } = utils;
let keys = 1, defaultData = [];
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
  const StagefromRef = useRef(null)
  const DeletefromRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState(false);
  const [attachId, setAttachId] = useState('1')
  const [title, setTitle] = useState('新增变更详情');
  const [handlestage, setHandlestage] = useState([]);
  const [deletedata, setDeletedata] = useState([]);
  const [addtask, setAddtask] = useState([]);
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
    let params = {}
    const { data, success, message: msg } = await QueryMasterdata(params);
    if (success) {
      setHandlestage(data.rows)
      if (isAdd) {
        data.rows.map(item => {
          if (item.identificationStage === "认定方案") {
            handleTask(item)
          } else if (item.identificationStage === "认定结果") {
            setTimeout(() => {
              hanleResult(item)
            }, 1000);
          }
        })
      }
      return
    }
  }
  async function handleTask(val) {
    const { data, success, message: msg } = await TaskqueryMasterdata({ stageId: val.id });
    if (success) {
      let defaulted;
      data.map(item => {
        defaulted = {
          key: keys,
          stageName: val.identificationStage,
          stageCode: val.stageCode,
          stageSort: val.changeSort,
          stageId: val.id,
          taskName: item.taskDesc,
          taskCode: item.taskCode,
          taskTypeName: '判断型任务',
          taskTypeCode: '01',
          sort: item.changeSort,
          executionStatus: 0,
          defaultRequired: item.defaultRequired
        }
      })
      defaultData.push(defaulted)
    }
  }
  async function hanleResult(val) {
    const { data, success, message: msg } = await TaskqueryMasterdata({ stageId: val.id });
    if (success) {
      keys++;
      let defaulted;
      data.map(item => {
        defaulted = {
          key: keys++,
          stageName: val.identificationStage,
          stageCode: val.stageCode,
          stageSort: val.changeSort,
          stageId: val.id,
          taskName: item.taskDesc,
          taskCode: item.taskCode,
          taskTypeName: '判断型任务',
          taskTypeCode: '01',
          sort: item.changeSort,
          executionStatus: 0,
          defaultRequired: item.defaultRequired
        }
      })
      defaultData.push(defaulted)
      setDataSource(defaultData);
    }
  }
  async function hanldModify(val) {
    if (isEdit && val.length !== 0) {
      let newsdata = [];
      keys++;
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
    let newsdata = dataSource.filter(item => item.stageName !== '认定方案' && item.stageName !== '认定结果');
    let obj = {};
    newsdata = newsdata.reduce(function (item, next) {
      obj[next.stageName] ? '' : obj[next.stageName] = true && item.push(next);
      return item;
    }, []);
    setAddtask(newsdata)
    if (newsdata.length === 0) {
      message.error('请先新增任务阶段后在新增任务！')
    } else {
      setTitle('新增分配计划详情')
      setModalType(false)
      setAttachId(1)
      ModifyfromRef.current.handleModalVisible(true)
      uploadTable()
    }
  }
  // 编辑
  function handleEdit() {
    let newsdata = dataSource.filter(item => item.stageName !== '认定方案' && item.stageName !== '认定结果');
    let obj = {};
    newsdata = newsdata.reduce(function (item, next) {
      obj[next.stageName] ? '' : obj[next.stageName] = true && item.push(next);
      return item;
    }, []);
    setAddtask(newsdata)
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
        if (val.stageName != '认定结果' && val.stageName != '认定方案') {
          if (item.stageCode === val.stageCode && item.taskCode === val.taskCode && !modalType) {
            message.error('当前阶段任务已存在，请重新新增！')
            return false;
          } else if (item.stageCode === val.stageCode && item.taskCode === val.taskCode && modalType && val.isedit) {
            message.error('当前阶段任务已存在，请重新新增！')
            return false;
          }
        }

      }
      if (!modalType) {
        keys++;
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
    Modal.confirm({
      title: '删除数据',
      content: '是否要删除当前所选数据？',
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
        keys--;
        setDataSource(filterData)
      }
    })
  }

  // 获取表单值
  function displanfrom() {
    const changeinfor = tabformRef.current.data;
    let params = false;
    if (changeinfor.length > 0) {
      for (let item of changeinfor) {
        if (isEmpty(item.responsiblePartyName) || isEmpty(item.executiveDepartmentName) || isEmpty(item.writeDay)) {
          params = false
          return params;
        } else {
          params = changeinfor
        }
      }
      return params
    }
  }
  // 新增阶段
  function showstageModal() {
    if (dataSource[0].stageName === '认定方案' && dataSource[0].executionStatus !== 2) {
      message.error('认定方案任务状态为已执行才能新增认定阶段，请确认')
    } else {
      uploadTable()
      StagefromRef.current.handleModalVisible(true)
    }

  }
  function handleAddStage(val) {
    keys++
    let odddata = [];
    [...odddata] = dataSource;
    for (let item of odddata) {
      if (item.stageCode === val[0].stageCode && item.taskCode === val[0].taskCode) {
        message.error('当前阶段已存在，请重新新增！')
        return false;
      }
    }
    val.map(item => {
      odddata.push({
        ...item,
        key: keys++,
      })
    })
    setDataSource(odddata)
    StagefromRef.current.handleModalVisible(false)
  }
  // 删除阶段
  function handleDeletecogn() {
    let newsdata = [], obj = {};
    dataSource.map(item => {
      newsdata.push({
        ...item,
        identificationStage: item.stageName,
        stageCode: item.stageCode,
        executionStatus: item.executionStatus
      })
    })
    newsdata = newsdata.reduce(function (item, next) {
      obj[next.identificationStage] ? '' : obj[next.identificationStage] = true && item.push(next);
      return item;
    }, []);
    setDeletedata(newsdata)
    DeletefromRef.current.handleModalVisible(true)
  }
  async function handleDeleteStage(val) {
    if (val.executionStatus !== 0) {
      message.error('该阶段的认定任务已执行，不可删除！')
    } else {
      Modal.confirm({
        title: '删除数据',
        content: '是否要删除当前所选数据？',
        okText: '删除',
        cancelText: '取消',
        onOk: async () => {
          const filterData = dataSource.filter(item => item.stageName !== val.identificationStage);
          keys--
          setDataSource(filterData)
        }
      })

    }
    DeletefromRef.current.handleModalVisible(false)
  }
  const headerleft = (
    <>
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showstageModal()}>新增阶段</AuthButton>
      }
      {
        <AuthButton className={styles.btn} onClick={() => handleDeletecogn()}>删除阶段</AuthButton>
      }
      {
        <AuthButton type="primary" className={styles.btn} onClick={() => showModal()}>新增任务</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty || isdelete || !isimple} onClick={handleRemove}>删除任务</AuthButton>
      }
      {
        <AuthButton className={styles.btn} disabled={empty || !isimple} onClick={() => handleEdit()}>编辑</AuthButton>
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
      <ExtTable
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
        height={600}
        ellipsis={false}
        saveData={false}
        onSelectRow={handleSelectedRows}
        selectedRowKeys={selectRowKeys}
        dataSource={dataSource}
      />
      {/****阶段 */}
      <StageModle
        data={handlestage}
        onOk={handleAddStage}
        wrappedComponentRef={StagefromRef}
      />
      <DeleteModle
        deletedata={deletedata}
        onOk={handleDeleteStage}
        wrappedComponentRef={DeletefromRef}
      />
      {/***编辑 */}
      <ModifyForm
        addtask={addtask}
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