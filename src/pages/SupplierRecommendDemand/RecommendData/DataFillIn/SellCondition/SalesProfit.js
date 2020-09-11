/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:28:52
 * @LastEditTime: 2020-09-11 16:37:57
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/SalesProfit.js
 * @Description: 销售收入及利润 Table
 * @Connect: 1981824361@qq.com
 */
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar } from 'suid';
import { Button, Divider, Form } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';
import EditTable from '../Common/EditTable';

let data = [];
for (let i = 0; i < 5; i++) {
  data.push({ 
    name1: i.toString(),
    name2: i+1000,
    name3: 32,
    name4: 'RMB',
  });
}

const SalesProfit = (props)=> {
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
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "销售金额",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "利润",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "币种",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        }
    ];
    // 行选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 删除
    function handleDelete() {
        console.log('删除')
    }

    function setNewData(newData) {
      console.log(newData);
      setDataSource(newData);
    }
    return <Fragment>
        {/* <div className={styles.mb}>
            <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
        </div> */}
        <EditTable
           dataSource = {dataSource}
           columns={columns}
           rowKey='name1'
           setNewData={setNewData}
           isEditTable
           isToolBar
            // bordered
            // allowCancelSelect
            // showSearch={false}
            // remotePaging
            // checkbox={{ multiSelect: false }}
            // ref={tableRef}
            // rowKey={(item) => item.name1}
            // size='small'
            // onSelectRow={handleSelectedRows}
            // selectedRowKeys={selectedRowKeys}
            // data={data}
            // components={components}
        />
    </Fragment>
}

export default Form.create()(SalesProfit);