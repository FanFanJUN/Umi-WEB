import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, message, Input, Row, Col, Checkbox } from 'antd';
import { Fieldclassification, countryListConfig } from '@/utils/commonProps'
import { ExtTable, ComboList, ComboTree, utils } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { smBaseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import { findCanChooseSupplier } from '@/services/SupplierModifyService'
import { PCNMasterdatalist } from '../../commonProps'
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
        //getSupplierlist()
    }, []);
    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/smPcnTitleService/phyIdentQueryPcn`,
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
                    fieldName: 'onlyMe',
                    operator: 'EQ',
                    value: onlyMe ? 1 : 0
                }]) : [{
                    fieldName: 'onlyMe',
                    operator: 'EQ',
                    value: onlyMe ? 1 : 0
                }]
                //filters: []
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
            modifyanalysis(selectedRows)
            handleModalVisible(false);
            setSearchValue('');
            cleanSelectedRecord();

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
                let handlefilters = filters.filter(item => item.fieldName !== 'smPcnChangeTypeName');
                setSeniorsearchvalue(handlefilters)
                tableRef.current.remoteDataRefresh()
            }
        })
    }
    function handleReset() {
        resetFields()
    }
    const columns = [
        {
            title: "单据状态",
            width: 120,
            dataIndex: "smSubmitStatus",
            render: function (text, record, row) {
                if (text === 0 && record.smDocunmentStatus === 0) {
                    return <div>草稿</div>;
                } else if (text === 0 && record.smDocunmentStatus === 1) {
                    return <div>已保存</div>;
                } else if (text === 1) {
                    return <div className="doingColor">验证中</div>;
                } else if (text === 2) {
                    return <div className="successColor">变更不通过</div>;
                } else if (text === 3) {
                    return <div className="successColor">变更通过</div>;
                } else if (text === 4) {
                    return <div className="successColor">变更完成</div>;
                } else if (text === -1) {
                    return <div className="successColor">确认中</div>;
                }
            },
        },
        {
            title: "PCN变更单号",
            width: 160,
            dataIndex: "smPcnCode"
        },
        {
            title: "物料分类",
            width: 160,
            dataIndex: "materielCategoryName"
        },
        {
            title: "供应商代码",
            width: 150,
            dataIndex: "smSupplierCode"
        },
        {
            title: "供应商名称",
            width: 160,
            dataIndex: "smSupplierName"
        },
        {
            title: "原厂代码",
            width: 160,
            dataIndex: "smOriginalFactoryCode"
        },
        {
            title: "原厂名称",
            width: 160,
            dataIndex: "smOriginalFactoryName"
        },
        {
            title: "公司代码",
            width: 150,
            dataIndex: "companyCode"
        },
        {
            title: "公司名称",
            width: 160,
            dataIndex: "companyName"
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
            title: "变更类型",
            width: 160,
            dataIndex: "smPcnChangeTypeName"
        },
        {
            title: "联系人",
            width: 160,
            dataIndex: "smContacts"
        },
        {
            title: "联系电话",
            width: 120,
            dataIndex: "smContactNumber"
        },
    ].map(_ => ({ ..._, align: 'center' }));
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"PCN变更单"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
            onOk={handleOk}
        >
            <div>
                <Row>
                    <Col span={10}>
                        <Item {...formLayout} label='PCN变更单' >
                            {
                                getFieldDecorator('Q_LK_smPcnCode', {
                                    initialValue: '',
                                })(
                                    <Input />

                                )}
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='供应商名称' {...formLayout}>
                            {
                                getFieldDecorator("Q_LK_smSupplierName", {
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
                        <Item label='变更类型' {...formLayout}>
                            {
                                (
                                    getFieldDecorator('Q_EQ_smPcnChangeTypeCode'),
                                    getFieldDecorator('Q_EQ_smPcnChangeTypeName', {

                                    })(
                                        <ComboList
                                            showSearch={false}
                                            style={{ width: '100%' }}
                                            {...PCNMasterdatalist}
                                            name='Q_EQ_smPcnChangeTypeName'
                                            field={['Q_EQ_smPcnChangeTypeCode']}
                                            form={form}
                                        />
                                    )
                                )
                            }
                        </Item>
                    </Col>
                    <Col span={10}>
                        <Item label='仅我的' {...formLayout}>
                            {
                                getFieldDecorator("Q_EQ_onlyMe", {
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
