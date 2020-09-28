import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, DataImport, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '../../supplierRegister/SupplierAutoLayout';
import styles from '../index.less';

import { getMaxLineNum,getLineCode } from '@/utils/index';
import { SaveSupplierRegister, DetailSupplierRegister } from "@/services/supplierConfig"
import { getCNCountryIdInfo} from '../../../services/supplierRegister';
import UploadFile from '../../../components/Upload/index'
import { onLineTarget } from '../../../../config/proxy.config';
import { baseUrl} from '../../../utils/commonUrl';
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

    form
  }));
  const tabformRef = useRef(null)
  const BankInfoRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [edit, setEdit] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [modalType, setModalType] = useState('add');
  const [showAttach, triggerShowAttach] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, triggerLoading] = useState(false);
  const [attachId, setAttachId] = useState('')


  const authorizations = storage.sessionStorage.get("Authorization");
  const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
  useEffect(() => {
    handleData(editData)
  }, [editData])
  const columns = [
    {
        title: '手机',
        dataIndex: 'supplierVo.mobile',
        ellipsis: true,
        width: 180,

      }, 
      {
        title: '邮箱',
        dataIndex: 'supplierVo.accountVo.email',
        ellipsis: true,
        width: 80,

      },
      {
        title: '供应商分类',
        dataIndex: 'supplierVo.supplierCategoryName',
        ellipsis: true,
        width: 120,

      },{
        title: '供应商名称',
        dataIndex: 'supplierVo.name',
        ellipsis: true,
        width: 120
      }, {
        title: '简称',
        dataIndex: 'supplierVo.abbreviation',
        ellipsis: true,
        width: 120,
      },
      {
        title: '统一社会信用代码',
        dataIndex: 'supplierVo.creditCode',
        ellipsis: true,
        width: 160,

      }, {
        title: '邓白氏码',
        dataIndex: 'supplierVo.dbCode',
        ellipsis: true,
        width: 180,

      },{
        title: '企业性质',
        dataIndex: 'supplierVo.enterprisePropertyName',
        ellipsis: true,
        width: 100,

      }, 
      {
        title: '业务标的物',
        dataIndex: 'supplierVo.belongIndustry',
        ellipsis: true,
        width: 180,
        render: (value, item, index) => {
          if (item.supplierVo) {
            return item.supplierVo.belongIndustryName
          }
        }
      },  {
        title: '国家代码',
        dataIndex: 'supplierVo.countryCode',
        ellipsis: true,
        width: 100,
      }, {
        title: '国家名称',
        dataIndex: 'supplierVo.countryName',
        ellipsis: true,
        width: 100,
      }, {
        title: '地区代码',
        dataIndex: 'supplierVo.registerProvinceCode',
        ellipsis: true,
        width: 80,
      }, {
        title: '地区名称',
        dataIndex: 'supplierVo.registerProvinceName',
        ellipsis: true,
        width: 100,
      }, {
        title: '城市代码',
        dataIndex: 'supplierVo.registerRegionCode',
        ellipsis: true,
        width: 160,
      }, {
        title: '城市名称',
        dataIndex: 'supplierVo.registerRegionName',
        ellipsis: true,
        width: 160,
      }, {
        title: '区县代码',
        dataIndex: 'supplierVo.registerDistrictCode',
        ellipsis: true,
        width: 160,
      }, {
        title: '区县名称',
        dataIndex: 'supplierVo.registerDistrictName',
        ellipsis: true,
        width: 160,
      }, {
        title: '邮编',
        dataIndex: 'supplierVo.postcode',
        ellipsis: true,
        width: 120,

      }, {
        title: '详细地址',
        dataIndex: 'supplierVo.registerStreet',
        ellipsis: true,
        width: 100,

      }, {
        title: '传真',
        dataIndex: 'supplierVo.fax',
        ellipsis: true,
        width: 120,

      },
      {
        title: '银行国家',
        dataIndex: 'countryName',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].countryName
          }
        }
      }, {
        title: '银行地区',
        dataIndex: 'provinceName',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].provinceName
          }
        }
      }, {
        title: '银行城市',
        dataIndex: 'regionName',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].regionName
          }
        }
      },{
        title: '银行编码',
        dataIndex: 'bankCode',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].bankCode
          }
        }
      }, {
        title: '联行号',
        dataIndex: 'unionpayCode',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].unionpayCode
          }
        }
      }, {
        title: 'SWIFT码',
        dataIndex: 'swift',
        ellipsis: true,
        width: 80,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].swift
          }
        }
      }, {
        title: '银行名称',
        dataIndex: 'bankName',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].bankName
          }
        }
      }, {
        title: '银行账号',
        dataIndex: 'bankAccount',
        ellipsis: true,
        width: 100,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].bankAccount
          }
        }
      }, {
        title: '银行控制代码',
        dataIndex: 'paymentCode',
        ellipsis: true,
        width: 120,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].paymentCode
          }
        }
      }, {
        title: '银行户主',
        dataIndex: 'bankOwner',
        ellipsis: true,
        width: 120,
        render: (value, item, index) => {
          if (item.bankInfoVos && item.bankInfoVos.length > 0) {
            return item.bankInfoVos[0].bankOwner
          }
        }
      }, 
      {
        title: '扩展公司代码',
        dataIndex: 'corporationCode',
        ellipsis: true,
        width: 120,
      },
      {
        title: '扩展采购组织代码',
        dataIndex: 'purchaseOrgCode',
        ellipsis: true,
        width: 160,
      },
      {
        title: '付款条件',
        dataIndex: 'payCodition',
        ellipsis: true,
        width: 80,

      }, {
        title: '方案组',
        dataIndex: 'schemeGroupCode',
        ellipsis: true,
        width: 80,
      },
      {
        title: '币种',
        dataIndex: 'currencyCode',
        ellipsis: true,
        width: 80,
      }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;

  function handleData(val) {
    console.log(val)
    if (val && val.length > 0) {
      val.forEach(item => item.key = keys++);
      console.log(val)
      setDataSource(val) 
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
  

  // 删除
  async function handleEdit() {
   // const filterData = dataSource.filter(item => item.key !== selectedRows[0].key);
    lineCode--;
    //setDataSource(filterData)
  }
  function getArrMatching(arr1, arr2) {
    return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    })
  }
 const validateItem = (data) => {
    //console.log(data)
    // data = data.map(item => ({...item, recordCheckList: item.recordCheckList === '是'}))
    // return new Promise((resolve, reject) => {
    //   JudgeTheListOfRestrictedMaterials(data).then(res => {
    //     const response = res.data.map(item => ({
    //       ...item,
    //       validate: item.importResult,
    //       status: item.importResult ? '数据完整' : '失败',
    //       statusCode: item.importResult ? 'success' : 'error',
    //       message: item.importResult ? '成功' : item.importResultInfo
    //     }));
    //     resolve(response);
    //   }).catch(err => {
    //     reject(err)
    //   })
    // });
  };
