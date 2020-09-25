/**
 * 实现功能： 高级查询表单组件
 * 使用说明见 README.md
 * auth: hezhi
 * version: 0.0.1
 * date: 2020-04-01
 */

import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Button, Row, Col, Form, Input, DatePicker, message } from 'antd';
import { ExtTable, WorkFlow, ExtModal, utils,ToolBar  } from 'suid';
import AutoSizeLayout from '@/components/AutoSizeLayout';
const { create } = Form;
const FormItem = Form.Item;

const PurchaseInfor = forwardRef(({
  form,
  editData = [],
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setDataSource(editData.supplierFinanceViews)
  }, [editData])
  const columns = [
    {
      title: '公司代码',
      dataIndex: 'corporationCode',
      align: 'center',
      width: 140,
    },
     {
        title: '公司名称',
        dataIndex: 'corporationName',
        align: 'center',
        width: 240,
      },
      {
        title: '采购组织代码',
        dataIndex: 'purchaseOrgCode',
        align: 'center',
        width: 200,
      },
      {
        title: '采购组织名称',
        dataIndex: 'purchaseOrgName',
        align: 'center',
        width: 240,
      },
      {
        title: '状态',
        align: 'center',
        dataIndex: '',
        width: 140,
        render: (text,blacklist,frozen) => {
          console.log(text)
          if (text.blacklist === true) {
            return  <span>黑名单</span>
          } else if(text.frozen === true && text.blacklist === false){
            return <span>冻结</span>
          } else if (text.blacklist === false && text.frozen === false) {
            return <span>正常</span>
          }
        }
      },
      {
        title: '方案冻结状态',
        align: 'center',
        dataIndex: 'planFrozen',
        width: 140,
        render: text => text === false ? "否" : "是"
      },
      {
        title: '报价冻结状态',
        align: 'center',
        dataIndex: 'offerFrozen',
        render: text => text === false ? "否" : "是"
      }, {
        title: '下单冻结状态',
        dataIndex: 'orderFrozen',
        align: 'center',
        width: 140,
        render: text => text === false ? "否" : "是"
      }, {
        title: '付款冻结状态',
        dataIndex: 'payFrozen',
        align: 'center',
        width: 140,
        render: text => text === false ? "否" : "是"
      }, {
        title: '付款条件',
        dataIndex: 'payCodition',
        align: 'center',
        width: 140,
      }, {
        title: '付款条件描述',
        dataIndex: 'payCoditionName',
        align: 'center',
        width: 240,
      },{
        title: '方案组',
        dataIndex: 'schemeGroupCode',
        align: 'center',
        width: 140
      }, {
        title: '币种代码',
        dataIndex: 'currencyCode',
        align: 'center',
        width: 140,
      }, {
        title: '币种名称',
        dataIndex: 'currencyName',
        align: 'center',
        width: 140
      }
  ].map(_ => ({ ..._, align: 'center' }))
  return (
    <>
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            rowKey={(item) => item.id}
            checkbox={false}
            allowCancelSelect
            pagination={{
              hideOnSinglePage: true,
              disabled: false,
              pageSize: 100,
             }}
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            dataSource={dataSource}
            //{...dataSource}
          />
        }
      </AutoSizeLayout>
    </>
  )
})

const CommonForm = create()(PurchaseInfor)

export default CommonForm