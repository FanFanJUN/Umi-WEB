/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-17 14:03:03
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react';
import { Button, Divider, Form } from 'antd';
import EditTable from '../CommonUtil/EditTable';

const SalesProfit = ({data, type, setTableData}) => {
    const [dataSource, setDataSource] = useState(data);

    const columns = [
        {
            "title": "年度",
            "dataIndex": "year",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
            //  required: false
        },
        {
            "title": "销售金额",
            "dataIndex": "salesAmount",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "利润",
            "dataIndex": "profit",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "币种",
            "dataIndex": "currencyName",
            "ellipsis": true,
            "editable": true,
            "inputType": 'selectwithService',
        }
    ];

    function setNewData(newData) {
        console.log(newData);
        setDataSource(newData);
        setTableData(newData, 'supplierSalesProceeds');
    }
    return <Fragment>
        <EditTable
            dataSource={dataSource|| []}
            columns={columns}
            rowKey='id'
            setNewData={setNewData}
            isEditTable={type === 'add'}
            isToolBar={type === 'add'}
        />
    </Fragment>
}

export default Form.create()(SalesProfit);