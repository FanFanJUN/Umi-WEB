import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, DataImport, utils, ToolBar,AuthButton  } from 'suid';
import { Form, Button, message, Checkbox, Modal,Upload } from 'antd';
import { openNewTab, getFrameElement ,isEmpty} from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '../../supplierRegister/SupplierAutoLayout';
import styles from '../index.less';

import { Importvalidity} from '../../../services/ImportSupplier';
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
    getImportDate,
    form
  }));
  const tabformRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  
  const authorizations = storage.sessionStorage.get("Authorization");
  const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
  useEffect(() => {
    handleData(editData)
  }, [editData])
  const columns = [
    {
        title: '手机',
        dataIndex: 'phone',
        ellipsis: true,
        width: 180,

      }, 
      {
        title: '邮箱',
        dataIndex: 'email',
        ellipsis: true,
        width: 80,

      },
    //   {
    //     title: '供应商分类',
    //     dataIndex: 'supplierVo.supplierCategory',
    //     ellipsis: true,
    //     width: 120,

    //   },
    //   {
    //     title: '供应商名称',
    //     dataIndex: 'supplierVo.name',
    //     ellipsis: true,
    //     width: 120
    //   },
    //   {
    //     title: '统一社会信用代码',
    //     dataIndex: 'supplierVo.creditCode',
    //     ellipsis: true,
    //     width: 160,

    //   },
    //   {
    //     title: '邓白氏码',
    //     dataIndex: 'supplierVo.dbCode',
    //     ellipsis: true,
    //     width: 180,

    //   },
    //   {
    //     title: '简称',
    //     dataIndex: 'supplierVo.searchCondition',
    //     ellipsis: true,
    //     width: 120,
    //   },
      
    //   {
    //     title: '企业性质',
    //     dataIndex: 'supplierVo.enterprisePropertyName',
    //     ellipsis: true,
    //     width: 100,

    //   }, 
    //   {
    //     title: '邮编',
    //     dataIndex: 'supplierVo.postcode',
    //     ellipsis: true,
    //     width: 120,

    //   },
    //  {
    //     title: '注册国家代码',
    //     dataIndex: 'supplierVo.countryCode',
    //     ellipsis: true,
    //     width: 100,
    //   }, {
    //     title: '注册国家名称',
    //     dataIndex: 'supplierVo.countryName',
    //     ellipsis: true,
    //     width: 100,
    //   }, {
    //     title: '注册省代码',
    //     dataIndex: 'supplierVo.registerProvinceCode',
    //     ellipsis: true,
    //     width: 80,
    //   }, {
    //     title: '注册省名称',
    //     dataIndex: 'supplierVo.registerProvinceName',
    //     ellipsis: true,
    //     width: 100,
    //   }, {
    //     title: '注册市代码',
    //     dataIndex: 'supplierVo.registerRegionCode',
    //     ellipsis: true,
    //     width: 160,
    //   }, {
    //     title: '注册市名称',
    //     dataIndex: 'supplierVo.registerRegionName',
    //     ellipsis: true,
    //     width: 160,
    //   }, {
    //     title: '注册区县代码',
    //     dataIndex: 'supplierVo.registerDistrictCode',
    //     ellipsis: true,
    //     width: 160,
    //   }, {
    //     title: '注册区县名称',
    //     dataIndex: 'supplierVo.registerDistrictName',
    //     ellipsis: true,
    //     width: 160,
    //   },  {
    //     title: '注册详细地址',
    //     dataIndex: 'supplierVo.registerStreet',
    //     ellipsis: true,
    //     width: 100,

    //   }, {
    //     title: '传真',
    //     dataIndex: 'supplierVo.fax',
    //     ellipsis: true,
    //     width: 120,

    //   },
    //   {
    //     title: '银行所在国家',
    //     dataIndex: 'bankCountry',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankCountry
    //       }
    //     }
    //   },
    //   {
    //     title: '银行编码',
    //     dataIndex: 'bankCode',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankCode
    //       }
    //     }
    //   }, 
    //   {
    //     title: '银行账户',
    //     dataIndex: 'bankAccount',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankAccount
    //       }
    //     }
    //   },
    //   {
    //     title: '银行名称',
    //     dataIndex: 'bankName',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankName
    //       }
    //     }
    //   }, 
    //   {
    //     title: '银行户主',
    //     dataIndex: 'bankOwner',
    //     ellipsis: true,
    //     width: 120,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankOwner
    //       }
    //     }
    //   }, 
    //   {
    //     title: 'SWIFT码',
    //     dataIndex: 'swift',
    //     ellipsis: true,
    //     width: 80,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].swift
    //       }
    //     }
    //   },
    //   {
    //     title: '银联行号',
    //     dataIndex: 'unionpayCode',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].unionpayCode
    //       }
    //     }
    //   },
    //    {
    //     title: '银行地区',
    //     dataIndex: 'bankArea',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankArea
    //       }
    //     }
    //   }, {
    //     title: '银行城市',
    //     dataIndex: 'bankCity',
    //     ellipsis: true,
    //     width: 100,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankCity
    //       }
    //     }
    //   }, {
    //     title: '银行控制代码',
    //     dataIndex: 'bankPayment',
    //     ellipsis: true,
    //     width: 120,
    //     render: (value, item, index) => {
    //       if (item.bankInfoVos && item.bankInfoVos.length > 0) {
    //         return item.bankInfoVos[0].bankPayment
    //       }
    //     }
    //   }, 
    //   {
    //     title: '扩展公司代码',
    //     dataIndex: 'cors',
    //     ellipsis: true,
    //     width: 120,
    //   },
    //   {
    //     title: '扩展采购组织代码',
    //     dataIndex: 'cgcode',
    //     ellipsis: true,
    //     width: 160,
    //   },
    //   {
    //     title: '付款条件',
    //     dataIndex: 'payConditionCode',
    //     ellipsis: true,
    //     width: 80,

    //   }, {
    //     title: '方案组',
    //     dataIndex: 'schemeGroupCode',
    //     ellipsis: true,
    //     width: 80,
    //   },
    //   {
    //     title: '币种',
    //     dataIndex: 'currencyCode',
    //     ellipsis: true,
    //     width: 80,
    //   }
  ].map(_ => ({ ..._, align: 'center' }))
  const empty = selectRowKeys.length === 0;

  function handleData(val) {
    if (val && val.length > 0) {
      val.forEach(item => item.key = keys++);
      setDataSource(val) 
    }
  }
  // 表单
  function getImportDate() {
    const dataInfo = tabformRef.current.data;
    if (!dataInfo || dataInfo.length === 0) {
      return false;
    }
    return dataInfo;
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
    console.log(data)
    //data = data.map(item => ({...item, recordCheckList: item.recordCheckList === '是'}))
    // return new Promise((resolve, reject) => {
    //   Importvalidity(data).then(res => {
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
  const importFunc = (value) => {
    console.log(value)
    // Importvalidity(value).then(res => {
    //   if (res.success) {
    //       message.success('导入成功');
    //   } else {
    //       message.error(res.message)
    //   }
    // });
  };
  function fileUpload({file}) {
    console.log({file})
    // if (file.status === 'done') {
    //   let result = file.response ? file.response : {};
    //   let baseResult = result['baseResult'];
    //   if (result.infoVos && result.infoVos.length > 0) {
    //     let supplierData = result['infoVos'];
    //     let i = 0;
    //     supplierData.forEach(item => {
    //       item.key = i++;
    //     });
    //     this.setState({supplierData})
    //     if (result.baseResult.length > 0) {
    //       Modal.success({
    //         title: '基础信息导入结果',
    //         key: 'baseResult',
    //         width: window.innerWidth * 0.8,
    //         content: baseResult ? baseResult.map(msg => <p>{msg}</p>) : "没有新增信息",
    //       });
    //     }
    //   } else {
    //     Modal.success({
    //       title: '基础信息导入结果',
    //       key: 'baseResult',
    //       width: window.innerWidth * 0.8,
    //       content: baseResult ? baseResult.map(msg => <p>{msg}</p>) : "没有新增信息",
    //     });
    //   }
    // }
  }
  function getHeaders() {
    let auth;
    console.log(auth)
    try {
     //auth = JSON.parse(localStorage.getItem('Authorization'));
      auth = storage.sessionStorage.get("Authorization")
    } catch (e) {

    }
    return {
      'Authorization': auth ? (auth.accessToken ? auth.accessToken : '') : ''
    }
  };
  function beforeUpload(file) {
    console.log(file)
    const xsl = file.name.toLocaleLowerCase().includes('xls') || file.name.includes('xlsx');
    if (!xsl) {
      message.error('必须上传模版文件');
      return false
    }
    //this.props.show();
    return xsl
  };
  const headerleft = (
    <>
      {
        <DataImport
          className={styles.btn}
          tableProps={{
              columns,
              showSearch: false,
              //allowCustomColumns: false
          }}
          importData={console.log}
          validateAll={true}
          validateData={validateItem}
          importFunc={importFunc}
        />
        
      }
      {/* {
        <Upload
          key="importSupplier"
          action={"/srm-sm-web" + "/supplierSelf/importSupplierList"}
          onChange={fileUpload}
          headers={getHeaders()}
          beforeUpload={beforeUpload}
          showUploadList={false}
        >
          <Button >导入</Button>
        </Upload>
      } */}
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