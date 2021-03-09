/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-18 10:23:19
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { Form } from 'antd';
import EditorTable from '../../../../../components/EditorTable';
import moment from 'moment';
import { currencyTableProps } from '../../../../../utils/commonProps';

const SalesProfit = ({ data = [], type, setTableData }) => {
  const columns = [
    {
      title: "年度",
      dataIndex: "year"
    },
    {
      title: "含税销售金额(万元)",
      dataIndex: "salesAmount",
    },
    {
      title: "利润(万元)",
      dataIndex: "profit",
    },
    {
      title: "币种",
      dataIndex: "currencyName",
    }
  ];

  const fields = [
    {
      name: 'year',
      label: '年度',
      fieldType: 'yearPicker',
      options: {
        rules: [
          {
            required: true,
            message: '请选择年度信息'
          },
          {
            validator: (_, v, cb) => {
              const cm = + moment().format('YYYY');
              if (v > cm) {
                cb('所选年度不能大于当前时间')
              }
              cb()
            }
          }
        ]
      },
      props: {
        placeholder: '请选择年度',
        disabled: true
      }
    },
    {
      name: 'salesAmount',
      label: '含税销售金额(万元)',
      fieldType: 'inputNumber',
      disabledTarget: 'profit',
      options: {
        rules: [
          {
            required: true,
            message: '销售金额不能为空'
          },
          {
            validator: (_, val, cb, tg) => {
              if (val < tg) {
                cb('含税销售金额应大于利润')
                return
              }
              cb()
            }
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请填写含税销售金额'
      }
    },
    {
      name: 'profit',
      label: '利润(万元)',
      fieldType: 'inputNumber',
      disabledTarget: 'salesAmount',
      options: {
        rules: [
          {
            required: true,
            message: '利润不能为空'
          },
          {
            validator: (_, val, cb, tg) => {
              if (val > tg) {
                cb('利润应小于含税销售金额')
                return
              }
              cb()
            }
          }
        ]
      },
      props: {
        min: 0,
        placeholder: '请填写利润'
      }
    },
    {
      name: 'currencyName',
      label: '币种',
      fieldType: 'comboList',
      options: {
        rules: [
          {
            required: true,
            message: '币种不能为空'
          }
        ]
      },
      props: {
        name: 'currencyName',
        field: ['currencyId'],
        placeholder: '请选择币种',
        ...currencyTableProps
      }
    },
  ]

  return (
    <EditorTable
      dataSource={data}
      columns={columns}
      allowRemove={false}
      allowCreate={false}
      rowKey='guid'
      setDataSource={setTableData}
      fields={fields}
      mode={type}
    />
  )
}

export default Form.create()(SalesProfit);