import React, { useState, createRef, useLayoutEffect } from 'react';
import { ExtTable, DataImport, utils } from 'suid';
import { Button, Modal, message, Table, Radio } from 'antd'

import styles from './index.less';
const RadioGroup = Radio.Group;
const importColumns = [
  
]
function StrategyTable({
  loading = false,
  dataSource = [],
  onCreateLine = () => null,
  onRemove = () => null,
  onEditor = () => null,
  onImportData = () => null,
  onInvalidChange = () => null,
  type = 'add',
  headerForm = {}
}) {
  // const commonFormRef = createRef();
  // const [dataSource, setCount] = useState([
  //   {
  //     // key:1,
  //     id:'3300001999040445651',
  //     state: "SupplierName",
  //     Suppliercode: "517345",
  //     Suppliername: "统一社会信用代码",
  //     // unitName: {
  //     //   Mustlose: true,
  //     //   Nomustlose: false,
  //     //   hide: false,
  //     //   show: false,
  //     // },
  //     unitName: "Mustlose",
  //     changeable: false,
  //     details: '基础信息',
  //     Handler: "智能制造管理员",
  //     Handlertime:"2020-08-07 14:34:30"
  //   },
  //   {
  //     // key:2,
  //     id:'3300001990888445652',
  //     state: "SupplierName12",
  //     Suppliercode: "545632245",
  //     Suppliername: "用代码",
  //     unitName: "Nomustlose",
  //     changeable: true,
  //     details: '基础信息',
  //     Handler: "智能制造管理员",
  //     Handlertime:"2020-08-07 17:34:30"
  //   }
  // ]);

  function onRadio (index) {
    return (e) => {
      const copyData = dataSource.slice(0)
      copyData[index].unitName = e.target.value;
      //setCount(copyData)
      onEditor(copyData)
    }
  }

  const map = {
    a: 'Mustlose',
    b: 'Nomustlose',
    c: 'hide',
    d: 'show'
  }
  const columns = [
    {
      key:'materialClassificationCode',
      title: '字段代码',
      dataIndex: 'materialClassificationCode',
      fixed: true,
      width: 180,
    },
    {
      key:'materialClassificationName',
      title: '字段名称',
      dataIndex: 'materialClassificationName',
      width: 220,
    },
    {
      //key:'unitName',
      title: <span><label className="ant-form-item-required" title=""></label>操作</span>,
      dataIndex: 'state',
      render(text, data, index) {
        return (
          // <Radio.Group value={type === "detail" ? unitName : ''} options={plainOptions} onChange={RadioGroup(index)}></Radio.Group>
          <div>
            <RadioGroup value={type === "detail" ? '' : text} onChange={onRadio(index)} disabled={type === "detail"}>
              <Radio  value={map.a}>必输</Radio>
              <Radio  value={map.b}>选输</Radio>
              <Radio  value={map.c}>仅显示</Radio>
              <Radio  value={map.d}>不显示</Radio>
            </RadioGroup>
          </div>
        )
      },
      width: 320
    },
    {
      key:'lastEditorName',
      title: '信息分类',
      dataIndex: 'lastEditorName',
      width: 180
    }
  ].map(item => ({ ...item, align: 'center' }));
  const changeColumns = [...columns]
  
  function onChange(e) {
    console.log('radio checked', e.target.value);
  }

  return (
    <div>
      <div>
        <div>
          <ExtTable
            allowCancelSelect
            columns={columns}
            loading={loading}
            showSearch={false}
            dataSource={dataSource}
            checkbox={false}
            rowKey={(item)=>`row-${item.id}`}
          />
          {/* <Table
           columns={columns} 
           dataSource={dataSource} 
          /> */}
        </div>
      </div>
    </div>
  )
}

export default StrategyTable;
