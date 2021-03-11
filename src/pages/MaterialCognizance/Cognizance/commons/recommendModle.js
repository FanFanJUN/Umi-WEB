import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, message, Input, Row, Col, Checkbox } from 'antd';
import { Fieldclassification, countryListConfig } from '@/utils/commonProps'
import { ExtTable, ComboList, ComboTree, utils } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import { findCanChooseSupplier } from '@/services/SupplierModifyService'
import { MaterieljurisdictionCode } from '../../commonProps'
const { Item, create } = Form;
const { storage } = utils;
const formLayout = {
    labelCol: {
        span: 8
    },
    wrapperCol: {
        span: 16
    }
}
const getRecommendRef = forwardRef(({
    form,
    modifyanalysis = () => null,
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalVisible,
        form
    }));
    const tableRef = useRef(null)
    const headerRef = useRef(null)
    const { getFieldDecorator, resetFields } = form;
    const { userId } = storage.sessionStorage.get("Authorization") || {};
    const [searchValue, setSearchValue] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setvisible] = useState(false);
    const [current, setcurrent] = useState([]);
    const [onlyMe, setOnlyMe] = useState(true);
    const [seniorSearchvalue, setSeniorsearchvalue] = useState([]);
    useEffect(() => {

    }, []);
    const dataSource = {
        store: {
            url: `${recommendUrl}/api/recommendAccessService/findRecommendAccessLine4Physical`,
            params: {
                ...searchValue,
                quickSearchProperties: [],
                sortOrders: [
                    {
                        property: 'createdDate',
                        direction: 'DESC'
                    }
                ],
                filters: seniorSearchvalue ? seniorSearchvalue.concat([{
                    fieldName: 'creatorId',
                    operator: 'EQ',
                    value: onlyMe ? userId : undefined
                }]) : [{
                    fieldName: 'creatorId',
                    operator: 'EQ',
                    value: onlyMe ? userId : undefined
                }]
            },
            type: 'POST'
        }
    }
    function handleModalVisible(flag) {
        setvisible(!!flag)
    };
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function handleOk() {
        if (selectedRowKeys.length === 0) {
            message.error('请选择一行数据！');
        } else {
            if (selectedRows[0].identifyTypeName && selectedRows[0].identifyTypeCode) {
                modifyanalysis(selectedRows)
                handleModalVisible(false);
                setSearchValue('');
                cleanSelectedRecord();
            } else {
                message.error('认定类型不能为空！');
            }

        }
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRows([]);
        setRowKeys([])
        tableRef.current.manualSelectedRows([])
    }
    function uploadTable() {
        cleanSelectedRecord()
        tableRef.current.remoteDataRefresh()
    }
    // 清除选中项
    function cleanSelectedRecord() {
        setRowKeys([])
    }
    function pageChange(val) {
        setcurrent(val.current)
    }
    // 仅我的
    function handleOnlyMeChange(e) {
        setOnlyMe(e.target.checked)
    }
    // 查询
    function handleQuickSerach() {
        form.validateFieldsAndScroll(async (err, v) => {
            if (!err) {
                const keys = Object.keys(v);
                const filters = keys.map((item) => {
                    const [_, operator, fieldName, isName] = item.split('_');
                    return {
                        fieldName,
                        operator,
                        value: !!isName ? undefined : v[item]
                    }
                }).filter(item => !!item.value)
                filters.map((item, index) => {
                    if (item.fieldName === undefined && item.operator === undefined) {
                        filters.splice(index, 1)
                    }
                })
                setSeniorsearchvalue(filters)
                tableRef.current.remoteDataRefresh()
            }
        })
    }
    function handleReset() {
        resetFields()
    }
    const columns = [
        {
            title: "审核状态",
            width: 120,
            dataIndex: "recommendAccess.flowStatus",
            render: function (text, record, row) {
                if (text === 'INIT') {
                    return <div>草稿</div>;
                } else if (text === 'INPROCESS') {
                    return <div>审批中</div>;
                } else if (text === 'COMPLETED') {
                    return <div>审批完成</div>;
                }
            },
        },
        {
            title: "公司领导审核状态",
            width: 160,
            dataIndex: "recommendAccess.leaderApprove",
            render: function (text, record, row) {
                if (text) {
                    return <div>已审核</div>;
                } else {
                    return <div className="successColor">未审核</div>;
                }
            }
        },
        {
            title: "准入单号",
            width: 160,
            dataIndex: "recommendAccess.docNumber"
        },
        {
            title: "物料分类",
            width: 160,
            dataIndex: "recommendAccess.materialCategoryName"
        },
        {
            title: "供应商代码",
            width: 150,
            dataIndex: "recommendAccess.supplierCode"
        },
        {
            title: "供应商名称",
            width: 160,
            dataIndex: "recommendAccess.supplierName"
        },
        {
            title: "原厂代码",
            width: 160,
            dataIndex: "recommendAccess.originCode"
        },
        {
            title: "原厂名称",
            width: 160,
            dataIndex: "recommendAccess.originName"
        },
        {
            title: "公司代码",
            width: 150,
            dataIndex: "corporationCode"
        },
        {
            title: "公司名称",
            width: 160,
            dataIndex: "corporationName"
        },
        {
            title: "采购组织代码",
            width: 160,
            dataIndex: "purchaseOrgCode"
        },
        {
            title: "采购组织名称",
            width: 160,
            dataIndex: "purchaseOrgName"
        },
        {
            title: "认定物料类别",
            width: 160,
            dataIndex: "recommendAccess.identifyMaterialLevelName"
        },
        {
            title: "认定类型",
            width: 120,
            dataIndex: "identifyTypeName"
        },
    ].map(_ => ({ ..._, align: 'center' }));
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"供应商推荐准入信息"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >
            <div>
                <Row>
                    <Col span={10}>
                        <Item {...formLayout} label='推荐准入单' >
                            {
                                getFieldDecorator('Q_LK_docNumber', {
                                    initialValue: '',
                                })(
                                    <Input />

                                )}
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                getFieldDecorator("Q_LK_supplierName", {
                                    initialValue: '',
                                })(
                                    <Input />
                                )
                            }
                        </Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={10}>
                        <Item label='物料分类' {...formLayout}>
                            {
                                (getFieldDecorator('Q_EQ_materialCategoryCode'),
                                    getFieldDecorator('Q_EQ_materialCategoryName', {

                                    })(
                                        <ComboTree
                                            style={{ width: '100%' }}
                                            form={form}
                                            {...MaterieljurisdictionCode}
                                            name="Q_EQ_materialCategoryName"
                                            field={['Q_EQ_materialCategoryCode']}
                                        />,
                                    ))
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='仅我的' {...formLayout}>
                            {
                                getFieldDecorator("creatorId", {
                                    initialValue: '',
                                })(
                                    <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe} ></Checkbox>

                                )
                            }
                            <Button type="primary" onClick={handleQuickSerach} className={styles.btn}>查询</Button>
                            <Button onClick={handleReset}>重置</Button>
                        </Item>

                    </Col>
                </Row>
            </div>
            <ExtTable
                columns={columns}
                showSearch={false}
                ref={tableRef}
                rowKey={(item) => item.id}
                checkbox={{
                    multiSelect: false
                }}
                allowCancelSelect
                size='small'
                remotePaging={true}
                ellipsis={false}
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                onChange={pageChange}
                //dataSource={dataSource}
                {...dataSource}
            />
        </Modal>
    );
},
);

export default create()(getRecommendRef);
