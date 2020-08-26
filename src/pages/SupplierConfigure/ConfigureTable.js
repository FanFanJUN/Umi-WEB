import React, { useState, forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { ExtTable, DataImport, utils } from 'suid';
import { Form, Input, Radio, Icon } from 'antd'
import styles from './index.less';
const { Item, create } = Form;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const tabformRef = forwardRef(({
  form,
  loading = false,
  dataSource = [],
  onBlured = () => null,
  onEditor = () => null,
  type = 'add',
  headerForm = {}
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator } = form;
  const tableRef = useRef(null)
  const [configure, setConfigure] = useState([]);
  //const { attachment = null } = initialValue;
  function onRadio(data,index) {
    return (e) => {
      const tablereflist = tableRef.current.data;
      const selectData = tablereflist.slice(0)
      selectData[index] = data;
      console.log(selectData)
      selectData[index].operationCode = e.target.value;
      let selectindex = e.target.value;
      let selectName = selectindex;
      switch (selectName) {
        case '0':
          selectName = '必输'
          break;
        case '1':
          selectName = '选输'
          break;
        case '2':
          selectName = '仅显示'
          break;
        case '3':
          selectName = '不显示'
          break;
        default:
      }
      selectData[index].operationName = selectName;
      onEditor(selectData)
    }
  }
  function onInput(data, index) {
    return (e) => {
      const tablereflist = tableRef.current.data;
      const selectData = tablereflist.slice(0)
      selectData[index] = data;
      selectData[index].smSort = e.target.value;
      onBlured(selectData)
    }
  }
  const tableProps = {
    columns: [
      {
        key: 'fieldCode',
        title: '字段代码',
        dataIndex: 'fieldCode',
        fixed: true,
        width: 180,
        align: 'center'
      },
      {
        key: 'fieldName',
        title: '字段名称',
        dataIndex: 'fieldName',
        width: 220,
        align: 'center'
      },
      {
        //key:'operationCode',
        title: <span><label className="ant-form-item-required" title=""></label>操作</span>,
        dataIndex: 'operationCode',
        align: 'center',
        render(text, record, index) {
          return (
            <FormItem style={{ marginBottom: 0 }}>
              {
                getFieldDecorator(`operationCode[${index}]`, {
                  initialValue: record.operationCode,
                  rules: [{ required: true, message: '请选择执行操作', whitespace: true }],
                })(
                  <RadioGroup onChange={onRadio(record,index)} disabled={type === "detail"}>
                    <Radio value='0'>必输</Radio>
                    <Radio value='1'>选输</Radio>
                    <Radio value='2'>仅显示</Radio>
                    <Radio value='3'>不显示</Radio>
                  </RadioGroup>
                )
              }
            </FormItem>
          )
        },
        width: 320
      },
      {
        key: 'smMsgTypeCode',
        title: '信息分类',
        dataIndex: 'smMsgTypeCode',
        width: 180,
        align: 'center',
        required: true,
        render: (text, record, index) => {
          if (text === '1') {
            return <div>基本信息</div>;
          }else if (text === '2') {
            return <div>帐号信息</div>;
          }else if (text === '3') {
            return <div>业务信息</div>;
          }else if (text === '4') {
            return <div>供货信息</div>;
          }else if (text === '5') {
            return <div>泛虹信息</div>;
          }else if (text === '6') {
            return <div>资质信息</div>;
          }else if (text === '7') {
            return <div>授权委托人信息</div>;
          }else if (text === '8') {
            return <div>银行信息</div>;
          }else if (text === '9') {
            return <div>原厂信息</div>;
          }
          
        }
      },
      {
        title: <span><label className="ant-form-item-required" title=""></label>排序码</span>,
        dataIndex: 'smSort',
        align: 'center',
        required: true,
        render: (text, record, index) => {
          return <FormItem style={{ marginBottom: 0 }}>
            {
              getFieldDecorator(`smSort[${index}]`, {
                initialValue: record.smSort,
                rules: [{ required: true, message: '请输入排序码', whitespace: true }],
              })(
                <Input
                  disabled={type === "detail"}
                  placeholder='请输入排序码'
                  style={{ width: 180 }}
                  onChange={onInput(record, index)}
                />
              )
            }

          </FormItem>
        },
        width: 220
      }
    ],
    sort: {
      multiple: true,
      field: { smMsgTypeCode: 'asc', smSort: 'asc' },
    },
  }
  function handleCheck() {
    console.log(tableRef.current.data)
  }
  return (
    <div>
      <div>
        <div>
          <ExtTable
            allowCancelSelect
            // toolBar={{
            //   left: <div onClick={handleCheck}>查看</div>
            // }}
            //columns={columns}
            {...tableProps}
            loading={loading}
            showSearch={false}
            dataSource={dataSource}
            checkbox={false}
            ref={tableRef}
            // onTableRef={(ref)=>}
            rowKey={(item) => `row-${item.id}`}
          />
        </div>
      </div>
    </div>
  )
}
)
const StrategyTable = create()(tabformRef)
export default StrategyTable;
