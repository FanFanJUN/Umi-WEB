import React, { forwardRef, useImperativeHandle, useEffect, useRef ,useState} from 'react';
import { Modal, Form, Button, message, Input, } from 'antd';
import { Fieldclassification ,countryListConfig} from '@/utils/commonProps'
import { ExtTable } from 'suid';
import { isEmpty} from '@/utils';
import { smBaseUrl,baseUrl } from '@/utils/commonUrl';
import Header from '@/components/Header';
import styles from '../index.less';
import {findCanChooseSupplier} from '@/services/SupplierModifyService'
const { create } = Form;
const getAgentregRef = forwardRef(({
    form,
    modifyanalysis = () => null,
    materieldata
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
    // const [dataSource, setdataSource] = useState([])
    useEffect(() => {
        //getSupplierlist()
    }, []);
    const dataSource = {
        store: {
            url: `${smBaseUrl}/supplierSupplyList/listPageVo?valid=1&page=1&rows=30&Quick_value=` + searchValue,
            params: {
                sortOrders: [
                    {
                        property: 'materielCategory',
                        direction: 'DESC'
                    }
                ],
                
            },
            type: 'POST'
        }
    }
    function handleModalVisible (flag) {
        setvisible(!!flag)
    };
    function handleSelectedRows(rowKeys, rows) {
        setRowKeys(rowKeys);
        setRows(rows);
    }
    function handleOk() {
        //const empty = selectedRowKeys.length > 0;
        if (selectedRowKeys.length === 0) {
            message.error('请选择一行数据！');
        } else {
            //隐藏供应商选择框
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
    // 输入框值
    function SerachValue(v) {
        if (isEmpty(v.target.value)) {
            setSearchValue('')
        }else {
            setSearchValue(v.target.value)
        }
        
    }
    // 查询
    function handleQuickSerach() {
        let search = "";
        setSearchValue(search);
        setSearchValue(searchValue)
        uploadTable();
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
    function clearinput() {
        setSearchValue('')
        uploadTable();
    }
    const columns = [
        {
            title: "原厂代码",
            width: 150,
            dataIndex: "originSupplierCode"
          },
          {
            title: "原厂名称",
            width: 220,
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
        <>
            <Input
                style={{width:260}}
                placeholder='请输入物料代码或名称查询'
                className={styles.btn}
                onChange={SerachValue}
                allowClear
            />
            <Button type='primary' onClick={handleQuickSerach}>查询</Button>
        </>
    )
    return (
        <Modal
            width={1000}
            className={"choose-supplier"}
            centered
            destroyOnClose={true}
            maskClosable={false}
            title={"选择影响物料"}
            visible={visible}
            onCancel={() => handleModalVisible(false)}
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
                    multiSelect: true
                }}
                allowCancelSelect
                size='small'
                remotePaging={true}
                ellipsis={false}
                onSelectRow={handleSelectedRows}
                selectedRowKeys={selectedRowKeys}
                onChange={pageChange}
                {...dataSource}
            />
      </Modal>
    );
},
);

export default create()(getAgentregRef);
