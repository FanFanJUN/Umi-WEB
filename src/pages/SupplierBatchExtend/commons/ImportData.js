import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle } from 'react';
import { ExtTable, DataImport, utils, ToolBar, AuthButton } from 'suid';
import { Form, Button, message, Checkbox, Modal, Upload } from 'antd';
import Header from '@/components/Header';
import AutoSizeLayout from '../../supplierRegister/SupplierAutoLayout';
import styles from '../index.less';
import { Importvalidity } from '../../../services/SupplierBatchExtend';
import { onLineTarget } from '../../../../config/proxy.config';
const DEVELOPER_ENV = (process.env.NODE_ENV === 'development').toString()
const { create } = Form;
const { authAction, storage } = utils;
let keys = 1;
const Importformef = forwardRef(({
  form,
  editData = {},
  headerInfo,
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
      title: '供应商代码',
      dataIndex: 'supplierCode',
      ellipsis: true,
      width: 120,
    }, {
      title: '供应商名称',
      dataIndex: 'supplierName',
      ellipsis: true,
      width: 120,
    }, {
      title: '公司代码',
      dataIndex: 'corporationCode',
      ellipsis: true,
      width: 120,
    }, {
      title: '公司名称',
      dataIndex: 'corporationName',
      ellipsis: true,
      width: 120,
    }, {
      title: '采购组织代码',
      dataIndex: 'purchaseOrgCode',
      ellipsis: true,
      width: 120,
    },
    {
      title: '采购组织名称',
      dataIndex: 'purchaseOrgName',
      ellipsis: true,
      width: 120,
    },
    {
      title: '付款条件代码',
      dataIndex: 'payCodition',
      ellipsis: true,
      width: 160,
    },
    {
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
    },
    // {
    //   title: '币种名称',
    //   dataIndex: 'currencyName',
    //   ellipsis: true,
    //   width: 80,
    // }
  ].map(_ => ({ ..._, align: 'center' }))
  // 编辑导入表单
  const empty = selectRowKeys.length === 0;

  function handleData(val) {
    if (val && val.length > 0) {
      val.forEach(item => item.key = keys++);
      setDataSource(val)
    }
  }
  // 表单
  function getImportDate() {
    if (dataSource.length === 0) {
      return false;
    }
    return { supplierFinanceViews: dataSource };
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
    let importdata = data, response, validitydata = [];
    return new Promise((resolve, reject) => {
      Importvalidity(data).then(res => {
        if (res.data.errStatus === 0) {
          res.data.supplierInfoVos.forEach((item, index) => {
            res.data.infos.map((items, indexs) => {
              if (index === indexs) {
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
          })
          res.data.infos.map((items, index) => {
            if (items.error === '') {
              const supplierInfo = res.data.supplierInfoVos.map((info, index) => ({
                ...info,
                key: index,
              }))
              setsavedata(supplierInfo)
            }
          })
        } else {
          importdata.forEach((item, indexs) => {
            let obj = {
              ...item,
              key: indexs,
              validate: false,
              status: '失败',
              statusCode: 'error',
              message: res.data.msgs[0]
            }
            validitydata.push(obj)
            response = validitydata
          })
        }
        resolve(response)
      }).catch(err => {
        //reject(err)
      })
    });
  };
  // 导入
  const importFunc = (value) => {
    setDataSource(value)

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
          href={host + "/srm-sm-web/supplierFinanceViewProcess/downloadFinanceViewTemplate?userAccount=" + authorizations.account} key="download"
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
        columns={columns}
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

      }
    </>
  )
}
)
const CommonForm = create()(Importformef)

export default CommonForm