//   const importFunc = (value) => {
//     SaveTheListOfRestrictedMaterials(value).then(res => {
//       if (res.success) {
//         tableRef.current.remoteDataRefresh();
//       } else {
//         message.error(res.message)
//       }
//     });
//   };
  const headerleft = (
    <>
      {
        <DataImport
            className={styles.btn}
            tableProps={{
                columns,
                showSearch: false,
                allowCustomColumns: false
            }}
            validateAll={true}
            validateFunc={validateItem}
            //importFunc={importFunc}
        />
      }
      {
        <AuthButton className={styles.btn} onClick={() => handleEdit()} disabled={empty} >删除</AuthButton>
      }
      {
        <AuthButton className={styles.btn} 
        href={host + "/srm-sm-web/supplier/downloadSupplierTemplate?userAccount=" + authorizations.account} key="download"
        >模版下载</AuthButton>
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
        <ExtTable
            columns={columns}
            showSearch={false}
            ref={tabformRef}
            rowKey={(item) => item.key}
            checkbox={{
              multiSelect: true
            }}
            pagination={{
              hideOnSinglePage: true,
              disabled: false,
              pageSize: 100,
            }}
            allowCancelSelect={true}
            size='small'
            remotePaging={true}
            ellipsis={false}
            saveData={false}
            onSelectRow={handleSelectedRows}
            selectedRowKeys={selectRowKeys}
            dataSource={dataSource}
            //{...dataSource}
          />
    </>
  )
}
)
const CommonForm = create()(Bankformef)

export default CommonForm