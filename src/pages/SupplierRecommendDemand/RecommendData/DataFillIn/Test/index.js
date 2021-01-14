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
    }
  ]
  return (
    <EditorTable
      fields={fields}
      dataSource={dataSource}
      setDataSource={setDataSource}
      columns={columns}
    />
  )
}