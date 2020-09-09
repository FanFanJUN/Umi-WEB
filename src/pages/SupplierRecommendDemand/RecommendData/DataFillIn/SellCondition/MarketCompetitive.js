/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 16:16:44
 * @LastEditTime: 2020-09-09 16:32:48
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/MarketCompetitive.JS
 * @Description: 市场地位及竞争状况
 * @Connect: 1981824361@qq.com
 */
import React from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar, } from 'suid';
import { Button, Divider, Form, InputNumber, Row, Col, Input, Radio } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 20,
    },
};

const MarketCompetitive = React.forwardRef((props, ref) => {
    const { form } = props;
    const { getFieldDecorator, setFieldsValue } = form;

    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columnsForMarket = [
        { title: '产品', dataIndex: 'name1', ellipsis: true, },
        { title: '年产值', dataIndex: 'name2', ellipsis: true, },
        { title: '币种', dataIndex: 'name3', ellipsis: true, },
        { title: '市场占有率', dataIndex: 'name4', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    const columnsForRank = [
        { title: '产品', dataIndex: 'name1', ellipsis: true, },
        { title: '竞争对手', dataIndex: 'name2', ellipsis: true, },
        { title: '年销售额', dataIndex: 'name3', ellipsis: true, },
        { title: '币种', dataIndex: 'name4', ellipsis: true, },
        { title: '年销量', dataIndex: 'name4', ellipsis: true, },
        { title: '市场占有率', dataIndex: 'name4', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const FormInfo = () => {
        return (
            <Fragment>
                <Row>
                    <Col span={24}>
                        <FormItem label="行业知名度" {...formLayout}>
                            {getFieldDecorator('source', {
                                initialValue: '',
                            })(<Radio.Group value={'2'}>
                                <Radio value={1}>行业内的国际知名企业</Radio>
                                <Radio value={2}>行业内国际知名企业在中国的合资企业</Radio>
                                <Radio value={3}>行业内的国内知名企业</Radio>
                                <Radio value={4}>都不是</Radio>
                              </Radio.Group>)}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <FormItem label="企业的主要竞争优势" {...formLayout}>
                            {getFieldDecorator('source', {
                                initialValue: '',
                                rules: [
                                    {
                                      required: true,
                                      message: '企业的主要竞争优势不能为空',
                                    },
                                  ],
                            })(<Input.TextArea placeholder="请输入主要竞争优势" style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
            </Fragment>
        )
    }
    // 行选中
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    // 删除
    function handleDelete() {
        console.log('删除')
    }
    return <Fragment>
        {/* <div className={styles.mb}>
            <Button type='primary' className={styles.btn} onClick={()=>{editRef.current.showModal('add')}}>新增</Button>
            <Button className={styles.btn} onClick={()=>{editRef.current.showModal('edit')}}>编辑</Button>
            <Button className={styles.btn} onClick={handleDelete}>删除</Button>
            <Button className={styles.btn}>批量导入</Button>
        </div> */}
        <div>
            <FormInfo />
            <Divider>市场地位</Divider>
            {/* <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div> */}
            <ExtTable
                columns={columnsForMarket}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                rowKey={(item) => item.id}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
            // {...tableProps}
            />
            <Divider>主要竞争对手排名</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForRank}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                rowKey={(item) => item.id}
                size='small'
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
            // {...tableProps}
            />
        </div>
    </Fragment>
})

export default Form.create()(MarketCompetitive);