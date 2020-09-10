import React, { useState, useRef, useEffect } from 'react';
import { ExtTable, WorkFlow, ExtModal, utils,ToolBar  } from 'suid';
import { Input, Button, message, Checkbox } from 'antd';
import { openNewTab, getFrameElement } from '@/utils';
import Header from '@/components/Header';
//import AdvancedForm from '@/components/AdvancedForm';
import AutoSizeLayout from '@/components/AutoSizeLayout';
import styles from './index.less';
import { smBaseUrl} from '@/utils/commonUrl';
import {queryStrategyTableList} from "@/services/supplierConfig"
const DEVELOPER_ENV = process.env.NODE_ENV === 'development'
const { Search } = Input
const { authAction, storage } = utils;
let editData;
function PurchaseInfor() {
  const [dataSource, setDataSource] = useState([]);
  const [onlyMe, setOnlyMe] = useState(true);
  const [selectedRows, setRows] = useState([]);


  const columns = [
    {
        title: '公司名称',
        dataIndex: 'corporationName',
        align: 'center',
        width: 180,
      },
      {
        title: '采购组织代码',
        dataIndex: 'purchaseOrgCode',
        align: 'center',
        width: 240,
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
        // dataIndex: 'regionName',
        width: 140,
        render: (text,blacklist,frozen) => {
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


  useEffect(() => {
    setDataSource(editData)
  }, [editData]);
  
  return (
    <>
      <AutoSizeLayout>
        {
          (height) => <ExtTable
            columns={columns}
            showSearch={false}
            rowKey={(item) => item.id}
            checkbox={{
              multiSelect: false
            }}
            allowCancelSelect
            size='small'
            height={height}
            remotePaging={true}
            ellipsis={false}
            //dataSource={dataSource}
            {...dataSource}
          />
        }
      </AutoSizeLayout>
    </>
  )
}

export default PurchaseInfor
