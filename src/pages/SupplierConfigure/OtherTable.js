import React, { useState, forwardRef,useImperativeHandle, useLayoutEffect } from 'react';
import { ExtTable, DataImport, utils } from 'suid';
import { Form,Input, Radio } from 'antd'
import styles from './index.less';
const { Item, create } = Form;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;

const tabformRef = forwardRef(({
  form,
  loading = false,
  dataSource = [],
  handblurcode = () => null,
  onEditor = () => null,
  type = 'add',
  headerForm = {}
}, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { getFieldDecorator, getFieldValue } = form;
  const [configure, setConfigure] = useState([]);
  //const { attachment = null } = initialValue;
  function onRadio (index) {
    return (e) => {
      const copyData = dataSource.slice(0)
      copyData[index].operationCode = e.target.value;
      let selectindex =  e.target.value;
      let selectName = selectindex;
      switch(selectName){
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
      copyData[index].operationName = selectName;
      onEditor(copyData)
    }
  }
  function onInput(data,index) {
    return (e) => {
      const copyData = dataSource.slice(0)
      copyData[index].smSort = e.target.value;
      handblurcode(copyData)
    }
  }
  const tableProps = {
    columns: [
      {
        key:'fieldCode',
        title: '字段代码',
        dataIndex: 'fieldCode',
        fixed: true,
        width: 180,
        align: 'center'
      },
      {
        key:'fieldName',
        title: '字段名称',
        dataIndex: 'fieldName',
        width: 220,
        align: 'center'
      },
      {
        //key:'unitName',
        title: <span><label className="ant-form-item-required" title=""></label>操作</span>,
        dataIndex: 'operationCode',
        align: 'center',
        render(text, record, index) {
          return (
            <FormItem style={ {marginBottom: 0}}>
              {
                  getFieldDecorator(`operationCode[${index}]`, {
                    initialValue: record.operationCode,
                    rules: [{required: true, message: '请选择执行操作', whitespace: true}],
                  })(
                    <RadioGroup value={type === "detail" ? '': text} onChange={onRadio(index)} disabled={type === "detail"}>
                      <Radio  value='0'>必输</Radio>
                      <Radio  value='1'>选输</Radio>
                      <Radio  value='2'>仅显示</Radio>
                      <Radio  value='3'>不显示</Radio>
                    </RadioGroup>
                  )
                }
            </FormItem>
          )
        },
        width: 320
      },
      {
        key:'smMsgTypeName',
        title: '信息分类',
        dataIndex: 'smMsgTypeName',
        width: 180,
        align: 'center'
      },
      {
        title: <span><label className="ant-form-item-required" title=""></label>排序码</span>,
        dataIndex: 'smSort',
        align: 'center',
        render:(text, record, index) => {
          return  <FormItem style={ {marginBottom: 0} }>
          {
            getFieldDecorator(`smSort[${index}]`, {
              initialValue: record.smSort,
              rules: [{required: true, message: '请输入排序码', whitespace: true}],
            })(
              <Input 
                disabled={type === "detail"} 
                placeholder='请输入排序码' 
                style={{ width: 180 }} 
                onBlur={onInput(record,index)}
              />
            )
          }
        </FormItem>
        },
        width: 220
      }
    ]
  }
  function onChange(e) {
    console.log('radio checked', e.target.value);
  }
  return (
    <div>
      <div>
        <div>
          <ExtTable
            allowCancelSelect
            //columns={columns}
            {...tableProps}
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
)
const StrategyTable = create()(tabformRef)
export default StrategyTable;
