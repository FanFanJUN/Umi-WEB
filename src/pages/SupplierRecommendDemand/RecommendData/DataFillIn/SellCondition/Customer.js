/*
 * @Author: Li Cai
 * @LastEditors: Li Cai
 * @Date: 2020-09-09 15:36:50
 * @LastEditTime: 2020-09-22 15:17:08
 * @FilePath: /srm-sm-web/src/pages/SupplierRecommendDemand/RecommendData/DataFillIn/SellCondition/Customer.js
 * @Description: 客户相关
 * @Connect: 1981824361@qq.com
 */
import React, { useImperativeHandle } from 'react';
import { useEffect, useState, useRef, Fragment } from 'react';
import { ExtTable, ComboList, ExtModal, utils, ToolBar, ScrollBar, } from 'suid';
import { Button, Divider, Form, InputNumber, Row, Col, Input } from 'antd';
import moment from 'moment';
import styles from '../../DataFillIn/index.less';
import EditableFormTable from '../CommonUtil/EditTable';
import UploadFile from '../CommonUtil/UploadFile';

const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const formLayout2 = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};

const Customer = React.forwardRef(({ form, type, data, setTableData }, ref) => {
    const { getFieldDecorator, setFieldsValue } = form;
    const [changhongSaleInfos, setchanghongSaleInfos] = useState(data.changhongSaleInfos);
    const [mainCustomers, setmainCustomers] = useState(data.mainCustomers);
    const [exportSituations, setexportSituations] = useState(data.exportSituations);
    const [supplierOrderInfos, setsupplierOrderInfos] = useState(data.supplierOrderInfos);
    const [threeYearPlans, setthreeYearPlans] = useState(data.threeYearPlans);

    const tableRef = useRef(null);

    const columnsForGroup = [
        { title: '供货BU名称', dataIndex: 'buName', ellipsis: true, },
        { title: '配件名称', dataIndex: 'paretsName', ellipsis: true, },
        { title: '单价', dataIndex: 'unitPrice', ellipsis: true, inputType: 'InputNumber' },
        { title: '年供货量', dataIndex: 'annualOutput', ellipsis: true, inputType: 'InputNumber' },
        { title: '占该BU该配件比例', dataIndex: 'buRate', ellipsis: true, inputType: 'percentInput', width: 203 },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForMajorcustomers = [
        { title: '名称', dataIndex: 'name', ellipsis: true, },
        { title: '所在行业', dataIndex: 'industry', ellipsis: true, },
        { title: '客户在行业所占百分比占比(%)', dataIndex: 'industryCustomerRate', ellipsis: true, },
        {
            title: '开始供货时间', dataIndex: 'startSupplyTime', ellipsis: true, render: (text) => {
                return text && moment(text).format('YYYY-MM-DD');
            }
        },
        { title: '供货数量', dataIndex: 'supplyNumber', ellipsis: true, },
        { title: '企业在该客户的销售额', dataIndex: 'salesName', ellipsis: true, },
        // { title: '币种', dataIndex: 'name4', ellipsis: true, },
        { title: '企业占该客户同类物资采购份额', dataIndex: 'customerPurchaseRate', ellipsis: true, },
        { title: '客户采购额占企业总体销售比例', dataIndex: 'customerSaleRate', ellipsis: true, inputType: 'percentInput' },
        { title: '客户地理分布', dataIndex: 'geographical', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForExpSitu = [
        { title: '出口国家', dataIndex: 'exportCountryName', ellipsis: true, },
        { title: '金额', dataIndex: 'money', ellipsis: true, },
        { title: '币种', dataIndex: 'currencyName', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));
    const columnsForOrder = [
        { title: '客户', dataIndex: 'customer', ellipsis: true, },
        { title: '订单或合同', dataIndex: 'orderContract', ellipsis: true, },
        { title: '关键件/重要件', dataIndex: 'importantPart', ellipsis: true, inputType: 'Select', width: 172 },
        { title: '应用经验证明材料', dataIndex: 'applicationExperienceFileIds', ellipsis: true, inputType: 'UploadFile', width: 181 },
    ].map(item => ({ ...item, align: 'center' }));

    const columnsForDevPlan = [
        { title: '项目（方案）', dataIndex: 'project', ellipsis: true, },
        { title: '项目描述', dataIndex: 'projectDescription', ellipsis: true, inputType: 'TextArea' },
        { title: '证据', dataIndex: 'proof', ellipsis: true, },
    ].map(item => ({ ...item, align: 'center' }));

    const OverallSit = () => {
        return (
            <Row>
                <Col span={12}>
                    <FormItem label="现在所有客户数量（个）" {...formLayout2}>
                        {getFieldDecorator('customersNumber', {
                            initialValue: type === 'add' ? '' : data.customersNumber,
                        })(<InputNumber placeholder="请输入现在所有客户数量" style={{ width: '100%' }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="其中最大客户所占销售额(%)" {...formLayout2}>
                        {getFieldDecorator('maxCustomerRate', {
                            initialValue: type === 'add' ? '' : data.shareDemanNumber,
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
                        {getFieldDecorator('situationDescription', {
                            initialValue: type === 'add' ? '' : data.situationDescription,
                        })(<Input.TextArea placeholder="请输入情况介绍" style={{ width: '100%' }} />)}
                    </FormItem>
                </Col>
                <Col span={12}>
                    <FormItem label="资料" {...formLayout}>
                        {getFieldDecorator('situationAttachmentIds', {
                        })(
                            <UploadFile style={{ width: '100%' }}
                                showColor={type !== 'add' ? true : false}
                                type={type === 'add' ? '' : 'show'}
                                entityId={data.situationAttachmentIds} />,
                        )}
                    </FormItem>
                </Col>
            </Row>
        )
    }

    function setNewData(newData, type) {
        switch (type) {
            case 'changhongSaleInfos':
                setchanghongSaleInfos(newData);
                break;
            case 'mainCustomers':
                setmainCustomers(newData);
                break;
            case 'supplierOrderInfos':
                setsupplierOrderInfos(newData);
                break;
            case 'threeYearPlans':
                setthreeYearPlans(newData);
                break;
            default:
                break;
        }
        setTableData(newData, type);
    }

    return <Fragment>
        <div>
            <Divider>总体情况</Divider>
            <OverallSit />
            <Divider>长虹集团</Divider>
            <EditableFormTable
                columns={columnsForGroup}
                ref={tableRef}
                rowKey='id'
                size='small'
                isToolBar={type === 'add'}
                isEditTable={type === 'add'}
                dataSource={changhongSaleInfos || []}
                setNewData={setNewData}
                tableType='changhongSaleInfos'
            />
            <Divider>其他主要客户情况</Divider>
            <EditableFormTable
                columns={columnsForMajorcustomers}
                bordered
                ref={tableRef}
                rowKey='id'
                isToolBar={type === 'add'}
                isEditTable={type === 'add'}
                dataSource={mainCustomers || []}
                setNewData={setNewData}
                tableType='mainCustomers'
            />
            <Divider>出口情况</Divider>
            <ExtTable
                columns={columnsForExpSitu}
                bordered
                allowCancelSelect
                showSearch={false}
                remotePaging
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                rowKey='id'
                dataSource={exportSituations || []}
                tableType='exportSituations'
            />
            <Divider>客户合作情况介绍和资料</Divider>
            <CustermerInfo />
            <Divider>主要客户近半年内的订单或合同及证明材料</Divider>
            <EditableFormTable
                columns={columnsForOrder}
                bordered
                checkbox={{ multiSelect: false }}
                ref={tableRef}
                rowKey='id'
                isToolBar={type === 'add'}
                isEditTable={type === 'add'}
                dataSource={supplierOrderInfos || []}
                setNewData={setNewData}
                tableType='supplierOrderInfos'
            />
            <Divider>未来三年发展规划</Divider>
            <EditableFormTable
                columns={columnsForDevPlan}
                bordered
                ref={tableRef}
                rowKey='id'
                isToolBar={type === 'add'}
                isEditTable={type === 'add'}
                dataSource={threeYearPlans || []}
                setNewData={setNewData}
                tableType='threeYearPlans'
            />
        </div>
    </Fragment>
})

export default Customer;