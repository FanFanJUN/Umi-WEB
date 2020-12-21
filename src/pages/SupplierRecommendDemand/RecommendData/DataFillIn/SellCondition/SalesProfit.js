/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-18 10:23:19
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { useState, useEffect } from 'react';
import { Form } from 'antd';
import EditTable from '../CommonUtil/EditTable';

const SalesProfit = ({ data=[], type, setTableData }) => {
  useEffect(() => {
    setDataSource(data)
  }, [data])
  const [dataSource, setDataSource] = useState([]);
  const columns = [
    {
      title: "年度",
      dataIndex: "year",
      ellipsis: true,
      editable: true,
      inputType: 'YearPicker',
      props: {
        // mode: 'year'
      }
      // inputType: 'in',
      //  required: false
    },
    {
      title: "含税销售金额（万元）",
      dataIndex: "salesAmount",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "利润（万元）",
      dataIndex: "profit",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "币种",
      dataIndex: "currencyName",
      ellipsis: true,
      editable: true,
      inputType: 'selectwithService',
    }
  ];

  function setNewData(newData) {
    setDataSource(newData);
    setTableData(newData, 'supplierSalesProceeds');
  }
  return (
    <EditTable
      dataSource={dataSource}
      columns={columns}
      rowKey='guid'
      setNewData={setNewData}
      isEditTable={type === 'add'}
      isToolBar={type === 'add'}
    />
  )
}

export default Form.create()(SalesProfit);