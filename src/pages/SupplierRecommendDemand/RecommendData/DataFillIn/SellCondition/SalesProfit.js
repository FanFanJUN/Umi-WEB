/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-18 10:23:19
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { useState } from 'react';
import { Form } from 'antd';
import EditTable from '../CommonUtil/EditTable';

const SalesProfit = ({ data, type, setTableData }) => {
  const [dataSource, setDataSource] = useState(data);

  const columns = [
    {
      title: "年度",
      dataIndex: "year",
      ellipsis: true,
      editable: true,
      // inputType: 'in',
      //  required: false
    },
    {
      title: "销售金额",
      dataIndex: "salesAmount",
      ellipsis: true,
      editable: true,
      inputType: 'InputNumber',
    },
    {
      title: "利润",
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
    (newData);
    setDataSource(newData);
    setTableData(newData, 'supplierSalesProceeds');
  }
  return (
    <EditTable
      dataSource={dataSource || []}
      columns={columns}
      rowKey='guid'
      setNewData={setNewData}
      isEditTable={type === 'add'}
      isToolBar={type === 'add'}
    />
  )
}

export default Form.create()(SalesProfit);