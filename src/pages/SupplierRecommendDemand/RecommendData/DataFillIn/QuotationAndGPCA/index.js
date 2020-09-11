/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-08 16:58:07
 * @LastEditTime: 2020-09-11 09:31:40
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/QuotationAndGPCA/index.js
 * @Description: 报价单及成分分析表 Tab
 * @Connect: 1981824361@qq.com
 */
import React, { useState, useRef } from 'react';
import { Form, Button, Spin, PageHeader, Radio, Row } from 'antd';
import styles from '../../DataFillIn/index.less';
import EditTable from '../Common/EditTable';

const QuotationAndGPCA = (props) => {

    const [data, setData] = useState({
        loading: false,
        type: 'add',
        userInfo: {}
    });
    const [dataSource, setDataSource] = useState([]);
    const baseInfoRef = useRef(null);

    const columns = [
        {
            "title": "产品名称",
            "dataIndex": "name1",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "型号/规格",
            "dataIndex": "name2",
            "ellipsis": true,
            "editable": true,
        },
        {
            "title": "原材料成本",
            "dataIndex": "name3",
            "ellipsis": true,
            "editable": true,
            "inputType": 'InputNumber',
        },
        {
            "title": "包装材料成本",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "设备用成本",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "厂房使用成本",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "工厂人工费用",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "管理费用",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "运费",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
        {
            "title": "币种",
            "dataIndex": "name4",
            "ellipsis": true,
            "editable": true,
            "inputType": 'Input',
        },
    ];
    function onChange(key) {

    }
    return (
        <div>
            <Spin spinning={data.loading}>
                <PageHeader
                    ghost={false}
                    style={{
                        padding: '0px'
                    }}
                    title="报价单及成分分析表"
                    extra={[
                        <Button key="save" type="primary" style={{ marginRight: '12px' }}>
                            保存
                        </Button>,
                    ]}
                >
                    <div className={styles.wrapper}>
                        <div className={styles.bgw}>
                            <div className={styles.title}>授权委托人</div>
                            <div className={styles.content}>
                                <Row style={{ marginBottom: '10px' }}>
                                    <span style={{marginRight: '18px'}}>能够且愿意向长虹提供完整的成本结构:</span>
                                    <Radio.Group onChange={onChange()} value={'1'}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={2}>否</Radio>
                                    </Radio.Group>
                                </Row>
                                <div className={styles.mb}>
                                    <Button type='primary' className={styles.btn} onClick={() => { }}>新增</Button>
                                </div>
                                <EditTable
                                    dataSource={dataSource}
                                    columns={columns}
                                    rowKey='name1'
                                    //    setNewData={setNewData}
                                    isEditTable
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
                            </div>
                        </div>
                    </div>
                </PageHeader>
            </Spin>
        </div>
    )
};

export default Form.create()(QuotationAndGPCA);