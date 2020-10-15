import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, DataImport, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal, Upload } from 'antd';
import { openNewTab, getFrameElement, isEmpty } from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '../../supplierRegister/SupplierAutoLayout';
import styles from '../index.less';

import { Importvalidity } from '../../../services/ImportSupplier';
import UploadFile from '../../../components/Upload/index'
import { onLineTarget } from '../../../../config/proxy.config';
import { baseUrl } from '../../../utils/commonUrl';
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
let lineCode = 1;
let obj = {};
const Bankformef = forwardRef(({
  form,
  editData = {},
  headerInfo,
  isEdit,
  isView
}, ref) => {
  useImperativeHandle(ref, () => ({
    getImportDate,
    form
  }));
  const tabformRef = useRef(null)
  const [dataSource, setDataSource] = useState([]);
  const [selectRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [savedata, setsavedata] = useState([]);
  const authorizations = storage.sessionStorage.get("Authorization");
  const host = process.env.NODE_ENV === 'production' ? '' : onLineTarget;
  useEffect(() => {
    handleData(editData)
  }, [editData])
  // 新增导入表单
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
    {
      title: '供应商分类',
      dataIndex: 'supplierCategory',
      ellipsis: true,
      width: 120,

    },
    {
      title: '供应商名称',
      dataIndex: 'name',
      ellipsis: true,
      width: 120
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'creditCode',
      ellipsis: true,
      width: 160,

    },
    {
      title: '邓白氏码',
      dataIndex: 'dbCode',
      ellipsis: true,
      width: 180,

    },
    {
      title: '简称',
      dataIndex: 'searchCondition',
      ellipsis: true,
      width: 120,
    },

    {
      title: '企业性质',
      dataIndex: 'enterprisePropertyName',
      ellipsis: true,
      width: 100,

    },
    {
      title: '邮编',
      dataIndex: 'postcode',
      ellipsis: true,
      width: 120,

    },
    {
      title: '注册国家代码',
      dataIndex: 'countryCode',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册国家名称',
      dataIndex: 'countryName',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册省代码',
      dataIndex: 'registerProvinceCode',
      ellipsis: true,
      width: 80,
    }, {
      title: '注册省名称',
      dataIndex: 'registerProvinceName',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册市代码',
      dataIndex: 'registerRegionCode',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册市名称',
      dataIndex: 'registerRegionName',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册区县代码',
      dataIndex: 'registerDistrictCode',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册区县名称',
      dataIndex: 'registerDistrictName',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册详细地址',
      dataIndex: 'registerStreet',
      ellipsis: true,
      width: 100,

    }, {
      title: '传真',
      dataIndex: 'fax',
      ellipsis: true,
      width: 120,

    },
    {
      title: '银行所在国家',
      dataIndex: 'bankCountry',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankCountry
      //   }
      // }
    },
    {
      title: '银行编码',
      dataIndex: 'bankCode',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankCode
      //   }
      // }
    },
    {
      title: '银行账户',
      dataIndex: 'bankAccount',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankAccount
      //   }
      // }
    },
    {
      title: '银行名称',
      dataIndex: 'bankName',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankName
      //   }
      // }
    },
    {
      title: '银行户主',
      dataIndex: 'bankOwner',
      ellipsis: true,
      width: 120,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankOwner
      //   }
      // }
    },
    {
      title: 'SWIFT码',
      dataIndex: 'swift',
      ellipsis: true,
      width: 80,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].swift
      //   }
      // }
    },
    {
      title: '银联行号',
      dataIndex: 'unionpayCode',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].unionpayCode
      //   }
      // }
    },
    {
      title: '银行地区',
      dataIndex: 'bankArea',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankArea
      //   }
      // }
    }, {
      title: '银行城市',
      dataIndex: 'bankCity',
      ellipsis: true,
      width: 100,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankCity
      //   }
      // }
    }, {
      title: '银行控制代码',
      dataIndex: 'bankPayment',
      ellipsis: true,
      width: 120,
      // render: (value, item, index) => {
      //   if (item.bankInfoVos && item.bankInfoVos.length > 0) {
      //     return item.bankInfoVos[0].bankPayment
      //   }
      // }
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
  // 编辑导入表单
  const columnsedit = [
    {
      title: '手机',
      dataIndex: 'supplierVo.accountVo.mobile',
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

    },
    {
      title: '供应商名称',
      dataIndex: 'supplierVo.name',
      ellipsis: true,
      width: 120
    },
    {
      title: '统一社会信用代码',
      dataIndex: 'supplierVo.creditCode',
      ellipsis: true,
      width: 160,

    },
    {
      title: '邓白氏码',
      dataIndex: 'supplierVo.dbCode',
      ellipsis: true,
      width: 180,

    },
    {
      title: '简称',
      dataIndex: 'supplierVo.abbreviation',
      ellipsis: true,
      width: 120,
    },

    {
      title: '企业性质',
      dataIndex: 'supplierVo.enterprisePropertyName',
      ellipsis: true,
      width: 100,

    },
    {
      title: '邮编',
      dataIndex: 'supplierVo.postcode',
      ellipsis: true,
      width: 120,

    },
    {
      title: '注册国家代码',
      dataIndex: 'supplierVo.countryCode',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册国家名称',
      dataIndex: 'supplierVo.countryName',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册省代码',
      dataIndex: 'supplierVo.registerProvinceCode',
      ellipsis: true,
      width: 80,
    }, {
      title: '注册省名称',
      dataIndex: 'supplierVo.registerProvinceName',
      ellipsis: true,
      width: 100,
    }, {
      title: '注册市代码',
      dataIndex: 'supplierVo.registerRegionCode',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册市名称',
      dataIndex: 'supplierVo.registerRegionName',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册区县代码',
      dataIndex: 'supplierVo.registerDistrictCode',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册区县名称',
      dataIndex: 'supplierVo.registerDistrictName',
      ellipsis: true,
      width: 160,
    }, {
      title: '注册详细地址',
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
      title: '银行所在国家',
      dataIndex: 'countryName',
      ellipsis: true,
      width: 100,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].countryName
        }
      }
    },
    {
      title: '银行编码',
      dataIndex: 'bankCode',
      ellipsis: true,
      width: 100,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].bankCode
        }
      }
    },
    {
      title: '银行账户',
      dataIndex: 'bankAccount',
      ellipsis: true,
      width: 100,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].bankAccount
        }
      }
    },
    {
      title: '银行名称',
      dataIndex: 'bankName',
      ellipsis: true,
      width: 100,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].bankName
        }
      }
    },
    {
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
      title: 'SWIFT码',
      dataIndex: 'swift',
      ellipsis: true,
      width: 80,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].swift
        }
      }
    },
    {
      title: '银联行号',
      dataIndex: 'unionpayCode',
      ellipsis: true,
      width: 100,
      render: (value, item, index) => {
        if (item.bankInfoVos && item.bankInfoVos.length > 0) {
          return item.bankInfoVos[0].unionpayCode
        }
      }
    },
    {
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
    },
    {
      title: '扩展公司代码',
      dataIndex: 'supplierFinanceView.corporationCode',
      ellipsis: true,
      width: 120,
    },
    {
      title: '扩展采购组织代码',
      dataIndex: 'supplierFinanceView.purchaseOrgCode',
      ellipsis: true,
      width: 160,
    },
    {
      title: '付款条件',
      dataIndex: 'supplierFinanceView.payCodition',
      ellipsis: true,
      width: 80,
    }, {
      title: '方案组',
      dataIndex: 'supplierFinanceView.schemeGroupCode',
      ellipsis: true,
      width: 80,
    },
    {
      title: '币种',
      dataIndex: 'supplierFinanceView.currencyCode',
      ellipsis: true,
      width: 80,
    }
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
    if (savedata.length === 0) {
      return false;
    }
    return { supplierInfoVos: savedata };

  }
  // 记录列表选中
  function handleSelectedRows(rowKeys, rows) {
    setRowKeys(rowKeys);
    setRows(rows);;

  }
  // 清除选中项
  function cleanSelectedRecord() {
    setRowKeys([]);
    setRows([]);
  }


  // 清空列选择并刷新
  function uploadTable() {
    cleanSelectedRecord()
    tabformRef.current.remoteDataRefresh()
  }

  // 删除
  async function handleEdit() {
    let filterData = getArrMatching(dataSource, selectedRows);
    setDataSource(filterData)
    uploadTable();
  }
  function getArrMatching(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
      return arr.indexOf(v) === arr.lastIndexOf(v);
    })
  }
  // 导入数据效验
  const validateItem = (data) => {
    let importdata = data, response,validitydata = [];
    return new Promise((resolve, reject) => {
      Importvalidity(data).then(res => {
        importdata.forEach((item, indexs) => {
          if (res.data.errStatus === '1') {
            res.data.msgs.map((items, index) => {
              if (indexs === index) {
                let obj = {
                  ...item,
                  key: index,
                  validate: false,
                  status: '失败',
                  statusCode: 'error',
                  message: items
                }
                validitydata.push(obj)
                response = validitydata
              }
            })
          }else {
            res.data.infos.map((items,index) => {
              if (indexs === index) {
                let obj = {
                  ...item,
                  key: index,
                  validate: items.error === '' ? true : false,
                  status: items.error === '' ? '数据完整' : '失败',
                  statusCode: items.error === '' ? 'success' : 'error',
                  message: items.error === '' ? '成功' : items.error
                }
                validitydata.push(obj)
                response = validitydata
              }
            })
            res.data.infos.map((items,index) => {
              if (items.error === '') {
                const supplierInfo = res.data.supplierInfoVos.map((info, index) => ({
                  ...info,
                  key: index,
                }))
                setsavedata(supplierInfo)
              }
            })
          }
          resolve(response)
        })
      }).catch(err => {
        reject(err)
      })
    });
  };
  // 导入
  const importFunc = (value) => {
    console.log(value)
    if (isEdit) {
      setDataSource(savedata)
    } else {
      setDataSource(value)
    }

  };
  function deWeightFour(repeatdata) {
    var result = [];
    var obj = {};
    for (var i = 0; i < repeatdata.length; i++) {
      if (!obj[repeatdata[i].phone]) {
        result.push(repeatdata[i]);
        obj[repeatdata[i].phone] = true;
      }
    }
    return result
  }
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
          validateAll={true}
          validateFunc={validateItem}
          importFunc={importFunc}
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
      <Header style={{ display: headerInfo === true ? 'none' : 'block', color: 'red' }}
        left={headerInfo ? '' : headerleft}
        advanced={false}
        extra={false}
      />
      {isView ? <ExtTable
        columns={isEdit ? columnsedit : columns}
        showSearch={false}
        ref={tabformRef}
        rowKey={(item) => item.key}
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
      /> : <ExtTable
          columns={isEdit ? columnsedit : columns}
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

      }
    </>
  )
}
)
const CommonForm = create()(Bankformef)

export default CommonForm