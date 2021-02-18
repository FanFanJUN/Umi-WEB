import { useState } from 'react';
import EditorTable from '../CommonUtil/EditorTable';
import moment from 'moment';

export default () => {
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: '名字',
      dataIndex: 'name'
    },
    {
      title: '年月日开始',
      dataIndex: 'year',
      render(text) {
        return moment(text).format('YYYY-MM-DD')
      }
    }
  ]
  const fields = [
    {
      name: 'name',
      label: '姓名',
      option: {
        rules: [
          {
            required: true,
            message: '姓名不能为空'
          }
        ]
      },
    },
    {
      name: 'year',
      label: '年月日',
      fieldType: 'datePicker',
      option: {
        rules: [
          {
            required: true,
            message: '选择日期'
          }
        ]
      },
      disabledDate: (ct, mt, tv) => {
        return ct && ct > tv
      },
      disabledTarget: 'month'
    },
    {
      name: 'month',
      label: '年月日',
      fieldType: 'datePicker',
      option: {
        rules: [
          {
            required: true,
            message: '选择日期'
          }
        ]
      },
      disabledDate: (ct, mt, tv) => {
        return ct && ct < tv
      },
      disabledTarget: 'year'
    },
    {
      name: 'sales',
      label: '当月销量',
      fieldType: 'inputNumber',
      option: {
        rules: [
          {
            required: true,
            message: '清填写当月销量'
          },
          {
            validator: (_, val, cb, targetValue) => {
              if (targetValue < val) {
                cb('当月销量不能大于总销量')
                return
              }
              cb()
            }
          },
          {
            min: 0,
            type: 'number',
            message: '当月销量不能为负数'
          }
        ]
      },
      disabledTarget: 'countSales'
    },
    {
      name: 'countSales',
      label: '总销量',
      fieldType: 'inputNumber',
      option: {
        rules: [
          {
            required: true,
            message: '不能为空'
          },
          {
            validator: (_, val, cb, targetValue) => {
              if (targetValue > val) {
                cb('总销量不能小于当月销量')
                return
              }
              cb()
            }
          }
        ],
        validateFirst: true
      },
      disabledTarget: 'sales'
    }
  ]
  return (
    <EditorTable
      fields={fields}
      dataSource={dataSource}
      setDataSource={setDataSource}
      columns={columns}
      allowOperation={false}
      allowCreate={false}
      allowEditor={false}
      allowRemove={false}
      allowExport
      allowImport
    />
  )
}