/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-15 16:36:27
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button, Divider, Form } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';
import EditTable from '../CommonUtil/EditTable';

let data = [];
for (let i = 0; i < 5; i++) {
    data.push({
        id: i.toString(),
        year: i + 56,
        salesAmount: i + 1000,
        profit: 32,
        currencyName: 'RMB',
    });
}

const SalesProfit = (props) => {
    const { form } = props;
    const [dataSource, setDataSource] = useState(data);
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columns = [
        {
            "title": "年度",
            "dataIndex": "year",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
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
            "inputType": 'Input',
        }
    ];

    function setNewData(newData) {
        console.log(newData);
        setDataSource(newData);
    }
    return <Fragment>
        {/* <div className={styles.mb}>
            <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
        </div> */}
        <EditTable
            dataSource={dataSource}
            columns={columns}
            rowKey='id'
            setNewData={setNewData}
            isEditTable
            isToolBar
        />
    </Fragment>
}

export default Form.create()(SalesProfit);