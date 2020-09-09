/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:36:50
 * @LastEditTime: 2020-09-09 16:17:51
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/Customer.js
 * @Description: 客户相关
 * @Connect: 1981824361@qq.com
 */
import React from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar, } from 'suid';
import { Button, Divider, Form, InputNumber, Row, Col, Input } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const Customer = React.forwardRef((props, ref) => {
    const { form } = props;
    const { getFieldDecorator, setFieldsValue } = form;

    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [addvisible, setVisible] = useState(false)
    const tableRef = useRef(null);
    const editRef = useRef(null);
    const columnsForGroup = [
        { title: '供货BU名称', dataIndex: 'name1', ellipsis: true, },
        { title: '配件名称', dataIndex: 'name2', ellipsis: true, },
        { title: '单价', dataIndex: 'name3', ellipsis: true, },
        { title: '年供货量', dataIndex: 'name4', ellipsis: true, },
        {
            title: '首次获证时间', dataIndex: 'name5', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '占该BU该配件比例', dataIndex: 'name4', ellipsis: true, },
        { title: '附件', dataIndex: 'name4', ellipsis: true, },
        {
            title: '计划取得时间', dataIndex: 'name5', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
    ].map(item => ({ ...item, align: 'center' }));
    const columnsForPro = [
        { title: '产品', dataIndex: 'name1', ellipsis: true, },
        { title: '体系', dataIndex: 'name2', ellipsis: true, },
        { title: '证照执行标准', dataIndex: 'name3', ellipsis: true, },
        { title: '证照编号', dataIndex: 'name4', ellipsis: true, },
        { title: '发证机构', dataIndex: 'name4', ellipsis: true, },
        {
            title: '首次获证时间', dataIndex: 'name5', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '最新年审', dataIndex: 'name4', ellipsis: true, },
        { title: '附件', dataIndex: 'name4', ellipsis: true, },
        {
            title: '计划取得时间', dataIndex: 'name5', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForMajorcustomers = [
        { title: '名称', dataIndex: 'name1', ellipsis: true, },
        { title: '所在行业', dataIndex: 'name2', ellipsis: true, },
        { title: '客户在行业所占百分比占比(%)', dataIndex: 'name3', ellipsis: true, },
        {
            title: '开始供货时间', dataIndex: 'name5', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '供货数量', dataIndex: 'name4', ellipsis: true, },
        { title: '企业在该客户的销售额', dataIndex: 'name4', ellipsis: true, },
        { title: '币种', dataIndex: 'name4', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForExpSitu = [
        { title: '出口国家', dataIndex: 'name1', ellipsis: true, },
        { title: '金额', dataIndex: 'name2', ellipsis: true, },
        { title: '币种', dataIndex: 'name3', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    const columnsForOrder = [
        { title: '客户', dataIndex: 'name1', ellipsis: true, },
        { title: '订单或合同', dataIndex: 'name2', ellipsis: true, },
        { title: '关键件/重要件', dataIndex: 'name3', ellipsis: true, },
        { title: '应用经验证明材料', dataIndex: 'name3', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForDevPlan = [
        { title: '项目（方案）', dataIndex: 'name1', ellipsis: true, },
        { title: '项目描述', dataIndex: 'name2', ellipsis: true, },
        { title: '证据', dataIndex: 'name3', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const OverallSit = () => {
        return (
            <Row>
                <Col span={12}>
                    <FormItem label="现在所有客户数量（个）" {...formLayout}>
                        {getFieldDecorator('source', {
                            initialValue: '',
                        })(<InputNumber placeholder="请输入现在所有客户数量" style={{ width: '100%' }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="其中最大客户所占销售额（%）" {...formLayout}>
                        {getFieldDecorator('shareDemanNumber', {
                        })(
                            <Input style={{ width: '100%' }} />,
                        )}
                    </FormItem>
                </Col>
            </Row>
        )
    }

    const CustermerInfo = () => {
        return (
            <Row>
                <Col span={12}>
                    <FormItem label="情况介绍" {...formLayout}>
                        {getFieldDecorator('source', {
                            initialValue: '',
                        })(<Input.TextArea placeholder="请输入现在所有客户数量" style={{ width: '100%' }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="资料" {...formLayout}>
                        {getFieldDecorator('shareDemanNumber', {
                        })(
                            <Input style={{ width: '100%' }} />,
                        )}
                    </FormItem>
                </Col>
            </Row>
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
            <Divider>总体情况</Divider>
            <OverallSit />
            <Divider>长虹集团</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForGroup}
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
            <Divider>其他主要客户情况</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForMajorcustomers}
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
            <Divider>出口情况</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForExpSitu}
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
            <Divider>客户合作情况介绍和资料</Divider>
            <CustermerInfo />
            <Divider>主要客户近半年内的订单或合同及证明材料</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForOrder}
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
            <Divider>未来三年发展规划</Divider>
            <div className={styles.mb}>
                <Button type='primary' className={styles.btn} onClick={() => { editRef.current.showModal('add') }}>新增</Button>
                <Button className={styles.btn} onClick={handleDelete} type="danger">删除</Button>
            </div>
            <ExtTable
                columns={columnsForDevPlan}
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

export default Form.create()(Customer);