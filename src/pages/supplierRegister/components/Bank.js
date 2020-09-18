import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils, ToolBar } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '../SupplierAutoLayout';
import styles from './index.less';
import BankInfoModal from './BankInfoModal'
import { getMaxLineNum,getLineCode } from '@/utils/index';
import { SaveSupplierRegister, DetailSupplierRegister } from "@/services/supplierConfig"
import { getCNCountryIdInfo} from '../../../services/supplierRegister';
import UploadFile from '../../../components/Upload/index'
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
let lineCode = 1;
const Bankformef = forwardRef(({
  form,
  isView = false,
  editData = {},
  headerInfo
}, ref) => {
  useImperativeHandle(ref, () => ({
    getbankform,
    bankTemporary,
    setHeaderFields,
    form
  }));
  const tabformRef = useRef(null)
  const BankInfoRef = useRef(null)
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
    getCNCountryId();
  }, [editData])
  const columns = [
    {
      title: '行号',
      dataIndex: 'lineCode',
      align: 'center',
      width: 80
    },
    {
      title: '国家',
      dataIndex: 'countryName',
      align: 'center',
      width: 120,
    },
    {
      title: '省/地区',
      dataIndex: 'provinceName',
      align: 'center',
      width: 140,
    },
    {
      title: '市',
      align: 'center',
      dataIndex: 'regionName',
      width: 140,
    },
    {
      title: '银行编码',
      align: 'center',
      dataIndex: 'bankCode',
      width: 140,
    },
    {
      title: '银联号',
      align: 'center',
      dataIndex: 'unionpayCode',
    }, {
      title: 'SWIFT码',
      dataIndex: 'swift',
      align: 'center',
      width: 100,
    }, {
      title: '银行名称',
      dataIndex: 'bankName',
      align: 'center',
      width: 220,
    }, {
      title: '银行地址',
      dataIndex: 'bankAddress',
      align: 'center',
      width: 220,
    }, {
      title: '银行账号',
      dataIndex: 'bankAccount',
      align: 'center',
      width: 220,
    }, {
      title: '银行控制代码',
      dataIndex: 'paymentName',
      align: 'center',
      width: 120,
    }, {
      title: '银行户主',
      dataIndex: 'bankOwner',
      align: 'center',
      width: 220,
    },
    {
      title: '开户许可证',
      dataIndex: 'openingPermitId',
      align: 'center',
      width: 90,
      render: (value, record) => <UploadFile type="show" entityId={value}/>
    }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;
  // 获取国家ID
  async function getCNCountryId() {
    const { data,success, message: msg } = await getCNCountryIdInfo()
    if (success) {
      setCNCountryId(data)
      return
    }
  }
  function getBankcodelist(val) {
    let bankInfoVos;
    if (val) {
      if (val.bankInfoVos !== undefined) {
        bankInfoVos = val.bankInfoVos;
        bankInfoVos.forEach(item => item.key = keys++);
        //设置行号，取（最大值+1）为当前行号
        if (bankInfoVos.length > 0) {
          if (!isEmpty(bankInfoVos)) {
            console.log(bankInfoVos)
            bankInfoVos.forEach(item => {
              item.lineCode = getLineCode(lineCode++)
            })
          }
          let maxLineCode = getMaxLineNum(bankInfoVos);
          lineCode = maxLineCode ++;
          // keys = keys ++
          // console.log(lineCode)
          // console.log(keys)
        }
        setDataSource(bankInfoVos) 
      } 
    }

  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows); ;
     
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
    BankInfoRef.current.handleModalVisible(true)
  }
  // 编辑
  function handleEdit() {
    let newsbank;
    if (selectedRows.length > 1) {
      newsbank = selectedRows.splice(1);
    }else {
      newsbank = selectedRows
    }
    //setDataSource(newsbank) 
    console.log(newsbank)
    setEdit(true)
    const [row] = newsbank;
    setInitialValue({ ...row })
    BankInfoRef.current.handleModalVisible(true);
  }
  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    //tableRef.current.remoteDataRefresh()
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
    dataSource.map((item, index) => {
      if (item.key === val.key) {
        const copyData = dataSource.slice(0)
        copyData[index] = val;
        console.log()
        setDataSource(copyData)
        setRows(copyData)
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
    lineCode--;
    setDataSource(filterData)
  }
  // 数据处理
  function mergeData(formData) {
    const data = dataSource;
    const exist = data.find((value) => value.bankAccount === formData.bankAccount &&
      value.key !== formData.key);
    if (exist) {
      message.error("存在重复的银行账号，请检查！");
      return false;
    }
    if (edit) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === formData.key) {
          data[i] = formData;
          break;
        }
      }
      cleanSelectedRecord();
      //setRows(formData)
      //this.setState({selectedRows: [formData]})
    } else { 
      //生成行号
      dataSource.length === 0 ? '' : lineCode++;
      formData.lineCode = getLineCode(lineCode);
      formData.key = keys++;
      const newData = [...dataSource, formData];
      setDataSource(newData)
    }
    //如果不是变更，重排为连续的行号
    // if (!this.props.isModify) {
    //   for (let i = 0; i < data.length; i++) {
    //     data[i].lineCode = getLineCode(i);
    //   }
    // }
    //setDataSource(data)
    return true;
  }
  //暂存
  function bankTemporary() {
    const bankInfo = tabformRef.current.data;
    return bankInfo;
  }
  // 获取表单值
  function getbankform() {
    const bankInfo = tabformRef.current.data;
    if (!bankInfo || bankInfo.length === 0) {
      return false;
    }
    return bankInfo;
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
              authAction(
                <Button type='primary' ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={() => showModal()}>新增</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} onClick={() => handleEdit()} disabled={empty}>编辑</Button>
              )
            }
            {
              authAction(
                <Button ignore={DEVELOPER_ENV} key='' className={styles.btn} disabled={empty} onClick={handleRemove}>删除</Button>
              )
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
            allowCancelSelect={true}
            size='small'
            height={height}
            Modeltitle={Modeltitle}
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
        <BankInfoModal
          visible={visible}
          onCancel={handleCancel}
          onOk={handleSubmit}
          type={modalType}
          initialValues={initialValue}
          CNCountryId={CNCountryId}
          wrappedComponentRef={BankInfoRef}
          isView={isView}
          edit={edit}
          saveData={false}
          mergeData={mergeData}
          loading={loading}
          destroyOnClose
        />
        {/* <Modal
          visible={showAttach}
          onCancel={hideAttach}
          footer={
            <Button type='ghost' onClick={hideAttach}>关闭</Button>
          }
        ></Modal> */}
      </div>


    </>
  )
}
)
const CommonForm = create()(Bankformef)

export default CommonForm