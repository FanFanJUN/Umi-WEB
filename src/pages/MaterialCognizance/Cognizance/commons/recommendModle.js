import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, message, Input, Row, Col, Checkbox } from 'antd';
import { Fieldclassification, countryListConfig } from '@/utils/commonProps'
import { ExtTable, ComboList, ComboTree } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { recommendUrl, baseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import { findCanChooseSupplier } from '@/services/SupplierModifyService'
import { Materieljurisdiction } from '../../commonProps'
const { Item, create } = Form;
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
    const { getFieldDecorator, validateFieldsAndScroll, getFieldValue, setFieldsValue } = form;
    const [loading, triggerLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedRowKeys, setRowKeys] = useState([]);
    const [selectedRows, setRows] = useState([]);
    const [visible, setvisible] = useState(false);
    const [current, setcurrent] = useState([]);
    const [onlyMe, setOnlyMe] = useState(true);
    useEffect(() => {
        //getSupplierlist()
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
        // e.target.checked === true ? setJurisdiction(1) : setJurisdiction(0)
        // uploadTable();
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
            dataIndex: "recommendAccess.corporationCode"
        },
        {
            title: "公司名称",
            width: 160,
            dataIndex: "recommendAccess.corporationName"
        },
        {
            title: "采购组织代码",
            width: 160,
            dataIndex: "recommendAccess.orgCode"
        },
        {
            title: "采购组织名称",
            width: 160,
            dataIndex: "recommendAccess.orgName"
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
                                getFieldDecorator('docNumber', {
                                    initialValue: '',
                                })(
                                    <Input />

                                )}
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                getFieldDecorator("smSupplierName", {
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
                                getFieldDecorator("materialCategoryName", {
                                    initialValue: '',
                                })(
                                    <ComboTree
                                        style={{ width: '100%' }}
                                        {...Materieljurisdiction}
                                        name="materialCategoryName"
                                        field={['materialCategoryCode']}
                                    />
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='仅我的' {...formLayout}>
                            {
                                getFieldDecorator("createdDate", {
                                    initialValue: '',
                                })(
                                    <Checkbox className={styles.btn} onChange={handleOnlyMeChange} checked={onlyMe} ></Checkbox>

                                )
                            }
                            <Button type="primary">查询</Button>
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
