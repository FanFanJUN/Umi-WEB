import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar,AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal} from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import Header from '@/components/Header';
import UploadFile from '../../../components/Upload/index'
import AutoSizeLayout from '../SupplierAutoLayout';
import styles from './index.less';
import AgentInfoEditModal from './AgentInfoEditModal'
import AgentApprvoEditModal from './AgentApprvoEditModal'
import { getMaxLineNum,getLineCode } from '@/utils/index';
import { SaveSupplierRegister, DetailSupplierRegister } from "@/services/supplierConfig"
import { getCNCountryIdInfo} from '../../../services/supplierRegister';
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
const Agentformef = forwardRef(({
  form,
  isView = false,
  editData = {},
  headerInfo,
  agenthead
}, ref) => {
  useImperativeHandle(ref, () => ({
    getAgentform,
    agentTemporary,
    setHeaderFields,
    form
  }));
  const agentModelRef = useRef(null)
  const tabformRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [CNCountryId, setCNCountryId] = useState(false);
  const [edit, setEdit] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState('add');
  const [showAttach, triggerShowAttach] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, triggerLoading] = useState(false);
  const [attachId, setAttachId] = useState('')

  let Modeltitle = '新增';
  useEffect(() => {
    getBankcodelist(editData);
  }, [editData]);
  const columns = [
    {
      title: '原厂代码',
      dataIndex: 'originalCode',
      align: 'center',
      width: 120,
    },
    {
      title: '原厂公司名称',
      dataIndex: 'originalCompanyName',
      align: 'center',
      width: 300,
    },
    {
      title: '代理品牌',
      align: 'center',
      dataIndex: 'agentBrand',
      width: 140,
    },
    {
      title: '国别',
      align: 'center',
      dataIndex: 'countryName',
      width: 140,
    },
    {
      title: '原厂地址',
      align: 'center',
      dataIndex: 'originalAddress',
      width:200
    },
    {
      title: '营业执照',
      dataIndex: 'businessLicenseDocId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value} />
    },
    {
      title: '委托代理书',
      dataIndex: 'powerAttorneyDocId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value} />
    }
  ].map(_ => ({ ..._, align: 'center' }))
  // 流程表格
  const purchaseColumns = [
    {
      title: '原厂代码',
      dataIndex: 'originalCode',
      align: 'center',
      width: 120,
    },
    {
      title: '修改后代码',
      dataIndex: 'newOriginalCode',
      align: 'center',
      width: 120,
    },
    {
      title: '原厂公司名称',
      dataIndex: 'originalCompanyName',
      align: 'center',
      width: 300,
    },
    {
      title: '修改后公司名称',
      dataIndex: 'newOriginalCompanyName',
      align: 'center',
      width: 300,
    },
    {
      title: '代理品牌',
      align: 'center',
      dataIndex: 'agentBrand',
      width: 140,
    },
    {
      title: '修改后代理品牌',
      align: 'center',
      dataIndex: 'newAgentBrand',
      width: 140,
    },
    {
      title: '国别',
      align: 'center',
      dataIndex: 'countryName',
      width: 140,
    },
    {
      title: '原厂地址',
      align: 'center',
      dataIndex: 'originalAddress',
    },
    {
      title: '营业执照',
      dataIndex: 'businessLicenseDocId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value} />
    },
    {
      title: '委托代理书',
      dataIndex: 'powerAttorneyDocId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value} />
    }
  ].map(_ => ({ ..._, align: 'center' }));
  const empty = selectRowKeys.length === 0;
  
  function getBankcodelist(val) {
    let supplierAgents = val.supplierAgents;
      if (supplierAgents === undefined) {
        supplierAgents = [];
      }else {
        supplierAgents = val.supplierAgents;
        supplierAgents.forEach(item => item.key = keys++);
        setDataSource(supplierAgents)
      }
  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys([]);
    setRows([]);
    setRowKeys(rowKeys);
    setRows(rows);
    console.log(selectRowKeys)
  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
  }
   // 新增
   function showModal() {
    let rowselect = [];
    setRows(rowselect);
    setInitialValue(rowselect)
    setEdit(false)
    agentModelRef.current.handleModalVisible(true)
  }
  // 编辑
  function handleEdit() {
    console.log(selectedRows)
    let newsagent;
    if (selectedRows.length > 1) {
      newsagent = selectedRows.splice(1);
    }else {
      newsagent = selectedRows
    }
    console.log(newsagent)
    //setDataSource(newsagent) 
    setEdit(true)
    const [row] = newsagent;
    setInitialValue({ ...row })
    agentModelRef.current.handleModalVisible(true);
  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    //tabformRef.current.remoteDataRefresh()
  }
  // 取消编辑或新增
  function handleCancel() {
    //const { resetFields } = commonFormRef.current.form;
    //resetFields()
    hideModal()
  }
  // 新增或编辑保存
  async function handleSubmit(val) {
    dataSource.map((item, index) => {
      if (item.key === val.key) {
        const copyData = dataSource.slice(0)
        copyData[index] = val;
        setDataSource(copyData)
      }
    })
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
    setDataSource(filterData)
  }
  // 数据处理
  function mergeData(formData) {
    const data = dataSource;
    const exist = data.find((value) => value.agentBrand === formData.agentBrand &&
      value.key !== formData.key);
    if (exist) {
      message.error("存在重复的代理品牌，请检查！");
      return false;
    }
    if (edit) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === formData.key) {
          data[i] = formData;
          break;
        }
      }
      setRows(formData)
    } else {
      formData.key = keys++;
      const newData = [...dataSource, formData];
      setDataSource(newData)
    }
    return true;
  }
  //暂存
  function agentTemporary() {
    const agentInfo = tabformRef.current.data;
    return agentInfo;
  }
  // 获取表单值
  function getAgentform() {
    const agentInfo = tabformRef.current.data;
    console.log(agentInfo)
    if (!agentInfo || agentInfo.length === 0) {
      return false;
    }
    return agentInfo;
  }
  // 设置所有表格参数
  const setHeaderFields = (fields) => {
    //const { attachmentId = null, ...fs } = fields;
    // setAttachment(attachmentId)
    // setFieldsValue(fs)
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
  const agentleft = (
    <>
        {
          authAction(
            <AuthButton className={styles.btn} disabled={empty} onClick={handleEdit}>删除</AuthButton>
          )
        }
    </>
  );
  return (
    <>
      <Header
        left={ headerInfo ? '' : agenthead ? agentleft :headerleft}
        advanced={false}
        extra={false}
      />
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={agenthead ? purchaseColumns :columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.key}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect={true}
            size='small'
            height={height}
            Modeltitle={Modeltitle}
            remotePaging={true}
            ellipsis={false}
            wrappedComponentRef={agentModelRef}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
            //{...dataSource}
          />
        }
      </AutoSizeLayout>
      <div>
        {agenthead ? 
          <AgentApprvoEditModal 
            visible={visible}
            onCancel={handleCancel}
            onOk={handleSubmit}
            type={modalType}
            initialValues={initialValue}
            CNCountryId={CNCountryId}
            wrappedComponentRef={agentModelRef}
            isView={isView}
            edit={edit}
            saveData={false}
            editData={editData}
            mergeData={mergeData}
            loading={loading}
            destroyOnClose
          />
        :
        <AgentInfoEditModal
          visible={visible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          type={modalType}
          initialValues={initialValue}
          CNCountryId={CNCountryId}
          wrappedComponentRef={agentModelRef}
          isView={isView}
          edit={edit}
          saveData={false}
          editData={editData}
          mergeData={mergeData}
          loading={loading}
          destroyOnClose
        />
      }
        
      </div>


    </>
  )
}
)
const CommonForm = create()(Agentformef)

export default CommonForm