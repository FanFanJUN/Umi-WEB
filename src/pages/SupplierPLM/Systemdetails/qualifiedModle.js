import React, { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Modal, Form, Button, message, Input, Row, Col, Checkbox } from 'antd';
import { Fieldclassification, countryListConfig } from '@/utils/commonProps'
import { ExtTable, ComboList, ComboTree, utils } from 'suid';
import { openNewTab, getFrameElement } from '@/utils';
import { smBaseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
const { Item, create } = Form;
const { storage } = utils;
const { Search } = Input
const getRecommendRef = forwardRef(({
    form,
    modifyanalysis = () => null,
}, ref,) => {
    useImperativeHandle(ref, () => ({
        handleModalqualified,
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
    const [seniorSearchvalue, setSeniorsearchvalue] = useState({});
    useEffect(() => {
        //getSupplierlist()
    }, []);
    const dataSource = {
        store: {
            url: `${smBaseUrl}/api/supplierSupplyListExtService/findBySearch`,
            params: {
                ...searchValue,
                quickSearchProperties: ['supplier.code', 'supplier.name'],
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
    function handleModalqualified(flag) {
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
            handleModalqualified(false);
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
    // 查询
    function handleQuickSerach(value) {
        setSearchValue(v => ({ ...v, quickSearchValue: value }));
        uploadTable();
    }

    const columns = [
        {
            title: "供应商代码",
            width: 120,
            dataIndex: "supplierCode"
        },
        {
            title: "供应商名称",
            width: 160,
            dataIndex: "supplier.name"
        },
        {
            title: "业务单元代码",
            width: 150,
            dataIndex: "buCode"
        },
        {
            title: "业务单元名称",
            width: 150,
            dataIndex: "buName"
        },
        {
            title: "原厂代码",
            width: 150,
            dataIndex: "originSupplierCode"
        },
        {
            title: "原厂名称",
            width: 120,
            dataIndex: "originSupplierName"
        },
        {
            title: "物料分类代码",
            width: 150,
            dataIndex: "materielCategoryCode"
        },
        {
            title: "物料分类名称",
            width: 150,
            dataIndex: "materielCategory.name"
        },
        {
            title: "采购专业组",
            width: 160,
            dataIndex: "purchaseProfessionalGroup"
        },
        {
            title: "物料级别",
            width: 140,
            dataIndex: "materialGrade"
        },
        {
            title: "评定等级",
            width: 140,
            dataIndex: "cooperationLevelName"
        },

        {
            title: "公司代码",
            width: 150,
            dataIndex: "corporation.code"
        },
        {
            title: "公司名称",
            width: 240,
            dataIndex: "corporation.name"
        },
        {
            title: "采购组织代码",
            width: 140,
            dataIndex: "purchaseOrgCode"
        },
        {
            title: "采购组织名称",
            width: 240,
            dataIndex: "purchaseOrg.name"
        },
        {
            title: "开始日期",
            width: 150,
            dataIndex: "startDate",
            render: (text) => {
                return text.substring(0, 10);
            },
        },
        {
            title: "过期日期",
            width: 150,
            dataIndex: "endDate",
            render: (text) => {
                return text.substring(0, 10);
            },
        },
        {
            title: "冻结",
            width: 150,
            dataIndex: "frozen",
            render: (text, record, index) => (
                <div>{record.frozen ? '是' : '否'}</div>
            ),
        }
    ].map(_ => ({ ..._, align: 'center' }));
    // 右侧搜索
    const searchBtnCfg = (
        <Search
            placeholder='请输入供应商代码或名称查询'
            onSearch={handleQuickSerach}
            allowClear
            style={{ width: '240px' }}
        />
    )
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"合格供应商名录"}
            visible={visible}
            onCancel={() => handleModalqualified(false)}
            onOk={handleOk}
        >
            <Header
                left={false}
                right={searchBtnCfg}
                advanced={false}
                extra={false}
                ref={headerRef}
            />
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
